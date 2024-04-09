import { useCallback, useEffect, useState } from "react";
import { usePassword } from "~/app/_components/PasswordContext";
import type { TxFilter, TxSort, TxReturn } from "~/types";
import type { FromTo } from "../zodSchemas";
import { sortOptions } from "../utils";
import { getCurrentYearMonth } from "../utils/datePicker";
import getTxByDates from "~/app/month/dataLayer/getData";

export const useTxs = () => {
  const [loading, setLoading] = useState(false);
  const { password, showDialog } = usePassword();
  const [data, setData] = useState<TxReturn>({
    success: false,
    data: [],
    message: "Fel lösenord",
  });

  const defaults: { txFilter: TxFilter; txSort: TxSort; txDate: FromTo } = {
    txFilter: {
      category: "none",
      person: "none",
      account: "none",
      inom: false,
      search: "",
    },
    txSort: { sort: sortOptions.dateAsc },
    txDate: getCurrentYearMonth(),
  };
  const [txFilter, setTxFilter] = useState<TxFilter>(defaults.txFilter);
  const [txSort, setTxSort] = useState<TxSort>(defaults.txSort);
  const [txDate, setTxDate] = useState<FromTo>(defaults.txDate);

  const getData = useCallback(
    async (password: string, dates: FromTo) => {
      setLoading(true);
      const res = await getTxByDates({ dates, password });
      setData(res);
      if (data.message === "Fel lösenord") {
        showDialog({ open: true });
      } else {
        showDialog({ open: false });
      }
      setLoading(false);
    },
    [data.message, showDialog],
  );
  useEffect(() => {
    getData(password, txDate).catch(() => {
      setData({ data: [], message: "Något gick fel", success: false });
    });
  }, [txDate, getData, password]);
  return {
    data,
    loading,
    filters: {
      set: { setTxSort, setTxDate, setTxFilter },
      get: { txFilter, txSort },
      defaults,
    },
  };
};
