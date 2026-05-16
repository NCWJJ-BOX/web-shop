import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Store Admin';

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail.toLowerCase() },
      update: { name: adminName, passwordHash, role: 'ADMIN' },
      create: { name: adminName, email: adminEmail.toLowerCase(), passwordHash, role: 'ADMIN' },
    });
  }

  await Promise.all([
    prisma.category.upsert({
      where: { id: 'electronics' },
      update: {},
      create: {
        id: 'electronics',
        name: 'Electronics',
        icon: 'Smartphone',
        count: 4,
      },
    }),
    prisma.category.upsert({
      where: { id: 'fashion' },
      update: {},
      create: {
        id: 'fashion',
        name: 'Fashion',
        icon: 'Shirt',
        count: 1,
      },
    }),
    prisma.category.upsert({
      where: { id: 'home' },
      update: {},
      create: {
        id: 'home',
        name: 'Home & Living',
        icon: 'Home',
        count: 1,
      },
    }),
    prisma.category.upsert({
      where: { id: 'beauty' },
      update: {},
      create: {
        id: 'beauty',
        name: 'Beauty',
        icon: 'Sparkles',
        count: 1,
      },
    }),
    prisma.category.upsert({
      where: { id: 'sports' },
      update: {},
      create: {
        id: 'sports',
        name: 'Sports',
        icon: 'Dumbbell',
        count: 1,
      },
    }),
    prisma.category.upsert({
      where: { id: 'toys' },
      update: {},
      create: {
        id: 'toys',
        name: 'Toys & Games',
        icon: 'Gamepad2',
        count: 1,
      },
    }),
  ]);

  const products = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max 256GB',
      price: 1299,
      originalPrice: 1399,
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800',
      images: [
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1512054813030-24510a20245a?auto=format&fit=crop&q=80&w=800'
      ],
      categoryId: 'electronics',
      rating: 4.8,
      reviews: 2341,
      description: 'The most advanced iPhone ever with titanium design, A17 Pro chip, and pro camera system.',
      features: ['A17 Pro Chip', '48MP Main Camera', '5x Telephoto Zoom', 'Titanium Design'],
      inStock: true,
      stockQty: 50,
      discount: 7,
      isFeatured: true,
    },
    {
      id: '2',
      name: 'Premium Wireless Headphones',
      price: 299,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1583394838336-acd9929a339e?auto=format&fit=crop&q=80&w=800'
      ],
      categoryId: 'electronics',
      rating: 4.6,
      reviews: 1876,
      description: 'Active noise cancellation meets premium sound quality in these flagship headphones.',
      features: ['Active Noise Cancellation', '30hr Battery', 'Premium Drivers', 'Comfortable Fit'],
      inStock: true,
      stockQty: 50,
      discount: 25,
      isNew: true,
    },
    {
      id: '3',
      name: 'Designer Leather Jacket',
      price: 189,
      originalPrice: 259,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&q=80&w=800'
      ],
      categoryId: 'fashion',
      rating: 4.7,
      reviews: 923,
      description: 'Handcrafted genuine leather jacket with modern cut and premium finishing.',
      features: ['Genuine Leather', 'Modern Cut', 'Premium Zippers', 'Multiple Pockets'],
      inStock: true,
      stockQty: 30,
      discount: 27,
    },
    {
      id: '4',
      name: 'Smart Home Security Camera',
      price: 79,
      originalPrice: 129,
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
      images: [
        'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1582139329536-87284ff0d049?auto=format&fit=crop&q=80&w=800'
      ],
      categoryId: 'electronics',
      rating: 4.4,
      reviews: 1456,
      description: '1080p HD security camera with night vision and smartphone alerts.',
      features: ['1080p HD Video', 'Night Vision', 'Motion Detection', 'Cloud Storage'],
      inStock: true,
      stockQty: 60,
      discount: 39,
      isFeatured: true,
    },
    {
      id: '5',
      name: 'Luxury Skincare Set',
      price: 149,
      originalPrice: 199,
      image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800',
      images: [
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'
      ],
      categoryId: 'beauty',
      rating: 4.9,
      reviews: 756,
      description: 'Complete skincare routine with premium ingredients for radiant skin.',
      features: ['Vitamin C Serum', 'Hyaluronic Acid', 'Retinol Cream', 'Premium Packaging'],
      inStock: true,
      stockQty: 40,
      discount: 25,
      isNew: true,
    },
    {
      id: '6',
      name: 'Professional Running Shoes',
      price: 159,
      originalPrice: 199,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800'
      ],
      categoryId: 'sports',
      rating: 4.5,
      reviews: 2134,
      description: 'Advanced running shoes with responsive cushioning and breathable design.',
      features: ['Responsive Foam', 'Breathable Mesh', 'Durable Outsole', 'Lightweight Design'],
      inStock: true,
      stockQty: 80,
      discount: 20,
    },
    {
      id: '7',
      name: 'Modern Coffee Table',
      price: 299,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1534349762230-e0caa6c34582?auto=format&fit=crop&q=80&w=800',
      images: [
        'https://images.unsplash.com/photo-1534349762230-e0caa6c34582?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800'
      ],
      categoryId: 'home',
      rating: 4.6,
      reviews: 543,
      description: 'Sleek modern coffee table with storage compartment and premium oak finish.',
      features: ['Oak Wood Finish', 'Hidden Storage', 'Modern Design', 'Easy Assembly'],
      inStock: true,
      stockQty: 20,
      discount: 25,
    },
    {
      id: '8',
      name: 'Wireless Gaming Controller',
      price: 69,
      originalPrice: 89,
      image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=800',
      images: [
        'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1600080972464-8e5f35802446?auto=format&fit=crop&q=80&w=800'
      ],
      categoryId: 'toys',
      rating: 4.7,
      reviews: 1876,
      description: 'Professional wireless gaming controller with haptic feedback and precision controls.',
      features: ['Wireless Connectivity', 'Haptic Feedback', 'Precision Controls', '40hr Battery'],
      inStock: true,
      stockQty: 70,
      discount: 22,
      isFeatured: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }

  console.log('Created products:', products.length);
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
