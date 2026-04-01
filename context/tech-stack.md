# Tech Stack — イセエビ (Ise Ebi)

> 技術選択の根拠と依存関係

## Primary Languages & Frameworks

| カテゴリ | 技術 | バージョン | 選択理由 |
|---------|------|-----------|---------|
| **Framework** | Next.js | 14.x | App Router, Server Components, Vercel統合 |
| **Language** | TypeScript | 5.x | 型安全性, DX向上 |
| **Styling** | Tailwind CSS | 3.x | 高速プロトタイピング, 一貫性 |
| **UI Library** | shadcn/ui | latest | アクセシビリティ, カスタマイズ性 |

## Backend & Database

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| **Database** | Convex | リアルタイムDB, サーバーレス |
| **Auth** | Clerk | 認証, ユーザー管理 |
| **Payment** | Stripe | 決済処理 |

### Convex Schema

```
users
├── clerkId: string
├── username: string
├── email: string
├── name: string?
├── bio: string?
├── avatarUrl: string?
├── themeColor: string
├── themeName: string
├── productLayout: string?
├── twitterUrl: string?
├── instagramUrl: string?
├── youtubeUrl: string?
├── tiktokUrl: string?
├── websiteUrl: string?
└── stripeAccountId: string?

links
├── userId: Id<"users">
├── title: string
├── url: string
├── order: number
├── icon: string?
├── iconUrl: string?
└── isActive: boolean

products
├── userId: Id<"users">
├── title: string
├── description: string?
├── price: number
├── currency: string
├── fileUrl: string?
├── thumbnailUrl: string?
└── isActive: boolean

orders
├── productId: Id<"products">
├── userId: Id<"users">
├── buyerEmail: string
├── buyerName: string?
├── stripePaymentId: string?
├── amount: number
├── currency: string
└── status: string

analytics
├── userId: Id<"users">
├── eventType: string
└── metadata: string?
```

## Infrastructure & Deployment

| カテゴリ | サービス | 用途 |
|---------|---------|------|
| **Hosting** | Vercel | Next.jsホスティング, エッジ関数 |
| **Database** | Convex Cloud | リアルタイムDB, 関数 |
| **Auth** | Clerk Cloud | 認証インフラ |
| **Payment** | Stripe | 決済処理 |
| **Images** | Convex Storage | 画像保存 |

### 環境変数

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=<url>
CONVEX_DEPLOYMENT=<deployment>

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<key>
CLERK_SECRET_KEY=<key>

# Stripe
STRIPE_SECRET_KEY=<key>
STRIPE_PUBLISHABLE_KEY=<key>
STRIPE_WEBHOOK_SECRET=<secret>
USE_MOCK_PAYMENT=<true|false>

# AI（オプション）
OPENAI_API_KEY=<key>
```

## Development Tools

| カテゴリ | ツール | 用途 |
|---------|-------|------|
| **Package Manager** | npm | 依存管理 |
| **Testing** | Vitest | ユニットテスト |
| **Linting** | ESLint | コード品質 |
| **Formatting** | Prettier | コードフォーマット |
| **Type Checking** | TypeScript | 静的型検査 |

## Key Dependencies

### Production
```json
{
  "next": "14.x",
  "react": "18.x",
  "react-dom": "18.x",
  "convex": "^1.x",
  "@clerk/nextjs": "^5.x",
  "@stripe/stripe-js": "^3.x",
  "stripe": "^15.x",
  "tailwindcss": "3.x",
  "lucide-react": "latest",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest",
  "zod": "^3.x"
}
```

### Development
```json
{
  "typescript": "5.x",
  "vitest": "latest",
  "@vitejs/plugin-react": "latest",
  "eslint": "8.x",
  "eslint-config-next": "14.x",
  "@testing-library/react": "latest",
  "@testing-library/jest-dom": "latest"
}
```

## Architecture Decisions

### ADR-001: Convex採用
- **決定**: Prisma + PostgreSQLではなくConvexを採用
- **理由**:
  - リアルタイム機能が標準装備
  - サーバーレス関数とDBの統合
  - スキーママイグレーション不要
  - 無料枠が大きい
- **トレードオフ**:
  - ロックインリスク
  - 複雑なクエリの制限

### ADR-002: Clerk採用
- **決定**: NextAuth.jsではなくClerkを採用
- **理由**:
  - ソーシャルログインが簡単
  - 組織管理機能
  - UIコンポーネント提供
- **トレードオフ**:
  - コスト（無料枠超過時）
  - ベンダーロックイン

### ADR-003: モック決済対応
- **決定**: Stripe APIなしでも動作するモックモード実装
- **理由**:
  - 開発環境でのテスト容易化
  - Stripe登録前の評価可能
- **実装**: `USE_MOCK_PAYMENT`環境変数で切り替え

## Security Considerations

| 項目 | 対策 |
|------|------|
| 認証 | Clerk（セッションベース） |
| CSRF | Next.js標準保護 |
| XSS | React自動エスケープ |
| SQL Injection | Convex（NoSQL） |
| 環境変数 | Vercel Secrets管理 |
| Webhook署名 | Stripe署名検証 |

## Performance Targets

| 指標 | 目標 |
|------|------|
| Lighthouse Score | 90+ |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Core Web Vitals | 全てPass |

---

*最終更新: 2026-04-01*
