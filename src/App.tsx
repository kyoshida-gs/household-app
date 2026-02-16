import { Route, BrowserRouter, Routes } from "react-router-dom";
// import "@/index.css";
import Home from "@/pages/Home";
import Report from "@/pages/Report";
import NoMatch from "@/pages/NoMatch";
import AppLayout from "./components/layout/AppLayout";
import { theme } from "./theme/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<Report />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
