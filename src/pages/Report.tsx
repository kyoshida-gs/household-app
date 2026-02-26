import { Grid2, Paper } from "@mui/material";
import BarChart from "@/components/BarChart";
import CategoryChart from "@/components/CategoryChart";
import MonthSelector from "@/components/MonthSelector";
import TransactionTable from "@/components/TransactionTable";

export default function Report() {
  const commonPaperStyle = {
    height: "400px",
    display: "flex",
    flexDirection: "column",
    p: 2,
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <MonthSelector />
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
