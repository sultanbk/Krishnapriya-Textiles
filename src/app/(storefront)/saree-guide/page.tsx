import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Saree Guide — Sizing, Draping Styles & Care Tips",
  description:
    "Complete guide to saree sizing, popular draping styles like Nivi, Bengali, Gujarati and more. Plus fabric care tips for your precious silk sarees.",
};

const drapingStyles = [
  {
    name: "Nivi Style (నివి / ನಿವಿ)",
    origin: "Andhra Pradesh",
    difficulty: "Easy",
    description:
      "The most common and popular draping style. The saree is wrapped around the waist, tucked into the petticoat, and the pallu is draped over the left shoulder. Simple, elegant, and perfect for everyday wear.",
    steps: [
      "Tuck one end of the saree into the petticoat at the navel, going from right to left",
      "Wrap the saree around once from right to left",
      "Make 5-7 pleats (about 5 inches wide) at the front center",
      "Tuck the pleats into the petticoat, facing left",
      "Take the remaining fabric, drape it across the chest and over the left shoulder",
      "Pin the pallu at the shoulder for a neat look",
    ],
    bestFor: "Daily wear, office, temples, casual occasions",
  },
  {
    name: "Bengali Style (বাঙালি)",
    origin: "West Bengal",
    difficulty: "Medium",
    description:
      "Elegant and distinctive style where the saree is draped without pleats at the front. The pallu is brought over the left shoulder, then taken around from the back to create a key-hole design on the left side.",
    steps: [
      "Tuck the saree at the right hip into the petticoat",
      "Wrap around the body once — no front pleats needed",
      "Take the pallu from behind, bring it over the left shoulder",
      "Fan out the pallu and secure it on the left shoulder",
      "Pull the key-hole portion of the pallu to the front-left",
      "Use pins to secure and adjust the drape",
    ],
    bestFor: "Pujas, Bengali weddings, festive occasions, Durga Puja",
  },
  {
    name: "Gujarati / Seedha Pallu",
    origin: "Gujarat / Rajasthan",
    difficulty: "Easy",
    description:
      "Similar to the Nivi style but the pallu comes from behind and is draped over the right shoulder, falling to the front. The pallu displays beautiful front-facing designs, making it perfect for richly designed sarees.",
    steps: [
      "Start tucking from the right side, going right to left",
      "Make one full wrap around the body",
      "Make pleats at the front and tuck them in, facing left",
      "Take the remaining pallu from behind to the front",
      "Bring the pallu over the RIGHT shoulder (not left)",
      "Spread the pallu and pin at the right shoulder",
    ],
    bestFor: "Navratri, Garba nights, weddings, festive ceremonies",
  },
  {
    name: "Maharashtrian / Nauvari (9-yard)",
    origin: "Maharashtra",
    difficulty: "Hard",
    description:
      "Traditional 9-yard saree draped like a dhoti. The fabric is passed between the legs and tucked at the back, creating a trouser-like bottom. Very practical and allows free movement. Traditionally worn by Maharashtrian women.",
    steps: [
      "Take the center of the saree and pass between the legs from front to back",
      "Tuck the back portion into the waist at the back",
      "Wrap one portion around the right leg and tuck at the front",
      "Wrap the other portion around the left leg",
      "Make pleats with the remaining fabric at the front",
      "Drape the pallu over the left shoulder and pin securely",
    ],
    bestFor: "Traditional Maharashtrian functions, Lavani dance, active occasions",
  },
  {
    name: "South Indian / Temple Style",
    origin: "Karnataka / Tamil Nadu",
    difficulty: "Medium",
    description:
      "A traditional style where the saree is tucked tighter and the pleats are fan-shaped at the front facing right. The pallu is pinned at the shoulder and cascades down the back. Often paired with gold jewelry and flowers.",
    steps: [
      "Tuck the saree from the right side at the navel",
      "Make one full wrap around from right to left",
      "Create neat fan-shaped pleats at the front, facing RIGHT",
      "Tuck the pleats pointing towards the right",
      "Drape the pallu over the left shoulder to the back",
      "Pin the pallu neatly to display the pallu design from behind",
    ],
    bestFor: "Temple visits, South Indian weddings, classical dance, Pongal",
  },
  {
    name: "Lehenga Style",
    origin: "Modern / Fusion",
    difficulty: "Easy",
    description:
      "A modern draping style that makes your saree look like a lehenga. The pleats are tucked at the back instead of the front, creating a smooth, flat front. Perfect for those who want a contemporary look with a traditional saree.",
    steps: [
      "Tuck the saree at the front, then wrap around once",
      "Instead of front pleats, take the fabric to the back",
      "Make pleats at the back and tuck them in",
      "Bring the pallu from behind over the left shoulder",
      "Spread the pallu over the chest and pin at the shoulder",
      "Adjust for a smooth, flat front like a lehenga",
    ],
    bestFor: "Receptions, cocktail parties, sangeet, modern functions",
  },
];

