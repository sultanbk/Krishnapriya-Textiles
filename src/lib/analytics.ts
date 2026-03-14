// Google Analytics 4 tracking utilities
// Set NEXT_PUBLIC_GA_MEASUREMENT_ID in your .env file

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Check if GA is available
export const isGAEnabled = () => typeof window !== "undefined" && !!GA_MEASUREMENT_ID;

// https://developers.google.com/analytics/devguides/collection/ga4/page-view
export const pageview = (url: string) => {
  if (!isGAEnabled()) return;
  window.gtag("event", "page_view", {
    page_path: url,
  });
};

// Generic event tracker
export const event = (action: string, params?: Record<string, unknown>) => {
  if (!isGAEnabled()) return;
  window.gtag("event", action, params);
};

// ─── Ecommerce Events ───

export const viewItem = (item: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  event("view_item", {
    currency: "INR",
    value: item.price,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        item_category: item.category,
      },
    ],
  });
};

export const addToCart = (item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}) => {
  event("add_to_cart", {
    currency: "INR",
    value: item.price * item.quantity,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
        item_category: item.category,
      },
    ],
  });
};

export const removeFromCart = (item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  event("remove_from_cart", {
    currency: "INR",
    value: item.price * item.quantity,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      },
    ],
  });
};

export const viewItemList = (items: { id: string; name: string; price: number }[]) => {
  event("view_item_list", {
    currency: "INR",
    items: items.map((item, index) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      index,
    })),
  });
};

export const beginCheckout = (value: number, items: { id: string; name: string; price: number; quantity: number }[]) => {
  event("begin_checkout", {
    currency: "INR",
    value,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

export const purchase = (params: {
  transactionId: string;
  value: number;
  shipping: number;
  items: { id: string; name: string; price: number; quantity: number }[];
}) => {
  event("purchase", {
    transaction_id: params.transactionId,
    currency: "INR",
    value: params.value,
    shipping: params.shipping,
    items: params.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

export const search = (searchTerm: string) => {
  event("search", { search_term: searchTerm });
};

export const addToWishlist = (item: {
  id: string;
  name: string;
  price: number;
}) => {
  event("add_to_wishlist", {
    currency: "INR",
    value: item.price,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
      },
    ],
  });
};

export const share = (method: string, contentType: string, itemId: string) => {
  event("share", {
    method,
    content_type: contentType,
    item_id: itemId,
  });
};

export const login = (method: string) => {
  event("login", { method });
};

export const signUp = (method: string) => {
  event("sign_up", { method });
};

// TypeScript global declaration for gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
