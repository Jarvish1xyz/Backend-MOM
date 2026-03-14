import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useNotice } from "../../../NoticeContext";
import API from "../../../api";

function UpdateMeeting() {
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const { triggerNotice, triggerConfirm } = useNotice();

    const [allUsers, setAllUsers] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [participants, setParticipants] = useState([""]);
    const [formData, setFormData] = useState({
        title: '',
        id: '',
        date: '',
        time: '',
        agenda: '',
        note: '',
    });

    // 1. Fetch Users & Existing Meeting Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

                const userRes = await API.get("/user/all", { headers });
                setAllUsers(userRes.data);

                const meetingRes = await API.get(`/meeting/details/${id}`, { headers });
                const meeting = meetingRes.data.meeting;

                // 1. Format the date for the HTML input (YYYY-MM-DD)
                let formattedDate = "";
                let formattedTime = "";

                if (meeting.Date) {
                    const d = new Date(meeting.Date);
                    formattedDate = d.toISOString().split('T')[0]; // Result: "2024-05-20"

                    // 2. Extract time if you need to fill the time input
                    formattedTime = d.toTimeString().slice(0, 5); // Result: "14:30"
                }

                setFormData({
                    title: meeting.title || '',
                    id: meeting.meetingid || '', // Note: your model uses 'meetingid'
                    date: formattedDate,         // Mapping model 'Date' to state 'date'
                    time: formattedTime,
                    agenda: meeting.agenda || '',
                    note: meeting.note || '',
                });

                // Set participants...
                if (meeting.members && meeting.calledBy) {
                    const emailsOnly = meeting.members
                        .filter((member) => member.email !== meeting.calledBy.email)
                        .map((member) => member.email); // This converts [ {obj}, {obj} ] to [ "email1", "email2" ]

                    setParticipants(emailsOnly.length > 0 ? emailsOnly : [""]);
                }

            } catch (err) {
                triggerNotice("Failed to load meeting details", "error");
            }
        };
        fetchData();
    }, [id, triggerNotice]);

    // Helper: Filter users for dropdown
    const getFilteredUsers = (query) => {
        if (!query) return [];
        return allUsers.filter(u =>
            (u.email.toLowerCase().includes(query.toLowerCase()) && (u.department === user.department)) ||
            (u.username.toLowerCase().includes(query.toLowerCase()) && (u.department === user.department))
            // (u.email.toLowerCase().includes(query.toLowerCase())) ||
            // (u.username.toLowerCase().includes(query.toLowerCase()))
        ).slice(0, 5);
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const updateParticipant = (index, value) => {
        const updated = [...participants];
        updated[index] = value;
        setParticipants(updated);
    };

    const addParticipant = () => setParticipants([...participants, ""]);

    const removeParticipant = (index) => {
        const updated = participants.filter((_, i) => i !== index);
        setParticipants(updated.length ? updated : [""]);
    };

    // 2. Save Logic with Confirmation
    const handleUpdateSave = () => {
        if (user.role !== "HR" && user.role !== "Admin") {
            triggerNotice("Only HR/Admin can update meetings", "warning");
            return;
        }

        triggerConfirm(
            "Do you want to save the changes to this meeting document?",
            async () => {
                try {
                    const cleanParticipants = participants.filter(p => p !== "");
                    console.log(participants, cleanParticipants);
                    const allMembers = Array.from(new Set([...cleanParticipants, user.email]));

                    await API.patch(`/meeting/update/${id}`, {
                        ...formData,
                        calledBy: user.email,
                        membersEmail: allMembers,
                        isGoogle: localStorage.getItem("isGoogle") === "true",
                    }, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    });

                    triggerNotice("Meeting updated successfully", "success");
                    navigate(`/meeting/${id}`);
                } catch (err) {
                    console.error("Update Error:", err);
                    triggerNotice("Failed to update meeting", "error");
                }
            },
            "primary" // This triggers the blue "Update" theme
        );
    };

    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            handleUpdateSave();
        }
    };

    return (
        <div onKeyDown={handleKeyDown} className="max-w-4xl mx-auto animate-fade-in pb-20 px-4 md:px-0">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Edit Meeting</h1>
                <p className="text-slate-500 font-medium">Review and update meeting details below.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">

                    {/* Section 1: Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Meeting Title</label>
                            <input name="title" value={formData.title} onChange={handleFormChange} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none font-semibold text-slate-700 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference ID</label>
                            <input name="id" value={formData.id} onChange={handleFormChange} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none font-semibold text-slate-700 transition-all" />
                        </div>
                    </div>

                    {/* Section 2: Time & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                            <input name="date" type="date" value={formData.date} onChange={handleFormChange} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-semibold text-slate-700" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                            <input name="time" type="time" value={formData.time} onChange={handleFormChange} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-semibold text-slate-700" />
                        </div>
                    </div>

                    {/* Section 3: Participants */}
                    <div className="pt-6 border-t border-slate-50">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-4">Attendees</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {participants.map((email, i) => (
                                <div key={i} className="relative group">
                                    <div className="flex gap-2 items-center">
                                        <div className="relative flex-1">
                                            <input
                                                value={email}
                                                onChange={(e) => {
                                                    updateParticipant(i, e.target.value);
                                                    setActiveDropdown(i);
                                                }}
                                                onFocus={() => setActiveDropdown(i)}
                                                placeholder="Search name or email..."
                                                className="w-full px-5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                                            />
                                            {activeDropdown === i && email.length > 1 && (
                                                <div className="absolute z-50 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-modal-pop">
                                                    {getFilteredUsers(email).map((u) => (
                                                        <button
                                                            key={u._id}
                                                            type="button"
                                                            onClick={() => {
                                                                updateParticipant(i, u.email);
                                                                setActiveDropdown(null);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                                                        >
                                                            <img src={u.profileImg || `https://ui-avatars.com/api/?name=${u.username}`} className="w-8 h-8 rounded-lg" alt="" />
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-700">{u.username}</p>
                                                                <p className="text-[10px] text-slate-400">{u.email}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {participants.length > 1 && (
                                            <button onClick={() => removeParticipant(i)} className="p-2 text-slate-300 hover:text-red-500 transition-all">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={addParticipant} className="mt-4 text-blue-600 font-bold text-xs uppercase p-2 hover:bg-blue-50 rounded-lg transition-all">+ Add Attendee</button>
                    </div>

                    {/* Section 4: Details */}
                    <div className="pt-6 border-t border-slate-50 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Agenda</label>
                            <textarea name="agenda" value={formData.agenda} onChange={handleFormChange} rows="2" className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none font-semibold text-slate-700 resize-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Meeting Notes</label>
                            <textarea name="note" value={formData.note} onChange={handleFormChange} rows="6" className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none font-semibold text-slate-700 resize-none transition-all" />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50 px-8 py-6 flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-100">
                    <button onClick={() => navigate(-1)} className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all order-2 sm:order-1">
                        Discard Changes
                    </button>
                    <button onClick={handleUpdateSave} className="bg-blue-600 text-white px-10 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all order-1 sm:order-2">
                        Update Meeting
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateMeeting;