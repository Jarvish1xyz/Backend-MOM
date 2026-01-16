import { useState } from "react";
import ParticipantInput from "./ParticipantInput";
import "./CreateMOM.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateMOM() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [participants, setParticipants] = useState([""]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    id: '',
    date: '',
    time: '',
    agenda: '',
    note: '',
    members: [user.email]
  })

  const updateParticipant = (index, value) => {
    const updated = [...participants];
    updated[index] = value;
    setParticipants(updated);

    setFormData({
      ...formData,
      members: updated.filter(e => e.trim() !== "")
    });
  };


  const addParticipant = () =>
    setParticipants([...participants, ""]);

  const cancel = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/');
  }

  const updateUser = async () => {
    try {
      for(let member of formData.members) {
        console.log(member);
        const updated = await axios.patch(`/user/meeting/update/`, {
            email:member,
            meetingid:formData.id
        });
        console.log(updated);
      }
    }catch(err) {
      console.error(err.message);
    }
  }

  const save = async () => {
    try {

      if (user.role !== "HR" && user.role !== "Admin") {
        alert("Only HR/Admin can create meetings");
        navigate('/');
      }

      const res = await axios.post("/meeting/add", {
        title: formData.title,
        id: formData.id,
        date: formData.date,
        time: formData.time,
        agenda: formData.agenda,
        note: formData.note,
        calledByEmail: user.email,
        membersEmail: formData.members
      });

      console.log(res.data, formData);
      navigate("/");

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
    updateUser();
    navigate('/');
  };


  const handelChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
      <h1 className="text-3xl font-semibold text-sky-700 mb-6">
        Create Minutes of Meeting
      </h1>

      <div className="rounded-2xl shadow-xl p-6 glass-form space-y-6">

        {/* Title */}
        <input
          type="text"
          placeholder="Meeting-Title"
          name="title"
          value={formData.title}
          onChange={handelChange}
          className=" w-full px-3 py-2 rounded-md bg-white bg-opacity-75 bg-sky-50 transition"
        />
        <input
          type="text"
          placeholder="Meeting-id"
          name="id"
          value={formData.id}
          onChange={handelChange}
          className=" w-full px-3 py-2 rounded-md bg-white bg-opacity-75 bg-sky-50 transition"
        />

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <input name="date" value={formData.date} onChange={handelChange} type="date" className=" w-full px-3 py-2 rounded-md bg-white bg-opacity-75 bg-sky-50 transition" />
          <input name="time" value={formData.time} onChange={handelChange} type="time" className=" w-full px-3 py-2 rounded-md bg-white bg-opacity-75 bg-sky-50 transition" />
        </div>

        {/* Participants */}
        <div>
          <h3 className=" font-medium mb-2">Participants</h3>
          {participants.map((email, i) => (
            <ParticipantInput
              key={i}
              value={email}
              onChange={(val) => updateParticipant(i, val)}
            />
          ))}
          <button onClick={addParticipant} className="text-sky-900 text-sm mt-2 hover:bg-indigo-500 hover:text-white w-full px-3 py-2 rounded-md bg-white bg-opacity-75">
            + Add Participant
          </button>
        </div>
        <textarea name="agenda" value={formData.agenda} onChange={handelChange} className="input resize-none w-full px-3 py-2 rounded-md bg-white bg-opacity-75" rows="3" />
        <textarea name="note" value={formData.note} onChange={handelChange} className="input resize-none w-full px-3 py-2 rounded-md bg-white bg-opacity-75" rows="4" />

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button className="btn-secondary cursor-pointer" onClick={cancel}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save Meeting</button>
        </div>

      </div>
    </div>
  );
}

export default CreateMOM;
