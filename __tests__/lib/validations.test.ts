import { describe, it, expect } from "vitest";
import {
  checkoutSchema,
  analyticsTrackSchema,
  aiChatMessageSchema,
  aiChatSchema,
} from "@/lib/validations";

describe("checkoutSchema", () => {
  it("accepts valid input", () => {
    const result = checkoutSchema.safeParse({
      productId: "prod_123",
      buyerEmail: "buyer@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty productId", () => {
    const result = checkoutSchema.safeParse({
      productId: "",
      buyerEmail: "buyer@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing productId", () => {
    const result = checkoutSchema.safeParse({
      buyerEmail: "buyer@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = checkoutSchema.safeParse({
      productId: "prod_123",
      buyerEmail: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = checkoutSchema.safeParse({
      productId: "prod_123",
    });
    expect(result.success).toBe(false);
  });
});

describe("analyticsTrackSchema", () => {
  it("accepts valid input with metadata", () => {
    const result = analyticsTrackSchema.safeParse({
      userId: "user_123",
      eventType: "page_view",
      metadata: { page: "/home" },
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid input without metadata", () => {
    const result = analyticsTrackSchema.safeParse({
      userId: "user_123",
      eventType: "page_view",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty userId", () => {
    const result = analyticsTrackSchema.safeParse({
      userId: "",
      eventType: "page_view",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty eventType", () => {
    const result = analyticsTrackSchema.safeParse({
      userId: "user_123",
      eventType: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const result = analyticsTrackSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("aiChatMessageSchema", () => {
  it("accepts valid user message", () => {
    const result = aiChatMessageSchema.safeParse({
      role: "user",
      content: "Hello",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid assistant message", () => {
    const result = aiChatMessageSchema.safeParse({
      role: "assistant",
      content: "Hi there!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid role", () => {
    const result = aiChatMessageSchema.safeParse({
      role: "system",
      content: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty content", () => {
    const result = aiChatMessageSchema.safeParse({
      role: "user",
      content: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects content over 2000 characters", () => {
    const result = aiChatMessageSchema.safeParse({
      role: "user",
      content: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts content at exactly 2000 characters", () => {
    const result = aiChatMessageSchema.safeParse({
      role: "user",
      content: "a".repeat(2000),
    });
    expect(result.success).toBe(true);
  });
});

describe("aiChatSchema", () => {
  it("accepts valid messages array", () => {
    const result = aiChatSchema.safeParse({
      messages: [{ role: "user", content: "Hello" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty messages array", () => {
    const result = aiChatSchema.safeParse({
      messages: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing messages", () => {
    const result = aiChatSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
