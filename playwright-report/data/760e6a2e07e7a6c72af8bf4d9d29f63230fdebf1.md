# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing.spec.ts >> ランディングページ >> 機能セクションが表示される
- Location: e2e/landing.spec.ts:18:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /リンク/ })
Expected: visible
Error: strict mode violation: getByRole('heading', { name: /リンク/ }) resolved to 2 elements:
    1) <h1 class="text-3xl font-bold tracking-tight sm:text-5xl">…</h1> aka getByRole('heading', { name: 'リンクも商品も 1ページで売れる' })
    2) <h3 class="font-semibold">リンク集</h3> aka getByRole('heading', { name: 'リンク集' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /リンク/ })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - img [ref=e7]
          - generic [ref=e9]: イセエビ
        - generic [ref=e10]:
          - link "ログイン" [ref=e11] [cursor=pointer]:
            - /url: /login
          - link "はじめる" [ref=e12] [cursor=pointer]:
            - /url: /register
    - main [ref=e13]:
      - generic [ref=e15]:
        - generic [ref=e16]:
          - img [ref=e17]
          - text: 日本語対応
        - heading "リンクも商品も 1ページで売れる" [level=1] [ref=e19]:
          - text: リンクも商品も
          - text: 1ページで売れる
        - paragraph [ref=e20]: プロフィール、リンク集、商品販売、決済まで揃った クリエイター向けストアフロント
        - generic [ref=e21]:
          - link "無料ではじめる" [ref=e22] [cursor=pointer]:
            - /url: /register
            - text: 無料ではじめる
            - img [ref=e23]
          - link "デモを見る" [ref=e25] [cursor=pointer]:
            - /url: /testuser
        - list [ref=e26]:
          - listitem [ref=e27]:
            - img [ref=e28]
            - text: 無料で開始
          - listitem [ref=e31]:
            - img [ref=e32]
            - text: 日本円対応
          - listitem [ref=e35]:
            - img [ref=e36]
            - text: Apple Pay
      - generic [ref=e40]:
        - generic [ref=e41]:
          - heading "必要な機能をシンプルに" [level=2] [ref=e42]
          - paragraph [ref=e43]: クリエイターが商品を販売するために必要なものだけ
        - generic [ref=e44]:
          - generic [ref=e45]:
            - img [ref=e46]
            - heading "リンク集" [level=3] [ref=e49]
            - paragraph [ref=e50]: SNSやWebサイトを1ページに集約
          - generic [ref=e51]:
            - img [ref=e52]
            - heading "商品販売" [level=3] [ref=e55]
            - paragraph [ref=e56]: デジタル商品をワンタップで販売
          - generic [ref=e57]:
            - img [ref=e58]
            - heading "決済" [level=3] [ref=e60]
            - paragraph [ref=e61]: StripeでApple Pay/Google Pay対応
          - generic [ref=e62]:
            - img [ref=e63]
            - heading "AI接客" [level=3] [ref=e66]
            - paragraph [ref=e67]: 商品レコメンドを自動化
          - generic [ref=e68]:
            - img [ref=e69]
            - heading "分析" [level=3] [ref=e70]
            - paragraph [ref=e71]: PV・売上をダッシュボードで確認
      - generic [ref=e73]:
        - heading "今すぐはじめる" [level=2] [ref=e74]
        - paragraph [ref=e75]: 無料でアカウントを作成して、あなたのストアを作ろう
        - link "ストアを作成" [ref=e76] [cursor=pointer]:
          - /url: /register
          - text: ストアを作成
          - img [ref=e77]
    - contentinfo [ref=e79]:
      - paragraph [ref=e81]: Powered by イセエビ
  - region "Notifications alt+T"
  - alert [ref=e82]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("ランディングページ", () => {
  4  |   test("ランディングページが正しく表示される", async ({ page }) => {
  5  |     await page.goto("/landing");
  6  | 
  7  |     // ページタイトル確認
  8  |     await expect(page).toHaveTitle(/イセエビ|Ise Ebi/);
  9  | 
  10 |     // ヒーローセクション
  11 |     await expect(page.locator("h1")).toContainText(/クリエイター|ストア/);
  12 | 
  13 |     // CTAボタン
  14 |     const ctaButton = page.getByRole("link", { name: /始める|登録|無料/ });
  15 |     await expect(ctaButton).toBeVisible();
  16 |   });
  17 | 
  18 |   test("機能セクションが表示される", async ({ page }) => {
  19 |     await page.goto("/landing");
  20 | 
  21 |     // 機能説明（見出しとして確認）
> 22 |     await expect(page.getByRole("heading", { name: /リンク/ })).toBeVisible();
     |                                                              ^ Error: expect(locator).toBeVisible() failed
  23 |     await expect(page.getByRole("heading", { name: /商品/ })).toBeVisible();
  24 |     await expect(page.getByRole("heading", { name: /決済/ })).toBeVisible();
  25 |   });
  26 | 
  27 |   test("ナビゲーションが機能する", async ({ page }) => {
  28 |     await page.goto("/landing");
  29 | 
  30 |     // ログインリンク
  31 |     const loginLink = page.getByRole("link", { name: /ログイン/ });
  32 |     if (await loginLink.isVisible()) {
  33 |       await loginLink.click();
  34 |       await expect(page).toHaveURL(/\/login/);
  35 |     }
  36 |   });
  37 | });
  38 | 
  39 | test.describe("404ページ", () => {
  40 |   test("存在しないページで404が表示される", async ({ page }) => {
  41 |     await page.goto("/this-page-does-not-exist");
  42 | 
  43 |     // 404メッセージ
  44 |     await expect(page.getByText(/404|見つかりません/)).toBeVisible();
  45 |   });
  46 | });
  47 | 
```