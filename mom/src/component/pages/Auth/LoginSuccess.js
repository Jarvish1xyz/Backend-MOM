// pages/LoginSuccess.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function LoginSuccess() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      // 1. Save data exactly like your standard login
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);

      // 2. Force a page reload to "/" so App.js picks up the new state
      window.location.href = "/"; 
    }
  }, [location]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-xl font-semibold">Authenticating with Google...</p>
    </div>
  );
}

export default LoginSuccess;