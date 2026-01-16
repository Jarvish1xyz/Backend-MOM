import { useEffect, useState } from "react";
// import Sidebar from "./Sidebar";
// import './Navbar.css';

function Navbar({ onLineClick, isOpen }) {
  const [islogo, setIslogo] = useState(false);

  const change = () => {
    setIslogo(!islogo);
    onLineClick();
  };
  
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") change(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [islogo]);

  return (
    <nav className="fixed top-0 w-full h-11 bg-white border-b border-slate-200 flex items-center px-4 z-50">
      <div className="flex items-center gap-4">
        <div onClick={change} className="cursor-pointer space-y-1.5 p-2 hover:bg-slate-100 rounded-lg transition-all">
          <div className={`h-0.5 w-5 bg-blue-600 rounded-full transition-all ${islogo ? "rotate-45 translate-y-[7px]" : ""}`}></div>
          <div className={`h-0.5 w-5 bg-blue-600 rounded-full transition-all ${islogo ? "opacity-0" : ""}`}></div>
          <div className={`h-0.5 w-5 bg-blue-600 rounded-full transition-all ${islogo ? "-rotate-45 -translate-y-[7px]" : ""}`}></div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded shadow-inner flex items-center justify-center text-white font-bold text-[10px]">MOM</div>
          <span className="font-bold text-slate-800 tracking-tight">Portal<span className="text-blue-600 text-xs ml-1 font-black">PRO</span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;