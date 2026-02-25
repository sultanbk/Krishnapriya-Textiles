import { PrismaClient, Fabric, Occasion, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import bcrypt from "bcryptjs";

// Load env vars
config({ path: ".env.local" });
config({ path: ".env" });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Categories ─────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "silk-sarees" },
      update: {},
      create: {
        name: "Silk Sarees",
        slug: "silk-sarees",
        description:
          "Luxurious pure silk sarees handcrafted by master weavers. Perfect for weddings, festivals, and special celebrations.",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "cotton-sarees" },
      update: {},
      create: {
        name: "Cotton Sarees",
        slug: "cotton-sarees",
        description:
          "Comfortable cotton sarees ideal for daily wear and office. Breathable and elegant.",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "banarasi-sarees" },
      update: {},
      create: {
        name: "Banarasi Sarees",
        slug: "banarasi-sarees",
        description:
          "Exquisite Banarasi sarees with rich zari work, perfect for grand occasions.",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "kanchipuram-sarees" },
      update: {},
      create: {
        name: "Kanchipuram Sarees",
        slug: "kanchipuram-sarees",
        description:
          "Timeless Kanchipuram silk sarees known for their durability and temple border designs.",
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "chiffon-sarees" },
      update: {},
      create: {
        name: "Chiffon Sarees",
        slug: "chiffon-sarees",
        description:
          "Lightweight chiffon sarees with beautiful drape, perfect for parties and events.",
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: "georgette-sarees" },
      update: {},
      create: {
        name: "Georgette Sarees",
        slug: "georgette-sarees",
        description:
          "Elegant georgette sarees with a smooth texture, ideal for festive and formal occasions.",
        sortOrder: 6,
      },
    }),
    prisma.category.upsert({
      where: { slug: "linen-sarees" },
      update: {},
      create: {
        name: "Linen Sarees",
        slug: "linen-sarees",
        description:
          "Premium linen sarees for the modern woman. Breathable and sophisticated.",
        sortOrder: 7,
      },
    }),
    prisma.category.upsert({
      where: { slug: "tussar-sarees" },
      update: {},
      create: {
        name: "Tussar Sarees",
        slug: "tussar-sarees",
        description:
          "Natural tussar silk sarees with a rich texture and earthy tones.",
        sortOrder: 8,
      },
    }),
    prisma.category.upsert({
      where: { slug: "mysore-silk-sarees" },
      update: {},
      create: {
        name: "Mysore Silk Sarees",
        slug: "mysore-silk-sarees",
        description:
          "Classic Mysore silk sarees, known for their smooth finish and vibrant colors.",
        sortOrder: 9,
      },
    }),
    prisma.category.upsert({
      where: { slug: "organza-sarees" },
      update: {},
      create: {
        name: "Organza Sarees",
        slug: "organza-sarees",
        description:
          "Trendy organza sarees with a sheer, lightweight feel and modern designs.",
        sortOrder: 10,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  const [silk, cotton, banarasi, kanchipuram, chiffon, georgette, linen, tussar, mysoreSilk, organza] = categories;

  // ─── Products ───────────────────────────────
  const products = [
    {
      name: "Royal Maroon Banarasi Silk Saree",
      slug: "royal-maroon-banarasi-silk-saree",
      sku: "KP-BNRS-001",
      description:
        "Exquisite maroon Banarasi silk saree with intricate gold zari work. Features a rich pallu with temple motifs and a contrasting border. Perfect for weddings and grand celebrations. This handwoven masterpiece reflects centuries of Banarasi weaving tradition.",
      shortDescription: "Handwoven maroon Banarasi silk with gold zari work",
      price: 4999,
      compareAtPrice: 5999,
      stock: 12,
      fabric: Fabric.BANARASI,
      occasion: [Occasion.WEDDING, Occasion.FESTIVE],
      categoryId: banarasi.id,
      color: "Maroon",
      length: "6.3 meters",
      width: "47 inches",
      weight: "800g",
      blouseIncluded: true,
      blouseLength: "0.8 meters unstitched",
      borderType: "Temple border with gold zari",
      palluDetail: "Rich pallu with traditional motifs and zari work",
      washCare: "Dry clean only. Store in muslin cloth.",
      zariType: "Pure gold zari",
      isFeatured: true,
      isNewArrival: true,
    },
    {
      name: "Emerald Green Kanchipuram Silk Saree",
      slug: "emerald-green-kanchipuram-silk-saree",
      sku: "KP-KNCH-001",
      description:
        "Stunning emerald green Kanchipuram silk saree with a grand contrast border in magenta and gold. Woven with pure mulberry silk and real zari. The pallu features traditional peacock motifs. An heirloom piece for the discerning woman.",
      shortDescription: "Pure Kanchipuram silk in emerald green with peacock motifs",
      price: 4500,
      compareAtPrice: 5500,
      stock: 8,
      fabric: Fabric.KANCHIPURAM,
      occasion: [Occasion.WEDDING, Occasion.FESTIVE],
      categoryId: kanchipuram.id,
      color: "Emerald Green",
      length: "6.2 meters",
      width: "47 inches",
      weight: "750g",
      blouseIncluded: true,
      blouseLength: "0.8 meters unstitched",
      borderType: "Grand contrast border in magenta & gold",
      palluDetail: "Traditional peacock and temple motifs",
      washCare: "Dry clean only. Store wrapped in soft cotton cloth.",
      zariType: "Pure zari",
      isFeatured: true,
    },
    {
      name: "Sky Blue Chiffon Saree",
      slug: "sky-blue-chiffon-saree",
      sku: "KP-CHFF-001",
      description:
        "Lightweight sky blue chiffon saree with delicate silver sequin work along the border. Features a graceful drape and subtle shimmer. Ideal for parties, evening events, and festive gatherings.",
      shortDescription: "Lightweight chiffon with silver sequin border",
      price: 1499,
      compareAtPrice: 1999,
      stock: 25,
      fabric: Fabric.CHIFFON,
      occasion: [Occasion.PARTY, Occasion.FESTIVE],
      categoryId: chiffon.id,
      color: "Sky Blue",
      length: "6.3 meters",
      width: "44 inches",
      weight: "350g",
      blouseIncluded: true,
      blouseLength: "0.8 meters unstitched",
      borderType: "Silver sequin border",
      palluDetail: "Sequin scattered pallu with tassels",
      washCare: "Gentle hand wash in cold water or dry clean.",
      zariType: "None",
      isFeatured: true,
    },
    {
      name: "Ivory White Cotton Saree with Jamdani Border",
      slug: "ivory-white-cotton-saree-jamdani-border",
      sku: "KP-CTTN-001",
      description:
        "Elegant ivory white handloom cotton saree with a beautiful Jamdani weave border in red and gold. Perfect for daily wear and office. The cotton is soft, breathable, and comfortable for all-day wear in Indian weather.",
      shortDescription: "Handloom cotton with Jamdani weave border",
      price: 899,
      compareAtPrice: 1200,
      stock: 40,
      fabric: Fabric.COTTON,
      occasion: [Occasion.DAILY, Occasion.OFFICE],
      categoryId: cotton.id,
      color: "Ivory White",
      length: "6.0 meters",
      width: "44 inches",
      weight: "400g",
      blouseIncluded: false,
      borderType: "Jamdani weave in red and gold",
      palluDetail: "Simple pallu with Jamdani motifs",
      washCare: "Machine wash on gentle cycle or hand wash. Iron on medium heat.",
      zariType: "None",
    },
    {
      name: "Dusty Rose Georgette Saree",
      slug: "dusty-rose-georgette-saree",
      sku: "KP-GRGT-001",
      description:
        "Beautiful dusty rose georgette saree with intricate thread embroidery along the border. The georgette fabric offers a lovely drape and the pastel shade makes it perfect for daytime events and festive celebrations.",
      shortDescription: "Georgette with thread embroidery in dusty rose",
      price: 1799,
      compareAtPrice: 2499,
      stock: 18,
      fabric: Fabric.GEORGETTE,
      occasion: [Occasion.PARTY, Occasion.FESTIVE],
      categoryId: georgette.id,
      color: "Dusty Rose",
      length: "6.3 meters",
      width: "44 inches",
      weight: "400g",
      blouseIncluded: true,
      blouseLength: "0.8 meters unstitched",
      borderType: "Thread embroidery border",
      palluDetail: "Embroidered floral pallu",
      washCare: "Dry clean recommended. Can be gently hand washed.",
      zariType: "None",
      isNewArrival: true,
    },
    {
      name: "Golden Tussar Silk Saree",
      slug: "golden-tussar-silk-saree",
      sku: "KP-TSSR-001",
      description:
        "Natural golden tussar silk saree with hand-painted Madhubani art. The raw silk texture and earthy tones give this saree a unique, artisanal character. Perfect for cultural events and festive occasions.",
      shortDescription: "Hand-painted tussar silk with Madhubani art",
      price: 3299,
      compareAtPrice: 3999,
      stock: 6,
      fabric: Fabric.TUSSAR,
      occasion: [Occasion.FESTIVE, Occasion.CASUAL],
      categoryId: tussar.id,
      color: "Golden",
      length: "6.0 meters",
      width: "46 inches",
      weight: "550g",
      blouseIncluded: true,
      blouseLength: "0.8 meters unstitched",
      borderType: "Hand-painted border",
      palluDetail: "Madhubani painted pallu with nature motifs",
      washCare: "Dry clean only. Do not wring or soak.",
      zariType: "None",
      isFeatured: true,
    },
    {
      name: "Navy Blue Mysore Silk Saree",
      slug: "navy-blue-mysore-silk-saree",
      sku: "KP-MYSR-001",
      description:
        "Classic navy blue Mysore silk saree with a golden kasuti embroidery border. Known for their pure silk sheen and smooth finish, Mysore silks are the pride of Karnataka. Ideal for festive occasions and traditional events.",
      shortDescription: "Pure Mysore silk with kasuti embroidery",
      price: 3999,
      compareAtPrice: 4500,
      stock: 10,
      fabric: Fabric.MYSORE_SILK,
      occasion: [Occasion.WEDDING, Occasion.FESTIVE],
      categoryId: mysoreSilk.id,
      color: "Navy Blue",
      length: "6.2 meters",
      width: "47 inches",
      weight: "650g",
      blouseIncluded: true,
      blouseLength: "0.8 meters unstitched",
      borderType: "Kasuti embroidery border",
      palluDetail: "Rich pallu with traditional Karnataka motifs",
      washCare: "Dry clean only.",
      zariType: "Pure gold zari",
      isNewArrival: true,
    },
    {
      name: "Peach Organza Saree with Floral Prints",
      slug: "peach-organza-saree-floral-prints",
      sku: "KP-ORGZ-001",
      description:
        "Trendy peach organza saree with digital floral prints and a sequin-embellished border. The sheer organza fabric offers a contemporary look while maintaining traditional elegance. Perfect for parties and modern festive wear.",
      shortDescription: "Digital print organza with sequin border",
      price: 1999,
      compareAtPrice: 2599,
      stock: 15,
      fabric: Fabric.ORGANZA,
      occasion: [Occasion.PARTY, Occasion.CASUAL],
      categoryId: organza.id,
      color: "Peach",
      length: "6.3 meters",
      width: "44 inches",
      weight: "300g",
      blouseIncluded: true,
      blouseLength: "0.8 meters unstitched",
      borderType: "Sequin-embellished border",
      palluDetail: "Floral digital print pallu",
      washCare: "Dry clean only.",
      zariType: "None",
      isNewArrival: true,
    },
    {
      name: "Classic Red Silk Saree with Gold Border",
      slug: "classic-red-silk-saree-gold-border",
      sku: "KP-SILK-001",
      description:
        "A timeless red pure silk saree with a traditional gold zari border. This classic piece is a wardrobe essential for every Indian woman. Perfect for poojas, festivals, and family celebrations. The rich red symbolizes auspiciousness and joy.",
      shortDescription: "Pure silk in classic red with traditional gold zari",
      price: 2999,
      compareAtPrice: 3500,
      stock: 20,
      fabric: Fabric.SILK,
      occasion: [Occasion.WEDDING, Occasion.FESTIVE, Occasion.DAILY],
      categoryId: silk.id,
      color: "Red",
      length: "6.2 meters",
      width: "46 inches",
      weight: "600g",
      blouseIncluded: true,
      blouseLength: "0.8 meters unstitched",
      borderType: "Traditional gold zari border",
      palluDetail: "Grand pallu with butta motifs",
      washCare: "Dry clean only. Store in muslin cloth away from direct sunlight.",
      zariType: "Pure zari",
      isFeatured: true,
    },
    {
      name: "Sage Green Linen Saree",
      slug: "sage-green-linen-saree",
      sku: "KP-LINN-001",
      description:
        "Premium sage green linen saree with a minimalist silver zari border. The linen fabric is breathable and comfortable, making it perfect for office wear and casual outings. A sophisticated choice for the modern woman.",
      shortDescription: "Premium linen with silver zari border",
      price: 1299,
      compareAtPrice: 1699,
      stock: 30,
      fabric: Fabric.LINEN,
      occasion: [Occasion.OFFICE, Occasion.CASUAL, Occasion.DAILY],
      categoryId: linen.id,
      color: "Sage Green",
      length: "6.0 meters",
      width: "44 inches",
      weight: "350g",
      blouseIncluded: false,
      borderType: "Silver zari border",
      palluDetail: "Simple pallu with woven stripes",
      washCare: "Machine wash cold. Iron on medium heat.",
      zariType: "Silver zari",
    },
    {
      name: "Magenta Crepe Silk Saree",
      slug: "magenta-crepe-silk-saree",
      sku: "KP-CRPE-001",
      description:
        "Vibrant magenta crepe silk saree with self-textured body and a stone-studded border. The crepe fabric offers a unique crinkled texture and a beautiful drape. Ideal for evening events and festivities.",
      shortDescription: "Crepe silk with stone-studded border",
      price: 2499,
      compareAtPrice: 2999,
      stock: 14,
      fabric: Fabric.CREPE,
      occasion: [Occasion.PARTY, Occasion.FESTIVE],
      categoryId: silk.id,
      color: "Magenta",
      length: "6.3 meters",
      width: "44 inches",
      weight: "450g",
      blouseIncluded: true,
      blouseLength: "0.8 meters unstitched",
      borderType: "Stone-studded border",
      palluDetail: "Self-textured pallu with stone work",
      washCare: "Dry clean recommended.",
      zariType: "None",
    },
    {
      name: "Budget Indigo Cotton Saree",
      slug: "budget-indigo-cotton-saree",
      sku: "KP-CTTN-002",
      description:
        "Affordable indigo blue cotton saree with traditional block print design. Made from pure handloom cotton, this saree is perfect for daily wear. Comfortable, durable, and easy to maintain.",
      shortDescription: "Block-printed handloom cotton in indigo",
      price: 599,
      stock: 50,
      fabric: Fabric.COTTON,
      occasion: [Occasion.DAILY, Occasion.CASUAL],
      categoryId: cotton.id,
      color: "Indigo Blue",
      length: "6.0 meters",
      width: "44 inches",
      weight: "380g",
      blouseIncluded: false,
      borderType: "Block print border",
      palluDetail: "Matching block print pallu",
      washCare: "Machine wash cold. Colors may bleed on first wash.",
      zariType: "None",
    },
    {
      name: "Mustard Yellow Cotton Silk Blend Saree",
      slug: "mustard-yellow-cotton-silk-blend",
      sku: "KP-SILK-002",
      description:
        "Beautiful mustard yellow cotton silk blend saree with a temple border in maroon. The cotton silk blend offers the sheen of silk with the comfort of cotton. Versatile enough for both office and festive wear.",
      shortDescription: "Cotton silk blend with temple border",
      price: 999,
      compareAtPrice: 1399,
      stock: 35,
      fabric: Fabric.SILK,
      occasion: [Occasion.FESTIVE, Occasion.OFFICE, Occasion.DAILY],
      categoryId: silk.id,
      color: "Mustard Yellow",
      length: "6.2 meters",
      width: "44 inches",
      weight: "480g",
      blouseIncluded: true,
      blouseLength: "0.8 meters unstitched",
      borderType: "Temple border in maroon",
      palluDetail: "Woven paisley pallu",
      washCare: "Gentle hand wash or dry clean.",
      zariType: "None",
    },
    {
      name: "Lavender Organza Saree with Pearl Work",
      slug: "lavender-organza-saree-pearl-work",
      sku: "KP-ORGZ-002",
      description:
        "Dreamy lavender organza saree with delicate pearl embroidery and a scalloped border. This contemporary saree is a showstopper for cocktail parties and reception events. Comes with a matching embroidered blouse piece.",
      shortDescription: "Organza with pearl embroidery and scalloped border",
      price: 2799,
      compareAtPrice: 3499,
      stock: 8,
      fabric: Fabric.ORGANZA,
      occasion: [Occasion.PARTY, Occasion.WEDDING],
      categoryId: organza.id,
      color: "Lavender",
      length: "6.3 meters",
      width: "44 inches",
      weight: "280g",
      blouseIncluded: true,
      blouseLength: "0.8 meters unstitched",
      borderType: "Scalloped border with pearl work",
      palluDetail: "Pearl-embroidered pallu with scallop edges",
      washCare: "Dry clean only. Handle with care.",
      zariType: "None",
      isNewArrival: true,
    },
    {
      name: "Teal Banarasi Silk Saree with Meenakari Work",
      slug: "teal-banarasi-silk-meenakari",
      sku: "KP-BNRS-002",
      description:
        "Magnificent teal Banarasi silk saree with traditional Meenakari work on the border and pallu. The multi-colored Meenakari technique brings the saree to life. A collector's piece for those who appreciate fine craftsmanship.",
      shortDescription: "Banarasi silk with Meenakari work in teal",
      price: 4799,
      compareAtPrice: 5499,
      stock: 5,
      fabric: Fabric.BANARASI,
      occasion: [Occasion.WEDDING, Occasion.FESTIVE],
      categoryId: banarasi.id,
      color: "Teal",
      length: "6.3 meters",
      width: "47 inches",
      weight: "850g",
      blouseIncluded: true,
      blouseLength: "0.8 meters unstitched",
      borderType: "Meenakari border with multi-color zari",
      palluDetail: "Grand Meenakari pallu with floral motifs",
      washCare: "Dry clean only. Store flat in muslin cloth.",
      zariType: "Real zari with Meenakari",
      isFeatured: true,
    },
  ];

  for (const product of products) {
    const { occasion, ...productData } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...productData,
        occasion,
        images: {
          create: [
            {
              url: `https://placehold.co/800x1067/800020/C9A84C?text=${encodeURIComponent(product.name.split(" ").slice(0, 3).join("+"))}`,
              publicId: `kpt/${product.sku.toLowerCase()}`,
              alt: product.name,
              position: 0,
            },
          ],
        },
      },
    });
  }

  console.log(`✅ Created ${products.length} products`);

  // ─── Admin User ─────────────────────────────
  const admin = await prisma.user.upsert({
    where: { phone: "9108455006" },
    update: {},
    create: {
      phone: "9108455006",
      name: "Puneet Shidling",
      email: "admin@krishnapriyatextiles.com",
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Admin user created: ${admin.phone}`);

  // ─── Sample Coupon ──────────────────────────
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "Welcome discount - 10% off on your first order",
      discountType: "PERCENTAGE",
      discountValue: 10,
      maxDiscount: 500,
      minOrderAmount: 1000,
      usageLimit: 100,
      perUserLimit: 1,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "SILK20" },
    update: {},
    create: {
      code: "SILK20",
      description: "Flat ₹200 off on silk sarees",
      discountType: "FLAT",
      discountValue: 200,
      minOrderAmount: 2000,
      usageLimit: 50,
      perUserLimit: 1,
      isActive: true,
    },
  });

  console.log("✅ Sample coupons created");

  // ─── Sample Banners ─────────────────────────
  await prisma.banner.upsert({
    where: { id: "banner-1" },
    update: {},
    create: {
      id: "banner-1",
      title: "New Festive Collection",
      subtitle: "Explore our handpicked festive sarees starting from ₹999",
      image: "https://placehold.co/1920x600/800020/C9A84C?text=Festive+Collection",
      mobileImage: "https://placehold.co/768x600/800020/C9A84C?text=Festive+Collection",
      link: "/products?occasion=FESTIVE",
      position: 0,
    },
  });

  await prisma.banner.upsert({
    where: { id: "banner-2" },
    update: {},
    create: {
      id: "banner-2",
      title: "Silk Saree Sale",
      subtitle: "Up to 30% off on premium silk sarees",
      image: "https://placehold.co/1920x600/C9A84C/800020?text=Silk+Sale",
      mobileImage: "https://placehold.co/768x600/C9A84C/800020?text=Silk+Sale",
      link: "/products?fabric=SILK",
      position: 1,
    },
  });

  console.log("✅ Sample banners created");

  // ─── Sample Testimonials ────────────────────
  const testimonials = [
    {
      id: "testimonial-1",
      customerName: "Lakshmi Devi",
      location: "Bangalore, Karnataka",
      content:
        "I ordered a Kanchipuram silk saree for my daughter's wedding and it was absolutely stunning! The quality is exceptional and it arrived well-packaged. Thank you, Krishnapriya Textiles!",
      rating: 5,
    },
    {
      id: "testimonial-2",
      customerName: "Priya Sharma",
      location: "Hubli, Karnataka",
      content:
        "Best place to buy sarees online! I've ordered multiple times and every time the saree looks even better than the photos. Their customer service is also very helpful.",
      rating: 5,
    },
    {
      id: "testimonial-3",
      customerName: "Meera Rao",
      location: "Mysore, Karnataka",
      content:
        "The cotton sarees from Krishnapriya Textiles are my go-to for office wear. Comfortable, elegant, and very affordable. Highly recommended!",
      rating: 4,
    },
    {
      id: "testimonial-4",
      customerName: "Anitha Gowda",
      location: "Dharwad, Karnataka",
      content:
        "I received my Banarasi silk saree and it's gorgeous! The zari work is so intricate. I'll definitely be ordering more sarees from here.",
      rating: 5,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {},
      create: { ...t, position: testimonials.indexOf(t) },
    });
  }

  console.log("✅ Sample testimonials created");

  // ─── Settings ───────────────────────────────
  const settings = [
    { key: "store_name", value: "Krishnapriya Textiles", group: "general" },
    { key: "store_phone", value: "+919108455006", group: "general" },
    { key: "store_email", value: "contact@krishnapriyatextiles.com", group: "general" },
    { key: "free_shipping_threshold", value: "1500", group: "shipping" },
    { key: "default_shipping_charge", value: "99", group: "shipping" },
    { key: "cod_available", value: "true", group: "shipping" },
    { key: "min_order_amount", value: "0", group: "orders" },
    { key: "gst_percentage", value: "5", group: "tax" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  console.log("✅ Settings initialized");

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
