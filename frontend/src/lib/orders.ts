import { supabase } from './supabase';
import { Order, OrderItem, Payment } from '../types';

function generateOrderNo(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WS-${y}${m}${day}-${rand}`;
}

export async function createOrder(input: {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  items: { productId: string; quantity: number }[];
}): Promise<Order> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Fetch product details for price calculation
  const productIds = input.items.map((it) => it.productId);
  const { data: products, error: prodErr } = await supabase
    .from('Product')
    .select('id, name, price')
    .in('id', productIds);
  if (prodErr) throw prodErr;

  const priceMap = new Map<string, { name: string; price: number }>();
  for (const p of products || []) {
    priceMap.set(p.id, { name: p.name, price: p.price });
  }

  const orderItems = input.items.map((it) => {
    const prod = priceMap.get(it.productId);
    if (!prod) throw new Error(`Product not found: ${it.productId}`);
    return {
      productId: it.productId,
      name: prod.name,
      price: prod.price,
      quantity: it.quantity,
      lineTotal: prod.price * it.quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, it) => sum + it.lineTotal, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;
  const orderNo = generateOrderNo();

  // Insert order
  const { data: order, error: orderErr } = await supabase
    .from('Order')
    .insert({
      orderNo,
      userId: user.id,
      status: 'PENDING_PAYMENT',
      currency: 'THB',
      subtotal,
      shippingFee,
      total,
      shippingName: input.shippingName,
      shippingPhone: input.shippingPhone,
      shippingAddress: input.shippingAddress,
    })
    .select()
    .single();
  if (orderErr) throw orderErr;

  // Insert order items
  const itemsToInsert = orderItems.map((it) => ({
    orderId: order.id,
    productId: it.productId,
    name: it.name,
    price: it.price,
    quantity: it.quantity,
    lineTotal: it.lineTotal,
  }));

  const { error: itemsErr } = await supabase
    .from('OrderItem')
    .insert(itemsToInsert);
  if (itemsErr) throw itemsErr;

  // Deduct stock
  for (const it of input.items) {
    await supabase.rpc('deduct_stock', {
      p_id: it.productId,
      p_qty: it.quantity,
    });
  }

  return mapOrder(order, orderItems);
}

export async function uploadSlip(orderId: string, file: File): Promise<Order> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const ext = file.name.split('.').pop() || 'jpg';
  const filePath = `${user.id}/${orderId}/${Date.now()}.${ext}`;

  // Upload to storage
  const { error: uploadErr } = await supabase.storage
    .from('payment-slips')
    .upload(filePath, file, { contentType: file.type });
  if (uploadErr) throw uploadErr;

  // Insert payment record
  const { data: payment, error: payErr } = await supabase
    .from('Payment')
    .insert({
      orderId,
      status: 'SUBMITTED',
      slipPath: filePath,
      slipMime: file.type,
      slipOriginalName: file.name,
      slipSize: file.size,
    })
    .select()
    .single();
  if (payErr) throw payErr;

  // Update order status
  await supabase
    .from('Order')
    .update({ status: 'PAYMENT_SUBMITTED' })
    .eq('id', orderId);

  // Return updated order
  return getOrderById(orderId);
}

export async function getMyOrders(): Promise<Order[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: orders, error } = await supabase
    .from('Order')
    .select('*')
    .eq('userId', user.id)
    .order('createdAt', { ascending: false });
  if (error) throw error;

  const result: Order[] = [];
  for (const order of orders || []) {
    const full = await getOrderById(order.id);
    result.push(full);
  }
  return result;
}

export async function getOrderById(orderId: string): Promise<Order> {
  const { data: order, error } = await supabase
    .from('Order')
    .select('*')
    .eq('id', orderId)
    .single();
  if (error) throw error;

  const { data: items } = await supabase
    .from('OrderItem')
    .select('*')
    .eq('orderId', orderId);

  const { data: payment } = await supabase
    .from('Payment')
    .select('*')
    .eq('orderId', orderId)
    .order('submittedAt', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: shipment } = await supabase
    .from('Shipment')
    .select('*')
    .eq('orderId', orderId)
    .maybeSingle();

  return mapOrder(order, items || [], payment || undefined, shipment || undefined);
}

function mapOrder(
  o: Record<string, unknown>,
  items: Record<string, unknown>[],
  payment?: Record<string, unknown>,
  shipment?: Record<string, unknown>,
): Order {
  return {
    id: o.id as string,
    orderNo: o.orderNo as string,
    status: o.status as Order['status'],
    currency: (o.currency as string) || 'THB',
    subtotal: o.subtotal as number,
    shippingFee: o.shippingFee as number,
    total: o.total as number,
    shippingName: o.shippingName as string,
    shippingPhone: o.shippingPhone as string,
    shippingAddress: o.shippingAddress as string,
    items: items.map((it) => ({
      id: it.id as string,
      productId: it.productId as string,
      name: it.name as string,
      price: it.price as number,
      quantity: it.quantity as number,
      lineTotal: it.lineTotal as number,
    })),
    payment: payment ? {
      id: payment.id as string,
      status: payment.status as Payment['status'],
      slipPath: payment.slipPath as string,
      slipMime: payment.slipMime as string,
      slipOriginalName: payment.slipOriginalName as string,
      slipSize: payment.slipSize as number,
      submittedAt: payment.submittedAt as string,
      approvedAt: payment.approvedAt as string | undefined,
      reviewedAt: payment.reviewedAt as string | undefined,
      reviewNote: payment.reviewNote as string | undefined,
    } : undefined,
    shipment: shipment ? {
      id: shipment.id as string,
      carrier: shipment.carrier as string | undefined,
      trackingNo: shipment.trackingNo as string | undefined,
      shippedAt: shipment.shippedAt as string | undefined,
      deliveredAt: shipment.deliveredAt as string | undefined,
    } : undefined,
    createdAt: (o.createdAt as string) || new Date().toISOString(),
  };
}
