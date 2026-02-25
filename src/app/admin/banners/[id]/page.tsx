import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BannerForm } from "../banner-form";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = await db.banner.findUnique({ where: { id } });

  if (!banner) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Banner</h1>
        <p className="text-sm text-muted-foreground">
          Update banner details
        </p>
      </div>
      <BannerForm banner={banner} />
    </div>
  );
}
