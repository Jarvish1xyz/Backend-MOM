import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateMOM() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  
  const [participants, setParticipants] = useState([""]);
  const [formData, setFormData] = useState({
    title: '',
    id: '',
    date: '',
    time: '',
    agenda: '',
    note: '',
  });

  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateParticipant = (index, value) => {
    const updated = [...participants];
    updated[index] = value;
    setParticipants(updated);
  };

  const addParticipant = () => setParticipants([...participants, ""]);

  // Logic to update all users (linked to the meeting)
  const updateUserLinks = async (meetingId, allMembers) => {
    try {
      // Loop through every member and link the meeting to their profile
      const promises = allMembers.map(memberEmail => 
        axios.patch(`/user/meeting/update/`, {
          email: memberEmail,
          meetingid: meetingId
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
      );
      await Promise.all(promises); // Wait for ALL updates to finish
    } catch (err) {
      console.error("Error linking users:", err.message);
    }
  };

  const save = async () => {
    try {
      if (user.role !== "HR" && user.role !== "Admin") {
        alert("Only HR/Admin can create meetings");
        return navigate('/');
      }

      // Filter empty emails and add creator if not already there
      const cleanParticipants = participants.filter(p => p.trim() !== "");
      const allMembers = Array.from(new Set([...cleanParticipants, user.email]));

      // 1. Create the Meeting
      await axios.post("/meeting/add", {
        ...formData,
        calledByEmail: user.email,
        membersEmail: allMembers
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // 2. IMPORTANT: Wait for the user links to finish before leaving!
      await updateUserLinks(formData.id, allMembers);

      // 3. Navigate only after everything is successful
      navigate("/");
    } catch (err) {
      console.error("Save Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Create Meeting</h1>
        <p className="text-slate-500 font-medium">Document the discussion, decisions, and action items.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Meeting Title</label>
              <input name="title" value={formData.title} onChange={handelChange} placeholder="e.g. Quarterly Product Review" className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-semibold text-slate-700 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference ID</label>
              <input name="id" value={formData.id} onChange={handelChange} placeholder="e.g. MOM-2024-001" className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-semibold text-slate-700 transition-all" />
            </div>
          </div>

          {/* Section 2: Time & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
              <input name="date" type="date" value={formData.date} onChange={handelChange} className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-semibold text-slate-700 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
              <input name="time" type="time" value={formData.time} onChange={handelChange} className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-semibold text-slate-700 transition-all" />
            </div>
          </div>

          {/* Section 3: Participants */}
          <div className="pt-6 border-t border-slate-50">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-4">Attendees</label>
            <div className="space-y-3">
              {participants.map((email, i) => (
                <div key={i} className="flex gap-2 animate-in slide-in-from-left-2 duration-300">
                  <input 
                    value={email} 
                    onChange={(e) => updateParticipant(i, e.target.value)} 
                    placeholder="colleague@company.com" 
                    className="flex-1 px-5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium"
                  />
                </div>
              ))}
              <button onClick={addParticipant} className="flex items-center gap-2 text-blue-600 rounded-xl font-bold text-xs cursor-pointer uppercase tracking-wider hover:text-white hover:bg-blue-600 p-2 transition-colors">
                <span className="text-lg">+</span> Add Attendee
              </button>
            </div>
          </div>

          {/* Section 4: Details */}
          <div className="pt-6 border-t border-slate-50 space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Agenda</label>
              <textarea name="agenda" value={formData.agenda} onChange={handelChange} rows="3" placeholder="What was the purpose of the meeting?" className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-semibold text-slate-700 transition-all resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Meeting Notes</label>
              <textarea name="note" value={formData.note} onChange={handelChange} rows="5" placeholder="Detailed notes, decisions, and action items..." className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-semibold text-slate-700 transition-all resize-none" />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-slate-50 px-8 py-6 flex justify-end gap-3 border-t border-slate-100">
          <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-all">
            Discard
          </button>
          <button onClick={save} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            Save & Publish
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateMOM;