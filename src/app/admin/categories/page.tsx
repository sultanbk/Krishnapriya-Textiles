"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  FolderOpen,
  Loader2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function openNew() {
    setEditingId(null);
    setName("");
    setDescription("");
    setImage("");
    setSortOrder(categories.length);
    setDialogOpen(true);
  }

  function openEdit(cat: Category) {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setSortOrder(cat.sortOrder);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSaving(true);
    try {
      const body = { name, description, image, sortOrder };
      const res = editingId
        ? await fetch(`/api/admin/categories/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      toast.success(editingId ? "Category updated!" : "Category created!");
      setDialogOpen(false);
      fetchCategories();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (!res.ok) throw new Error("Failed to update");

      setCategories((cats) =>
        cats.map((c) => (c.id === id ? { ...c, isActive: !isActive } : c))
      );
      toast.success(isActive ? "Category hidden" : "Category visible");
    } catch {
      toast.error("Failed to update category");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete");
      }

      toast.success("Category deleted");
      setCategories((cats) => cats.filter((c) => c.id !== id));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage product categories for your store
          </p>
        </div>
        <Button size="sm" onClick={openNew}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Category
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 font-medium">No categories yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first category to organize products
            </p>
            <Button onClick={openNew} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden md:grid grid-cols-[0.3fr_2fr_1fr_0.6fr_0.6fr_0.8fr] gap-4 border-b bg-muted/40 px-5 py-2.5 text-xs font-medium text-muted-foreground">
            <span>#</span>
            <span>Name</span>
            <span>Slug</span>
            <span>Products</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y">
                  {categories.map((cat, i) => (
                    <div key={cat.id} className="group transition-colors hover:bg-muted/40">
                      <div className="hidden md:grid grid-cols-[0.3fr_2fr_1fr_0.6fr_0.6fr_0.8fr] gap-4 items-center px-5 py-3">
                      <span className="text-xs text-muted-foreground">{i + 1}</span>
                      <div className="flex items-center gap-3 min-w-0">
                          {cat.image ? (
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                              <FolderOpen className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{cat.name}</p>
                            {cat.description && (
                              <p className="truncate text-xs text-muted-foreground">
                                {cat.description}
                              </p>
                            )}
                          </div>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{cat.slug}</span>
                      <Badge variant="secondary" className="w-fit border-0 text-[10px] font-medium gap-1">
                          <Package className="h-3 w-3" />
                          {cat._count.products}
                      </Badge>
                      <Badge
                          variant="secondary"
                          className={`w-fit border-0 text-[10px] font-medium ${
                            cat.isActive
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                      >
                          {cat.isActive ? "Active" : "Hidden"}
                      </Badge>
                      <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggle(cat.id, cat.isActive)}
                            title={cat.isActive ? "Hide" : "Show"}
                          >
                            {cat.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(cat)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <ConfirmDialog
                            title="Delete this category?"
                            description={
                              cat._count.products > 0
                                ? `This category has ${cat._count.products} products. Move them to another category before deleting.`
                                : "This category will be permanently deleted."
                            }
                            confirmText="Yes, Delete"
                            variant="destructive"
                            onConfirm={() => handleDelete(cat.id)}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </ConfirmDialog>
                      </div>
                      </div>
                    </div>
                  ))}
          </div>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update this category's details"
                : "Create a new product category"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Category Name *</Label>
              <Input
                id="cat-name"
                placeholder="e.g., Silk Sarees"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                placeholder="Brief description of this category"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-image">Image URL</Label>
              <Input
                id="cat-image"
                placeholder="https://res.cloudinary.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Paste a Cloudinary image URL for the category thumbnail
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-sort">Sort Order</Label>
              <Input
                id="cat-sort"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
