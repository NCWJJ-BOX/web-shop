import { supabase } from './supabase';
import type { OrderStatus } from '../types';

// ============ Types ============

export interface AdminStats {
  revenueTotal: number;
  paidOrdersCount: number;
  totalOrdersCount: number;
  pendingPaymentCount: number;
  recentOrders: Array<{
    id: string;
    orderNo: string;
    status: string;
    total: number;
    createdAt: string;
    user: { id: string; name: string; email: string };
  }>;
  topProducts: Array<{
    productId: string;
    name: string;
    image: string;
    quantity: number;
    revenue: number;
  }>;
}

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  features: string[];
  description: string;
  categoryId: string;
  isFeatured: boolean;
  isActive: boolean;
  stockQty: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  icon: string;
}

export interface AdminOrder {
  id: string;
  orderNo: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  shippingFee: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  items: Array<{ id: string; name: string; price: number; quantity: number; lineTotal: number }>;
  payment?: {
    id: string;
    status: string;
    slipPath: string;
    submittedAt: string;
    reviewNote?: string;
  };
  shipment?: {
    id: string;
    carrier?: string;
    trackingNo?: string;
  };
}

export interface AdminPayment {
  id: string;
  status: string;
  slipPath: string;
  slipMime: string;
  submittedAt: string;
  reviewNote?: string;
  order: AdminOrder;
}

// ============ Stats ============

export async function fetchAdminStats(): Promise<AdminStats> {
  const { data: orders, error } = await supabase
    .from('Order')
    .select('id, orderNo, status, total, createdAt, userId')
    .order('createdAt', { ascending: false });
  if (error) throw error;

  const paidOrders = (orders || []).filter((o) => ['PAID', 'PACKED', 'SHIPPED', 'DELIVERED'].includes(o.status));
  const revenueTotal = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingPaymentCount = (orders || []).filter((o) => o.status === 'PAYMENT_SUBMITTED').length;

  // Get user info for recent orders
  const recentOrders = [];
  for (const o of (orders || []).slice(0, 10)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, name, email')
      .eq('id', o.userId)
      .maybeSingle();
    recentOrders.push({
      id: o.id,
      orderNo: o.orderNo,
      status: o.status,
      total: o.total,
      createdAt: o.createdAt,
      user: profile || { id: o.userId, name: 'Unknown', email: '' },
    });
  }

  // Top products from order items
  const { data: items } = await supabase
    .from('OrderItem')
    .select('productId, name, quantity, lineTotal');

  const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const it of items || []) {
    const existing = productMap.get(it.productId);
    if (existing) {
      existing.quantity += it.quantity;
      existing.revenue += it.lineTotal;
    } else {
      productMap.set(it.productId, { name: it.name, quantity: it.quantity, revenue: it.lineTotal });
    }
  }

  const topProducts = [...productMap.entries()]
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 10)
    .map(([productId, v]) => ({
      productId,
      name: v.name,
      image: '',
      quantity: v.quantity,
      revenue: v.revenue,
    }));

  return {
    revenueTotal,
    paidOrdersCount: paidOrders.length,
    totalOrdersCount: (orders || []).length,
    pendingPaymentCount,
    recentOrders,
    topProducts,
  };
}

// ============ Products ============

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from('Product')
    .select('*')
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data || []).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    images: p.images || [],
    features: p.features || [],
    description: p.description || '',
    categoryId: p.categoryId || '',
    isFeatured: p.isFeatured ?? false,
    isActive: p.isActive ?? true,
    stockQty: p.stockQty ?? 0,
  }));
}

export async function createAdminProduct(product: Omit<AdminProduct, 'id'>): Promise<AdminProduct> {
  const { data, error } = await supabase
    .from('Product')
    .insert(product)
    .select()
    .single();
  if (error) throw error;
  return { ...product, id: data.id };
}

export async function updateAdminProduct(id: string, patch: Partial<AdminProduct>): Promise<AdminProduct> {
  const { error } = await supabase
    .from('Product')
    .update(patch)
    .eq('id', id);
  if (error) throw error;
  const { data } = await supabase.from('Product').select('*').eq('id', id).single();
  return data as AdminProduct;
}

