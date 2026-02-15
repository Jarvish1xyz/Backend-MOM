import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateMOM() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]); // To store user list from DB
  const [activeDropdown, setActiveDropdown] = useState(null); // Track which input is open
  const [participants, setParticipants] = useState([""]);
  const [formData, setFormData] = useState({
    title: '',
    id: '',
    date: '',
    time: '',
    agenda: '',
    note: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/user/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAllUsers(res.data);
        // console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();

    // Existing draft logic...
    const draft = localStorage.getItem("meetingDraft");
    if (draft) {
      const parsed = JSON.parse(draft);
      setFormData(parsed);
      if (parsed.allMembers) setParticipants(parsed.allMembers);
      localStorage.removeItem("meetingDraft");
      localStorage.setItem("isGoogle", "true");
    }
  }, []);

  const getFilteredUsers = (query) => {
    if (!query) return [];
    return allUsers.filter(u =>
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.username.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit results for clean UI
  };

  const removeParticipant = (index) => {
    const updated = participants.filter((_, i) => i !== index);
    setParticipants(updated.length ? updated : [""]); // Keep at least one empty row
  };

  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateParticipant = (index, value) => {
    const updated = [...participants];
    updated[index] = value;
    setParticipants(updated);
  };

  const addParticipant = () => setParticipants([...participants, ""]);

  // Function to handle Google API Redirect
  const scheduleGoogleMeet = () => {

    localStorage.setItem(
      "meetingDraft",
      JSON.stringify({ ...formData, allMembers: participants })
    );
    const token = localStorage.getItem("token");

    window.location.href = `https://probable-meme-g474x6r4v95v2wxjv-5000.app.github.dev/auth/google?token=${token}`;
  };

  const updateUserLinks = async (meetingId, allMembers) => {
    try {
      const promises = allMembers.map(memberEmail =>
        axios.patch(`/user/meeting/update/`, {
          email: memberEmail,
          meetingid: meetingId
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
      );
      await Promise.all(promises);
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

      const cleanParticipants = participants.filter(p => p.trim() !== "");
      const allMembers = Array.from(new Set([...cleanParticipants, user.email]));

      // console.log(formData);
      await axios.post("/meeting/add", {
        ...formData,
        calledByEmail: user.email,
        membersEmail: allMembers,
        isGoogle: localStorage.getItem("isGoogle") === "true",
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      await updateUserLinks(formData.id, allMembers);
      navigate("/");
    } catch (err) {
      console.error("Save Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Create Meeting</h1>
          <p className="text-slate-500 font-medium">Document the discussion, decisions, and action items.</p>
        </div>

        {/* GOOGLE MEET INTEGRATION BUTTON */}
        {(user.role === "HR" || user.role === "Admin") && (
          <button
            onClick={scheduleGoogleMeet}
            className={`${localStorage.getItem("isGoogle") === "true" ? "bg-green-500 hover:bg-green-600 text-white" : "bg-white hover:bg-slate-50 border border-slate-200 text-slate-700"} flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm shadow-sm hover:border-blue-300 transition-all group`}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
              alt="Google Calendar"
              className="w-5 h-5"
            />
            Schedule with Google Meet
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">

          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Meeting Title</label>
              <input name="title" value={formData.title} onChange={handelChange} placeholder="e.g. Quarterly Product Review" className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 outline-none font-semibold text-slate-700" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference ID</label>
              <input name="id" value={formData.id} onChange={handelChange} placeholder="e.g. 10401" className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 outline-none font-semibold text-slate-700" />
            </div>
          </div>

          {/* Section 2: Time & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
              <input name="date" type="date" value={formData.date} onChange={handelChange} className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none font-semibold text-slate-700" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
              <input name="time" type="time" value={formData.time} onChange={handelChange} className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none font-semibold text-slate-700" />
            </div>
          </div>

          {/* Section 3: Participants */}
          <div className="pt-6 border-t border-slate-50">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-4">
              Attendees
            </label>
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
                        placeholder="Search colleague name or email..."
                        className="w-full px-5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                      />

                      {/* CUSTOM DROPDOWN MENU */}
                      {activeDropdown === i && email.length > 1 && (
                        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                          {getFilteredUsers(email).length > 0 ? (
                            getFilteredUsers(email).map((u) => (
                              <button
                                key={u._id}
                                type="button"
                                onClick={() => {
                                  updateParticipant(i, u.email);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0 text-left"
                              >
                                <img
                                  src={u.profileImg || `https://ui-avatars.com/api/?name=${u.username}`}
                                  className="w-8 h-8 rounded-lg object-cover bg-slate-100"
                                  alt=""
                                />
                                <div>
                                  <p className="text-sm font-bold text-slate-700 leading-tight">{u.username}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">{u.email}</p>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                              No matching users
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* REMOVE BUTTON (X) */}
                    {participants.length > 1 && (
                      <button
                        onClick={() => removeParticipant(i)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove attendee"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addParticipant}
              className="mt-6 flex items-center gap-2 text-blue-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-50 p-2 transition-colors"
            >
              <span className="text-lg">+</span> Add Attendee
            </button>
          </div>

          {/* Section 4: Details */}
          <div className="pt-6 border-t border-slate-50 space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Agenda</label>
              <textarea name="agenda" value={formData.agenda} onChange={handelChange} rows="2" placeholder="Purpose of meeting..." className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 outline-none font-semibold text-slate-700 resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Meeting Notes</label>
              <textarea name="note" value={formData.note} onChange={handelChange} rows="4" placeholder="Detailed notes..." className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 outline-none font-semibold text-slate-700 resize-none" />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-slate-50 px-8 py-6 flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-100">
          <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl cursor-pointer text-sm font-bold text-slate-500 hover:bg-slate-200 transition-all order-2 sm:order-1">
            Discard
          </button>
          <button onClick={save} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl cursor-pointer text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all order-1 sm:order-2">
            Save Meeting
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateMOM;