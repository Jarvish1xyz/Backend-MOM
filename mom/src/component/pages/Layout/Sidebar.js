import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ isCollapsed, onLogout }) {
  const user = JSON.parse(localStorage.getItem("user") || "");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout(); // Triggers handleAuthChange in App.js
    navigate("/auth");
  };

  return (
    <div className="h-full flex flex-col py-6 bg-white transition-all duration-300">
      {/* 🚀 MAIN MENU */}
      <div className="px-3 space-y-2 flex-1">
        {/* Home Button */}
        <button
          onClick={() => navigate("/")}
          className={`cursor-pointer flex items-center rounded-xl transition-all duration-200 group w-full py-3
            ${isCollapsed ? "justify-center px-0" : "gap-6 px-4"} 
            ${pathname === "/" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"}`}
        >
          <svg
            className={`w-5 h-5 shrink-0 transition-colors ${pathname === "/" ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          {!isCollapsed && (
            <span className="text-sm font-bold tracking-tight">Dashboard</span>
          )}
        </button>

        {/* Starred Button */}
        {user.role !== "Admin" && (
          <button
            onClick={() => navigate("/starred")}
            className={`cursor-pointer flex items-center rounded-xl transition-all duration-200 group w-full py-3
            ${isCollapsed ? "justify-center px-0" : "gap-6 px-4"} 
            ${pathname === "/starred" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"}`}
          >
            <svg
              className={`w-5 h-5 shrink-0 transition-colors ${pathname === "/starred" ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            {!isCollapsed && (
              <span className="text-sm font-bold tracking-tight">Starred</span>
            )}
          </button>
        )}

        {/* Profile Button */}
        <button
          onClick={() => navigate("/profile")}
          className={`cursor-pointer flex items-center rounded-xl transition-all duration-200 group w-full py-3
            ${isCollapsed ? "justify-center px-0" : "gap-6 px-4"} 
            ${pathname === "/profile" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"}`}
        >
          <svg
            className={`w-5 h-5 shrink-0 transition-colors ${pathname === "/profile" ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          {!isCollapsed && (
            <span className="text-sm font-bold tracking-tight">Profile</span>
          )}
        </button>
      </div>

      {/* 🚪 LOGOUT SECTION */}
      <div className="mt-auto px-3 pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className={`cursor-pointer flex items-center w-full py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200
            ${isCollapsed ? "justify-center px-0" : "gap-6 px-4"}`}
        >
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7"
            />
          </svg>
          {!isCollapsed && (
            <span className="text-xs font-black uppercase tracking-widest">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
