import { en, type Messages } from "./en";

export type { Messages };

/** Active UI messages. P1 adds a language switcher; components read strings only through this hook. */
export function useMessages(): Messages {
  return en;
}

/** Replace {name} placeholders with values. Unknown placeholders are left as-is. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
