import { expect, test, type Page } from "@playwright/test";

test.describe("transactions visual guardrails", () => {
  type DateChangeCall = {
    from: string;
    to: string;
  };

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
  const getDateChangeCalls = async (page: Page) =>
    page.evaluate(
      () =>
        (
          window as unknown as {
            __dateChangeCalls?: DateChangeCall[];
          }
        ).__dateChangeCalls ?? [],
    );

  test.beforeEach(async ({ page }) => {
    await gotoHarness(page);
  });

  test("matches screenshot baseline", async ({ page }) => {
    const frame = page.getByTestId("visual-transactions-ready");
    await expect(frame).toHaveScreenshot("transactions-list.png", {
      animations: "disabled",
      maxDiffPixels: 20,
      scale: "css",
    });
  });

  test("matches screenshot baseline when mark internal is visible", async ({
    page,
  }) => {
    await gotoHarness(page, "/demo/visual-transactions/internal");
    const frame = page.getByTestId("visual-transactions-ready");
    await expect(frame).toHaveScreenshot(
      "transactions-list-with-internal.png",
      {
        animations: "disabled",
        maxDiffPixels: 20,
        scale: "css",
      },
    );
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
          if (
            rect.right > listRect.right + 1 ||
            rect.left < listRect.left - 1
          ) {
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

  test("mark internal trigger is hidden when canMarkInternal is false", async ({
    page,
  }) => {
    await gotoHarness(page, "/demo/visual-transactions");
    await expect(page.getByTestId("mark-internal-trigger")).toHaveCount(0);
  });

  test("mark internal trigger is visible when canMarkInternal is true", async ({
    page,
  }) => {
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

  test("debounces rapid month navigation while updating the visible draft month immediately", async ({
    isMobile,
    page,
  }) => {
    test.skip(isMobile, "Date filter behavior tests use desktop controls.");
    await gotoHarness(page, "/demo/visual-transactions/date-filter");
    await expect(page.getByTestId("month-month-select")).toContainText(
      "Januari",
    );
    await expect(page.getByText("ICA Kvantum")).toBeVisible();

    await page.getByTestId("month-next").click();
    await expect(page.getByTestId("month-month-select")).toContainText(
      "Februari",
    );

    await page.getByTestId("month-next").click();
    await expect(page.getByTestId("month-month-select")).toContainText("Mars");
    await expect(page.getByText("ICA Kvantum")).toBeVisible();
    await expect(page.getByText("Mars testtransaktion")).toHaveCount(0);

    await page.waitForTimeout(300);
    expect(await getDateChangeCalls(page)).toEqual([]);

    await expect
      .poll(() => getDateChangeCalls(page))
      .toEqual([{ from: "2024-03-01", to: "2024-03-31" }]);
    await expect(page.getByText("Mars testtransaktion")).toBeVisible();
  });

  test("debounces date-tab conversion and submits the converted draft range once", async ({
    isMobile,
    page,
  }) => {
    test.skip(isMobile, "Date filter behavior tests use desktop controls.");
    await gotoHarness(page, "/demo/visual-transactions/date-filter");
    await page.getByTestId("date-tab-day").click();
    await expect(page.getByTestId("date-tab-day")).toHaveAttribute(
      "data-state",
      "active",
    );

    await page.waitForTimeout(300);
    expect(await getDateChangeCalls(page)).toEqual([]);

    await expect
      .poll(() => getDateChangeCalls(page))
      .toEqual([{ from: "2024-01-01", to: "2024-01-01" }]);
  });

  test("keeps loaded rows unchanged while a debounced date request is pending", async ({
    isMobile,
    page,
  }) => {
    test.skip(isMobile, "Date filter behavior tests use desktop controls.");
    await gotoHarness(page, "/demo/visual-transactions/date-filter");
    await page.getByTestId("month-next").click();

    await expect(page.getByTestId("month-month-select")).toContainText(
      "Februari",
    );
    await expect(page.getByText("ICA Kvantum")).toBeVisible();
    await expect(page.getByText("Februari testtransaktion")).toHaveCount(0);

    await page.waitForTimeout(300);
    expect(await getDateChangeCalls(page)).toEqual([]);
    await expect(page.getByText("ICA Kvantum")).toBeVisible();

    await expect
      .poll(() => getDateChangeCalls(page))
      .toEqual([{ from: "2024-02-01", to: "2024-02-29" }]);
    await expect(page.getByText("Februari testtransaktion")).toBeVisible();
    await expect(page.getByText("ICA Kvantum")).toHaveCount(0);
  });
});
