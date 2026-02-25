import type { Prisma } from "@prisma/client";

// ─── Action Response ───
export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

// ─── Pagination ───
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// ─── Session / Auth ───
export interface SessionUser {
  userId: string;
  phone: string;
  role: "USER" | "ADMIN";
}

// ─── Product Types ───
export type ProductWithImages = Prisma.ProductGetPayload<{
  include: {
    images: true;
    category: true;
  };
}>;

export type ProductListItem = Prisma.ProductGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    price: true;
    compareAtPrice: true;
    stock: true;
    fabric: true;
    color: true;
    isActive: true;
    isFeatured: true;
    isNewArrival: true;
    codAvailable: true;
    images: {
      select: {
        id: true;
        url: true;
        alt: true;
      };
    };
    category: {
      select: {
        name: true;
        slug: true;
      };
    };
  };
}>;

export interface ProductFilters {
  category?: string;
  fabric?: string[];
  occasion?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  search?: string;
  page?: number;
}

// ─── Cart Types ───
export type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: {
          include: {
            images: true;
          };
        };
      };
    };
  };
}>;

export interface CartSummary {
  items: CartItemDisplay[];
  subtotal: number;
  shippingCharge: number;
  discount: number;
  total: number;
  couponCode?: string;
  itemCount: number;
}

export interface CartItemDisplay {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  quantity: number;
  stock: number;
}

// ─── Order Types ───
export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: true;
    user: {
      select: {
        id: true;
        name: true;
        phone: true;
        email: true;
      };
    };
  };
}>;

export interface ShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

// ─── Dashboard Types ───
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockCount: number;
  recentOrders: OrderWithItems[];
  monthlyRevenue: { month: string; revenue: number }[];
}
