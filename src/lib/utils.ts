/**
 * Merge class names (Tailwind-style utility).
 * Accepts strings and conditional classes.
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ').trim() || ''
}
