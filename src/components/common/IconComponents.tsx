import type { JSX } from "react";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import type { ExpenseCategory, IncomeCategory } from "../../types";
import AlarmIcon from "@mui/icons-material/Alarm";
import AddHomeIcon from "@mui/icons-material/AddHome";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import TrainIcon from "@mui/icons-material/Train";
import WorkIcon from "@mui/icons-material/Work";
import SavingsIcon from "@mui/icons-material/Savings";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { useTheme } from "@mui/material/styles";

export default function IconComponents(): Record<
  IncomeCategory | ExpenseCategory,
  JSX.Element
> {
  const theme = useTheme();
  const { incomeCategoryColor, expenseCategoryColor } = theme.palette;

  return {
    食費: (
      <FastfoodIcon
        fontSize="small"
        sx={{ color: expenseCategoryColor.食費 }}
      />
    ),
    日用品: (
      <AlarmIcon fontSize="small" sx={{ color: expenseCategoryColor.日用品 }} />
    ),
    住居費: (
      <AddHomeIcon
        fontSize="small"
        sx={{ color: expenseCategoryColor.住居費 }}
      />
    ),
    交際費: (
      <Diversity3Icon
        fontSize="small"
        sx={{ color: expenseCategoryColor.交際費 }}
      />
    ),
    娯楽: (
      <SportsTennisIcon
        fontSize="small"
        sx={{ color: expenseCategoryColor.娯楽 }}
      />
    ),
    交通費: (
      <TrainIcon fontSize="small" sx={{ color: expenseCategoryColor.交通費 }} />
    ),
    給与: (
      <WorkIcon fontSize="small" sx={{ color: incomeCategoryColor.給与 }} />
    ),
    副収入: (
      <AddBusinessIcon
        fontSize="small"
        sx={{ color: incomeCategoryColor.副収入 }}
      />
    ),
    お小遣い: (
      <SavingsIcon
        fontSize="small"
        sx={{ color: incomeCategoryColor.お小遣い }}
      />
    ),
  };
}
