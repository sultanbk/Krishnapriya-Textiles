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
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  badge?: string;
  children?: NavItem[];
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

export const adminNav: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Customers", href: "/admin/customers", icon: Users },
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
