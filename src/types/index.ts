export type TransactionType = "income" | "expense";
export type IncomeCategoryType = "給与" | "副業" | "お小遣い";
export type ExpenseCategoryType =
  | "食費"
  | "日用品"
  | "居住費"
  | "交際費"
  | "娯楽"
  | "交通費";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  content: string;
  type: TransactionType;
  category: IncomeCategoryType | ExpenseCategoryType;
}

export interface Balance {
  income: number;
  expense: number;
  balance: number;
}
