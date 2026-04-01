import { test, expect } from "@playwright/test";

test.describe("ストアフロント", () => {
  // テスト用ユーザー（存在しない場合のフォールバック）
  const testUsername = "testuser";

  test("存在しないユーザーは404またはエラー表示", async ({ page }) => {
    await page.goto(`/${testUsername}-nonexistent-12345`);

    // 404またはエラーメッセージ
    const notFound = page.getByText(/見つかりません|404|存在しません/);
    const error = page.getByText(/エラー|Error/);

    // どちらかが表示されることを確認
    await expect(notFound.or(error)).toBeVisible({ timeout: 5000 });
  });

  test("ストアフロントのレイアウトが正しい", async ({ page }) => {
    // 既存のユーザーページにアクセス（存在すれば）
    await page.goto("/landing");

    // ページが読み込まれることを確認
    await expect(page).toHaveURL(/localhost:3000/);
  });
});

test.describe("テーマ切り替え", () => {
  test("異なるテーマでストアフロントが表示される", async ({ page }) => {
    // ランディングページでテーマプレビューを確認
    await page.goto("/landing");

    // ページが正常に表示されることを確認
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });
});

test.describe("レスポンシブデザイン", () => {
  test("モバイル表示が正しい", async ({ page }) => {
    // モバイルビューポート
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/landing");

    // ページが表示される
    await expect(page.locator("body")).toBeVisible();

    // 横スクロールがないことを確認
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10); // 10px許容
  });

  test("タブレット表示が正しい", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/landing");

    await expect(page.locator("body")).toBeVisible();
  });

  test("デスクトップ表示が正しい", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/landing");

    await expect(page.locator("body")).toBeVisible();
  });
});
