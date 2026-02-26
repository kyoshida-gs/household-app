import { db } from "@/firebase";
import type { Transaction } from "@/types";
import { isFirestoreError } from "@/utils/errorHandling";
import type { transactionSchema } from "@/validations/schema";
import { useMediaQuery, useTheme } from "@mui/material";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { createContext, useContext, useState } from "react";
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  // 取引データを保存
  const onSaveTransaction = async (
    transaction: z.input<typeof transactionSchema>,
  ) => {
    // console.log("handleSaveTransaction: ", transaction);
    try {
      const docRef = await addDoc(collection(db, "Transactions"), transaction);
      // console.log("Document written with ID: ", docRef.id);

      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction;

      setTransactions((prevTransactions) => [
        ...prevTransactions,
        newTransaction,
      ]);
    } catch (error) {
      if (isFirestoreError(error)) {
        console.error("Firestoreのエラー: ", error);
      } else {
        console.error("一般的なエラー: ", error);
      }
    }
  };

  // 取引データを削除
  const onDeleteTransaction = async (ids: string | readonly string[]) => {
    try {
      const isdToDelete = Array.isArray(ids) ? ids : [ids];
      // console.log("isdToDelete: ", isdToDelete);

      for (const id of isdToDelete) {
        await deleteDoc(doc(db, "Transactions", id));
      }

      const filteredTransactions = transactions.filter(
        (transaction) => !isdToDelete.includes(transaction.id),
      );
      setTransactions(filteredTransactions);
    } catch (error) {
      if (isFirestoreError(error)) {
        console.error("Firestoreのエラー: ", error);
      } else {
        console.error("一般的なエラー: ", error);
      }
    }
  };
  // console.log("monthlyTransactions", monthlyTransactions);

  // 取引データを更新
  const onUpdateTransaction = async (
    transaction: z.input<typeof transactionSchema>,
    id: string,
  ) => {
    try {
      const docRef = doc(db, "Transactions", id);

      await updateDoc(docRef, transaction);

      const updatedTransactions = transactions.map((t) => {
        return t.id === id ? { ...t, ...transaction } : t;
      }) as Transaction[];

      setTransactions(updatedTransactions);
      // console.log("updatedTransactions: ", updatedTransactions);
    } catch (error) {
      if (isFirestoreError(error)) {
        console.error("Firestoreのエラー: ", error);
      } else {
        console.error("一般的なエラー: ", error);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        setTransactions,
        currentMonth,
        setCurrentMonth,
        isLoading,
        setIsLoading,
        isMobile,
        onSaveTransaction,
        onDeleteTransaction,
        onUpdateTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
