import { useEffect, useState } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
// import "@/index.css";

import Home from "@/pages/Home";
import Report from "@/pages/Report";
import NoMatch from "@/pages/NoMatch";
import AppLayout from "./components/layout/AppLayout";
import { theme } from "./theme/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

import type { Transaction } from "./types";
import { formatMonth } from "./utils/formatting";

import type { z } from "zod";
import type { transactionSchema } from "./validations/schema";

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  function isFirestoreError(
    err: unknown,
  ): err is { code: string; message: string } {
    return typeof err === "object" && err !== null && "code" in err;
  }

  // Firestoreからデータを取得
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Transactions"));

        const transactionsData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction;
        });

        setTransactions(transactionsData);
      } catch (error) {
        if (isFirestoreError(error)) {
          console.error("Firestoreのエラー: ", error);
        } else {
          console.error("一般的なエラー: ", error);
        }
      }
    };
    fetchTransactions();
  }, []);

  // 月ごとのデータを取得
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

  // 取引データを保存
  const handleSaveTransaction = async (
    transaction: z.input<typeof transactionSchema>,
  ) => {
    // console.log("handleSaveTransaction: ", transaction);
    try {
      const docRef = await addDoc(collection(db, "Transactions"), transaction);
      console.log("Document written with ID: ", docRef.id);

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
  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Transactions", id));
      const filterdTransactions = transactions.filter(
        (transaction) => transaction.id !== id,
      );
      setTransactions(filterdTransactions);
      console.log("Document deleted with ID: ", id);
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
  const handleUpdateTransaction = async (
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
      console.log("updatedTransactions: ", updatedTransactions);
    } catch (error) {
      if (isFirestoreError(error)) {
        console.error("Firestoreのエラー: ", error);
      } else {
        console.error("一般的なエラー: ", error);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route
              path="/"
              element={
                <Home
                  monthlyTransactions={monthlyTransactions}
                  setCurrentMonth={setCurrentMonth}
                  onSaveTransaction={handleSaveTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                  onUpdateTransaction={handleUpdateTransaction}
                />
              }
            />
            <Route path="/report" element={<Report />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
