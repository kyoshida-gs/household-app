import type { Transaction } from "@/types";
import type { transactionSchema } from "@/validations/schema";
import { createContext } from "react";
import type z from "zod";

interface AppContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;

  onSaveTransaction: (
    transaction: z.input<typeof transactionSchema>,
  ) => Promise<void>;
  onDeleteTransaction: (ids: string | readonly string[]) => Promise<void>;
  onUpdateTransaction: (
    transaction: z.input<typeof transactionSchema>,
    id: string,
  ) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
