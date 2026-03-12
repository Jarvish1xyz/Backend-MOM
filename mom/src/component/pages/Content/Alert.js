const Notice = ({ message, type, onClose }) => {
  const themes = {
    error: "border-red-200 bg-red-50 text-red-700 shadow-red-100",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-100",
    warning: "border-amber-200 bg-amber-50 text-amber-700 shadow-amber-100",
    info: "border-blue-200 bg-blue-50 text-blue-700 shadow-blue-100"
  };

  return (
    <div className={`fixed top-6 right-6 z-[999] flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-2xl animate-in slide-in-from-right-8 duration-300 ${themes[type]}`}>
      <div className="flex flex-col">
        <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-0.5">{type}</p>
        <p className="text-sm font-bold">{message}</p>
      </div>
      <button onClick={onClose} className="hover:rotate-90 transition-transform p-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Notice;