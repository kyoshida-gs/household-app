import Calendar from "@/components/Calendar";
import MonthlySummary from "@/components/MonthlySummary";
import TransactionForm from "@/components/TransactionForm";
import TransactionMenu from "@/components/TransactionMenu";
import type { Transaction } from "@/types";
import { Box } from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";

interface HomeProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

export default function Home({
  monthlyTransactions,
  setCurrentMonth,
}: HomeProps) {
  const today = format(new Date(), "yyyy-MM-dd");
  console.log("today: ", today);
  const [currentDay, setCurrentDay] = useState(today);

  // 1日分のデータを取得
  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  });
  console.log("dailyTransactions: ", dailyTransactions);

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
        />
        <TransactionForm />
      </Box>
    </Box>
  );
}
