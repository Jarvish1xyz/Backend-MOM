import { useState } from "react";
import axios from 'axios';

function LoginForm({ onClickCheck, onToggle }) {
    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const login = async () => {
        try {
            const res = await axios.post("/auth/login", form);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            onClickCheck()
        } catch (err) {
            alert(err.response?.data?.msg || "Login failed");
        }
    };

    return (
        <div className="w-72">
            <form>
                <div className="mb-4">
                    <input placeholder="Username" name="username" type="text" className="w-full px-3 py-2 rounded-md bg-white bg-opacity-75" onChange={handleChange}/>
                </div>
                <div className="mb-4">
                    <input placeholder="Password" name="password" type="password" className="w-full px-3 py-2 rounded-md bg-white bg-opacity-75" onChange={handleChange}/>
                </div>
                <div className="bg-blue-600 text-white text-center py-2 rounded-md cursor-pointer" onClick={login}>
                    Log in
                </div>

                <div className="text-sky-700/80 mt-3 text-opacity-75 flex justify-center items-center flex-col">
                    <p>
                        Don't have an account?{" "}
                        <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={onToggle}>
                            Register
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
