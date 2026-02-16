import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePoll from "./pages/CreatePoll";
import Poll from "./pages/Poll";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreatePoll />} />
        <Route path="/poll/:id" element={<Poll />} />
      </Routes>
    </BrowserRouter>
  );
}