export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  inStock: boolean;
  discount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_SUBMITTED'
  | 'PAID'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface Payment {
  id: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  slipPath: string;
  slipMime: string;
  slipOriginalName: string;
  slipSize: number;
  submittedAt: string;
  approvedAt?: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface Shipment {
  id: string;
  carrier?: string;
  trackingNo?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface Order {
  id: string;
  orderNo: string;
  status: OrderStatus;
  currency: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  payment?: Payment;
  shipment?: Shipment;
  createdAt: string;
}
