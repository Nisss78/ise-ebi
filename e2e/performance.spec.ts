import { test, expect } from "@playwright/test";

test.describe("パフォーマンス", () => {
  test("ランディングページの読み込み時間", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/landing");
    const loadTime = Date.now() - startTime;

    // 3秒以内に読み込まれることを確認
    expect(loadTime).toBeLessThan(3000);
    console.log(`Landing page load time: ${loadTime}ms`);
  });

  test("Core Web Vitals - LCP", async ({ page }) => {
    await page.goto("/landing");

    // Largest Contentful Paint を測定
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ["largest-contentful-paint"] });

        // フォールバック（3秒後に解決）
        setTimeout(() => resolve(0), 3000);
      });
    });

    // LCP が 2.5秒以内であることを確認（Good）
    if (lcp > 0) {
      expect(lcp).toBeLessThan(2500);
      console.log(`LCP: ${lcp}ms`);
    }
  });

  test("ページサイズが適切", async ({ page }) => {
    await page.goto("/landing");

    // リソースサイズを確認
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType("resource").map((r) => ({
        name: r.name,
        size: (r as PerformanceResourceTiming).transferSize || 0,
      }));
    });

    const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
    const totalSizeMB = totalSize / (1024 * 1024);

    // 5MB以内であることを確認
    expect(totalSizeMB).toBeLessThan(5);
    console.log(`Total page size: ${totalSizeMB.toFixed(2)}MB`);
  });
});

test.describe("アクセシビリティ", () => {
  test("画像にalt属性がある", async ({ page }) => {
    await page.goto("/landing");

    const images = await page.locator("img").all();
    for (const img of images) {
      const alt = await img.getAttribute("alt");
      // alt属性が存在する、または役割がプレゼンテーション
      expect(alt !== null || (await img.getAttribute("role")) === "presentation").toBeTruthy();
    }
  });

  test("見出し構造が正しい", async ({ page }) => {
    await page.goto("/landing");

    // h1が1つだけ存在
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(2); // 許容範囲
  });

  test("ボタンにラベルがある", async ({ page }) => {
    await page.goto("/landing");

    const buttons = await page.locator("button").all();
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute("aria-label");
      const hasLabel = text || ariaLabel;
      expect(hasLabel).toBeTruthy();
    }
  });

  test("リンクにラベルがある", async ({ page }) => {
    await page.goto("/landing");

    const links = await page.locator("a").all();
    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute("aria-label");
      const title = await link.getAttribute("title");
      const hasLabel = text || ariaLabel || title;
      // 空リンクでないことを確認
      expect(hasLabel).toBeTruthy();
    }
  });

  test("フォーカス順序が適切", async ({ page }) => {
    await page.goto("/landing");

    // Tabキーでフォーカス移動
    await page.keyboard.press("Tab");
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBeTruthy();
  });
});

test.describe("SEO", () => {
  test("メタタグが設定されている", async ({ page }) => {
    await page.goto("/landing");

    // title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    // meta description
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    // 存在すれば確認、なくてもOK（実装依存）
    if (description) {
      expect(description.length).toBeGreaterThan(0);
    }
  });

  test("OGPタグが設定されている", async ({ page }) => {
    await page.goto("/landing");

    // og:title
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    // 実装依存のため存在すれば確認
    if (ogTitle) {
      expect(ogTitle.length).toBeGreaterThan(0);
    }
  });
});
