export const siteConfig = {
  name: "Krishnapriya Textiles",
  shortName: "KPT",
  description:
    "Premium silk sarees from Karnataka. Handpicked collection of Mysore Silk, Kanchipuram, Banarasi and more. Authentic quality, affordable prices.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  locale: "en_IN",
  currency: "INR",
  currencySymbol: "₹",
  phone: "+91 91084 55006",
  whatsapp: "9108455006",
  email: "info@krishnapriyatextiles.com",
  address: {
    street: "Shidling Complex, Opposite Bus Stand, Hubli Road",
    city: "Shirahatti",
    state: "Karnataka",
    pincode: "582120",
    country: "India",
  },
  social: {
    instagram: "https://instagram.com/krishnapriyatextiles",
    facebook: "https://facebook.com/krishnapriyatextiles",
    youtube: "",
  },
  shipping: {
    freeShippingThreshold: 1500,
    defaultShippingCharge: 99,
    estimatedDeliveryDays: { min: 3, max: 7 },
  },
  seo: {
    titleTemplate: "%s | Krishnapriya Textiles",
    defaultTitle: "Krishnapriya Textiles — Premium Silk Sarees from Karnataka",
    defaultDescription:
      "Shop authentic silk sarees from Karnataka. Mysore Silk, Kanchipuram, Banarasi & more. Free shipping above ₹1500. COD available.",
  },
} as const;

export type SiteConfig = typeof siteConfig;
