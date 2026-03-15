import { useState } from "react";
import axios from 'axios';
import { useNotice } from "../../../NoticeContext";
import API from "../../../api";

function LoginForm({ onClickCheck, isVisible }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const { triggerNotice } = useNotice();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const login = async () => {
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      triggerNotice("Successfuly Login!!!", "success");
      onClickCheck();
    } catch (err) {
      triggerNotice("Invalid email or password", "error");
    }
  };

  const handleGoogleLogin = () => {
    // This points to the route we just created in the backends
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google/login`;
  };

  return (
    <div className={`w-full max-w-sm transition-all duration-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"}`}>
      <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight text-center">Sign In</h2>
      <div className="space-y-4">
        <form onSubmit={(e) => { e.preventDefault() }}>
          <AuthField placeholder="Username" name="username" type="text" onChange={handleChange} />
          <AuthField placeholder="Password" name="password" type="password" onChange={handleChange} />
          <p className="text-right text-xs font-bold text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">Forgot Password?</p>
          <button type="submit" onClick={login} className="w-full cursor-pointer bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
            LOG IN
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="google-login-button"
          style={{ backgroundColor: '#4285F4', color: 'white', padding: '10px', borderRadius: '5px' }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

// Reusable Inner Component for style consistency
const AuthField = (props) => (
  <input
    {...props}
    className="w-full m-2 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-semibold text-slate-700 transition-all placeholder:text-slate-400"
  />
);

export default LoginForm;