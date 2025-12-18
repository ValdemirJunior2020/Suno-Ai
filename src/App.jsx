// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import MediaExamples from "./pages/MediaExamples.jsx";
import OrderFlow from "./pages/OrderFlow.jsx";
import Success from "./pages/Success.jsx"; // ✅ add

export default function App() {
  return (
    <div className="page">
      <div className="overlay">
        <div className="container">
          <Navbar />

          <Routes>
            <Route path="/" element={<Navigate to="/order" replace />} />
            <Route path="/order" element={<OrderFlow />} />
            <Route path="/media" element={<MediaExamples />} />
            <Route path="/success" element={<Success />} /> {/* ✅ add */}
            <Route path="*" element={<Navigate to="/order" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
