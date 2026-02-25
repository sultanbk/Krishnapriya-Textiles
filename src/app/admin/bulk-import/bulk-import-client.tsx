"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Loader2,
  Info,
} from "lucide-react";
import { toast } from "sonner";

interface ImportResult {
  row: number;
  status: "success" | "error";
  name: string;
  message: string;
}

interface ImportResponse {
  total: number;
  success: number;
  errors: number;
  results: ImportResult[];
}

export function BulkImportClient() {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<ImportResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleDownloadTemplate() {
    try {
      const res = await fetch("/api/admin/products/bulk-import");
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "product-import-template.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Template downloaded!");
    } catch {
      toast.error("Failed to download template");
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/admin/products/bulk-import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");

      setResults(data);
      if (data.success > 0) {
        toast.success(`${data.success} products imported successfully!`);
      }
      if (data.errors > 0) {
        toast.error(`${data.errors} products had errors`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to import products");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Steps guide */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            How to Import Products
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-sm">Download Template</p>
                <p className="text-xs text-muted-foreground">
                  Get the Excel template with all required columns
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-sm">Fill in Data</p>
                <p className="text-xs text-muted-foreground">
                  Add your products with required fields. See &quot;Reference&quot; sheet for valid values
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-sm">Upload & Import</p>
                <p className="text-xs text-muted-foreground">
                  Upload the filled file. Products will be created automatically
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <p className="font-medium">Required fields:</p>
              <p>Name, SKU, Description (10+ chars), Price, Fabric, Occasion, Category, Color</p>
              <p className="mt-1">
                Note: Images need to be uploaded separately after import via the product edit page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <FileSpreadsheet className="h-12 w-12 text-primary" />
            <div className="text-center">
              <p className="font-medium">Step 1: Download Template</p>
              <p className="text-sm text-muted-foreground">
                Excel file with columns and example row
              </p>
            </div>
            <Button onClick={handleDownloadTemplate} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <Upload className="h-12 w-12 text-primary" />
            <div className="text-center">
              <p className="font-medium">Step 2: Upload Filled File</p>
              <p className="text-sm text-muted-foreground">
                {selectedFile
                  ? `Selected: ${selectedFile.name}`
                  : "Choose your filled Excel file"}
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSelectedFile(file);
              }}
            />
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                Choose File
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex-1"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                Total: {results.total}
              </Badge>
              <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
                Success: {results.success}
              </Badge>
              {results.errors > 0 && (
                <Badge variant="destructive" className="text-sm px-3 py-1">
                  Errors: {results.errors}
                </Badge>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium">Row</th>
                    <th className="p-2 text-left font-medium">Product</th>
                    <th className="p-2 text-left font-medium">Status</th>
                    <th className="p-2 text-left font-medium">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {results.results.map((r, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="p-2">{r.row}</td>
                      <td className="p-2 font-medium">{r.name}</td>
                      <td className="p-2">
                        {r.status === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </td>
                      <td className="p-2 text-muted-foreground">{r.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
