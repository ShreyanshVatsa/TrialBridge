import { cn } from "@/lib/utils";

/** TrialBridge mark: a bridge arch over a deck, with amber supports. Decorative unless `title` is given. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("size-8 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect width="64" height="64" rx="16" className="fill-primary" />
      <path d="M12 42c6-12 13-18 20-18s14 6 20 18" fill="none" className="stroke-primary-foreground" strokeWidth="5" strokeLinecap="round" />
      <path d="M10 44h44" className="stroke-primary-foreground" strokeWidth="5" strokeLinecap="round" />
      <path d="M22 44v-9M32 44V30M42 44v-9" stroke="#f2a65a" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
