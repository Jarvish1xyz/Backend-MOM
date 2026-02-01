import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Layout/Loading";

function Home() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/meeting/mymeetings", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(res => {
      setMeeting(res.data.meetings);
      setLoading(false);
    }).catch(err => {
      console.log(err.message);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">
            Welcome back, <span className="text-blue-600 font-bold">{user.email || 'User'}</span>
          </p>
        </div>
        {(user.role === "HR" || user.role === "Admin") && (
          <button 
            onClick={() => navigate('/create')} 
            className="group relative flex items-center gap-2 bg-blue-200 text-blue-700 hover:text-white px-7 py-3.5 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all hover:-translate-y-1"
          >
            <span className="text-xl leading-none">+</span>
            Create Meeting
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Meetings", value: meeting.length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending Tasks", value: "0", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Completed", value: meeting.length, color: "text-emerald-600", bg: "bg-emerald-50" }
        ].map((stat, i) => (
          <div key={i} className="relative overflow-hidden bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-all group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-[4rem] opacity-40 group-hover:scale-110 transition-transform`}></div>
            <span className="relative z-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">{stat.label}</span>
            <h2 className={`relative z-10 text-4xl font-black ${stat.color} mt-2 tracking-tight`}>{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Recent Meetings Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div className="px-10 py-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Recent Sessions</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Last updated: Just now</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Live Database</span>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {meeting.length > 0 ? (
            [...meeting].reverse().map((m, i) => {
              const dateObj = new Date(m.Date);
              return (
                <div key={i} className="px-10 py-7 flex items-center justify-between hover:bg-slate-50/80 transition-all group">
                  <div className="flex items-center gap-8">
                    {/* Date Icon */}
                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-[1.25rem] flex flex-col items-center justify-center shadow-sm group-hover:border-blue-200 group-hover:shadow-blue-50 transition-all">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{dateObj.toLocaleString('en', {month:'short'})}</span>
                      <span className="text-2xl font-black text-slate-800 leading-none mt-1">{dateObj.getDate()}</span>
                    </div>

                    <div>
                      <h4 className="font-black text-slate-800 text-xl tracking-tight group-hover:text-blue-600 transition-colors">
                        {m.title}
                      </h4>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                          {m.meetingid}
                        </span>
                        <span className="text-slate-200 font-normal">|</span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {dateObj.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/meeting/${m.meetingid}`)} 
                    className="bg-slate-50 text-slate-400 border border-slate-200 px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-[0.1em] hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-100 transition-all"
                  >
                    View Details
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-bold italic">No meetings found. Start by creating one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;