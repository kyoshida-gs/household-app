import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { Transaction } from "@/types";
import { calculateDailyBalances } from "@/utils/financeCalculations";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface BarChartProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
}

export default function BarChart({
  monthlyTransactions,
  isLoading,
}: BarChartProps) {
  const theme = useTheme();
  const dailyBalances = calculateDailyBalances(monthlyTransactions);
  const dateLabels = Object.keys(dailyBalances).sort();
  const incomeData = dateLabels.map((date) => dailyBalances[date].income);
  const expenseData = dateLabels.map((date) => dailyBalances[date].expense);

  const data = {
    labels: dateLabels,
    datasets: [
      {
        label: "支出",
        data: expenseData,
        backgroundColor: theme.palette.expenseColor.main,
      },
      {
        label: "収入",
        data: incomeData,
        backgroundColor: theme.palette.incomeColor.main,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "日別収支",
      },
    },
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : monthlyTransactions.length > 0 ? (
        <Bar options={options} data={data} />
      ) : (
        <Typography>データがありません</Typography>
      )}
    </Box>
  );
}
