import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
<BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/**
           <Route path ="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute> } />
         */}    
      </Routes>
    </BrowserRouter>
);
