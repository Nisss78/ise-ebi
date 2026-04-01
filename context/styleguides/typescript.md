# TypeScript Style Guide — イセエビ

> コードスタイルとベストプラクティス

## Naming Conventions

### Variables & Functions
```typescript
// ✅ Good: camelCase
const userName = "Alice";
function getUserById(id: string) {}

// ❌ Bad: snake_case
const user_name = "Alice";
function get_user_by_id(id: string) {}
```

### Components
```typescript
// ✅ Good: PascalCase
function UserProfile() {}
const CheckoutModal = () => {};

// ❌ Bad: camelCase
function userProfile() {}
const checkoutModal = () => {};
```

### Types & Interfaces
```typescript
// ✅ Good: PascalCase with descriptive names
type SerializedUser = {};
interface ProductData {}

// ❌ Bad: vague names
type Data = {};
interface IProduct {} // I-prefixは不要
```

### Constants
```typescript
// ✅ Good: SCREAMING_SNAKE_CASE for true constants
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = "https://api.example.com";

// ✅ Good: camelCase for configuration objects
const themeConfig = {
  primaryColor: "#3B82F6",
};
```

### Files
```
// Components: PascalCase
UserProfile.tsx
CheckoutModal.tsx

// Utilities: camelCase
formatPrice.ts
validateEmail.ts

// Pages: lowercase with hyphens
page.tsx
layout.tsx
loading.tsx
```

## Component Structure

### Function Components
```typescript
// ✅ Good: Named export
type UserProfileProps = {
  username: string;
  avatarUrl?: string;
};

export function UserProfile({ username, avatarUrl }: UserProfileProps) {
  return <div>{username}</div>;
}

// ❌ Bad: Default export without typing
export default (props) => {
  return <div>{props.username}</div>;
};
```

### Component Organization
```typescript
// 1. Imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Types
type Props = {};
type State = {};

// 3. Constants
const MAX_ITEMS = 10;

// 4. Helper functions
function formatDate(date: Date) {}

// 5. Component
export function MyComponent({}: Props) {
  // Hooks
  const [state, setState] = useState<State>({});
  
  // Handlers
  const handleClick = () => {};
  
  // Effects
  useEffect(() => {}, []);
  
  // Render
  return <div>...</div>;
}
```

## TypeScript Best Practices

### Explicit Return Types (Public APIs)
```typescript
// ✅ Good: Public functions have explicit return types
export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency,
  }).format(price);
}

// ✅ OK: Internal components can omit
function InternalComponent() {
  return <div />;
}
```

### Avoid `any`
```typescript
// ❌ Bad
function process(data: any) {
  return data.value;
}

// ✅ Good
function process(data: { value: string }) {
  return data.value;
}

// ✅ Better: Generic with constraint
function process<T extends { value: string }>(data: T) {
  return data.value;
}
```

### Use `unknown` for Truly Unknown Types
```typescript
// ❌ Bad
function parse(json: string): any {
  return JSON.parse(json);
}

// ✅ Good
function parse(json: string): unknown {
  return JSON.parse(json);
}

// Then narrow with type guards
const data = parse(jsonString);
if (typeof data === "object" && data !== null && "name" in data) {
  console.log(data.name);
}
```

### Nullish Coalescing
```typescript
// ✅ Good: Use ?? for null/undefined only
const name = user.name ?? "Anonymous";

// ❌ Bad: || treats "" and 0 as falsy
const name = user.name || "Anonymous"; // "" -> "Anonymous"
```

### Optional Chaining
```typescript
// ✅ Good
const userName = user?.profile?.displayName;

// ❌ Bad: Too verbose
const userName = user && user.profile && user.profile.displayName;
```

## React Patterns

### Custom Hooks
```typescript
// ✅ Good: Prefix with "use"
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch user
  }, [userId]);
  
  return { user, loading };
}
```

### Memoization
```typescript
// ✅ Good: Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensive(data);
}, [data]);

// ✅ Good: Memoize callbacks passed to children
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### Props Spreading
```typescript
// ✅ Good: Explicit props
<Button type="submit" disabled={isLoading}>
  Submit
</Button>

// ⚠️ Use sparingly: Spreading
<Button {...props} />

// ❌ Bad: Spreading unknown props to native elements
<div {...unknownProps} />
```

## Error Handling

### API Errors
```typescript
// ✅ Good: Structured error handling
try {
  const response = await fetch("/api/checkout", {
    method: "POST",
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new APIError(response.status, await response.text());
  }
  
  return await response.json();
} catch (error) {
  if (error instanceof APIError) {
    // Handle known error
  }
  throw error;
}

// ✅ Good: Typed errors
class APIError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "APIError";
  }
}
```

### Null/Undefined Checks
```typescript
// ✅ Good: Early returns
function processUser(user: User | null) {
  if (!user) {
    return null;
  }
  
  // Continue with user
}

// ✅ Good: Type guards
function isSerializedUser(data: unknown): data is SerializedUser {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "username" in data
  );
}
```

## Convex Patterns

### Queries
```typescript
// ✅ Good: Type-safe query
export const getUser = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    
    if (!user) {
      throw new ConvexError("User not found");
    }
    
    return user;
  },
});
```

### Mutations
```typescript
// ✅ Good: Validate and mutate
export const createProduct = mutation({
  args: {
    title: v.string(),
    price: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Validate
    if (args.price < 0) {
      throw new ConvexError("Price must be positive");
    }
    
    // Create
    const productId = await ctx.db.insert("products", {
      ...args,
      currency: "JPY",
      isActive: true,
    });
    
    return productId;
  },
});
```

## Testing Patterns

### Test Organization
```typescript
describe("formatPrice", () => {
  it("should format JPY correctly", () => {
    expect(formatPrice(1000, "JPY")).toBe("¥1,000");
  });
  
  it("should format USD correctly", () => {
    expect(formatPrice(10, "USD")).toBe("$10.00");
  });
  
  it("should handle edge cases", () => {
    expect(formatPrice(0, "JPY")).toBe("¥0");
  });
});
```

---

*最終更新: 2026-04-01*
