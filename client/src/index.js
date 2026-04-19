import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route  , Navigate, Outlet} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import  Sidebar  from "./components/Sidebar"
import ProtectedRoute from "./components/ProtectedRoute"
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
<BrowserRouter>
      <Routes>
        ///<Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        {/**ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/sidebar" element={<Sidebar />} />
          // can addd more routes here 
        </Route>

      </Routes>
    
    </BrowserRouter>
);