const fabricCare = [
  {
    fabric: "Silk (Mysore, Kanchipuram)",
    icon: "🧵",
    tips: [
      "Always dry clean silk sarees",
      "Store in soft muslin cloth, never in plastic bags",
      "Keep silica gel packets to absorb moisture",
      "Fold along the zari to prevent creasing",
      "Air the saree every 3-4 months to prevent fungus",
      "Keep separate from other fabric sarees",
    ],
  },
  {
    fabric: "Banarasi Silk",
    icon: "✨",
    tips: [
      "Dry clean only — water can damage the zari",
      "Wrap in acid-free tissue paper",
      "Store with neem leaves to keep insects away",
      "Never hang for too long — it stretches the fabric",
      "Iron on low heat with a cotton cloth in between",
    ],
  },
  {
    fabric: "Cotton & Linen",
    icon: "🌿",
    tips: [
      "Can be hand-washed with mild detergent",
      "Use cold water to prevent color fading",
      "Dry in shade, not direct sunlight",
      "Iron when slightly damp for best results",
      "Starch for a crisp look",
    ],
  },
  {
    fabric: "Chiffon & Georgette",
    icon: "💨",
    tips: [
      "Hand wash gently or dry clean",
      "Do not wring — gently squeeze water out",
      "Hang to dry to avoid wrinkles",
      "Iron on low temperature",
      "Store on padded hangers if possible",
    ],
  },
  {
    fabric: "Organza",
    icon: "🦋",
    tips: [
      "Dry clean recommended",
      "Very delicate — handle with care",
      "Store flat or rolled, not folded",
      "Iron on very low heat with a pressing cloth",
      "Keep away from jewelry hooks that can snag the fabric",
    ],
  },
];

const sizingInfo = [
  { label: "Standard Saree Length", value: "5.5 meters (18 feet)" },
  { label: "With Blouse Piece", value: "6.3 meters (includes 0.8m blouse)" },
  { label: "Standard Width", value: "1.1 meters (44 inches)" },
  { label: "Petticoat Length", value: "Should reach ankle length" },
  { label: "Blouse Piece", value: "0.8 - 1 meter" },
];

export default function SareeGuidePage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">
          Saree Guide
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Everything you need to know about saree sizing, draping styles, and
          fabric care tips
        </p>
      </div>

      {/* Sizing Guide */}
      <section>
        <h2 className="font-heading text-2xl font-bold mb-4">
          📏 Saree Sizing Guide
        </h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              All our sarees follow standard Indian saree measurements. Most
              sarees come with a blouse piece included.
            </p>
            <div className="grid gap-3">
              {sizingInfo.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <span className="font-medium text-sm">{item.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-sm">
                <strong>Tip:</strong> If you&apos;re new to sarees, a 6.3-meter
                saree with blouse piece is the easiest to work with. The extra
                fabric gives you room for comfortable draping.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Draping Styles */}
      <section>
        <h2 className="font-heading text-2xl font-bold mb-4">
          👘 Popular Draping Styles
        </h2>
        <p className="text-muted-foreground mb-6">
          Different regions of India have their own beautiful saree draping
          styles. Here are the most popular ones:
        </p>
        <div className="space-y-6">
          {drapingStyles.map((style) => (
            <Card key={style.name}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle className="font-heading text-lg">
                    {style.name}
                  </CardTitle>
                  <Badge variant="secondary">{style.origin}</Badge>
                  <Badge
                    className={
                      style.difficulty === "Easy"
                        ? "bg-green-100 text-green-800"
                        : style.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {style.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {style.description}
                </p>
                <div>
                  <p className="font-medium text-sm mb-2">How to drape:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    {style.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
                <p className="text-xs">
                  <strong>Best for:</strong> {style.bestFor}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Fabric Care */}
      <section>
        <h2 className="font-heading text-2xl font-bold mb-4">
          🧹 Fabric Care Tips
        </h2>
        <p className="text-muted-foreground mb-6">
          Taking proper care of your sarees will keep them beautiful for
          generations. Here are fabric-specific care tips:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {fabricCare.map((item) => (
            <Card key={item.fabric}>
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-base">
                  {item.icon} {item.fabric}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {item.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* General Tips */}
      <section>
        <h2 className="font-heading text-2xl font-bold mb-4">
          💡 General Tips for Wearing Sarees
        </h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-medium">For Beginners</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Start with cotton or georgette — they&apos;re easier to drape</li>
                  <li>• Use safety pins generously until you get confident</li>
                  <li>• A well-fitted petticoat is the secret to a good drape</li>
                  <li>• Practice the Nivi style first — it&apos;s the easiest</li>
                  <li>• Keep the pleats straight and even for a neat look</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium">Pro Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Wear matching bangles, earrings and a bindi for the complete look</li>
                  <li>• A thin belt under the saree helps keep it in place</li>
                  <li>• Choose heels for formal events — they help the pallu drape better</li>
                  <li>• Starch cotton sarees lightly for a crisp finish</li>
                  <li>• Jasmine flowers (ಮಲ್ಲಿಗೆ) complete the South Indian saree look</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
