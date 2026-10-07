import { cn } from "@/lib/utils";

/** Neutral placeholder block; pulses only when motion is allowed. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-lg bg-muted motion-reduce:animate-none", className)} />;
}
