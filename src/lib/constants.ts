// ── Form field character limits ──────────────────────────
export const PRODUCT_LIMITS = {
  title: 50,
  description: 200,
  fileUrl: 500,
} as const;

export const LINK_LIMITS = {
  title: 30,
  url: 500,
  icon: 10,
} as const;

// ── Image resize settings ────────────────────────────────
export const IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const IMAGE_RESIZE = {
  product: 800,
  avatar: 400,
  icon: 64,
} as const;

export const IMAGE_QUALITY = 0.8;
