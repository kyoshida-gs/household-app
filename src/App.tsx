import { Route, BrowserRouter, Routes } from "react-router-dom";
// import "@/index.css";
import Home from "@/pages/Home";
import Report from "@/pages/Report";
import NoMatch from "@/pages/NoMatch";
import AppLayout from "./components/layout/AppLayout";
import { theme } from "./theme/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import type { Transaction } from "./types";
import { formatMonth } from "./utils/formatting";

export default function App() {
  function isFirestoreError(
    err: unknown,
  ): err is { code: string; message: string } {
    return typeof err === "object" && err !== null && "code" in err;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

        console.log(transactionsData);
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

  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });
  console.log("monthlyTransactions", monthlyTransactions);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route
              path="/"
              element={<Home monthlyTransactions={monthlyTransactions} />}
            />
            <Route path="/report" element={<Report />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
