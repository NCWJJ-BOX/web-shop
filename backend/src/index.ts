import express, { Request, Response } from 'express';
import cors from 'cors';
import { Prisma } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { prisma } from './prisma';
import { authRouter } from './routes/auth';
import { ordersRouter } from './routes/orders';
import { adminRouter } from './routes/admin';

const app = express();

const portFromEnv = process.env.PORT ? Number(process.env.PORT) : NaN;
const PORT = Number.isFinite(portFromEnv) ? portFromEnv : 3001;

function firstQueryValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
}

function toProductDto(product: {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  images: string[];
  categoryId: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  inStock: boolean;
  discount: number | null;
  isNew: boolean;
  isFeatured: boolean;
}) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice ?? undefined,
    image: product.image,
    images: product.images,
    category: product.categoryId,
    rating: product.rating,
    reviews: product.reviews,
    description: product.description,
    features: product.features,
    inStock: product.inStock,
    discount: product.discount ?? undefined,
    isNew: product.isNew || undefined,
    isFeatured: product.isFeatured || undefined,
  };
}

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })
);
app.use(express.json());

const uploadsDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const category = firstQueryValue(req.query.category);
    const search = firstQueryValue(req.query.search);

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (category && category !== 'all') {
      where.categoryId = category;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
    });

    res.json(products.map(toProductDto));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/featured', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
    });
    res.json(products.map(toProductDto));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(toProductDto(product));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.use((err: unknown, _req: Request, res: Response, _next: unknown) => {
  if (err instanceof Error) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: 'Unexpected error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