export async function deleteAdminProduct(id: string): Promise<void> {
  const { error } = await supabase.from('Product').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `products/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

// ============ Categories ============

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const { data, error } = await supabase
    .from('Category')
    .select('*')
    .order('name');
  if (error) throw error;
  return (data || []).map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon || '',
  }));
}

export async function createAdminCategory(cat: { name: string; icon: string }): Promise<AdminCategory> {
  const { data, error } = await supabase
    .from('Category')
    .insert(cat)
    .select()
    .single();
  if (error) throw error;
  return { id: data.id, name: data.name, icon: data.icon };
}

export async function updateAdminCategory(id: string, patch: { name: string; icon: string }): Promise<AdminCategory> {
  const { error } = await supabase
    .from('Category')
    .update(patch)
    .eq('id', id);
  if (error) throw error;
  return { id, ...patch };
}

export async function deleteAdminCategory(id: string): Promise<void> {
  const { error } = await supabase.from('Category').delete().eq('id', id);
  if (error) throw error;
}

// ============ Orders ============

export async function fetchAdminOrders(status?: OrderStatus): Promise<AdminOrder[]> {
  let query = supabase
    .from('Order')
    .select('*')
    .order('createdAt', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data: orders, error } = await query;
  if (error) throw error;

  const result: AdminOrder[] = [];
  for (const o of orders || []) {
    const { data: items } = await supabase
      .from('OrderItem')
      .select('*')
      .eq('orderId', o.id);

    const { data: payment } = await supabase
      .from('Payment')
      .select('*')
      .eq('orderId', o.id)
      .order('submittedAt', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: shipment } = await supabase
      .from('Shipment')
      .select('*')
      .eq('orderId', o.id)
      .maybeSingle();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, name, email')
      .eq('id', o.userId)
      .maybeSingle();

    result.push({
      id: o.id,
      orderNo: o.orderNo,
      status: o.status,
      total: o.total,
      subtotal: o.subtotal,
      shippingFee: o.shippingFee,
      shippingName: o.shippingName,
      shippingPhone: o.shippingPhone,
      shippingAddress: o.shippingAddress,
      createdAt: o.createdAt,
      user: profile || { id: o.userId, name: 'Unknown', email: '' },
      items: (items || []).map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        lineTotal: it.lineTotal,
      })),
      payment: payment ? {
        id: payment.id,
        status: payment.status,
        slipPath: payment.slipPath,
        submittedAt: payment.submittedAt,
        reviewNote: payment.reviewNote,
      } : undefined,
      shipment: shipment ? {
        id: shipment.id,
        carrier: shipment.carrier,
        trackingNo: shipment.trackingNo,
      } : undefined,
    });
  }
  return result;
}

export async function updateOrderShipping(
  orderId: string,
  patch: { status?: OrderStatus; carrier?: string; trackingNo?: string }
): Promise<AdminOrder> {
  if (patch.status) {
    await supabase.from('Order').update({ status: patch.status }).eq('id', orderId);
  }
  if (patch.carrier !== undefined || patch.trackingNo !== undefined) {
    const { data: existing } = await supabase
      .from('Shipment')
      .select('id')
      .eq('orderId', orderId)
      .maybeSingle();
    if (existing) {
      await supabase.from('Shipment').update({
        carrier: patch.carrier,
        trackingNo: patch.trackingNo,
      }).eq('orderId', orderId);
    } else {
      await supabase.from('Shipment').insert({
        orderId,
        carrier: patch.carrier,
        trackingNo: patch.trackingNo,
      });
    }
  }
  const orders = await fetchAdminOrders();
  const updated = orders.find((o) => o.id === orderId);
  if (!updated) throw new Error('Order not found after update');
  return updated;
}

// ============ Payments ============

export async function fetchAdminPayments(): Promise<AdminPayment[]> {
  const { data: payments, error } = await supabase
    .from('Payment')
    .select('*')
    .order('submittedAt', { ascending: false });
  if (error) throw error;

  const result: AdminPayment[] = [];
  for (const p of payments || []) {
    const { data: order } = await supabase
      .from('Order')
      .select('*')
      .eq('id', p.orderId)
      .single();
    if (!order) continue;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, name, email')
      .eq('id', order.userId)
      .maybeSingle();

    result.push({
      id: p.id,
      status: p.status,
      slipPath: p.slipPath,
      slipMime: p.slipMime,
      submittedAt: p.submittedAt,
      reviewNote: p.reviewNote,
      order: {
        id: order.id,
        orderNo: order.orderNo,
        status: order.status,
        total: order.total,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        shippingName: order.shippingName,
        shippingPhone: order.shippingPhone,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        user: profile || { id: order.userId, name: 'Unknown', email: '' },
        items: [],
      },
    });
  }
  return result;
}

export async function approvePayment(paymentId: string): Promise<void> {
  const { data: payment, error } = await supabase
    .from('Payment')
    .update({ status: 'APPROVED', approvedAt: new Date().toISOString(), reviewedAt: new Date().toISOString() })
    .eq('id', paymentId)
    .select()
    .single();
  if (error) throw error;

  await supabase
    .from('Order')
    .update({ status: 'PAID' })
    .eq('id', payment.orderId);
}

export async function rejectPayment(paymentId: string, note: string): Promise<void> {
  const { data: payment, error } = await supabase
    .from('Payment')
    .update({ status: 'REJECTED', reviewedAt: new Date().toISOString(), reviewNote: note })
    .eq('id', paymentId)
    .select()
    .single();
  if (error) throw error;

  await supabase
    .from('Order')
    .update({ status: 'PENDING_PAYMENT' })
    .eq('id', payment.orderId);
}
