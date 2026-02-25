import { BannerForm } from "../banner-form";

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Banner</h1>
        <p className="text-sm text-muted-foreground">
          Create a new homepage banner
        </p>
      </div>
      <BannerForm />
    </div>
  );
}
