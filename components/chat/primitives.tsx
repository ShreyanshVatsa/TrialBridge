"use client";

import { Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/site/logo";
import { cn } from "@/lib/utils";

export function AssistantBubble({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="animate-fade-up flex items-end gap-2.5">
      <LogoMark className="mb-0.5 size-7" />
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-bubble px-4 py-3 text-foreground">
        <span className="sr-only">{label}: </span>
        {children}
      </div>
    </div>
  );
}

export function UserBubble({
  children,
  label,
  onEdit,
  editLabel,
}: {
  children: ReactNode;
  label: string;
  onEdit?: () => void;
  editLabel?: string;
}) {
  return (
    <div className="animate-fade-up flex items-center justify-end gap-1.5">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={editLabel}
          title={editLabel}
          className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Pencil className="size-4" aria-hidden />
        </button>
      )}
      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground">
        <span className="sr-only">{label}: </span>
        {children}
      </div>
    </div>
  );
}

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

/** Quick-reply chips. Single-select acts on click; multi-select toggles aria-pressed. */
export function Chips<T extends string>({
  options,
  selected,
  onSelect,
  multi = false,
  label,
  className,
}: {
  options: readonly ChipOption<T>[];
  selected?: readonly T[];
  onSelect: (value: T) => void;
  multi?: boolean;
  label: string;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((o) => {
        const isSelected = selected?.includes(o.value) ?? false;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onSelect(o.value)}
            aria-pressed={multi ? isSelected : undefined}
            className={cn(
              "min-h-11 rounded-full border px-4 py-2 text-left text-base transition-colors",
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-card text-foreground hover:border-primary hover:bg-secondary",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export const inputClass =
  "h-12 w-full rounded-xl border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-ring aria-[invalid=true]:border-destructive";
