import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Home, Package, BarChart, ShoppingCart, Boxes, UserCircle, LogOut, ChevronUp } from "lucide-react";
import {me} from "../services/APIs/auth.api.js"
export default function Sidebar() {
  const [showDropUp, setShowDropUp] = useState(false);
  const [userName, setUserName] = useState(" ");
  const [userEmail, setUserEmail] = useState(" ");
  const dropRef = useRef(null);

   const fetchUserData = async () =>  { 
    const user = await me();
    setUserName(user.data?.name);
    setUserEmail(user.data?.email);
  };
useEffect(() => {

 fetchUserData();
} , []);
  // Close drop-up when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setShowDropUp(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      // Redirect or update auth state after logout
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 p-2 rounded-lg transition-colors ${
      isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
    }`;

  return (
    <div className="w-64 bg-[#111E48] text-white h-screen p-5 flex flex-col">
      <h1 className="text-2xl font-bold mb-8"></h1>

      {/* Nav Links */}
      <nav className="flex flex-col gap-4 flex-1">
        <NavLink to="/dashboard" className={navLinkClass}>
          <Home size={20} /> Dashboard
        </NavLink>

        <NavLink to="/products" className={navLinkClass}>
          <Package size={20} /> Student Management
        </NavLink>

        <NavLink to="/reports" className={navLinkClass}>
          <BarChart size={20} /> Teacher Management
        </NavLink>

        <NavLink to="/category" className={navLinkClass}>
          <Boxes className="w-5 h-5" /> Courses
        </NavLink>

        <NavLink to="/purchase" className={navLinkClass}>
          <ShoppingCart className="w-5 h-5" /> Enrollments
        </NavLink>

        <NavLink to="/inventory" className={navLinkClass}>
          <Boxes className="w-5 h-5" /> Grades
        </NavLink>
      </nav>

      {/* Profile Section — pinned to bottom */}
      <div className="relative mt-auto pt-4 border-t border-white/10" ref={dropRef}>

        {/* Drop-up Card */}
        {showDropUp && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1a2d5a] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-fade-in">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}

        {/* User Info Button */}
        <button
          onClick={() => setShowDropUp((prev) => !prev)}
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors text-left"
        >
          <UserCircle className="w-9 h-9 text-gray-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{userName}</p>
            <p className="text-xs text-gray-400 truncate">{userEmail}</p>
          </div>
          <ChevronUp
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${
              showDropUp ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}