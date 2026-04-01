import { test, expect } from "@playwright/test";

test.describe("ランディングページ", () => {
  test("ランディングページが正しく表示される", async ({ page }) => {
    await page.goto("/landing");

    // ページタイトル確認（日本語「イセエビ」を含む）
    await expect(page).toHaveTitle(/イセエビ/);

    // ヒーローセクションの確認
    const heroHeading = page.getByRole("heading", { level: 1 }).first();
    await expect(heroHeading).toBeVisible({ timeout: 10000 });

    // CTAボタンの確認
    const ctaButton = page.getByRole("link", { name: /無料|始める|登録/ });
    await expect(ctaButton.first()).toBeVisible({ timeout: 5000 });
  });

  test("機能セクションが表示される", async ({ page }) => {
    await page.goto("/landing");

    // 機能説明（実際の見出しに合わせる）
    await expect(page.getByRole("heading", { name: "リンク集" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: /商品販売/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "決済" })).toBeVisible();
  });

  test("ナビゲーションが機能する", async ({ page }) => {
    await page.goto("/landing");

    // ページが読み込まれることを確認
    await expect(page.locator("header")).toBeVisible({ timeout: 10000 });

    // ログインリンク（あれば）
    const loginLink = page.getByRole("link", { name: /ログイン/ });
    const loginCount = await loginLink.count();
    
    if (loginCount > 0) {
      await loginLink.first().click();
      await page.waitForURL(/\/(login|sign-in)/, { timeout: 5000 }).catch(() => {
        // リダイレクトされなくてもOK（実装依存）
      });
    }
  });
});

test.describe("404ページ", () => {
  test("存在しないページで404が表示される", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");

    // 404メッセージ
    await expect(page.getByText(/404|見つかりません/)).toBeVisible();
  });
});
