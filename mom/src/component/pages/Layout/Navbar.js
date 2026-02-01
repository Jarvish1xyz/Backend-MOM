import { useEffect, useState } from "react";
// import Sidebar from "./Sidebar";
// import './Navbar.css';

function Navbar({ onLineClick }) {
  const [islogo, setIslogo] = useState(false);

  const change = () => {
    setIslogo(!islogo);
    onLineClick();
  };

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") change(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  },);

  return (
    <nav className="fixed top-0 w-full h-11 bg-white border-b border-slate-200 flex items-center px-4 z-50">
      <div className="flex items-center gap-4">
        <div onClick={change} className="cursor-pointer space-y-1.5 p-2 hover:bg-slate-100 rounded-lg transition-all">
          <div className={`h-0.5 w-5 bg-blue-600 rounded-full transition-all ${islogo ? "rotate-45 translate-y-2" : ""}`}></div>
          <div className={`h-0.5 w-5 bg-blue-600 rounded-full transition-all ${islogo ? "opacity-0" : ""}`}></div>
          <div className={`h-0.5 w-5 bg-blue-600 rounded-full transition-all ${islogo ? "-rotate-45 -translate-y-2" : ""}`}></div>
        </div>

        {/* Logo Section */}
        <div className="flex items-center gap-3 select-none">
          <div className="flex items-center justify-center transition-transform hover:scale-110 duration-200">
            <svg
              viewBox="80 80 80 80"
              className="w-7 h-7 drop-shadow-[0_2px_4px_rgba(37,99,235,0.2)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" /> {/* Vivid Blue */}
                  <stop offset="100%" stopColor="#3b82f6" /> {/* Brighter Sky Blue */}
                </linearGradient>
              </defs>

              <path
                fill="url(#logoGradient)"
                d="M149.8 85.7c.9.3.7 1.2-.8 3.3-1.9 2.6-2 4.4-2 27.9 0 19.9-.3 25.1-1.3 25.1-3.3 0-3.7-2.3-3.7-23.2 0-11.4-.3-20.8-.6-20.8-.4 0-5.6 4.7-11.5 10.5-6 5.8-11.5 10.5-12.2 10.5-.6 0-6.1-4.7-12.2-10.5-6-5.8-11.3-10.5-11.7-10.5-.5 0-.8 9.4-.8 20.8 0 20.9-.4 23.2-3.7 23.2-1 0-1.3-4.8-1.4-22.8-.1-12.5-.4-21.7-.6-20.5-.2 1.3-1.1 2.3-1.9 2.3-1 0-1.4-1.4-1.6-5.3-.3-10.2-1.6 14.7-1.7 33.5L82 148l2.8.2c6.6.4 8.7-.3 13-4.4 2.9-3 4.2-5 4.2-7 0-1.8-.5-2.8-1.5-2.8-1.2 0-1.5-1.9-1.5-11.5 0-6.3.4-11.5.9-11.5s1.1.3 1.3.7c.2.5 4 4.3 8.4 8.6l8.2 7.8 8.5-8.1c4.8-4.5 9.1-7.9 9.7-7.5.6.3 1 4.7 1 10.1 0 8.2-.3 9.6-2 11.1-3.1 2.7-2.4 5.1 2.8 9.9 4.3 4 5.1 4.4 10 4.4h5.2v-26.3c0-30.3-.5-36.7-2.9-36.6-1 0-1.2.2-.3.6"
              />
              <path
                fill="url(#logoGradient)"
                fillOpacity="0.9"
                d="M136.5 90c-.5.5-5 4.6-9.8 9.1l-8.9 8.1-2.6-2.3c-1.4-1.3-4.4-4.1-6.6-6.1-3.2-2.9-4.4-3.5-5.8-2.7-2.5 1.3-1.5 2.8 7.5 11.7l7.4 7.3 10.9-11.1c10-10.2 12.5-13.9 9.9-14.6-.5-.2-1.4.1-2 .6m-32.4 36.7c0 3.4.9 4.5 7 10.2l7 6.4 6.5-6.4c5.7-5.7 6.4-6.7 6.4-10.3v-4l-6.3 6.2c-3.4 3.4-6.6 6.2-7 6.2s-3.5-2.7-6.9-6-6.3-6-6.5-6-.3 1.7-.2 3.7"
              />
            </svg>
          </div>

          <span className="text-xl font-black text-slate-800 tracking-tight flex items-center">
            MOM<span className="text-blue-600">Pro</span>
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;