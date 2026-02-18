import Calendar from "@/components/Calendar";
import MonthlySummary from "@/components/MonthlySummary";
import TransactionForm from "@/components/TransactionForm";
import TransactionMenu from "@/components/TransactionMenu";
import type { Transaction } from "@/types";
import { Box } from "@mui/material";

interface HomeProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

export default function Home({
  monthlyTransactions,
  setCurrentMonth,
}: HomeProps) {
  return (
    <Box sx={{ display: "flex" }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary monthlyTransactions={monthlyTransactions} />
        <Calendar
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
        />
      </Box>

      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu />
        <TransactionForm />
      </Box>
    </Box>
  );
}
