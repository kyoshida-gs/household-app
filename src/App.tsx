import { Route, BrowserRouter, Routes } from "react-router-dom";
import "@/index.css";
import Home from "@/pages/Home";
import Report from "@/pages/Report";
import NoMatch from "@/pages/NoMatch";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}
