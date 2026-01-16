import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});

  // 🔹 Fetch logged-in user only
  useEffect(() => {
    axios.get("/user/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        setUser(res.data);
        setForm(res.data);
      })
      .catch(err => console.log(err.response?.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Save updated profile
  const saveProfile = async () => {
    try {
      const res = await axios.put(
        "/user/profile/update",
        {
          phone: form.phone,
          profileImg: form.profileImg,
          role: form.role
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setEdit(false);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-white p-6">

      <div className="glass-card w-full max-w-xl p-6 rounded-2xl shadow-xl animate-fadeIn">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-sky-900">
            My Profile
          </h2>

          {!edit ? (
            <button
              onClick={() => setEdit(true)}
              className="btn-primary"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={saveProfile} className="btn-primary">
                Save
              </button>
              <button onClick={() => setEdit(false)} className="btn-secondary cursor-pointer">
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <img
              src={
                form.profileImg ||
                "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1msDML?w=0&h=0&q=60&m=6&f=jpg&u=t"
              }
              alt="profile"
              className="w-28 h-28 rounded-full border-4 border-sky-300 object-cover shadow-md transition-transform group-hover:scale-105"
            />
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <Field label="Username" value={user.username} disabled />
          <Field label="Email" value={user.email} disabled />

          <Field
            label="Phone"
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            disabled={!edit}
          />

          <Field
            label="Profile Image URL"
            name="profileImg"
            value={form.profileImg || ""}
            onChange={handleChange}
            disabled={!edit}
          />

          <Field
            label="Role"
            name="role"
            value={form.role || ""}
            onChange={handleChange}
            disabled={!edit}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;

// 🔹 Reusable Input Field (UNCHANGED STRUCTURE)
const Field = ({ label, disabled, ...props }) => (
  <div>
    <label className="block text-sm text-sky-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      disabled={disabled}
      className={`input w-full ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>
);
