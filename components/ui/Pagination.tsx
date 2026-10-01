"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Builds a compact page-number sequence with "…" gaps, e.g.
 * 1 … 4 5 [6] 7 8 … 20
 */
function getPageWindow(current: number, total: number): (number | "gap")[] {
  const window = 1; // pages shown on each side of current
  const pages = new Set<number>([1, total, current]);
  for (let i = current - window; i <= current + window; i++) {
    if (i > 0 && i <= total) pages.add(i);
  }
  const sorted = Array.from(pages).sort((a, b) => a - b);

  const result: (number | "gap")[] = [];
  sorted.forEach((page, idx) => {
    if (idx > 0 && page - sorted[idx - 1] > 1) result.push("gap");
    result.push(page);
  });
  return result;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageWindow(currentPage, totalPages);

  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)}>
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="bg-zinc-900/50 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white disabled:opacity-30"
      >
        <span className="sr-only">Previous page</span>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((p, idx) =>
        p === "gap" ? (
          <span
            key={`gap-${idx}`}
            className="px-1.5 text-zinc-600 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={cn(
              "h-9 min-w-9 px-2.5 rounded-lg border text-sm font-medium transition-colors",
              p === currentPage
                ? "bg-purple-500/20 border-purple-500/30 text-purple-300"
                : "bg-zinc-900/50 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white",
            )}
          >
            {p}
          </button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="bg-zinc-900/50 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white disabled:opacity-30"
      >
        <span className="sr-only">Next page</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
