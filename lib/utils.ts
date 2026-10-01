import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as a 2-decimal amount (no currency symbol — the ₹/$
 * glyph is prefixed separately throughout the UI). Guards against the
 * 3+ decimal places that plain float arithmetic (e.g. `0.5 * price`) can
 * produce.
 */
export function formatAmount(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—"
  return value.toFixed(2)
}
