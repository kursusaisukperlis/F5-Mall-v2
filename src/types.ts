export type ProductCategory = 
  | 'Semua'
  | 'Buah-buahan Segar'
  | 'Kek & Pastri'
  | 'Sambal & Lauk Pauk'
  | 'Kudapan & Minuman'
  | 'Kraf & Keperluan Pejabat';

export interface SellerPaymentInfo {
  duitNowQrUrl?: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  tngPhone?: string;
  acceptsCod: boolean;
  paymentInstructions?: string;
}

export interface Seller {
  id: string;
  name: string;
  shopName: string;
  avatar: string;
  department: string; // e.g. "Bahagian Khidmat Pengurusan (Aras 3)"
  phone: string;
  whatsapp: string;
  rating: number;
  totalSales: number;
  joinedDate: string;
  paymentInfo: SellerPaymentInfo;
  deliveryLocations: string[]; // e.g. ["Hantar ke Meja (Aras 1-5)", "Ambil di Pantry Aras 3", "Lobi Utama"]
  bio: string;
  isVerifiedStaff: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stock: number;
  soldCount: number;
  unit: string; // e.g. "1 Bekas", "1 Kg", "1 Kotak (6 pcs)", "1 Balang"
  image: string;
  additionalImages?: string[];
  sellerId: string;
  sellerName: string;
  sellerDepartment: string;
  rating: number;
  reviewCount: number;
  deliveryOptions: string[];
  badge?: 'HOT' | 'PROMO' | 'FRESH' | 'VIRAL' | 'TERLARIS';
  tags: string[];
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  sellerId: string;
  quantity: number;
  specialNote?: string;
}

export type OrderStatus = 
  | 'pending_payment'
  | 'preparing'
  | 'delivering'
  | 'ready_for_pickup'
  | 'completed'
  | 'cancelled';

export type PaymentMethodType = 'duitnow_qr' | 'bank_transfer' | 'tng_ewallet' | 'cod';

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  specialNote?: string;
}

export interface DeliveryLocation {
  building: string;
  level: string; // e.g. "Aras 3"
  roomOrDesk: string; // e.g. "Unit IT, Meja 12"
  contactPhone: string;
  notes?: string;
  deliveryType: 'hantar_ke_meja' | 'ambil_sendiri';
}

export interface OrderTimelineItem {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  buyerId: string;
  buyerName: string;
  buyerDepartment: string;
  buyerPhone: string;
  sellerId: string;
  sellerName: string;
  sellerDepartment: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'pending' | 'paid' | 'verified';
  paymentProofUrl?: string;
  paymentProofTime?: string;
  deliveryLocation: DeliveryLocation;
  status: OrderStatus;
  statusTimeline: OrderTimelineItem[];
  ratingGiven?: boolean;
  sellerNotes?: string;
}

export interface Review {
  id: string;
  productId: string;
  productTitle: string;
  orderId: string;
  sellerId: string;
  sellerName?: string;
  buyerName: string;
  buyerDepartment: string;
  rating: number; // 1-5
  comment: string;
  tags: string[];
  createdAt: string;
  sellerReply?: {
    message: string;
    timestamp: string;
  };
}

export interface NotificationItem {
  id: string;
  type: 'order_status' | 'new_order' | 'payment_confirmed' | 'promo' | 'review';
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
  isRead?: boolean;
  orderId?: string;
  productId?: string;
  iconType?: 'package' | 'credit-card' | 'bell' | 'star' | 'truck';
}

export type AppNotification = NotificationItem;

export type UserRole = 'admin' | 'seller' | 'buyer';

export interface UserProfile {
  id: string;
  name: string;
  department: string;
  phone: string;
  avatar: string;
  deskLocation: string;
  isSeller: boolean;
  role: UserRole;
  sellerId?: string;
  email?: string;
}
