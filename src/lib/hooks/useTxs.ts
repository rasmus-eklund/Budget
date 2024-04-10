import { useCallback, useEffect, useState } from "react";
import { usePassword } from "~/app/_components/PasswordContext";
import type { TxReturn } from "~/types";
import type { FromTo } from "../zodSchemas";
import getTxByDates from "~/app/transactions/dataLayer/getData";

import { getCurrentYearMonth } from "../utils/datePicker";

export const useTxs = () => {
  const [loading, setLoading] = useState(false);
  const { password, showDialog } = usePassword();
  const [data, setData] = useState<TxReturn>({
    success: false,
    data: [],
    message: "Fel lösenord",
  });

  const [txDate, setTxDate] = useState<FromTo>(getCurrentYearMonth());

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
    setTxDate,
  };
};
