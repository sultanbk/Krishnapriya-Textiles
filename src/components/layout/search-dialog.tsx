"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setQuery("");
      // Small delay to ensure dialog is rendered
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
      onOpenChange(false);
    }
  }, [query, router, onOpenChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Quick search suggestions
  const suggestions = [
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
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search sarees..."
            className="flex-1 bg-transparent px-3 py-4 text-base outline-none placeholder:text-muted-foreground/60"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-lg"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Suggestions */}
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
                {suggestions.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      router.push(`/products?search=${encodeURIComponent(term)}`);
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

        {/* Keyboard hint */}
        <div className="border-t bg-muted/20 px-4 py-2.5 text-center text-xs text-muted-foreground">
          Press <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">Enter</kbd> to search
          {" · "}
          <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">Esc</kbd> to close
        </div>
      </DialogContent>
    </Dialog>
  );
}
