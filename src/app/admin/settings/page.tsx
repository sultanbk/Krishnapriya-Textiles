import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Store configuration</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Store Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Name: </span>
              <span className="font-medium">{siteConfig.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Phone: </span>
              <span className="font-medium">{siteConfig.phone}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email: </span>
              <span className="font-medium">{siteConfig.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Address: </span>
              <span className="font-medium">{siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state} - {siteConfig.address.pincode}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Shipping Config</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Free Shipping Threshold: </span>
              <span className="font-medium">
                ₹{siteConfig.shipping.freeShippingThreshold}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Default Shipping Charge: </span>
              <span className="font-medium">
                ₹{siteConfig.shipping.defaultShippingCharge}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Environment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Database: </span>
              <span className="font-mono font-medium">
                {process.env.DATABASE_URL ? "✅ Connected" : "❌ Not configured"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Razorpay: </span>
              <span className="font-mono font-medium">
                {process.env.RAZORPAY_KEY_ID ? "✅ Configured" : "❌ Not configured"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">MSG91 (OTP): </span>
              <span className="font-mono font-medium">
                {process.env.MSG91_AUTH_KEY ? "✅ Configured" : "❌ Not configured"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Cloudinary: </span>
              <span className="font-mono font-medium">
                {process.env.CLOUDINARY_CLOUD_NAME ? "✅ Configured" : "❌ Not configured"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
