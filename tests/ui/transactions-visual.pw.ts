import { expect, test, type Page } from "@playwright/test";

test.describe("transactions visual guardrails", () => {
  const gotoHarness = async (
    page: Page,
    path = "/demo/visual-transactions",
  ) => {
    await page.goto(path);
    await expect(page.getByTestId("visual-transactions-ready")).toBeVisible();
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
          caret-color: transparent !important;
        }
      `,
    });
  };

  test.beforeEach(async ({ page }) => {
    await gotoHarness(page);
  });

  test("matches screenshot baseline", async ({ page }) => {
    const frame = page.getByTestId("visual-transactions-ready");
    await expect(frame).toHaveScreenshot("transactions-list.png", {
      animations: "disabled",
      scale: "css",
    });
  });

  test("matches screenshot baseline when mark internal is visible", async ({
    page,
  }) => {
    await gotoHarness(page, "/demo/visual-transactions/internal");
    const frame = page.getByTestId("visual-transactions-ready");
    await expect(frame).toHaveScreenshot("transactions-list-with-internal.png", {
      animations: "disabled",
      scale: "css",
    });
  });

  test("does not overflow horizontally", async ({ page }) => {
    const metrics = await page.evaluate(() => {
      const list = document.querySelector(
        '[data-testid="transactions-virtuoso"]',
      ) as HTMLElement | null;

      if (!list) {
        return {
          missingList: true,
          overflowRows: [] as string[],
          overflowTexts: [] as string[],
          listOverflow: false,
        };
      }

      const listRect = list.getBoundingClientRect();
      const rows = Array.from(
        document.querySelectorAll('[data-testid="transaction-row"]'),
      ) as HTMLElement[];

      const overflowRows = rows
        .map((row) => row.getBoundingClientRect())
        .map((rect, index) =>
          rect.right > listRect.right + 1 || rect.left < listRect.left - 1
            ? `row-${index}`
            : null,
        )
        .filter((value): value is string => value !== null);

      const textElements = Array.from(
        document.querySelectorAll(
          '[data-testid="transaction-main-text"], [data-testid="transaction-side-text"]',
        ),
      ) as HTMLElement[];

      const overflowTexts = textElements
        .map((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.right > listRect.right + 1 || rect.left < listRect.left - 1) {
            return el.dataset.testid ?? "text";
          }
          return null;
        })
        .filter((value): value is string => value !== null);

      return {
        missingList: false,
        overflowRows,
        overflowTexts,
        listOverflow: list.scrollWidth > list.clientWidth,
      };
    });

    expect(metrics.missingList).toBeFalsy();
    expect(metrics.listOverflow).toBeFalsy();
    expect(metrics.overflowRows).toEqual([]);
    expect(metrics.overflowTexts).toEqual([]);
  });

  test("mark internal trigger is hidden when canMarkInternal is false", async ({ page }) => {
    await gotoHarness(page, "/demo/visual-transactions");
    await expect(page.getByTestId("mark-internal-trigger")).toHaveCount(0);
  });

  test("mark internal trigger is visible when canMarkInternal is true", async ({ page }) => {
    await gotoHarness(page, "/demo/visual-transactions/internal");
    const triggers = page.getByTestId("mark-internal-trigger");
    await expect(triggers.first()).toBeVisible();
    expect(await triggers.count()).toBeGreaterThan(0);
  });

  test("mark internal trigger does not overflow transaction row", async ({
    page,
  }) => {
    await gotoHarness(page, "/demo/visual-transactions/internal");
    const metrics = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll('[data-testid="transaction-row"]'),
      ) as HTMLElement[];

      const overflowRows = rows
        .map((row, index) => {
          const rowRect = row.getBoundingClientRect();
          const trigger = row.querySelector(
            '[data-testid="mark-internal-trigger"]',
          ) as HTMLElement | null;
          if (!trigger) return `missing-trigger-${index}`;

          const triggerRect = trigger.getBoundingClientRect();
          const isOutside =
            triggerRect.right > rowRect.right + 1 ||
            triggerRect.left < rowRect.left - 1;
          const hasHorizontalOverflow = row.scrollWidth > row.clientWidth;

          return isOutside || hasHorizontalOverflow ? `row-${index}` : null;
        })
        .filter((value): value is string => value !== null);

      return { overflowRows };
    });

    expect(metrics.overflowRows).toEqual([]);
  });
});
