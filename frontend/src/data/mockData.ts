import { Product, Category } from '../types';

export const categories: Category[] = [
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone', count: 1250 },
  { id: 'fashion', name: 'Fashion', icon: 'Shirt', count: 2300 },
  { id: 'home', name: 'Home & Living', icon: 'Home', count: 890 },
  { id: 'beauty', name: 'Beauty', icon: 'Sparkles', count: 670 },
  { id: 'sports', name: 'Sports', icon: 'Dumbbell', count: 420 },
  { id: 'books', name: 'Books', icon: 'BookOpen', count: 1100 },
  { id: 'toys', name: 'Toys & Games', icon: 'Gamepad2', count: 580 },
  { id: 'automotive', name: 'Automotive', icon: 'Car', count: 340 },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB',
    price: 1299,
    originalPrice: 1399,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
      'https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg'
    ],
    category: 'electronics',
    rating: 4.8,
    reviews: 2341,
    description: 'The most advanced iPhone ever with titanium design, A17 Pro chip, and pro camera system.',
    features: ['A17 Pro Chip', '48MP Main Camera', '5x Telephoto Zoom', 'Titanium Design'],
    inStock: true,
    discount: 7,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Premium Wireless Headphones',
    price: 299,
    originalPrice: 399,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'
    ],
    category: 'electronics',
    rating: 4.6,
    reviews: 1876,
    description: 'Active noise cancellation meets premium sound quality in these flagship headphones.',
    features: ['Active Noise Cancellation', '30hr Battery', 'Premium Drivers', 'Comfortable Fit'],
    inStock: true,
    discount: 25,
    isNew: true
  },
  {
    id: '3',
    name: 'Designer Leather Jacket',
    price: 189,
    originalPrice: 259,
    image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg',
    images: [
      'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
    ],
    category: 'fashion',
    rating: 4.7,
    reviews: 923,
    description: 'Handcrafted genuine leather jacket with modern cut and premium finishing.',
    features: ['Genuine Leather', 'Modern Cut', 'Premium Zippers', 'Multiple Pockets'],
    inStock: true,
    discount: 27
  },
  {
    id: '4',
    name: 'Smart Home Security Camera',
    price: 79,
    originalPrice: 129,
    image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg',
    images: [
      'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg',
      'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg'
    ],
    category: 'electronics',
    rating: 4.4,
    reviews: 1456,
    description: '1080p HD security camera with night vision and smartphone alerts.',
    features: ['1080p HD Video', 'Night Vision', 'Motion Detection', 'Cloud Storage'],
    inStock: true,
    discount: 39,
    isFeatured: true
  },
  {
    id: '5',
    name: 'Luxury Skincare Set',
    price: 149,
    originalPrice: 199,
    image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg',
    images: [
      'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg',
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg'
    ],
    category: 'beauty',
    rating: 4.9,
    reviews: 756,
    description: 'Complete skincare routine with premium ingredients for radiant skin.',
    features: ['Vitamin C Serum', 'Hyaluronic Acid', 'Retinol Cream', 'Premium Packaging'],
    inStock: true,
    discount: 25,
    isNew: true
  },
  {
    id: '6',
    name: 'Professional Running Shoes',
    price: 159,
    originalPrice: 199,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
      'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg'
    ],
    category: 'sports',
    rating: 4.5,
    reviews: 2134,
    description: 'Advanced running shoes with responsive cushioning and breathable design.',
    features: ['Responsive Foam', 'Breathable Mesh', 'Durable Outsole', 'Lightweight Design'],
    inStock: true,
    discount: 20
  },
  {
    id: '7',
    name: 'Modern Coffee Table',
    price: 299,
    originalPrice: 399,
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
    images: [
      'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
      'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg'
    ],
    category: 'home',
    rating: 4.6,
    reviews: 543,
    description: 'Sleek modern coffee table with storage compartment and premium oak finish.',
    features: ['Oak Wood Finish', 'Hidden Storage', 'Modern Design', 'Easy Assembly'],
    inStock: true,
    discount: 25
  },
  {
    id: '8',
    name: 'Wireless Gaming Controller',
    price: 69,
    originalPrice: 89,
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
    images: [
      'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
      'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg'
    ],
    category: 'toys',
    rating: 4.7,
    reviews: 1876,
    description: 'Professional wireless gaming controller with haptic feedback and precision controls.',
    features: ['Wireless Connectivity', 'Haptic Feedback', 'Precision Controls', '40hr Battery'],
    inStock: true,
    discount: 22,
    isFeatured: true
  }
];