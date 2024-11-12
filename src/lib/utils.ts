import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface RepoDomain {
  id: string;
  userId: string;
  domainName: string;
  createdAt: Date;
  lastUpdatedAt: Date;
}