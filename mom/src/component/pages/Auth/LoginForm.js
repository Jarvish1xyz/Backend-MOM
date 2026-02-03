import { useState } from "react";
import axios from 'axios';

function LoginForm({ onClickCheck, isVisible }) {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const login = async () => {
    try {
      const res = await axios.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onClickCheck();
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className={`w-full max-w-sm transition-all duration-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"}`}>
      <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight text-center">Sign In</h2>
      <div className="space-y-4">
        <AuthField placeholder="Username" name="username" type="text" onChange={handleChange} />
        <AuthField placeholder="Password" name="password" type="password" onChange={handleChange} />
        <p className="text-right text-xs font-bold text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">Forgot Password?</p>
        <button onClick={login} className="w-full cursor-pointer bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
          LOG IN
        </button>
      </div>
    </div>
  );
}

// Reusable Inner Component for style consistency
const AuthField = (props) => (
  <input 
    {...props}
    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-semibold text-slate-700 transition-all placeholder:text-slate-400"
  />
);

export default LoginForm;