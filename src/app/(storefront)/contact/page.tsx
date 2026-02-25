import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Krishnapriya Textiles. We're here to help you find the perfect saree. Call, WhatsApp, or email us.",
};

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    detail: siteConfig.phone,
    action: `tel:${siteConfig.phone}`,
    actionText: "Call Now",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: siteConfig.whatsapp,
    action: getWhatsAppLink("General Inquiry", "https://krishnapriyatextiles.com/contact"),
    actionText: "Chat on WhatsApp",
  },
  {
    icon: Mail,
    title: "Email",
    detail: siteConfig.email,
    action: `mailto:${siteConfig.email}`,
    actionText: "Send Email",
  },
  {
    icon: MapPin,
    title: "Address",
    detail: `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.state} - ${siteConfig.address.pincode}, ${siteConfig.address.country}`,
    action: "https://www.google.com/maps/search/Krishnapriya+Textiles+Shidling+Complex+Shirahatti+582120",
    actionText: "Get Directions",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/8 to-background py-16 md:py-24">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container relative mx-auto px-4 text-center">
          <h1
            className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            We&apos;d love to hear from you! Whether you need help choosing a
            saree or have a question about your order, we&apos;re here to help.
          </p>
          <div className="mx-auto mt-5 h-0.5 w-16 rounded-full bg-gradient-to-r from-transparent via-secondary to-transparent" />
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="group rounded-xl bg-card p-6 text-center shadow-sm ring-1 ring-border/50 transition-all duration-300 hover:shadow-md hover:ring-primary/20 hover:-translate-y-0.5"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/8 transition-colors group-hover:bg-primary/15">
                  <info.icon className="h-7 w-7 text-primary" />
                </div>
                <h3
                  className="mt-4 text-lg font-semibold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {info.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground break-all">
                  {info.detail}
                </p>
                <a
                  href={info.action}
                  target={info.action.startsWith("http") ? "_blank" : undefined}
                  rel={
                    info.action.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  {info.actionText} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-muted/20 py-14 sm:py-20">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="text-center">
            <h2
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Send Us a Message
            </h2>
            <p className="mt-2 text-muted-foreground">
              Fill out the form below and we&apos;ll get back to you within 24
              hours.
            </p>
            <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-transparent via-secondary to-transparent" />
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Store Location Map */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Visit Our Store
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find us on the map and visit us in person
            </p>
            <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-transparent via-secondary to-transparent" />
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl shadow-sm ring-1 ring-border/50">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3848.5!2d75.0128!3d15.2342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb9031fbcc635e9%3A0x5e8d53f9c8c18828!2sKrishnapriya%20Textiles%2C%20Shidling%20Complex%2C%20Shirahatti!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Krishnapriya Textiles Store Location"
              className="w-full"
            />
          </div>
          <div className="mt-4 text-center">
            <a
              href="https://www.google.com/maps/search/Krishnapriya+Textiles+Shidling+Complex+Shirahatti+582120"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              <MapPin className="h-5 w-5" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto max-w-xl px-4 text-center">
          <div className="rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border/50">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/8">
              <Clock className="h-7 w-7 text-primary" />
            </div>
            <h2
              className="mt-4 text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Business Hours
            </h2>
            <div className="mx-auto mt-3 h-0.5 w-12 rounded-full bg-gradient-to-r from-transparent via-secondary to-transparent" />
            <div className="mt-5 space-y-2.5 text-muted-foreground">
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-foreground">Monday – Saturday:</span>{" "}
                10:00 AM – 8:00 PM
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-foreground">Sunday:</span>{" "}
                10:00 AM – 2:00 PM
              </p>
              <p className="mt-3 text-xs sm:text-sm text-muted-foreground/70">
                WhatsApp queries are answered from 9:00 AM to 9:00 PM, all days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
