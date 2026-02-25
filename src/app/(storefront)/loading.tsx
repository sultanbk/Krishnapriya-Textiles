import { Skeleton } from "@/components/ui/skeleton";

export default function StorefrontLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page title skeleton */}
      <div className="mb-8 space-y-3">
        <Skeleton className="h-9 w-48 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded-full" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <Skeleton className="aspect-[3/4] rounded-xl" />
            <Skeleton className="h-3 w-2/3 rounded-full" />
            <Skeleton className="h-4 w-4/5 rounded-full" />
            <Skeleton className="h-4 w-1/3 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
