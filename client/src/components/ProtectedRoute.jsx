import { Navigate, Outlet } from "react-router-dom";


export default function  ProtectedRoute ( {allowedRoles} )  {
  // 1. Get user data from where you stored it (localStorage, State, or Cookies)
  const user = JSON.parse(localStorage.getItem("user")); 
  // 2. Check if user exists (is logged in)
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // 3. Check if user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Send to landing page if not Admin
  }
  // 4. If all checks pass, render the child component (the Sidebar/Dashboard)
  return <Outlet />;
};

