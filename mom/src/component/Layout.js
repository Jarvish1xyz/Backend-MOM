// Layout.js
import { Outlet } from "react-router-dom";
// import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
// import "./Layout.css";
import { useState } from "react";

function Layout({ onLogout }) {
  const [isside, setIsside] = useState(false);
  const change = () => setIsside(!isside);

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      <Navbar onLineClick={change} isOpen={isside} />

      <div className="flex flex-1 overflow-hidden mt-11">
        {/* SIDEBAR TERNARY WIDTH */}
        <div className={`transition-all duration-300 border-r border-slate-200 bg-white ${isside ? "w-60" : "w-16"}`}>
          <Sidebar isCollapsed={!isside} onLogout={onLogout} />
        </div>

        {/* CONTENT TERNARY PADDING */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
