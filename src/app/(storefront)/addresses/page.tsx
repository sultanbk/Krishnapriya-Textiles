"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, MapPin, Trash2, Star, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    try {
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }

  async function deleteAddress(id: string) {
    if (!confirm("Delete this address?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Address deleted");
        fetchAddresses();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleting(null);
    }
  }

  async function setDefault(id: string) {
    const addr = addresses.find((a) => a.id === id);
    if (!addr) return;
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addr, isDefault: true }),
      });
      if (res.ok) {
        toast.success("Default address updated");
        fetchAddresses();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            My Addresses
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your delivery addresses
          </p>
        </div>
        <Button asChild>
          <Link href="/addresses/new">
            <Plus className="mr-2 h-4 w-4" /> Add Address
          </Link>
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No addresses saved</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a delivery address to speed up checkout.
          </p>
          <Button asChild className="mt-4">
            <Link href="/addresses/new">
              <Plus className="mr-2 h-4 w-4" /> Add Your First Address
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {addresses.map((addr) => (
            <Card
              key={addr.id}
              className={`relative transition-all ${
                addr.isDefault ? "ring-2 ring-primary" : "ring-1 ring-border/50"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <p className="font-semibold">{addr.fullName}</p>
                  <p className="text-sm text-muted-foreground">{addr.line1}</p>
                  {addr.line2 && (
                    <p className="text-sm text-muted-foreground">{addr.line2}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {addr.city}, {addr.state} – {addr.pincode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Phone: +91 {addr.phone}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {!addr.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefault(addr.id)}
                    >
                      <Star className="mr-1 h-3.5 w-3.5" /> Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/addresses/${addr.id}/edit`}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={deleting === addr.id}
                    onClick={() => deleteAddress(addr.id)}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    {deleting === addr.id ? "..." : "Delete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
