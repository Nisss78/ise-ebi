# Stan Store Clone

日本のクリエイター向けストアフロントプラットフォーム。

## 機能

### ストアフロント（`/[username]`）
- プロフィール表示（アバター、名前、バイオ）
- SNSリンク集（ドラッグ&ドロップ順序変更）
- デジタル商品カード
- 1-Tap Checkout（モーダル完結決済）
- 複数テーマ対応

### 管理画面（`/admin`）
- プロフィール編集
- リンク管理（CRUD + 順序変更）
- 商品管理（CRUD + ファイルURL設定）
- 注文履歴（売上統計付き）
- アナリティクス
- AIアシスタント

### 決済システム
- **モック決済**（デフォルト）: Stripe APIキーなしで動作
- **本番Stripe**: 環境変数設定で切り替え可能
- Apple Pay / Google Pay 対応

## セットアップ

### 1. インストール

```bash
npm install
```

### 2. データベース初期化

```bash
npx prisma generate
npx prisma db push
```

### 3. 環境変数設定

`.env`を編集:

```env
# モック決済モード（Stripeなしで動作）
USE_MOCK_PAYMENT="true"

# 本番決済を使う場合
USE_MOCK_PAYMENT="false"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. 起動

```bash
npm run dev
```

## 使い方

1. **アカウント作成**: `http://localhost:3000/register`
2. **ログイン**: 管理画面へ自動遷移
3. **プロフィール設定**: 名前、バイオ、テーマを設定
4. **リンク追加**: SNSやWebサイトのリンクを追加
5. **商品追加**: タイトル、価格、ファイルURLを設定
6. **ストアフロント確認**: `http://localhost:3000/[username]`

## 決済フロー

### モック決済（デフォルト）
1. 購入ボタンクリック
2. メールアドレス入力
3. 即座に成功画面へ遷移
4. ダウンロードリンク表示

### 本番Stripe決済
1. `.env`で`USE_MOCK_PAYMENT="false"`に設定
2. Stripe APIキーを設定
3. Webhookエンドポイント: `/api/webhooks/stripe`

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (Base UI)
- Prisma + SQLite
- NextAuth.js
- Stripe

## ディレクトリ構成

```
src/
├── app/
│   ├── [username]/       # ストアフロント
│   ├── admin/            # 管理画面
│   ├── api/              # API routes
│   ├── checkout/         # 決済完了ページ
│   ├── login/            # ログイン
│   └── register/         # 新規登録
├── components/
│   ├── ui/               # UIコンポーネント
│   └── checkout-modal.tsx
└── lib/
    ├── prisma.ts         # DB接続
    ├── auth.ts           # 認証設定
    ├── stripe.ts         # Stripe/モック決済
    └── themes.ts         # テーマ定義
```

## 本番デプロイ

### Vercel推奨

1. GitHubにプッシュ
2. Vercelでプロジェクト作成
3. 環境変数を設定
4. SQLite → PostgreSQL に変更推奨

### Stripe設定

1. [Stripe Dashboard](https://dashboard.stripe.com/)でAPIキー取得
2. Webhookエンドポイント作成: `https://your-domain.com/api/webhooks/stripe`
3. イベント購読: `checkout.session.completed`

## ライセンス

MIT
