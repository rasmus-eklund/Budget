import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { JSDOM } from "jsdom";
import type * as React from "react";
import type { ChangeDatesOptions, Tx } from "~/types";
import type { FromTo } from "~/lib/zodSchemas";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost",
});

Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  HTMLButtonElement: dom.window.HTMLButtonElement,
  DocumentFragment: dom.window.DocumentFragment,
  Event: dom.window.Event,
  CustomEvent: dom.window.CustomEvent,
  MouseEvent: dom.window.MouseEvent,
  Node: dom.window.Node,
  navigator: dom.window.navigator,
  getComputedStyle: dom.window.getComputedStyle,
  requestAnimationFrame: (callback: FrameRequestCallback) =>
    setTimeout(callback, 0),
  cancelAnimationFrame: (id: number) => clearTimeout(id),
});

await mock.module("react-virtuoso", () => ({
  Virtuoso: ({
    data,
    itemContent,
    ...props
  }: {
    "data-testid"?: string;
    className?: string;
    data: Tx[];
    itemContent: (index: number, tx: Tx) => React.ReactNode;
  }) => <ul {...props}>{data.map((tx, index) => itemContent(index, tx))}</ul>,
}));

await mock.module("~/app/transactions/dataLayer/updateTransaction", () => ({
  updateTransaction: async () => ({ ok: true }),
}));

const { act, cleanup, render, screen } = await import("@testing-library/react");
const { default: Transactions } = await import("./Transactions");
const { default: DateFilter } = await import("./DateFilter");
const { fireEvent, waitFor } = await import("@testing-library/react");
const { useStore } = await import("~/stores/tx-store");

afterEach(() => cleanup());

const makeTx = (index: number): Tx => ({
  id: `tx-${index}`,
  datum: new Date(2024, 0, index + 1),
  text: `Transaction ${index}`,
  budgetgrupp: "mat",
  belopp: -100 - index,
  saldo: 1_000 - index,
  konto: "kortkonto",
  person: "anna",
});

const serializeRange = ({ from, to }: FromTo) => ({
  from: [
    from.getFullYear(),
    String(from.getMonth() + 1).padStart(2, "0"),
    String(from.getDate()).padStart(2, "0"),
  ].join("-"),
  to: [
    to.getFullYear(),
    String(to.getMonth() + 1).padStart(2, "0"),
    String(to.getDate()).padStart(2, "0"),
  ].join("-"),
});

const initialRange: FromTo = {
  from: new Date(2024, 0, 1, 0, 0, 0, 0),
  to: new Date(2024, 0, 31, 23, 59, 59, 999),
};

const fullRange: FromTo = {
  from: new Date(2024, 0, 1, 0, 0, 0, 0),
  to: new Date(2024, 2, 31, 23, 59, 59, 999),
};

const fixtureTxs = [
  {
    ...makeTx(1),
    id: "jan",
    text: "ICA Kvantum",
    datum: new Date(2024, 0, 2),
  },
  {
    ...makeTx(2),
    id: "feb",
    text: "Februari testtransaktion",
    datum: new Date(2024, 1, 6),
  },
  {
    ...makeTx(3),
    id: "mar",
    text: "Mars testtransaktion",
    datum: new Date(2024, 2, 8),
  },
];

const filterTxs = ({ from, to }: FromTo) =>
  fixtureTxs.filter((tx) => tx.datum >= from && tx.datum <= to);

const resetStore = () => {
  useStore.setState({
    txs: filterTxs(initialRange),
    loading: false,
    dateTab: "month",
    txSort: { sort: "date-asc" },
    filterTab: "transactions",
    hasChanged: false,
    range: fullRange,
    draftRange: initialRange,
    selectedRange: initialRange,
    showFilter: true,
    showDateFilter: true,
  });
};

const waitForDebounce = () =>
  new Promise((resolve) => setTimeout(resolve, 550));

const createDebouncedOrigin = (
  onLoad: (dates: FromTo, options: ChangeDatesOptions) => void,
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return async (dates: FromTo, options: ChangeDatesOptions = {}) => {
    if (!options.debounce) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = null;
      onLoad(dates, options);
      return;
    }

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      onLoad(dates, options);
    }, 500);
  };
};

