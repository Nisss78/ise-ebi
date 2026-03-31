import { z } from "zod";

export const checkoutSchema = z.object({
  productId: z.string().min(1, "productId is required"),
  buyerEmail: z.string().email("Valid email address is required"),
});

export const analyticsTrackSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  eventType: z.string().min(1, "eventType is required"),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const aiChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000, "Message must be 2000 characters or less"),
});

export const aiChatSchema = z.object({
  messages: z
    .array(aiChatMessageSchema)
    .min(1, "At least one message is required"),
});
