import { useEffect, type JSX } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  IconButton,
  ListItemIcon,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Controller,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";

import CloseIcon from "@mui/icons-material/Close";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AlarmIcon from "@mui/icons-material/Alarm";
import AddHomeIcon from "@mui/icons-material/AddHome";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import TrainIcon from "@mui/icons-material/Train";

import WorkIcon from "@mui/icons-material/Work";
import SavingsIcon from "@mui/icons-material/Savings";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";

import type { Transaction, TransactionType } from "@/types";

import type { z } from "zod";
import { transactionSchema } from "@/validations/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppContext } from "@/hooks/useAppContext";

interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CategoryItem {
  label: string;
  icon: JSX.Element;
}

const expenseCategories: CategoryItem[] = [
  { label: "食費", icon: <FastfoodIcon fontSize="small" /> },
  { label: "日用品", icon: <AlarmIcon fontSize="small" /> },
  { label: "住居費", icon: <AddHomeIcon fontSize="small" /> },
  { label: "交際費", icon: <Diversity3Icon fontSize="small" /> },
  { label: "娯楽", icon: <SportsTennisIcon fontSize="small" /> },
  { label: "交通費", icon: <TrainIcon fontSize="small" /> },
];

const incomeCategories: CategoryItem[] = [
  { label: "給与", icon: <WorkIcon fontSize="small" /> },
  { label: "副収入", icon: <AddBusinessIcon fontSize="small" /> },
  { label: "お小遣い", icon: <SavingsIcon fontSize="small" /> },
];

export default function TransactionForm({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  selectedTransaction,
  setSelectedTransaction,
  isDialogOpen,
  setIsDialogOpen,
}: TransactionFormProps) {
  const { isMobile } = useAppContext();
  const { onSaveTransaction, onDeleteTransaction, onUpdateTransaction } =
    useAppContext();
  const formWidth = 320;

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<z.input<typeof transactionSchema>>({
    defaultValues: {
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "",
      content: "",
    },
    resolver: zodResolver(transactionSchema),
  });
  // console.log("errors", errors);

  const incomeExpenseToggle = (type: TransactionType) => () => {
    setValue("type", type);
    setValue("category", "");
  };

  // 収支タイプを監視（useWatch で React Compiler の incompatible-library を回避）
  const currentType = useWatch({
    control,
    name: "type",
    defaultValue: "expense",
  });

  // 収支タイプに応じてカテゴリを導出（state ではなく render 時に算出）
  const categories =
    currentType === "expense" ? expenseCategories : incomeCategories;

  // カレンダーの日付と入力フォームの日付の連動
  useEffect(() => {
    setValue("date", currentDay);
  }, [currentDay, setValue]);

  const onSubmit: SubmitHandler<z.input<typeof transactionSchema>> = (data) => {
    // console.log("data: ", data);

    if (selectedTransaction) {
      onUpdateTransaction(data, selectedTransaction.id)
        .then(() => {
          console.log("更新しました");
          setSelectedTransaction(null);
          if (isMobile) {
            setIsDialogOpen(false);
          }
        })
        .catch((errors) => {
          console.error("更新に失敗しました: ", errors);
        });
    } else {
      onSaveTransaction(data)
        .then(() => {
          console.log("保存しました");
          setSelectedTransaction(null);
        })
        .catch((errors) => {
          console.error("保存に失敗しました: ", errors);
        });
    }

    reset({
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "",
      content: "",
    });
  };

  useEffect(() => {
    if (selectedTransaction) {
      const categoryExists = categories.some(
        (category) => category.label === selectedTransaction.category,
      );
      // console.log("categoryExists: ", categoryExists);

      if (categoryExists) {
        setValue("category", selectedTransaction.category);
      } else {
        setValue("category", "");
      }
    }
  }, [selectedTransaction, categories, setValue]);

  // 選択された取引のデータをフォームに設定
  useEffect(() => {
    if (selectedTransaction) {
      setValue("type", selectedTransaction.type);
      setValue("date", selectedTransaction.date);
      setValue("amount", selectedTransaction.amount);
      // setValue("category", selectedTransaction.category);
      setValue("content", selectedTransaction.content);
    } else {
      reset({
        type: "expense",
        date: currentDay,
        amount: 0,
        category: "",
        content: "",
      });
    }
  }, [selectedTransaction, currentDay, setValue, reset]);

  const handleDelete = () => {
    if (selectedTransaction) {
      onDeleteTransaction(selectedTransaction?.id);
      if (isMobile) {
        setIsDialogOpen(false);
      }
      setSelectedTransaction(null);
    }
  };

  const formContent = (
    <>
      {/* 入力エリアヘッダー */}
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Typography variant="h6">入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
          onClick={onCloseForm}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* フォーム要素 */}
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => {
              return (
                <ButtonGroup fullWidth>
                  <Button
                    variant={
                      field.value === "expense" ? "contained" : "outlined"
                    }
                    color="error"
                    onClick={incomeExpenseToggle("expense")}
                  >
                    支出
                  </Button>
                  <Button
                    variant={
                      field.value === "income" ? "contained" : "outlined"
                    }
                    color="primary"
                    onClick={incomeExpenseToggle("income")}
                  >
                    収入
                  </Button>
                </ButtonGroup>
              );
            }}
          />

          {/* 日付 */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="日付"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />

          {/* カテゴリ */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="カテゴリ"
                type="select"
                error={!!errors.category}
                helperText={errors.category?.message}
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category.label}>
                    <ListItemIcon>{category.icon}</ListItemIcon>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* 金額 */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value <= 0 ? "" : field.value}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10) || 0;
                  field.onChange(newValue);
                }}
                label="金額"
                type="number"
                error={!!errors.amount}
                helperText={errors.amount?.message}
              />
            )}
          />

          {/* 内容 */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                label="内容"
                type="text"
                {...field}
                error={!!errors.content}
                helperText={errors.content?.message}
              />
            )}
          />

          {/* 保存ボタン */}
          <Button
            type="submit"
            variant="contained"
            color={currentType === "expense" ? "error" : "primary"}
            fullWidth
          >
            {selectedTransaction ? "更新" : "保存"}
          </Button>
          {selectedTransaction && (
            <Button
              onClick={handleDelete}
              variant="outlined"
              color={"secondary"}
              fullWidth
            >
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </>
  );

  return (
    <>
      {isMobile ? (
        // SP
        <Dialog
          open={isDialogOpen}
          onClose={onCloseForm}
          fullWidth
          maxWidth={"sm"}
        >
          <DialogTitle>{formContent}</DialogTitle>
        </Dialog>
      ) : (
        // PC
        <Box
          sx={{
            position: "fixed",
            top: 64,
            right: isEntryDrawerOpen ? formWidth : 0, // フォームの位置を調整
            width: formWidth,
            height: "100%",
            bgcolor: "background.paper",
            zIndex: (theme) => theme.zIndex.drawer - 1,
            transition: (theme) =>
              theme.transitions.create("right", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            p: 2, // 内部の余白
            boxSizing: "border-box", // ボーダーとパディングをwidthに含める
            boxShadow: "0px 0px 15px -5px #777777",
          }}
        >
          {formContent}
        </Box>
      )}
    </>
  );
}
