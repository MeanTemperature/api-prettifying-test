import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export utilities for easy access
export { JsonFormatter } from './json-formatter';
export { TextUtils } from './text-utils';
