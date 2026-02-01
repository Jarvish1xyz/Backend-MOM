import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Layout/Loading";

function Home() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/meeting/mymeetings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setMeeting(res.data.meetings);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  }, []);

  // --- DYNAMIC STATE LOGIC ---
  // We filter the meetings array based on the 'status' field from your backend model
  const pendingCount = meeting.filter(m => m.status === 'Pending').length;
  const doneCount = meeting.filter(m => m.status === 'Done').length;

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Welcome back,{" "}
            <span className="text-blue-600 font-bold">
              {user.email || "User"}
            </span>
          </p>
        </div>
        {(user.role === "HR" || user.role === "Admin") && (
          <button
            onClick={() => navigate("/create")}
            className="group relative flex items-center gap-2 bg-blue-600 text-white px-7 py-3.5 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95"
          >
            <span className="text-xl leading-none">+</span>
            Create Meeting
          </button>
        )}
      </div>

      {/* Stats Grid - Updated with Icons and Dynamic Logic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Meetings",
            value: meeting.length,
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            ),
            color: "text-blue-600",
            bg: "bg-blue-600",
            lightBg: "bg-blue-50",
          },
          {
            label: "Pending Tasks",
            value: pendingCount, // Dynamic Pending Count
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: "text-amber-600",
            bg: "bg-amber-600",
            lightBg: "bg-amber-50",
          },
          {
            label: "Completed",
            value: doneCount, // Dynamic Completed Count
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: "text-emerald-600",
            bg: "bg-emerald-600",
            lightBg: "bg-emerald-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="group relative overflow-hidden bg-white p-7 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500"
          >
            {/* Dynamic Background Glow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.lightBg} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>

            <div className="relative z-10 flex flex-col gap-4">
              {/* Icon Header */}
              <div className={`w-12 h-12 ${stat.lightBg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                {stat.icon}
              </div>

              <div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {stat.label}
                </span>
                <div className="flex items-baseline gap-1">
                  <h2 className={`text-4xl font-black ${stat.color} mt-1 tracking-tight`}>
                    {stat.value}
                  </h2>
                  <span className="text-[10px] font-bold text-slate-300 uppercase italic tracking-tighter">
                    Current
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar Animation */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50">
              <div
                className={`h-full ${stat.bg} opacity-20 w-1/3 group-hover:w-full transition-all duration-1000`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Meetings Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div className="px-10 py-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Recent Sessions
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Last updated: Just now
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
              Live Database
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {meeting.length > 0 ? (
            [...meeting].reverse().map((m, i) => {
              const dateObj = new Date(m.Date);
              return (
                <div
                  key={i}
                  className="px-10 py-6 flex items-center justify-between hover:bg-slate-50/80 transition-all group border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-8">
                    <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:border-blue-300 group-hover:shadow-blue-50 transition-all duration-300">
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter leading-none">
                        {dateObj.toLocaleString("en", { month: "short" })}
                      </span>
                      <span className="text-xl font-bold text-slate-800 leading-none mt-1">
                        {dateObj.getDate()}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 text-lg tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                        {m.title}
                      </h4>

                      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {m.meetingid}
                        </span>
                        <span className="text-slate-200 font-normal">|</span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {/* Added Status Badge in list */}
                        <span className="text-slate-200 font-normal">|</span>
                        <span className={`font-black ${m.status === 'Done' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/meeting/${m.meetingid}`)}
                    className="bg-slate-50 text-slate-500 border border-slate-200 px-5 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300"
                  >
                    View Details
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-bold italic">
                No meetings found. Start by creating one!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;