import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Ticket,
  Image,
  ImageIcon,
  MessageSquare,
  MessageSquareText,
  Settings,
  BarChart3,
  Video,
  TrendingUp,
  FileSpreadsheet,
  FolderOpen,
  Star,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  badge?: string;
  children?: NavItem[];
}

export interface AdminNavGroup {
  label: string;
  items: NavItem[];
}

export const storefrontNav: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "All Sarees", href: "/products" },
  {
    title: "Collections",
    href: "/categories",
    children: [
      { title: "All Collections", href: "/categories" },
      { title: "Wedding Collection", href: "/products?occasion=WEDDING" },
      { title: "Under ₹1500", href: "/products?maxPrice=1500" },
    ],
  },
  { title: "About", href: "/about" },
  { title: "Saree Guide", href: "/saree-guide" },
  { title: "Contact", href: "/contact" },
];

export const accountNav: NavItem[] = [
  { title: "My Account", href: "/account" },
  { title: "My Orders", href: "/orders" },
  { title: "Addresses", href: "/addresses" },
];

// Flat list for backward compat
export const adminNav: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Categories", href: "/admin/categories", icon: FolderOpen },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Reviews", href: "/admin/reviews", icon: Star },
  { title: "Coupons", href: "/admin/coupons", icon: Ticket },
  { title: "Inventory", href: "/admin/inventory", icon: BarChart3 },
  { title: "Sales Reports", href: "/admin/reports", icon: TrendingUp },
  { title: "Bulk Import", href: "/admin/bulk-import", icon: FileSpreadsheet },
  { title: "Banners", href: "/admin/banners", icon: Image },
  { title: "Site Images", href: "/admin/site-images", icon: ImageIcon },
  { title: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { title: "Messages", href: "/admin/messages", icon: MessageSquareText },
  { title: "Instagram", href: "/admin/instagram", icon: Video },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

// Grouped navigation for the new sidebar
export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Catalog",
    items: [
      { title: "Products", href: "/admin/products", icon: Package },
      { title: "Categories", href: "/admin/categories", icon: FolderOpen },
      { title: "Inventory", href: "/admin/inventory", icon: BarChart3 },
      { title: "Bulk Import", href: "/admin/bulk-import", icon: FileSpreadsheet },
    ],
  },
  {
    label: "Sales",
    items: [
      { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { title: "Customers", href: "/admin/customers", icon: Users },
      { title: "Coupons", href: "/admin/coupons", icon: Ticket },
      { title: "Reports", href: "/admin/reports", icon: TrendingUp },
    ],
  },
  {
    label: "Engagement",
    items: [
      { title: "Reviews", href: "/admin/reviews", icon: Star },
      { title: "Messages", href: "/admin/messages", icon: MessageSquareText },
      { title: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
      { title: "Instagram", href: "/admin/instagram", icon: Video },
    ],
  },
  {
    label: "Appearance",
    items: [
      { title: "Banners", href: "/admin/banners", icon: Image },
      { title: "Site Images", href: "/admin/site-images", icon: ImageIcon },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];
