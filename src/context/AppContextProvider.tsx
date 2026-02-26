import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import type z from "zod";
import type { transactionSchema } from "@/validations/schema";

import type { Transaction } from "@/types";
import { isFirestoreError } from "@/utils/errorHandling";
import { AppContext } from "./AppContext";

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
