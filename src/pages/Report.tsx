import { Grid2, Paper } from "@mui/material";
import BarChart from "@/components/BarChart";
import CategoryChart from "@/components/CategoryChart";
import MonthSelector from "@/components/MonthSelector";
import TransactionTable from "@/components/TransactionTable";

interface ReportProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}
export default function Report({ currentMonth, setCurrentMonth }: ReportProps) {
  const commonPaperStyle = {
    height: { xs: "auto", md: "400px" },
  };
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
          <CategoryChart />
        </Paper>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 8 }}>
        <Paper sx={commonPaperStyle}>
          <BarChart />
        </Paper>
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <TransactionTable />
      </Grid2>
    </Grid2>
  );
}
