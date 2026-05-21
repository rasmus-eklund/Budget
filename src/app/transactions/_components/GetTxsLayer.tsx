"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { type FromTo } from "~/lib/zodSchemas";
import { getErrorMessage, getLastMonthYear } from "~/lib";
import getTxByDates from "../dataLayer/getData";
import { useStore } from "~/stores/tx-store";
import { emptyOptions } from "~/constants";
import { ShowData, Spinner } from "~/components/common";
import { toast } from "sonner";

type Props = { range: FromTo };
const GetTxsLayer = ({ range: { from, to } }: Props) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const requestIdRef = useRef(0);
  const setTxs = useStore((state) => state.setTxs);
  const setLoading = useStore((state) => state.setLoading);
  const setRange = useStore((state) => state.setRange);
  const setDraftRange = useStore((state) => state.setDraftRange);
  const setSelectedRange = useStore((state) => state.setSelectedRange);
  const password = useStore((state) => state.password);

  const getData = useCallback(
    async (dates: FromTo, reset = false) => {
      const requestId = ++requestIdRef.current;
      if (password === "") {
        setTxs({ txs: [], options: emptyOptions, reset: true });
        router.push("/password?from=transactions");
        return;
      }
      setLoading(true);
      try {
        const res = await getTxByDates({ dates, password });
        if (requestId !== requestIdRef.current) return;
        if (!res.ok)
          return setTxs({ txs: [], options: emptyOptions, reset: true });
        setSelectedRange(dates);
        setDraftRange(dates);
        setTxs({ txs: res.data, options: res.options, reset });
      } catch (e) {
        if (requestId !== requestIdRef.current) return;
        toast.error(getErrorMessage(e));
        setTxs({ txs: [], options: emptyOptions, reset: true });
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [setTxs, setLoading, setSelectedRange, setDraftRange, password, router],
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
