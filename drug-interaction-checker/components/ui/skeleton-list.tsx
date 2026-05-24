"use client";

import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted/60", className)} />
  );
}

export function ResultSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3.5">
          <Skeleton className="mt-0.5 h-7 w-7 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  const widths = ["w-1/4", "w-1/5", "w-1/5", "w-1/4", "w-16"];
  return (
    <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
      <div className="border-b border-border/60 bg-muted/30 px-4 py-3 flex gap-6">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className={cn("h-3", widths[i] ?? "w-1/6")} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-6 px-4 py-3 border-b border-border/40 last:border-0">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className={cn("h-4", widths[j] ?? "w-1/6")} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-lg" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}
