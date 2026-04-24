import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentsPage from "./pages/Student";

// ✅ Inline layout — Sidebar + page content side by side
function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* ADMIN ROUTES — all wrapped in Sidebar layout */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/students" element={<StudentsPage />} />
          {/* add more routes here */}
        </Route>
      </Route>

    </Routes>
  </BrowserRouter>
);