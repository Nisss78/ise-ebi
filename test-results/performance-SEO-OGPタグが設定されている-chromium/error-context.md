# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: performance.spec.ts >> SEO >> OGPタグが設定されている
- Location: e2e/performance.spec.ts:131:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.getAttribute: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('meta[property="og:title"]')

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
  35  |     }
  36  |   });
  37  | 
  38  |   test("ページサイズが適切", async ({ page }) => {
  39  |     await page.goto("/landing");
  40  | 
  41  |     // リソースサイズを確認
  42  |     const resources = await page.evaluate(() => {
  43  |       return performance.getEntriesByType("resource").map((r) => ({
  44  |         name: r.name,
  45  |         size: (r as PerformanceResourceTiming).transferSize || 0,
  46  |       }));
  47  |     });
  48  | 
  49  |     const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
  50  |     const totalSizeMB = totalSize / (1024 * 1024);
  51  | 
  52  |     // 5MB以内であることを確認
  53  |     expect(totalSizeMB).toBeLessThan(5);
  54  |     console.log(`Total page size: ${totalSizeMB.toFixed(2)}MB`);
  55  |   });
  56  | });
  57  | 
  58  | test.describe("アクセシビリティ", () => {
  59  |   test("画像にalt属性がある", async ({ page }) => {
  60  |     await page.goto("/landing");
  61  | 
  62  |     const images = await page.locator("img").all();
  63  |     for (const img of images) {
  64  |       const alt = await img.getAttribute("alt");
  65  |       // alt属性が存在する、または役割がプレゼンテーション
  66  |       expect(alt !== null || (await img.getAttribute("role")) === "presentation").toBeTruthy();
  67  |     }
  68  |   });
  69  | 
  70  |   test("見出し構造が正しい", async ({ page }) => {
  71  |     await page.goto("/landing");
  72  | 
  73  |     // h1が1つだけ存在
  74  |     const h1Count = await page.locator("h1").count();
  75  |     expect(h1Count).toBeGreaterThanOrEqual(1);
  76  |     expect(h1Count).toBeLessThanOrEqual(2); // 許容範囲
  77  |   });
  78  | 
  79  |   test("ボタンにラベルがある", async ({ page }) => {
  80  |     await page.goto("/landing");
  81  | 
  82  |     const buttons = await page.locator("button").all();
  83  |     for (const button of buttons) {
  84  |       const text = await button.textContent();
  85  |       const ariaLabel = await button.getAttribute("aria-label");
  86  |       const hasLabel = text || ariaLabel;
  87  |       expect(hasLabel).toBeTruthy();
  88  |     }
  89  |   });
  90  | 
  91  |   test("リンクにラベルがある", async ({ page }) => {
  92  |     await page.goto("/landing");
  93  | 
  94  |     const links = await page.locator("a").all();
  95  |     for (const link of links) {
  96  |       const text = await link.textContent();
  97  |       const ariaLabel = await link.getAttribute("aria-label");
  98  |       const title = await link.getAttribute("title");
  99  |       const hasLabel = text || ariaLabel || title;
  100 |       // 空リンクでないことを確認
  101 |       expect(hasLabel).toBeTruthy();
  102 |     }
  103 |   });
  104 | 
  105 |   test("フォーカス順序が適切", async ({ page }) => {
  106 |     await page.goto("/landing");
  107 | 
  108 |     // Tabキーでフォーカス移動
  109 |     await page.keyboard.press("Tab");
  110 |     const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
  111 |     expect(firstFocused).toBeTruthy();
  112 |   });
  113 | });
  114 | 
  115 | test.describe("SEO", () => {
  116 |   test("メタタグが設定されている", async ({ page }) => {
  117 |     await page.goto("/landing");
  118 | 
  119 |     // title
  120 |     const title = await page.title();
  121 |     expect(title.length).toBeGreaterThan(0);
  122 | 
  123 |     // meta description
  124 |     const description = await page.locator('meta[name="description"]').getAttribute("content");
  125 |     // 存在すれば確認、なくてもOK（実装依存）
  126 |     if (description) {
  127 |       expect(description.length).toBeGreaterThan(0);
  128 |     }
  129 |   });
  130 | 
  131 |   test("OGPタグが設定されている", async ({ page }) => {
  132 |     await page.goto("/landing");
  133 | 
  134 |     // og:title
> 135 |     const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
      |                                                                     ^ Error: locator.getAttribute: Test timeout of 30000ms exceeded.
  136 |     // 実装依存のため存在すれば確認
  137 |     if (ogTitle) {
  138 |       expect(ogTitle.length).toBeGreaterThan(0);
  139 |     }
  140 |   });
  141 | });
  142 | 
```