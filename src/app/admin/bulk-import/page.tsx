import { BulkImportClient } from "./bulk-import-client";

export default function AdminBulkImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Bulk Product Import</h1>
        <p className="text-sm text-muted-foreground">
          Import multiple products at once using an Excel file
        </p>
      </div>
      <BulkImportClient />
    </div>
  );
}
