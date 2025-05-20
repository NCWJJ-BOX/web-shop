import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { prisma } from '../prisma';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth';

function toInt(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  return undefined;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function generateOrderNo(): string {
  const date = new Date();
  const y = date.getFullYear().toString();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `WS-${y}${m}${d}-${rand}`;
}

function uploadsDir(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir());
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').slice(0, 10);
    const name = crypto.randomBytes(16).toString('hex');
    cb(null, `${name}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
      return;
    }
    cb(new Error('Only image uploads are allowed'));
  },
});

export const ordersRouter = Router();

ordersRouter.post('/', requireAuth(), async (req, res) => {
  const userId = (req as AuthenticatedRequest).userId;

  const items = Array.isArray(req.body?.items) ? (req.body.items as unknown[]) : [];
  const shippingName = isNonEmptyString(req.body?.shippingName) ? req.body.shippingName.trim() : '';
  const shippingPhone = isNonEmptyString(req.body?.shippingPhone) ? req.body.shippingPhone.trim() : '';
  const shippingAddress = isNonEmptyString(req.body?.shippingAddress) ? req.body.shippingAddress.trim() : '';

  if (!shippingName || !shippingPhone || !shippingAddress) {
    res.status(400).json({ error: 'Missing shipping fields' });
    return;
  }

  const normalizedItems = items
    .map((it) => {
      const obj = isPlainObject(it) ? it : undefined;
      const productId = obj && isNonEmptyString(obj.productId) ? obj.productId.trim() : '';
      const quantity = obj ? (toInt(obj.quantity) ?? 0) : 0;
      return { productId, quantity };
    })
    .filter((it) => it.productId && it.quantity > 0);

  if (normalizedItems.length === 0) {
    res.status(400).json({ error: 'No items' });
    return;
  }

  const products = await prisma.product.findMany({
    where: { id: { in: normalizedItems.map((i) => i.productId) }, isActive: true },
  });

  const productById = new Map(products.map((p) => [p.id, p] as const));

  for (const it of normalizedItems) {
    if (!productById.has(it.productId)) {
      res.status(400).json({ error: `Unknown product: ${it.productId}` });
      return;
    }
  }

  for (const it of normalizedItems) {
    const product = productById.get(it.productId)!;
    if (product.stockQty < it.quantity) {
      res.status(409).json({ error: `Insufficient stock: ${product.name}` });
      return;
    }
  }

  const lineItems = normalizedItems.map((it) => {
    const product = productById.get(it.productId)!;
    const price = Math.round(product.price * 35);
    const lineTotal = price * it.quantity;
    return {
      productId: product.id,
      name: product.name,
      price,
      quantity: it.quantity,
      lineTotal,
    };
  });

  const subtotal = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const order = await prisma.$transaction(async (tx) => {
    for (const li of lineItems) {
      const affected = await tx.$executeRaw`
        UPDATE "Product"
        SET "stockQty" = "stockQty" - ${li.quantity},
            "inStock" = ("stockQty" - ${li.quantity}) > 0
        WHERE "id" = ${li.productId}
          AND "stockQty" >= ${li.quantity}
      `;
      if (affected === 0) {
        throw new Error(`Insufficient stock: ${li.productId}`);
      }
    }

    return await tx.order.create({
      data: {
        orderNo: generateOrderNo(),
        userId,
        subtotal,
        shippingFee,
        total,
        shippingName,
        shippingPhone,
        shippingAddress,
        items: {
          create: lineItems,
        },
      },
      include: { items: true, payment: true, shipment: true },
    });
  });

  res.status(201).json(order);
});

ordersRouter.get('/me', requireAuth(), async (req, res) => {
  const userId = (req as AuthenticatedRequest).userId;
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true, payment: true, shipment: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

ordersRouter.post('/:id/payment-slip', requireAuth(), upload.single('slip'), async (req, res) => {
  const userId = (req as AuthenticatedRequest).userId;
  const orderId = req.params.id;
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: 'Slip is required' });
    return;
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const slipPath = `/uploads/${path.basename(file.path)}`;

  const existingPayment = await prisma.payment.findUnique({ where: { orderId } });

  const payment = await prisma.payment.upsert({
    where: { orderId },
    update: {
      slipPath,
      slipMime: file.mimetype,
      slipOriginalName: file.originalname,
      slipSize: file.size,
      status: 'SUBMITTED',
      reviewedAt: null,
      reviewedByUserId: null,
      reviewNote: null,
    },
    create: {
      orderId,
      slipPath,
      slipMime: file.mimetype,
      slipOriginalName: file.originalname,
      slipSize: file.size,
      status: 'SUBMITTED',
    },
  });

  await prisma.paymentReview.create({
    data: {
      paymentId: payment.id,
      action: existingPayment ? 'RESUBMIT' : 'SUBMIT',
    },
  });

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'PAYMENT_SUBMITTED' },
    include: { items: true, payment: true, shipment: true },
  });

  res.json({ order: updated, payment });
});
