import { useMemo } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { formatMonth } from "@/utils/formatting";
import type { Transaction } from "@/types";

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
