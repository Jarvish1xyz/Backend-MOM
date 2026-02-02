import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Layout/Loading";

function StarredMeetings() {
  const navigate = useNavigate();
  const [starredMeetings, setStarredMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We assume your backend has an endpoint for starred items
    // or you can filter them from all meetings
    axios
      .get("/meeting/mymeetings/starred", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        // Filtering only the starred ones
        const starred = res.data.meetings.filter(m => m.isStarred);
        setStarredMeetings(starred);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Starred</h1>
            <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mt-1">
               Favorites
            </span>
          </div>
          <p className="text-slate-500 font-medium mt-1">
            Access your most important meeting minutes quickly.
          </p>
        </div>
        <button 
          onClick={() => navigate("/")}
          className="text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dashboard
        </button>
      </div>

      {/* Starred List Card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-10 py-7 border-b border-slate-100 bg-amber-50/30 flex items-center gap-3">
           <svg className="w-6 h-6 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
           <h2 className="text-xl font-black text-slate-800 tracking-tight">Priority Sessions</h2>
        </div>

        <div className="divide-y divide-slate-50">
          {starredMeetings.length > 0 ? (
            starredMeetings.map((m, i) => {
              const dateObj = new Date(m.Date);
              return (
                <div key={i} className="px-10 py-6 flex items-center justify-between hover:bg-slate-50/80 transition-all group">
                  <div className="flex items-center gap-8">
                    <div className="w-14 h-14 bg-white border border-amber-100 rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:border-amber-300 transition-all">
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-tighter">{dateObj.toLocaleString('en', {month:'short'})}</span>
                      <span className="text-xl font-bold text-slate-800 mt-1">{dateObj.getDate()}</span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800 text-lg tracking-tight group-hover:text-amber-600 transition-colors">
                        {m.title}
                      </h4>
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
                        <span className="flex items-center gap-1.5">{m.meetingid}</span>
                        <span className="text-slate-200">|</span>
                        <span className={`font-black ${m.status === 'Done' ? 'text-emerald-500' : 'text-amber-500'}`}>{m.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/meeting/${m.meetingid}`)} 
                    className="bg-white text-slate-600 border border-slate-200 px-5 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all shadow-sm"
                  >
                    Open Minutes
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              </div>
              <p className="text-slate-400 font-bold italic tracking-tight">No starred meetings yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StarredMeetings;