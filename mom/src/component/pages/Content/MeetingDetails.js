import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../Layout/Loading";

const MeetingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [meeting, setMeeting] = useState(null);
    const [dateObj, setDateObj] = useState(null);

    useEffect(() => {
        axios.get(`/meeting/details/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                setMeeting(res.data);
                setDateObj(new Date(res.data.Date));
                console.log(res.data);
            })
            .catch(err => console.error(err));
    }, [id]);

    if (!meeting) return <Loading />;

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

            {/* Top Navigation / Actions */}
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors group"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    Back to Dashboard
                </button>

                <div className="flex gap-3">
                    <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Print PDF
                    </button>
                </div>
            </div>

            {/* Main Document Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">

                {/* Document Header */}
                <div className="p-10 border-b border-slate-100 bg-slate-50/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                Official Minutes
                            </span>
                            <h1 className="text-4xl font-black text-slate-800 mt-4 tracking-tight">
                                {meeting.title}
                            </h1>
                            <p className="text-slate-500 font-medium mt-2 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {dateObj.toLocaleString('en', { month: 'short' })}-{dateObj.getDate()}-{dateObj.getFullYear()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference ID</p>
                            <p className="text-lg font-bold text-slate-700">{meeting.meetingid}</p>
                        </div>
                    </div>
                </div>

                {/* Document Body */}
                <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Sidebar Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Organized By</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                                    {meeting.calledBy.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{meeting.calledBy.email}</p>
                                    <p className="text-[10px] font-medium text-slate-400">Meeting Coordinator</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Attendees ({meeting.members?.length})</h3>
                            <div className="flex flex-col gap-2">
                                {meeting.members?.map((member, idx) => (
                                    <div key={idx} className="flex items-center gap-2 ...">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        <span className="text-xs font-semibold text-slate-600">
                                            {typeof member === 'object' ? member.email : member}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        <section>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-slate-200"></span> Agenda
                            </h3>
                            <p className="text-slate-700 leading-relaxed font-medium bg-blue-50/30 p-6 rounded-2xl border border-blue-50 italic">
                                "{meeting.agenda}"
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-slate-200"></span> Discussion & Notes
                            </h3>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-600 leading-loose whitespace-pre-wrap">
                                    {meeting.note}
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Branding */}
                <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Generated by MOMPro Enterprise Systems</p>
                </div>
            </div>
        </div>
    );
};

export default MeetingDetails;