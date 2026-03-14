"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";

interface Suggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  category: string | null;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Reset query when dialog opens (derived state from prop)
  const [prevOpen, setPrevOpen] = useState(false);
  if (open && !prevOpen) {
    setQuery("");
    setSuggestions([]);
    setSelectedIndex(-1);
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Fetch suggestions with debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSelectedIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(trimmed)}`
        );
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
      onOpenChange(false);
    }
  }, [query, router, onOpenChange]);

  const handleSelectSuggestion = useCallback(
    (slug: string) => {
      router.push(`/products/${slug}`);
      onOpenChange(false);
    },
    [router, onOpenChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[selectedIndex].slug);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
    }
  };

  // Quick search suggestions
  const quickSearches = [
    "Silk Sarees",
    "Banarasi",
    "Kanchipuram",
    "Cotton Sarees",
    "Wedding Sarees",
    "Party Wear",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[15%] translate-y-0 sm:max-w-lg p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogTitle className="sr-only">Search sarees</DialogTitle>

        {/* Search input */}
        <div className="flex items-center border-b px-4">
          {loading ? (
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />
          ) : (
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search sarees, fabrics, occasions..."
            className="flex-1 bg-transparent px-3 py-4 text-base outline-none placeholder:text-muted-foreground/60"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-lg"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                inputRef.current?.focus();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.trim().length >= 2 && suggestions.length > 0 ? (
            <div className="p-2">
              {suggestions.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectSuggestion(item.slug)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    index === selectedIndex
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {item.image ? (
                    <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Search className="h-4 w-4" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.category && (
                        <span>{item.category} · </span>
                      )}
                      <span className="font-semibold text-primary">
                        {formatPrice(item.price)}
                      </span>
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-30" />
                </button>
              ))}

              {/* View all results */}
              <button
                onClick={handleSearch}
                className="mt-1 flex w-full items-center justify-between rounded-xl bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <span>View all results for &ldquo;{query.trim()}&rdquo;</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : query.trim().length >= 2 && !loading && suggestions.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No results for &ldquo;{query.trim()}&rdquo;
              </p>
              <button
                onClick={handleSearch}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                Search anyway <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-4">
              {query.trim() ? (
                <button
                  onClick={handleSearch}
                  className="flex w-full items-center justify-between rounded-xl bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <span>Search for &ldquo;{query.trim()}&rdquo;</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          router.push(
                            `/products?search=${encodeURIComponent(term)}`
                          );
                          onOpenChange(false);
                        }}
                        className="rounded-full border border-border/60 bg-muted/30 px-3.5 py-1.5 text-sm transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Keyboard hints */}
        <div className="border-t bg-muted/20 px-4 py-2.5 text-center text-xs text-muted-foreground">
          <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">↑↓</kbd>{" "}
          navigate{" · "}
          <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">Enter</kbd>{" "}
          select{" · "}
          <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">Esc</kbd>{" "}
          close
        </div>
      </DialogContent>
    </Dialog>
  );
}
