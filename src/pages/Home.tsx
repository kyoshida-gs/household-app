import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { format } from "date-fns";
import type { DateClickArg } from "@fullcalendar/interaction/index.js";

import Calendar from "@/components/Calendar";
import MonthlySummary from "@/components/MonthlySummary";
import TransactionForm from "@/components/TransactionForm";
import TransactionMenu from "@/components/TransactionMenu";
import type { Transaction } from "@/types";

import useMonthlyTransaction from "@/hooks/useMonthlyTransaction";

export default function Home() {
  const monthlyTransactions = useMonthlyTransaction();

  const today = format(new Date(), "yyyy-MM-dd");
  const [currentDay, setCurrentDay] = useState(today);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 1日分のデータを取得
  const dailyTransactions = useMemo(() => {
    return monthlyTransactions.filter((transaction) => {
      return transaction.date === currentDay;
    });
  }, [monthlyTransactions, currentDay]);
  // console.log("dailyTransactions: ", dailyTransactions);

  const closeForm = () => {
    setSelectedTransaction(null);
    setIsDialogOpen(false);
  };

  // フォームの開閉処理
  const handleAddTransactionForm = () => {
    setSelectedTransaction(null);
    setIsDialogOpen(true);
  };

  // 取引が選択された時の処理
  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  // 日付を選択した時の処理
  const handleDateClick = (dateInfo: DateClickArg) => {
    // console.log("dateInfo: ", dateInfo);
    setCurrentDay(dateInfo.dateStr);
    setIsMenuDrawerOpen(true);
  };

  // モバイル用 Drawer を閉じる処理
  const handleCloseMobileDrawer = () => {
    setIsMenuDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary />
        <Calendar
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
          handleDateClick={handleDateClick}
        />
      </Box>

      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          onAddTransactionForm={handleAddTransactionForm}
          onSelectTransaction={handleSelectTransaction}
          isMenuDrawerOpen={isMenuDrawerOpen}
          onCloseMobileDrawer={handleCloseMobileDrawer}
        />
        <TransactionForm
          onCloseForm={closeForm}
          currentDay={currentDay}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </Box>
    </Box>
  );
}
