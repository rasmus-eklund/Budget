"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type FromTo } from "~/lib/zodSchemas";
import { getErrorMessage, getLastMonthYear } from "~/lib";
import getTxByDates from "../dataLayer/getData";
import { useStore } from "~/stores/tx-store";
import { emptyOptions } from "~/constants";
import { ShowData, Spinner } from "~/components/common";
import { toast } from "sonner";

type Props = { range: FromTo; userId: string };
const GetTxsLayer = ({ range: { from, to }, userId }: Props) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const setTxs = useStore((state) => state.setTxs);
  const setLoading = useStore((state) => state.setLoading);
  const setRange = useStore((state) => state.setRange);
  const setSelectedRange = useStore((state) => state.setSelectedRange);
  const password = useStore((state) => state.password);

  const getData = useCallback(
    async (dates: FromTo, reset = false) => {
      if (password === "") {
        setTxs({ txs: [], options: emptyOptions, reset: true });
        router.push("/password?from=transactions");
        return;
      }
      setLoading(true);
      try {
        const res = await getTxByDates({ dates, password, userId });
        if (!res.ok)
          return setTxs({ txs: [], options: emptyOptions, reset: true });
        setSelectedRange(dates);
        setTxs({ txs: res.data, options: res.options, reset });
      } catch (e) {
        toast.error(getErrorMessage(e));
        setTxs({ txs: [], options: emptyOptions, reset: true });
      } finally {
        setLoading(false);
      }
    },
    [setTxs, setLoading, setSelectedRange, password, userId, router],
  );

  useEffect(() => {
    const range = { from, to };
    setRange(range);
    if (password === "") {
      router.push("/password?from=transactions");
      return;
    }
    const dates = getLastMonthYear(range);
    getData(dates, true)
      .catch((e) => toast.error(getErrorMessage(e)))
      .finally(() => setIsReady(true));
  }, [setRange, from, to, getData, password, router]);
  if (!isReady) return <Spinner />;
  return <ShowData changeDates={getData} canMarkInternal />;
};

export default GetTxsLayer;
