import { Product, Seller, Order, Review, NotificationItem, UserProfile, CartItem, OrderStatus } from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SELLERS, 
  INITIAL_ORDERS, 
  INITIAL_REVIEWS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_USER 
} from '../data/initialData';
import { playNotificationSound } from './audio';

const STORAGE_KEYS = {
  PRODUCTS: 'pasarkita_products_v1',
  SELLERS: 'pasarkita_sellers_v1',
  ORDERS: 'pasarkita_orders_v1',
  REVIEWS: 'pasarkita_reviews_v1',
  NOTIFICATIONS: 'pasarkita_notifications_v1',
  USER: 'pasarkita_user_v1',
  CART: 'pasarkita_cart_v1',
};

// Storage Helpers
export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  window.dispatchEvent(new CustomEvent('pasarkita:products_updated', { detail: products }));
}

export function getStoredSellers(): Seller[] {
  if (typeof window === 'undefined') return INITIAL_SELLERS;
  const data = localStorage.getItem(STORAGE_KEYS.SELLERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(INITIAL_SELLERS));
    return INITIAL_SELLERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_SELLERS;
  }
}

export function saveSellers(sellers: Seller[]) {
  localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(sellers));
  window.dispatchEvent(new CustomEvent('pasarkita:sellers_updated', { detail: sellers }));
}

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent('pasarkita:orders_updated', { detail: orders }));
}

export function getStoredReviews(): Review[] {
  if (typeof window === 'undefined') return INITIAL_REVIEWS;
  const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    return INITIAL_REVIEWS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_REVIEWS;
  }
}

export function saveReviews(reviews: Review[]) {
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  window.dispatchEvent(new CustomEvent('pasarkita:reviews_updated', { detail: reviews }));
}

export function getStoredNotifications(): NotificationItem[] {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifs: NotificationItem[]) {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  window.dispatchEvent(new CustomEvent('pasarkita:notifications_updated', { detail: notifs }));
}

export function addNotification(title: string, message: string, type: NotificationItem['type'] = 'order_status', orderId?: string, productId?: string) {
  const current = getStoredNotifications();
  const newNotif: NotificationItem = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title,
    message,
    type,
    timestamp: 'Baru sahaja',
    read: false,
    orderId,
    productId,
  };
  const updated = [newNotif, ...current];
  saveNotifications(updated);
  playNotificationSound('order');
}

export function getStoredUser(): UserProfile {
  if (typeof window === 'undefined') return INITIAL_USER;
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
    return INITIAL_USER;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_USER;
  }
}

export function saveUser(user: UserProfile) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('pasarkita:user_updated', { detail: user }));
}

export function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.CART);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('pasarkita:cart_updated', { detail: cart }));
}

// Complex Actions
export function addProductToMall(newProductData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'soldCount'>): Product {
  const products = getStoredProducts();
  const newProduct: Product = {
    ...newProductData,
    id: `prod-${Date.now()}`,
    rating: 5.0,
    reviewCount: 0,
    soldCount: 0,
    createdAt: new Date().toISOString(),
  };
  const updated = [newProduct, ...products];
  saveProducts(updated);

  addNotification(
    '📢 Produk Baru Ditambah!',
    `${newProduct.sellerName} telah menyenaraikan "${newProduct.title}" untuk warga jabatan.`,
    'promo',
    undefined,
    newProduct.id
  );

  return newProduct;
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string) {
  const orders = getStoredOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return;

  const order = orders[index];
  const prevStatus = order.status;
  order.status = newStatus;

  let label = 'Status Dikemas Kini';
  if (newStatus === 'preparing') label = 'Sedang Disediakan / Dimasak';
  if (newStatus === 'delivering') label = 'Sedang Dihantar ke Meja';
  if (newStatus === 'ready_for_pickup') label = 'Sedia Untuk Diambil';
  if (newStatus === 'completed') label = 'Pesanan Selesai';
  if (newStatus === 'cancelled') label = 'Pesanan Dibatalkan';

  const newTimelineItem = {
    status: newStatus,
    label,
    timestamp: new Date().toISOString(),
    note: note || `Status pesanan dikemas kini kepada ${label}.`,
  };

  order.statusTimeline = [...order.statusTimeline, newTimelineItem];
  orders[index] = { ...order };
  saveOrders(orders);

  // Trigger Notification for buyer
  addNotification(
    `📦 Status Pesanan #${order.orderNumber}`,
    `${order.sellerName}: ${newTimelineItem.note}`,
    'order_status',
    order.id
  );
}

