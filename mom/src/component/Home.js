import { useNavigate } from "react-router-dom";
// import "./Home.css";
// import SearchMeeting from "./SearchMeeting";
import { useEffect, useState } from "react";
import axios from "axios";


function Home() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState([]);

  useEffect(() => {
    axios.get("/meeting/all", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: { email: user.email }
    }).then(res => setMeeting(res.data)).catch(err => console.log(err.message));
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 font-medium">Monitoring {user.email}'s activity</p>
        </div>
        {(user.role === "HR" || user.role === "Admin") && (
          <button onClick={() => navigate('/create')} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-0.5 active:translate-y-0">
            Create Meeting
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-6">
        {["Total", "Pending", "Done", "Next"].map((title, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">{meeting.length}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Recent Meetings</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Live Database</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {meeting.map((m, i) => {
            const dateObj = new Date(m.Date);
            return (
              <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[9px] font-black text-blue-600 uppercase leading-none">{dateObj.toLocaleString('en', {month:'short'})}</span>
                    <span className="text-xl font-black text-slate-800 leading-none mt-1">{dateObj.getDate()}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{m.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-1">
                      <span>#{m.meetingid}</span>
                      <span>•</span>
                      <span>{dateObj.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                </div>
                <button className="bg-slate-100 text-slate-600 px-5 py-2 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all">Details</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;