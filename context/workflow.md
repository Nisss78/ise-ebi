# Workflow — イセエビ (Ise Ebi)

> 開発プロセスと品質基準

## Development Methodology

**アプローチ**: スペック駆動開発 + Context-Driven Development

1. 仕様書（context/）を確認・更新
2. 実装
3. テスト
4. コミット
5. context/を更新（必要に応じて）

## Git Workflow

### Branch Strategy

```
master (main)
├── feature/<ticket-id>-<description>  # 新機能
├── fix/<ticket-id>-<description>      # バグ修正
├── refactor/<description>             # リファクタリング
└── docs/<description>                 # ドキュメント
```

### Commit Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: 新機能
- `fix`: バグ修正
- `refactor`: リファクタリング
- `style`: フォーマット（機能変更なし）
- `docs`: ドキュメント
- `test`: テスト
- `chore`: ビルド・設定

**Examples:**
```
feat(checkout): モック決済モード追加

- USE_MOCK_PAYMENT環境変数で切り替え
- Stripe APIなしで動作可能

Closes #12
```

```
fix(products): 商品価格表示のバグ修正

- 通貨フォーマット修正
- JPY以外の通貨対応

Fixes #34
```

### Pull Request

**必須項目:**
- 変更内容の要約
- 関連するIssue
- テスト結果
- スクリーンショット（UI変更時）

**マージ条件:**
- レビュー承認（1名以上）
- テストパス
- コンフリクト解消

## Testing Requirements

### Unit Tests
- **対象**: ユーティリティ関数, バリデーション, APIロジック
- **ツール**: Vitest + @testing-library/react
- **目標**: カバレッジ 70%+

### Integration Tests
- **対象**: API エンドポイント, Convex関数
- **ツール**: Vitest
- **目標**: 主要フロー 100%

### E2E Tests（将来）
- **対象**: ユーザーフロー全体
- **ツール**: Playwright
- **対象**: クリティカルパス

### Test Commands

```bash
# ユニットテスト
npm run test

# ウォッチモード
npm run test:watch

# カバレッジ
npm run test:coverage

# E2E（将来）
npm run test:e2e
```

## Quality Gates

### Pre-commit
- [ ] Lintエラーなし
- [ ] TypeScriptエラーなし
- [ ] テストパス（関連箇所）

### Pre-push
- [ ] 全テストパス
- [ ] ビルド成功

### Pre-merge
- [ ] コードレビュー承認
- [ ] CI/CDパス
- [ ] ドキュメント更新（必要時）

## Code Quality Tools

### ESLint Rules
- `eslint:recommended`
- `@typescript-eslint/recommended`
- `next/core-web-vitals`
- `plugin:@typescript-eslint/recommended-requiring-type-checking`

### TypeScript Config
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`

### Prettier
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "printWidth": 100
}
```

## Deployment Process

### Environments

| 環境 | URL | 用途 |
|------|-----|------|
| **Preview** | `pr-<number>-ise-ebi.vercel.app` | PRレビュー |
| **Production** | `ise-ebi.vercel.app` | 本番 |

### Deployment Flow

1. **開発** → feature branch
2. **PR作成** → Preview環境自動デプロイ
3. **レビュー** → Preview環境で確認
4. **マージ** → master
5. **自動デプロイ** → Production

### Rollback

```bash
# Vercel CLI
vercel rollback

# または管理画面から
```

## Monitoring & Logging

### Error Tracking
- **ツール**: Vercel Analytics（将来: Sentry）
- **対象**: JavaScript エラー, API エラー

### Performance Monitoring
- **ツール**: Vercel Analytics
- **指標**: Core Web Vitals, Lighthouse

### Logging
- **API**: `console.log`（Vercelログ）
- **Convex**: Convex Dashboard

## Documentation

### Required Documentation
- `README.md`: セットアップ, 使用方法
- `context/product.md`: 製品仕様
- `context/tech-stack.md`: 技術仕様
- `context/workflow.md`: 開発プロセス
- `context/tracks.md`: 進捗管理

### Update Timing
- 機能追加時 → product.md
- 技術変更時 → tech-stack.md
- プロセス変更時 → workflow.md
- タスク開始/完了時 → tracks.md

## Working with AI

### Session Start
1. `context/` 配下を全て読む
2. `context/tracks.md` で現在のタスク確認
3. 関連するコードを調査
4. 実装開始

### Session End
1. 進捗を `context/tracks.md` に記録
2. 変更点を `context/` に反映（必要時）
3. コミット

### Communication
- 仕様の不明点は質問
- 提案は文書化してから実装
- 大きな変更は事前に相談

---

*最終更新: 2026-04-01*