export function createNewOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'statusTimeline'>): Order {
  const orders = getStoredOrders();
  const orderNum = `JBT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const initialTimelineItem = {
    status: orderData.status,
    label: orderData.paymentMethod === 'cod' ? 'Pesanan COD Diterima' : 'Pesanan Diterima (Menunggu Pengesahan)',
    timestamp: new Date().toISOString(),
    note: `Pesanan berjaya dibuat oleh ${orderData.buyerName} untuk dihantar ke ${orderData.deliveryLocation.level}, ${orderData.deliveryLocation.roomOrDesk}.`,
  };

  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    orderNumber: orderNum,
    createdAt: new Date().toISOString(),
    statusTimeline: [initialTimelineItem],
  };

  const updatedOrders = [newOrder, ...orders];
  saveOrders(updatedOrders);

  // Update seller sales count & product sold counts
  const products = getStoredProducts();
  newOrder.items.forEach(item => {
    const pIdx = products.findIndex(p => p.id === item.productId);
    if (pIdx !== -1) {
      products[pIdx].soldCount += item.quantity;
      products[pIdx].stock = Math.max(0, products[pIdx].stock - item.quantity);
    }
  });
  saveProducts(products);

  const sellers = getStoredSellers();
  const sIdx = sellers.findIndex(s => s.id === newOrder.sellerId);
  if (sIdx !== -1) {
    sellers[sIdx].totalSales += newOrder.items.reduce((acc, it) => acc + it.quantity, 0);
    saveSellers(sellers);
  }

  // Create notification for seller & buyer
  addNotification(
    '🛒 Pesanan Baru Diterima!',
    `Pesanan #${orderNum} sebanyak RM${newOrder.totalAmount.toFixed(2)} daripada ${newOrder.buyerName} (${newOrder.buyerDepartment}) telah masuk.`,
    'new_order',
    newOrder.id
  );

  return newOrder;
}

export function addReviewToProduct(reviewData: Omit<Review, 'id' | 'createdAt'>) {
  const reviews = getStoredReviews();
  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const updatedReviews = [newReview, ...reviews];
  saveReviews(updatedReviews);

  // Update product average rating
  const products = getStoredProducts();
  const pIdx = products.findIndex(p => p.id === reviewData.productId);
  if (pIdx !== -1) {
    const productReviews = updatedReviews.filter(r => r.productId === reviewData.productId);
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    products[pIdx].rating = Number((sum / productReviews.length).toFixed(1));
    products[pIdx].reviewCount = productReviews.length;
    saveProducts(products);
  }

  // Mark order as reviewed
  const orders = getStoredOrders();
  const oIdx = orders.findIndex(o => o.id === reviewData.orderId);
  if (oIdx !== -1) {
    orders[oIdx].ratingGiven = true;
    saveOrders(orders);
  }

  addNotification(
    '⭐ Penilaian Baru Diterima!',
    `${reviewData.buyerName} memberikan ${reviewData.rating} bintang bagi "${reviewData.productTitle}".`,
    'review',
    reviewData.orderId,
    reviewData.productId
  );
}

export function updateProductInMall(productId: string, updatedFields: Partial<Product>): Product | null {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) return null;

  const updatedProduct: Product = {
    ...products[index],
    ...updatedFields,
  };
  products[index] = updatedProduct;
  saveProducts(products);
  return updatedProduct;
}

export function deleteProductFromMall(productId: string): boolean {
  const products = getStoredProducts();
  const filtered = products.filter((p) => p.id !== productId);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

export function updateSellerInMall(sellerId: string, updatedFields: Partial<Seller>): Seller | null {
  const sellers = getStoredSellers();
  const index = sellers.findIndex((s) => s.id === sellerId);
  if (index === -1) return null;

  const updatedSeller: Seller = {
    ...sellers[index],
    ...updatedFields,
  };
  sellers[index] = updatedSeller;
  saveSellers(sellers);
  return updatedSeller;
}

export function addSellerToMall(sellerData: Omit<Seller, 'id' | 'rating' | 'totalSales' | 'joinedDate'>): Seller {
  const sellers = getStoredSellers();
  const newSeller: Seller = {
    ...sellerData,
    id: `seller-${Date.now()}`,
    rating: 5.0,
    totalSales: 0,
    joinedDate: 'Hari Ini',
  };
  const updated = [newSeller, ...sellers];
  saveSellers(updated);
  return newSeller;
}

export function deleteSellerFromMall(sellerId: string): boolean {
  const sellers = getStoredSellers();
  const filtered = sellers.filter((s) => s.id !== sellerId);
  if (filtered.length === sellers.length) return false;
  saveSellers(filtered);
  return true;
}

export function broadcastAdminNotification(title: string, message: string, type: NotificationItem['type'] = 'promo') {
  addNotification(title, message, type);
}

export function updateOrderAdmin(orderId: string, updatedFields: Partial<Order>) {
  const orders = getStoredOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return;

  orders[index] = {
    ...orders[index],
    ...updatedFields,
  };
  saveOrders(orders);
}

export function resetMallToDefaults() {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(INITIAL_SELLERS));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));

  window.dispatchEvent(new CustomEvent('pasarkita:products_updated', { detail: INITIAL_PRODUCTS }));
  window.dispatchEvent(new CustomEvent('pasarkita:sellers_updated', { detail: INITIAL_SELLERS }));
  window.dispatchEvent(new CustomEvent('pasarkita:orders_updated', { detail: INITIAL_ORDERS }));
  window.dispatchEvent(new CustomEvent('pasarkita:reviews_updated', { detail: INITIAL_REVIEWS }));
  window.dispatchEvent(new CustomEvent('pasarkita:notifications_updated', { detail: INITIAL_NOTIFICATIONS }));
  window.dispatchEvent(new CustomEvent('pasarkita:user_updated', { detail: INITIAL_USER }));
  window.dispatchEvent(new CustomEvent('pasarkita:cart_updated', { detail: [] }));
}
