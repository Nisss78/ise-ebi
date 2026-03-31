import { Id } from "@/convex/_generated/dataModel";

// ── Product ──────────────────────────────────────────────
export interface Product {
  _id: Id<"products">;
  title: string;
  description?: string;
  price: number;
  currency: string;
  thumbnailUrl?: string;
  fileUrl?: string;
  isActive: boolean;
  _creationTime: number;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: string;
  thumbnailUrl: string;
  fileUrl: string;
}

// ── Link ─────────────────────────────────────────────────
export interface LinkItem {
  _id: Id<"links">;
  title: string;
  url: string;
  order: number;
  icon?: string;
  iconUrl?: string;
  isActive: boolean;
}

export interface LinkFormData {
  title: string;
  url: string;
  icon: string;
  iconUrl: string;
  isActive: boolean;
}

// ── Order ────────────────────────────────────────────────
export type Order = {
  _id: string;
  buyerEmail: string;
  buyerName?: string;
  amount: number;
  currency: string;
  status: string;
  _creationTime: number;
  product: {
    id: string;
    title: string;
    thumbnailUrl?: string;
  } | null;
};

// ── User ─────────────────────────────────────────────────
export interface User {
  _id: Id<"users">;
  username: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  themeName?: string;
  productLayout?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  websiteUrl?: string;
}

// ── Theme (re-export from lib/themes.ts) ─────────────────
// Theme type is defined in src/lib/themes.ts and re-exported here
export type { Theme } from "@/lib/themes";
