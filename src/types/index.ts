export type UserRole = 'buyer' | 'seller' | 'admin';

export interface University {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
}

export interface Campus {
  id: string;
  universityId: string;
  universityName: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  deliveryLocations: DeliveryLocation[];
}

export interface DeliveryLocation {
  id: string;
  campusId: string;
  name: string;
  buildingName?: string;
  description?: string;
  isPopular?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phoneNumber?: string;
  universityId?: string;
  campusId?: string;
  role: UserRole;
  isSeller: boolean;
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  bio: string;
  logoUrl?: string;
  bannerUrl?: string;
  campusId: string;
  campusName: string;
  isOpen: boolean;
  ratingAvg: number;
  ratingCount: number;
  contactNumber: string;
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerSlug: string;
  sellerRating: number;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number; // Stored in ZAR Cents (e.g. R35.00 -> 3500)
  imageUrl: string;
  isAvailable: boolean;
  campusIds: string[]; // List of campus IDs where sold
  tag?: string;
  eta: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export interface FeeBreakdown {
  subtotalCents: number;
  deliveryFeeCents: number; // Always 200 (R2.00) paid by buyer
  totalCents: number; // subtotalCents + deliveryFeeCents
  platformFeeCents: number; // Always 50 (R0.50) paid by seller per completed order
  sellerNetEarningsCents: number; // totalCents - platformFeeCents
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPriceCents: number;
  quantity: number;
  totalPriceCents: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  sellerId: string;
  sellerName: string;
  campusId: string;
  campusName: string;
  deliveryLocationId: string;
  deliveryLocationName: string;
  customLocationInstructions?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  platformFeeCents: number;
  sellerNetEarningsCents: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller';
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId?: string;
  productId?: string;
  orderId?: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order_status' | 'chat_message' | 'seller_alert' | 'system';
  link?: string;
  isRead: boolean;
  createdAt: string;
}
