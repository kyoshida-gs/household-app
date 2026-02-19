import { useState } from "react";
import { Box } from "@mui/material";
import { format } from "date-fns";

import Calendar from "@/components/Calendar";
import MonthlySummary from "@/components/MonthlySummary";
import TransactionForm from "@/components/TransactionForm";
import TransactionMenu from "@/components/TransactionMenu";
import type { Transaction } from "@/types";

import type { transactionSchema } from "@/validations/schema";
import type { z } from "zod";

interface HomeProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onSaveTransaction: (
    transaction: z.input<typeof transactionSchema>,
  ) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
  onUpdateTransaction: (
    transaction: z.input<typeof transactionSchema>,
    id: string,
  ) => Promise<void>;
}

export default function Home({
  monthlyTransactions,
  setCurrentMonth,
  onSaveTransaction,
  onDeleteTransaction,
  onUpdateTransaction,
}: HomeProps) {
  const today = format(new Date(), "yyyy-MM-dd");
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // 1日分のデータを取得
  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  });
  // console.log("dailyTransactions: ", dailyTransactions);

  const closeForm = () => {
    setSelectedTransaction(null);
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
  };

  // フォームの開閉処理
  const handleAddTransactionForm = () => {
    if (selectedTransaction) {
      setSelectedTransaction(null);
    } else {
      setIsEntryDrawerOpen(!isEntryDrawerOpen);
    }
  };

  // 取引が選択された時の処理
  const handleSelectTransaction = (transaction: Transaction) => {
    // console.log("handleSelectTransaction: ", transaction);
    setIsEntryDrawerOpen(true);
    setSelectedTransaction(transaction);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary monthlyTransactions={monthlyTransactions} />
        <Calendar
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
        />
      </Box>

      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          onAddTransactionForm={handleAddTransactionForm}
          onSelectTransaction={handleSelectTransaction}
        />
        <TransactionForm
          onCloseForm={closeForm}
          currentDay={currentDay}
          isEntryDrawerOpen={isEntryDrawerOpen}
          onSaveTransaction={onSaveTransaction}
          selectedTransaction={selectedTransaction}
          onDeleteTransaction={onDeleteTransaction}
          setSelectedTransaction={setSelectedTransaction}
          onUpdateTransaction={onUpdateTransaction}
        />
      </Box>
    </Box>
  );
}
