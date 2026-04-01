# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> 認証フロー >> ログインページが表示される
- Location: e2e/auth.spec.ts:18:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /ログイン|サインイン|Log In|Sign In/i })
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /ログイン|サインイン|Log In|Sign In/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - region "Notifications alt+T"
  - alert [ref=e3]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("認証フロー", () => {
  4  |   test("登録ページが表示される", async ({ page }) => {
  5  |     await page.goto("/register");
  6  | 
  7  |     // ページが読み込まれることを確認
  8  |     await expect(page).toHaveURL(/\/register/);
  9  | 
  10 |     // Clerkの登録フォームが表示されることを確認
  11 |     const heading = page.getByRole("heading", { name: /登録|サインアップ|Sign Up|Create/i });
  12 |     const clerkForm = page.locator("[data-testid='signup-form'], form");
  13 | 
  14 |     // どちらかが存在すればOK
  15 |     await expect(heading.or(clerkForm)).toBeVisible({ timeout: 10000 });
  16 |   });
  17 | 
  18 |   test("ログインページが表示される", async ({ page }) => {
  19 |     await page.goto("/login");
  20 | 
  21 |     // ログインフォーム要素
> 22 |     await expect(page.getByRole("heading", { name: /ログイン|サインイン|Log In|Sign In/i })).toBeVisible();
     |                                                                                     ^ Error: expect(locator).toBeVisible() failed
  23 |   });
  24 | 
  25 |   test("未認証で管理画面にアクセスするとリダイレクト", async ({ page }) => {
  26 |     await page.goto("/admin");
  27 | 
  28 |     // ログインページまたは認証ページにリダイレクトされることを確認
  29 |     await page.waitForURL(/\/(login|sign-in|register)/, { timeout: 5000 }).catch(() => {
  30 |       // リダイレクトされない場合、認証を求めるメッセージが表示されることを確認
  31 |     });
  32 | 
  33 |     // 現在のURLを確認
  34 |     const currentUrl = page.url();
  35 |     const isRedirected = /\/(login|sign-in|register)/.test(currentUrl);
  36 |     const hasAuthMessage = (async () => {
  37 |       const text = await page.locator("body").textContent();
  38 |       return text?.includes("ログイン") || text?.includes("認証");
  39 |     })();
  40 | 
  41 |     expect(isRedirected || await hasAuthMessage).toBeTruthy();
  42 |   });
  43 | });
  44 | 
  45 | test.describe("認証バリデーション", () => {
  46 |   test("無効なメールアドレスでエラー表示", async ({ page }) => {
  47 |     await page.goto("/register");
  48 | 
  49 |     const emailInput = page.locator('input[type="email"], input[name="email"]').first();
  50 |     if (await emailInput.count() > 0) {
  51 |       await emailInput.fill("invalid-email");
  52 |       
  53 |       // フォーム送信またはフォーカスアウト
  54 |       const submitButton = page.getByRole("button", { name: /登録|作成|Submit/i });
  55 |       if (await submitButton.count() > 0) {
  56 |         await submitButton.click();
  57 |       } else {
  58 |         await page.keyboard.press("Tab");
  59 |       }
  60 | 
  61 |       // エラーメッセージを待機
  62 |       await page.waitForTimeout(1000);
  63 | 
  64 |       // エラーが表示されることを確認（実装依存）
  65 |       const hasError = await page.locator("text=/無効|正しい|invalid/i").count() > 0;
  66 |       // 緩い検証（実装によって異なるため）
  67 |       expect(true).toBe(true); // フォームが表示されればOK
  68 |     }
  69 |   });
  70 | 
  71 |   test("短いパスワードでエラー表示", async ({ page }) => {
  72 |     await page.goto("/register");
  73 | 
  74 |     const passwordInput = page.locator('input[type="password"]').first();
  75 |     if (await passwordInput.count() > 0) {
  76 |       await passwordInput.fill("123");
  77 | 
  78 |       // フォーカスアウト
  79 |       await page.keyboard.press("Tab");
  80 |       await page.waitForTimeout(500);
  81 | 
  82 |       // 実装依存のため緩い検証
  83 |       expect(true).toBe(true);
  84 |     }
  85 |   });
  86 | });
  87 | 
```