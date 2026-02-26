import { useState } from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import type { ExpenseCategory, IncomeCategory, TransactionType } from "@/types";
import { theme } from "@/theme/theme";
import useMonthlyTransaction from "@/hooks/useMonthlyTransaction";
import { useAppContext } from "@/context/AppContext";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart() {
  const monthlyTransactions = useMonthlyTransaction();
  const { isLoading } = useAppContext();

  const [selectedType, setSelectedType] = useState<TransactionType>("expense");
  const handleChangeType = (event: SelectChangeEvent<TransactionType>) => {
    setSelectedType(event.target.value as TransactionType);
  };

  const categorySums = monthlyTransactions
    .filter((transaction) => transaction.type === selectedType)
    .reduce<Record<IncomeCategory | ExpenseCategory, number>>(
      (acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
      },
      {} as Record<IncomeCategory | ExpenseCategory, number>,
    );

  const categoryLabels = Object.keys(categorySums) as (
    | IncomeCategory
    | ExpenseCategory
  )[];
  const categoryValues = Object.values(categorySums);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  // 収入のカテゴリカラー
  const incomeCategoryColor: Record<IncomeCategory, string> = {
    給与: theme.palette.incomeCategoryColor.給与,
    副収入: theme.palette.incomeCategoryColor.副収入,
    お小遣い: theme.palette.incomeCategoryColor.お小遣い,
  };

  // 支出のカテゴリカラー
  const expenseCategoryColor: Record<ExpenseCategory, string> = {
    食費: theme.palette.expenseCategoryColor.食費,
    日用品: theme.palette.expenseCategoryColor.日用品,
    住居費: theme.palette.expenseCategoryColor.住居費,
    交際費: theme.palette.expenseCategoryColor.交際費,
    娯楽: theme.palette.expenseCategoryColor.娯楽,
    交通費: theme.palette.expenseCategoryColor.交通費,
  };

  const getCategoryColor = (
    category: IncomeCategory | ExpenseCategory,
  ): string => {
    if (selectedType === "income") {
      return incomeCategoryColor[category as IncomeCategory];
    } else {
      return expenseCategoryColor[category as ExpenseCategory];
    }
  };

  const data: ChartData<"pie"> = {
    labels: categoryLabels,
    datasets: [
      {
        label: "# of Votes",
        data: categoryValues,
        backgroundColor: categoryLabels.map((category) =>
          getCategoryColor(category),
        ),
        borderColor:
          selectedType === "income"
            ? Object.values(incomeCategoryColor)
            : Object.values(expenseCategoryColor),
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <FormControl fullWidth>
        <InputLabel
          id="type-select-label"
          sx={{ backgroundColor: "white", px: 1, ml: -1 }}
        >
          収支の種類
        </InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          value={selectedType}
          onChange={handleChangeType}
          sx={{ backgroundColor: "white" }}
        >
          <MenuItem value="expense">支出</MenuItem>
          <MenuItem value="income">収入</MenuItem>
        </Select>
      </FormControl>
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
          <Pie data={data} options={options} />
        ) : (
          <Typography>データがありません</Typography>
        )}
      </Box>
    </Box>
  );
}
