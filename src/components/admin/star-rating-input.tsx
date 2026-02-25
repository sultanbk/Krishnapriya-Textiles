"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md" | "lg";
}

export function StarRatingInput({ value, onChange, size = "md" }: StarRatingInputProps) {
  const [hover, setHover] = useState(0);

  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-9 w-9",
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-colors",
              star <= (hover || value)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground/30"
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground self-center">
        {value > 0 ? `${value}/5` : "Tap to rate"}
      </span>
    </div>
  );
}
