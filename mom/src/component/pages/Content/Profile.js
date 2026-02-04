import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Loading from "../Layout/Loading";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null); // Reference to the hidden input
  const navigate = useNavigate();

  useEffect(() => {
    try {
      axios
        .get("/user/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          setUser(res.data);
          setForm(res.data);
        });
    } catch (err) {
      console.log(err.response?.data);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Handle File Selection from Browser
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create local preview
      setForm({ ...form, profileImg: URL.createObjectURL(file) });
    }
  };

  const saveProfile = async () => {
    try {
      // Use FormData to support file upload
      const formData = new FormData();
      formData.append("phone", form.phone);
      formData.append("role", form.role);

      if (selectedFile) {
        formData.append("profileImg", selectedFile);
      }

      const res = await axios.put("/user/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setEdit(false);
      setSelectedFile(null);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  if (!user) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <button
          onClick={() => navigate(-1)}
          className="flex cursor-pointer items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors group"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Go Back
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Account Settings
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Manage your public profile and personal details
          </p>
        </div>

        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={saveProfile}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setEdit(false);
                setSelectedFile(null);
              }}
              className="bg-white border border-slate-200 text-slate-400 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Avatar Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm text-center">
            <div
              className={`relative inline-block group ${edit ? "cursor-pointer" : ""}`}
              onClick={() => edit && fileInputRef.current.click()}
            >
              <img
                src={
                  form.profileImg ||
                  "https://ui-avatars.com/api/?name=" + user.username
                }
                alt="profile"
                className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl ring-1 ring-slate-100 transition-transform group-hover:scale-105"
              />

              {/* Hidden Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />

              {edit && (
                <div className="absolute inset-0 bg-black/20 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <h3 className="mt-6 font-bold text-xl text-slate-800 uppercase tracking-tight">
              {user.username}
            </h3>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full tracking-widest border border-blue-100">
              {user.role || "Member"}
            </span>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-800 tracking-tight">
                Personal Information
              </h2>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  value={form.name || user.name}
                  disabled={!edit}
                />
                <Field
                  label="Username"
                  name="username"
                  onChange={handleChange}
                  value={form.username || user.username}
                  disabled={!edit}
                />
                <Field label="Email Address" value={user.email} disabled />
              </div>

              <div className="space-y-6 pt-4 border-t border-slate-50">
                <Field
                  label="Phone Number"
                  name="phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                  disabled={!edit}
                />

                <Field
                  label="Designation / Role"
                  name="role"
                  value={user.role}
                  disabled
                />

                {edit && (
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider italic">
                    * Click the profile image on the left to upload a new photo.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, disabled, ...props }) => (
  <div className="group">
    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
      {label}
    </label>
    <input
      {...props}
      disabled={disabled}
      className={`w-full px-5 py-3 rounded-2xl border transition-all text-sm font-semibold
        ${
          disabled
            ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-white border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none hover:border-slate-300 shadow-sm"
        }`}
    />
  </div>
);

export default Profile;
