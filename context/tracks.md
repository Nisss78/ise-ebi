# Tracks — イセエビ (Ise Ebi)

> ワークユニットのレジストリ

## Active Tracks

### TRACK-001: MVP完成
**Status**: 🟡 In Progress
**Priority**: High
**Type**: Feature
**Assignee**: -

**Description:**
MVP機能の完成と安定化

**Scope:**
- [x] ストアフロント基本機能
- [x] 管理画面基本機能
- [x] Stripe決済（モック対応）
- [ ] エラーハンドリング強化
- [ ] テストカバレッジ向上
- [ ] パフォーマンス最適化

**Blockers:**
- なし

**Notes:**
- 基本機能は実装済み
- 品質向上が残タスク

---

### TRACK-002: 認証フロー改善
**Status**: 🔵 Planned
**Priority**: Medium
**Type**: Improvement
**Assignee**: -

**Description:**
Clerk認証のUX改善とエッジケース対応

**Scope:**
- [ ] オンボーディングフロー改善
- [ ] エラーメッセージ日本語化
- [ ] ソーシャルログイン追加（Google, Twitter）
- [ ] パスワードリセットフロー確認

**Dependencies:**
- なし

---

### TRACK-003: 決済フロー検証
**Status**: 🔵 Planned
**Priority**: High
**Type**: Quality
**Assignee**: -

**Description:**
Stripe決済の本番使用に向けた検証

**Scope:**
- [ ] Webhook署名検証
- [ ] 決済成功/失敗フロー確認
- [ ] 返金フロー実装
- [ ] テスト決済シナリオ

**Dependencies:**
- Stripe本番アカウント設定

---

## Completed Tracks

### ✅ TRACK-000: プロジェクト初期化
**Completed**: 2026-03-15
**Type**: Setup

**Deliverables:**
- Next.js 14 セットアップ
- Convex統合
- Clerk認証統合
- 基本UI構築

---

## Backlog

### P1: 機能
- サブスクリプション販売対応
- 分析ダッシュボード強化
- AIアシスタント実用化
- メール通知機能

### P2: 品質
- E2Eテスト追加
- アクセシビリティ改善
- 国際化（i18n）基盤

### P3: 将来
- モバイルアプリ（React Native）
- 物理商品対応
- API公開（パートナー連携）

---

## Track Naming Convention

```
TRACK-<number>: <title>
```

### Status
- 🔵 Planned — 計画中
- 🟡 In Progress — 進行中
- 🟠 Blocked — ブロック中
- ✅ Completed — 完了
- ❌ Cancelled — キャンセル

### Priority
- **P0**: 緊急（バグ, セキュリティ）
- **P1**: 高（MVP機能）
- **P2**: 中（改善）
- **P3**: 低（将来機能）

### Type
- **Feature**: 新機能
- **Improvement**: 改善
- **Bug**: バグ修正
- **Quality**: 品質向上
- **Docs**: ドキュメント
- **Setup**: セットアップ

---

*最終更新: 2026-04-01*
