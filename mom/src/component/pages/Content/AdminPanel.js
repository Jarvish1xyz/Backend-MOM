import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Layout/Loading";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [view, setView] = useState("HR"); // Default view
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/admin/all-users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const viewDetail = (id) => {
    navigate(`/userprofile/${id}`);
  };

  // Filter logic happens on the fly based on the 'view' state
  const filteredUsers = users.filter((user) => user.role === view);

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* 1. Page Title */}
      <div className="text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Admin Control Center
        </h1>
        <p className="text-slate-500 font-medium mt-2 italic">
          Manage and monitor organizational roles
        </p>
      </div>

      {/* 2. Side-by-Side Toggle Options */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-[2.5rem] flex gap-2 border border-slate-200 shadow-inner">
          <button
            onClick={() => setView("HR")}
            className={`flex cursor-pointer items-center gap-3 px-12 py-4 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 ${
              view === "HR"
                ? "bg-white text-blue-600 shadow-xl shadow-blue-900/10 scale-105"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${view === "HR" ? "bg-blue-600 animate-pulse" : "bg-slate-300"}`}
            ></div>
            HR
          </button>

          <button
            onClick={() => setView("Employee")}
            className={`flex cursor-pointer items-center gap-3 px-12 py-4 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 ${
              view === "Employee"
                ? "bg-white text-emerald-600 shadow-xl shadow-emerald-900/10 scale-105"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${view === "Employee" ? "bg-emerald-600 animate-pulse" : "bg-slate-300"}`}
            ></div>
            Employees
          </button>
        </div>
      </div>

      {/* 3. Dynamic Content List */}
      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/50">
        {/* Sub-header inside the list card */}
        <div
          className={`px-12 py-8 border-b border-slate-100 flex justify-between items-center transition-colors duration-500 ${view === "HR" ? "bg-blue-50/20" : "bg-emerald-50/20"}`}
        >
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {view === "HR"
                ? "Human Resource Department"
                : "General Employee Base"}
            </h2>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">
              Total Personnel: {filteredUsers.length}
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-2xl border font-black text-[10px] uppercase tracking-tighter ${view === "HR" ? "bg-blue-100/50 text-blue-700 border-blue-200" : "bg-emerald-100/50 text-emerald-700 border-emerald-200"}`}
          >
            Admin Access Only
          </div>
        </div>

        <div className="divide-y divide-slate-50 min-h-[400px]">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u, i) => (
              <div
                key={i}
                className="px-12 py-8 flex items-center justify-between hover:bg-slate-50/80 transition-all group"
              >
                <div className="flex items-center gap-8">
                  {/* Dynamic User Badge */}
                  <div
                    className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl font-black text-white shadow-2xl transition-transform group-hover:rotate-6 ${view === "HR" ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-200" : "bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-200"}`}
                  >
                    {u.email.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-xl font-bold text-slate-800 tracking-tight">
                      {u.email} - {u.username}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Access Level:
                      </span>
                      <span
                        className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${view === "HR" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}
                      >
                        {u.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => viewDetail(u.userid)}
                    className="bg-slate-900 cursor-pointer text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center">
              <p className="text-slate-300 font-black italic text-xl uppercase tracking-tighter opacity-50">
                No users registered under {view} category
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