describe("Transactions", () => {
  it("keeps long transaction lists in the scrollable region above the footer", () => {
    const data = Array.from({ length: 80 }, (_, index) => makeTx(index));

    render(
      <Transactions
        data={data}
        changeDates={async () => undefined}
        canMarkInternal={false}
      />,
    );

    const root = screen.getByTestId("transactions-root");
    const list = screen.getByTestId("transactions-virtuoso");
    const footer = screen.getByTestId("transactions-footer");

    expect(root.className).toContain("flex");
    expect(root.className).toContain("min-h-0");
    expect(root.className).toContain("flex-1");
    expect(root.className).toContain("flex-col");

    expect(list.className).toContain("min-h-0");
    expect(list.className).toContain("flex-1");

    expect(footer.className).toContain("h-12");
    expect(footer.className).toContain("shrink-0");
    expect(root.lastElementChild).toBe(footer);
    expect(list.contains(footer)).toBe(false);
    expect(screen.getAllByTestId("transaction-row")).toHaveLength(data.length);
    expect(footer.textContent).toContain("Antal: 80");
  });

  it("uses an immediate date change when a transaction date is clicked", async () => {
    const changeCalls: {
      dates: ReturnType<typeof serializeRange>;
      options: ChangeDatesOptions;
    }[] = [];
    const data = [makeTx(0)];

    render(
      <Transactions
        data={data}
        changeDates={async (dates, options = {}) => {
          changeCalls.push({ dates: serializeRange(dates), options });
        }}
        canMarkInternal={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "2024-01-01" }));

    await waitFor(() =>
      expect(changeCalls).toEqual([
        {
          dates: { from: "2024-01-01", to: "2024-01-01" },
          options: { debounce: false },
        },
      ]),
    );
  });
});

describe("DateFilter", () => {
  beforeEach(() => resetStore());

  it("debounces rapid month navigation while updating the visible draft month immediately", async () => {
    const changeCalls: ReturnType<typeof serializeRange>[] = [];
    const changeDates = createDebouncedOrigin((dates) => {
      changeCalls.push(serializeRange(dates));
    });

    render(<DateFilter changeDates={changeDates} />);

    expect(screen.getByTestId("month-month-select").textContent).toContain(
      "Januari",
    );

    fireEvent.click(screen.getByTestId("month-next"));
    expect(screen.getByTestId("month-month-select").textContent).toContain(
      "Februari",
    );

    fireEvent.click(screen.getByTestId("month-next"));
    expect(screen.getByTestId("month-month-select").textContent).toContain(
      "Mars",
    );
    expect(changeCalls).toEqual([]);

    await act(async () => {
      await waitForDebounce();
    });

    await waitFor(() =>
      expect(changeCalls).toEqual([{ from: "2024-03-01", to: "2024-03-31" }]),
    );
  });

  it("debounces date-tab conversion and submits the converted draft range once", async () => {
    const changeCalls: ReturnType<typeof serializeRange>[] = [];
    const changeDates = createDebouncedOrigin((dates) => {
      changeCalls.push(serializeRange(dates));
    });

    render(<DateFilter changeDates={changeDates} />);

    fireEvent.mouseDown(screen.getByTestId("date-tab-day"), {
      button: 0,
      ctrlKey: false,
    });
    expect(screen.getByTestId("date-tab-day").getAttribute("data-state")).toBe(
      "active",
    );
    expect(changeCalls).toEqual([]);

    await act(async () => {
      await waitForDebounce();
    });

    await waitFor(() =>
      expect(changeCalls).toEqual([{ from: "2024-01-01", to: "2024-01-01" }]),
    );
  });

  it("keeps loaded rows unchanged while a debounced date request is pending", async () => {
    const Rows = () => {
      const txs = useStore((state) => state.txs);
      return (
        <div>
          {txs.map((tx) => (
            <p key={tx.id}>{tx.text}</p>
          ))}
        </div>
      );
    };
    const changeDates = createDebouncedOrigin((dates) => {
      useStore.setState({ txs: filterTxs(dates), selectedRange: dates });
    });

    render(
      <>
        <DateFilter changeDates={changeDates} />
        <Rows />
      </>,
    );

    fireEvent.click(screen.getByTestId("month-next"));

    expect(screen.getByTestId("month-month-select").textContent).toContain(
      "Februari",
    );
    expect(screen.getByText("ICA Kvantum")).toBeTruthy();
    expect(screen.queryByText("Februari testtransaktion")).toBeNull();

    await act(async () => {
      await waitForDebounce();
    });

    await waitFor(() =>
      expect(screen.getByText("Februari testtransaktion")).toBeTruthy(),
    );
    expect(screen.queryByText("ICA Kvantum")).toBeNull();
  });
});
