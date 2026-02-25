"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { createProductSchema } from "@/validators/product";
import { FABRIC_LABELS, OCCASION_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader";

type ProductForm = z.infer<typeof createProductSchema>;

interface ProductFormProps {
  categories: { id: string; name: string }[];
  initialData?: any;
  isEdit?: boolean;
}

interface ExistingImage {
  id?: string;
  url: string;
  publicId: string;
  alt: string;
  position: number;
}

export function ProductForm({ categories, initialData, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [productImages, setProductImages] = useState<UploadedImage[]>(
    (initialData?.images || []).map((img: ExistingImage, i: number) => ({
      url: img.url,
      publicId: img.publicId,
      alt: img.alt || "",
      position: img.position ?? i,
    }))
  );

  const form = useForm<ProductForm>({
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      compareAtPrice: undefined,
      sku: "",
      stock: 0,
      fabric: undefined,
      occasion: [],
      color: "",
      length: "",
      width: "",
      weight: "",
      blouseIncluded: false,
      blouseLength: "",
      borderType: "",
      palluDetail: "",
      zariType: "",
      washCare: "",
      isActive: true,
      isFeatured: false,
      isNewArrival: false,
      categoryId: undefined,
    },
  });

  async function onSubmit(data: ProductForm) {
    setLoading(true);
    try {
      const endpoint = isEdit
        ? `/api/admin/products/${initialData.id}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          images: productImages.map((img, i) => ({
            url: img.url,
            publicId: img.publicId,
            alt: img.alt || "",
            position: i,
          })),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save product");
      }

      toast.success(isEdit ? "Product updated!" : "Product created!");
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">📝 Saree Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saree Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mysore Pure Silk Saree" {...field} />
                      </FormControl>
                      <FormDescription>Give a clear name that customers can easily find</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the saree — fabric quality, design, color, when to wear it..."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Write details about the saree that help customers decide to buy</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price (₹) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>The price customer will pay</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="compareAtPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MRP / Original Price (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Leave empty if no discount"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? Number(e.target.value) : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., KP-SILK-101" {...field} />
                        </FormControl>
                        <FormDescription>A unique code to identify this saree (like a bill number)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">🧵 Saree Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fabric"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fabric Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select fabric type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(FABRIC_LABELS).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>What material is the saree made of?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="occasion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occasion(s)</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(OCCASION_LABELS).map(([key, label]) => (
                            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                              <Checkbox
                                checked={(field.value || []).includes(key as any)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, key]);
                                  } else {
                                    field.onChange(current.filter((v: string) => v !== key));
                                  }
                                }}
                              />
                              {label}
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Maroon" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="borderType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Border Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Temple Border" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zariType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zari Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Pure Zari" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 6.3 meters" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 45 inches" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (grams)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="palluDetail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pallu Design</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Rich grand pallu with traditional peacock motifs"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Describe how the pallu looks</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="washCare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wash / Care Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Dry clean only. Store in muslin cloth."
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>How should the customer wash and maintain this saree?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-6">
                  <FormField
                    control={form.control}
                    name="blouseIncluded"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Blouse piece included
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">📸 Saree Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add clear photos of the saree. First photo will be the main image. You can add up to 8 photos.
                </p>
                <ImageUploader
                  images={productImages}
                  onChange={setProductImages}
                  maxImages={8}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">👁️ Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0 rounded-md border p-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="font-medium">Show on Website</FormLabel>
                        <p className="text-xs text-muted-foreground">Customers can see and buy this saree</p>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0 rounded-md border p-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="font-medium">Featured Saree</FormLabel>
                        <p className="text-xs text-muted-foreground">Show this saree in the special/featured section on homepage</p>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">📂 Category & Stock</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock (How many pieces?) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>How many sarees of this type you have right now</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button type="submit" className="w-full text-base py-6" disabled={loading}>
              {loading ? "Saving... Please wait" : isEdit ? "✅ Save Changes" : "➕ Add Saree to Store"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
