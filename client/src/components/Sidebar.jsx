// Sidebar.jsx
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  ClipboardList,
  BarChart3,
  UserCircle2,
  LogOut,
  ChevronUp,
  Users,
  School,
} from "lucide-react";
import { me } from "../services/APIs/auth.api.js";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard"          },
  { to: "/students",  icon: Users,           label: "Student Management" },
  { to: "/reports",   icon: School,          label: "Teacher Management" },
  { to: "/category",  icon: BookOpen,        label: "Courses"            },
  { to: "/purchase",  icon: ClipboardList,   label: "Enrollments"        },
  { to: "/inventory", icon: BarChart3,       label: "Grades"             },
];

export default function Sidebar() {
  const [expanded,     setExpanded]     = useState(false);
  const [showDropUp,   setShowDropUp]   = useState(false);
  const [userName,     setUserName]     = useState("");
  const [userEmail,    setUserEmail]    = useState("");
  const dropRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await me();
        setUserName(user.data?.name  ?? "");
        setUserEmail(user.data?.email ?? "");
      } catch { /* silently ignore */ }
    };
    fetchUser();
  }, []);

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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => { setExpanded(false); setShowDropUp(false); }}
      className={`
        relative flex flex-col h-screen bg-[#111E48] text-white
        transition-all duration-300 ease-in-out shrink-0
        ${expanded ? "w-64" : "w-[68px]"}
      `}
    >
      {/* ── Logo / Brand ── */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 overflow-hidden">
        {/* Icon mark — always visible */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-[#111E48] border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
          <GraduationCap size={20} className="text-white" />
        </div>
        {/* Text — fades in on expand */}
        <div className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
          <p className="text-sm font-bold tracking-wide leading-none">EduSystem</p>
          <p className="text-[10px] text-white/40 mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex flex-col gap-1 flex-1 px-2 py-4 overflow-hidden">
        {/* Section label */}
        <p className={`text-[9px] font-bold uppercase tracking-widest text-white/30 px-2 mb-2 transition-all duration-200 whitespace-nowrap overflow-hidden ${expanded ? "opacity-100" : "opacity-0"}`}>
          Main Menu
        </p>

        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={!expanded ? label : undefined}  /* tooltip when collapsed */
            className={({ isActive }) => `
              group relative flex items-center gap-3 px-2.5 py-2.5 rounded-xl
              transition-all duration-150 overflow-hidden whitespace-nowrap
              ${isActive
                ? "bg-white/15 text-white shadow-inner"
                : "text-white/60 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-400 rounded-r-full" />
                )}

                <Icon
                  size={20}
                  className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-white/50 group-hover:text-white"}`}
                />

                <span className={`text-sm font-medium transition-all duration-200 ${expanded ? "opacity-100" : "opacity-0 w-0"}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Profile section ── */}
      <div
        className="relative mt-auto px-2 pb-3 pt-3 border-t border-white/10 overflow-hidden"
        ref={dropRef}
      >
        {/* Drop-up menu */}
        {showDropUp && expanded && (
          <div className="absolute bottom-full left-2 right-2 mb-2 bg-[#1a2d5a] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs font-semibold text-white truncate">{userName}</p>
              <p className="text-[11px] text-white/40 truncate">{userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        )}

        {/* User button */}
        <button
          onClick={() => expanded && setShowDropUp((p) => !p)}
          title={!expanded ? userName : undefined}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/10 transition-colors text-left overflow-hidden"
        >
          {/* Avatar circle */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow">
            {userName?.[0]?.toUpperCase() ?? <UserCircle2 size={18} />}
          </div>

          <div className={`flex-1 min-w-0 transition-all duration-200 ${expanded ? "opacity-100" : "opacity-0 w-0"}`}>
            <p className="text-sm font-semibold text-white truncate leading-none">{userName}</p>
            <p className="text-[11px] text-white/40 truncate mt-0.5">{userEmail}</p>
          </div>

          <ChevronUp
            size={15}
            className={`text-white/40 shrink-0 transition-all duration-200 ${expanded ? "opacity-100" : "opacity-0"} ${showDropUp ? "" : "rotate-180"}`}
          />
        </button>
      </div>
    </div>
  );
}