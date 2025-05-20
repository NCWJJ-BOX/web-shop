import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { prisma } from '../prisma';
import { requireAdmin, type AdminRequest } from '../middleware/auth';
import { Prisma, OrderStatus } from '@prisma/client';

function uploadsDir(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const productsUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = path.join(uploadsDir(), 'products');
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').slice(0, 10);
      cb(null, `${crypto.randomBytes(16).toString('hex')}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
      return;
    }
    cb(new Error('Only image uploads are allowed'));
  },
});

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readInt(value: unknown): number | undefined {
  const n = readNumber(value);
  return n === undefined ? undefined : Math.trunc(n);
}

function readBool(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function readStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const out: string[] = [];
  for (const v of value) {
    if (typeof v !== 'string') return undefined;
    out.push(v);
  }
  return out;
}

export const adminRouter = Router();

adminRouter.get('/payments', requireAdmin(), async (_req, res) => {
  const payments = await prisma.payment.findMany({
    include: {
      order: {
        include: { items: true, user: { select: { id: true, name: true, email: true } } },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });
  res.json(payments);
});

adminRouter.post('/uploads/product-image', requireAdmin(), productsUpload.single('image'), async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: 'Image is required' });
    return;
  }
  const rel = `/uploads/products/${path.basename(file.path)}`;
  res.status(201).json({ path: rel });
});

adminRouter.post('/payments/:id/approve', requireAdmin(), async (req, res) => {
  const paymentId = req.params.id;
  const note = readString((isPlainObject(req.body) ? req.body : {}).note)?.trim();
  const adminId = (req as AdminRequest).userId;
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) {
    res.status(404).json({ error: 'Payment not found' });
    return;
  }

  const updated = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: 'APPROVED',
      approvedAt: new Date(),
      reviewedAt: new Date(),
      reviewedByUserId: adminId,
      reviewNote: note || null,
    },
    include: { order: true },
  });

  await prisma.paymentReview.create({
    data: {
      paymentId: updated.id,
      adminId,
      action: 'APPROVE',
      note: note || null,
    },
  });

  await prisma.order.update({ where: { id: updated.orderId }, data: { status: 'PAID' } });
  res.json(updated);
});

adminRouter.post('/payments/:id/reject', requireAdmin(), async (req, res) => {
  const paymentId = req.params.id;
  const note = readString((isPlainObject(req.body) ? req.body : {}).note)?.trim();
  const adminId = (req as AdminRequest).userId;
  if (!note) {
    res.status(400).json({ error: 'Reject reason is required' });
    return;
  }
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) {
    res.status(404).json({ error: 'Payment not found' });
    return;
  }

  const updated = await prisma.$transaction(async (tx) => {
    const pay = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: 'REJECTED',
        approvedAt: null,
        reviewedAt: new Date(),
        reviewedByUserId: adminId,
        reviewNote: note,
      },
      include: { order: { include: { items: true } } },
    });

    await tx.paymentReview.create({
      data: {
        paymentId: pay.id,
        adminId,
        action: 'REJECT',
        note,
      },
    });

    await tx.order.update({ where: { id: pay.orderId }, data: { status: 'PENDING_PAYMENT' } });

    for (const it of pay.order.items) {
      await tx.$executeRaw`
        UPDATE "Product"
        SET "stockQty" = "stockQty" + ${it.quantity},
            "inStock" = ("stockQty" + ${it.quantity}) > 0
        WHERE "id" = ${it.productId}
      `;
    }

    return pay;
  });

  res.json(updated);
});

adminRouter.get('/stats', requireAdmin(), async (_req, res) => {
  const [paidAgg, ordersAgg, pendingCount] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { in: ['PAID', 'PACKED', 'SHIPPED', 'DELIVERED'] } },
      _sum: { total: true },
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      _count: { _all: true },
    }),
    prisma.order.count({ where: { status: 'PAYMENT_SUBMITTED' } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  const top = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: { order: { status: { in: ['PAID', 'PACKED', 'SHIPPED', 'DELIVERED'] } } },
    _sum: { quantity: true, lineTotal: true },
    orderBy: { _sum: { lineTotal: 'desc' } },
    take: 5,
  });

  const products = await prisma.product.findMany({
    where: { id: { in: top.map((t) => t.productId) } },
    select: { id: true, name: true, image: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p] as const));

  res.json({
    revenueTotal: paidAgg._sum.total ?? 0,
    paidOrdersCount: paidAgg._count._all,
    totalOrdersCount: ordersAgg._count._all,
    pendingPaymentCount: pendingCount,
    recentOrders,
    topProducts: top.map((t) => ({
      productId: t.productId,
      name: productMap.get(t.productId)?.name ?? 'Unknown',
      image: productMap.get(t.productId)?.image ?? '',
      quantity: t._sum.quantity ?? 0,
      revenue: t._sum.lineTotal ?? 0,
    })),
  });
});

adminRouter.get('/products', requireAdmin(), async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { updatedAt: 'desc' } });
  res.json(products);
});

adminRouter.get('/orders', requireAdmin(), async (req, res) => {
  const status = readString(req.query.status);
  const allowed = new Set<OrderStatus>(Object.values(OrderStatus));
  const parsedStatus = status && allowed.has(status as OrderStatus) ? (status as OrderStatus) : undefined;
  const where: Prisma.OrderWhereInput = parsedStatus ? { status: parsedStatus } : {};
  const orders = await prisma.order.findMany({
    where,
    include: { items: true, payment: true, shipment: true, user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json(orders);
});

adminRouter.patch('/orders/:id/shipping', requireAdmin(), async (req, res) => {
  const id = req.params.id;
  const body = isPlainObject(req.body) ? req.body : {};

  const status = readString(body.status);
  const carrier = readString(body.carrier)?.trim();
  const trackingNo = readString(body.trackingNo)?.trim();

  const order = await prisma.order.findUnique({ where: { id }, include: { shipment: true } });
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const allowed = new Set<OrderStatus>(Object.values(OrderStatus));
  const orderStatus = status && allowed.has(status as OrderStatus) ? (status as OrderStatus) : undefined;

  const updated = await prisma.$transaction(async (tx) => {
    if (!order.shipment) {
      await tx.shipment.create({ data: { orderId: order.id } });
    }

    if (carrier !== undefined || trackingNo !== undefined || orderStatus === 'SHIPPED' || orderStatus === 'DELIVERED') {
      await tx.shipment.update({
        where: { orderId: order.id },
        data: {
          carrier: carrier ?? undefined,
          trackingNo: trackingNo ?? undefined,
          shippedAt: orderStatus === 'SHIPPED' ? new Date() : undefined,
          deliveredAt: orderStatus === 'DELIVERED' ? new Date() : undefined,
        },
      });
    }

    if (orderStatus) {
      await tx.order.update({ where: { id: order.id }, data: { status: orderStatus } });
    }

    return await tx.order.findUnique({
      where: { id: order.id },
      include: { items: true, payment: true, shipment: true, user: { select: { id: true, name: true, email: true } } },
    });
  });

  res.json(updated);
});

adminRouter.get('/categories', requireAdmin(), async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json(categories);
});

adminRouter.post('/products', requireAdmin(), async (req, res) => {
  const body = isPlainObject(req.body) ? req.body : {};
  const name = readString(body.name)?.trim();
  const categoryId = readString(body.categoryId)?.trim();
  const image = readString(body.image)?.trim();
  const images = readStringArray(body.images);
  const features = readStringArray(body.features);
  const description = readString(body.description)?.trim();
  const price = readNumber(body.price);
  const stockQty = readInt(body.stockQty);

  if (!name || !categoryId || !image || !images || images.length === 0 || !features || !description || price === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const finalStock = stockQty ?? 50;
  const created = await prisma.product.create({
    data: {
      name,
      categoryId,
      price,
      originalPrice: readNumber(body.originalPrice) ?? null,
      image,
      images,
      rating: readNumber(body.rating) ?? 0,
      reviews: readInt(body.reviews) ?? 0,
      description,
      features,
      stockQty: finalStock,
      inStock: finalStock > 0,
      discount: readInt(body.discount) ?? null,
      isNew: readBool(body.isNew) ?? false,
      isFeatured: readBool(body.isFeatured) ?? false,
      isActive: readBool(body.isActive) ?? true,
    },
  });
  res.status(201).json(created);
});

adminRouter.patch('/products/:id', requireAdmin(), async (req, res) => {
  const id = req.params.id;
  const body = isPlainObject(req.body) ? req.body : {};

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const data: Prisma.ProductUpdateInput = {};
  const name = readString(body.name);
  if (name !== undefined) data.name = name.trim();
  const categoryId = readString(body.categoryId);
  if (categoryId !== undefined) data.category = { connect: { id: categoryId.trim() } };
  const image = readString(body.image);
  if (image !== undefined) data.image = image.trim();
  const images = readStringArray(body.images);
  if (images !== undefined) data.images = images;
  const features = readStringArray(body.features);
  if (features !== undefined) data.features = features;
  const description = readString(body.description);
  if (description !== undefined) data.description = description;
  const price = readNumber(body.price);
  if (price !== undefined) data.price = price;
  const originalPrice = body.originalPrice === null ? null : readNumber(body.originalPrice);
  if (originalPrice !== undefined || body.originalPrice === null) data.originalPrice = originalPrice;
  const inStock = readBool(body.inStock);
  if (inStock !== undefined) data.inStock = inStock;
  const discount = body.discount === null ? null : readInt(body.discount);
  if (discount !== undefined || body.discount === null) data.discount = discount;
  const isNew = readBool(body.isNew);
  if (isNew !== undefined) data.isNew = isNew;
  const isFeatured = readBool(body.isFeatured);
  if (isFeatured !== undefined) data.isFeatured = isFeatured;
  const isActive = readBool(body.isActive);
  if (isActive !== undefined) data.isActive = isActive;

  const stockQty = body.stockQty === null ? null : readInt(body.stockQty);
  if (stockQty !== undefined && stockQty !== null) {
    data.stockQty = stockQty;
    data.inStock = stockQty > 0;
  }

  const updated = await prisma.product.update({ where: { id }, data });
  res.json(updated);
});
