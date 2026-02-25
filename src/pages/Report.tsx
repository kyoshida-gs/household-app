import { Grid2, Paper } from "@mui/material";
import BarChart from "@/components/BarChart";
import CategoryChart from "@/components/CategoryChart";
import MonthSelector from "@/components/MonthSelector";
import TransactionTable from "@/components/TransactionTable";
import type { Transaction } from "@/types";

interface ReportProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  monthlyTransactions: Transaction[];
  isLoading: boolean;
  onDeleteTransaction: (ids: string | readonly string[]) => Promise<void>;
}
export default function Report({
  currentMonth,
  setCurrentMonth,
  monthlyTransactions,
  isLoading,
  onDeleteTransaction,
}: ReportProps) {
  const commonPaperStyle = {
    height: "400px",
    display: "flex",
    flexDirection: "column",
    p: 2,
  };

  console.table(monthlyTransactions);

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <MonthSelector
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Paper sx={commonPaperStyle}>
          <CategoryChart
            monthlyTransactions={monthlyTransactions}
            isLoading={isLoading}
          />
        </Paper>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 8 }}>
        <Paper sx={commonPaperStyle}>
          <BarChart
            monthlyTransactions={monthlyTransactions}
            isLoading={isLoading}
          />
        </Paper>
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <TransactionTable
          monthlyTransactions={monthlyTransactions}
          onDeleteTransaction={onDeleteTransaction}
        />
      </Grid2>
    </Grid2>
  );
}
