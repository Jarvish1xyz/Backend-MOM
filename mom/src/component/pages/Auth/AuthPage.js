import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./Auth.css";

function AuthPage({ onClickCheck }) {
    const [isRegister, setIsRegister] = useState(false);

    const check = () => setIsRegister(!isRegister);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 via-sky-200 to-white">
            <div className="relative w-[900px] h-[480px] rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-sky-100 via-sky-200">

                {/* Forms Container */}
                <div className="relative z-10 flex w-full h-full">
                    {/* Login */}
                    <div className="w-1/2 flex items-center justify-center">
                        <div className="glass-form">
                            <LoginForm onToggle={check} onClickCheck={onClickCheck}/>
                        </div>
                    </div>

                    {/* Register */}
                    <div className="w-1/2 flex items-center justify-center">
                        <div className="glass-form">
                            <RegisterForm onToggle={check} onClickCheck={onClickCheck} />
                        </div>
                    </div>
                </div>

                {/* Sliding Welcome Glass */}

                <div
                    className={`absolute top-0 h-full w-1/2 z-20 glass-slider 
                        ${isRegister ? "slide-left" : "slide-right"}`}
                >
                    {/* <Snowfall color="white" /> */}
                    <div className={` ${isRegister ? "animate-textIn" : "animate-textOut"}`}>
                        <h2 className="text-3xl font-bold mb-4">
                            {isRegister ? "Hello, Friend!" : "Welcome Back!"}
                        </h2>

                        <p className="text-sm opacity-90 mb-6 leading-relaxed">
                            {isRegister
                                ? "Join us and start documenting meetings, notes, and action items beautifully."
                                : "Log in to manage your meetings, MOMs, and decisions effortlessly."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
