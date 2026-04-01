import { test, expect } from "@playwright/test";

test.describe("ランディングページ", () => {
  test("ランディングページが正しく表示される", async ({ page }) => {
    await page.goto("/landing");

    // ページタイトル確認
    await expect(page).toHaveTitle(/イセエビ|Ise Ebi/);

    // ヒーローセクション
    await expect(page.locator("h1")).toContainText(/クリエイター|ストア/);

    // CTAボタン
    const ctaButton = page.getByRole("link", { name: /始める|登録|無料/ });
    await expect(ctaButton).toBeVisible();
  });

  test("機能セクションが表示される", async ({ page }) => {
    await page.goto("/landing");

    // 機能説明（見出しとして確認）
    await expect(page.getByRole("heading", { name: /リンク/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /商品/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /決済/ })).toBeVisible();
  });

  test("ナビゲーションが機能する", async ({ page }) => {
    await page.goto("/landing");

    // ログインリンク
    const loginLink = page.getByRole("link", { name: /ログイン/ });
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
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
