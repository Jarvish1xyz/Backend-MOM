import axios from "axios";
import { useState } from "react";

function RegisterForm({ onClickCheck, onToggle }) {


    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const register = async () => {
        try {
            console.log(form);
            await axios.post("/auth/register", form);
            onClickCheck()
        } catch (err) {
            alert(err.response?.data?.msg || "Registration failed");
        }
    };

    return (
        <div className="w-72">
            <form>
                <div className="mb-4">
                    <input placeholder="E-mail" name="email" type="email" className="w-full px-3 py-2 rounded-md bg-white bg-opacity-75" onChange={handleChange} />
                </div>
                <div className="mb-4">
                    <input placeholder="Username" name="username" type="text" className="w-full px-3 py-2 rounded-md bg-white bg-opacity-75" onChange={handleChange} />
                </div>
                <div className="mb-4">
                    <input placeholder="Password" name="password" type="password" className="w-full px-3 py-2 rounded-md bg-white bg-opacity-75" onChange={handleChange}/>
                </div>
                <div className="mb-4">
                    <input placeholder="Confirm password" name="confirmPassword" type="password" className="w-full px-3 py-2 rounded-md bg-white bg-opacity-75" onChange={handleChange}/>
                </div>
                <div className="bg-blue-600 text-white text-center py-2 rounded-md cursor-pointer" onClick={register}>
                    Register
                </div>
                <div className="mt-3 text-sky-700/80 flex justify-center items-center flex-col">
                    <p>
                        Have an account?{" "}
                        <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={onToggle}>Login</span>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;
