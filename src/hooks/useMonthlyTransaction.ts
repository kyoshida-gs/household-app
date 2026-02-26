import { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import type { Transaction } from "@/types";
import { formatMonth } from "@/utils/formatting";

export default function useMonthlyTransaction(): Transaction[] {
  const { transactions, currentMonth } = useAppContext();

  // 対象月の取引データを取得
  const monthlyTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      return transaction.date.startsWith(formatMonth(currentMonth));
    });
  }, [transactions, currentMonth]);

  return monthlyTransactions;
}
