import './LogReg.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    // console.log(isActive);

    const ischeck = async () => {
        setIsActive(isActive => !isActive);
        await delay(1000);
        // console.log(isActive);

        // window.localStorage.setItem('isActive', isActive);
        // navigate('/login')
        animationEnd();
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const animationEnd = () => {
        navigate('/');
    }

    return (
        <>
            <div className={`rounded-xl shadow-lg bg-gray-900/75 ${isActive ? "card-change-n" : "card-change-r"}`} style={{ width: "18.5rem" }}>
                <div className="p-3 mt-3 flex justify-center items-center flex-col">
                    <svg style={{ transform: "scale(1.5)" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 26" width="30" height="30" fill="white">
                        <path d="M16 0h-5L8 5H0v7h4l.444 1L0 21v5h5l3-5h8v-7h-4l-.444-1L16 5z" />
                    </svg>
                </div>
                <div className="p-6">
                    <form>
                        <div className="mb-4">
                            <input placeholder="Username" type="text" className="w-full px-3 py-2 rounded-md bg-white bg-opacity-75"/>
                        </div>
                        <div className="mb-4">
                            <input placeholder="Password" type="password" className="w-full px-3 py-2 rounded-md bg-white bg-opacity-75"/>
                        </div>
                        <div className="bg-blue-600 text-white text-center py-2 rounded-md cursor-pointer">
                            Log in
                        </div>

                        <div className="mt-3 text-white text-opacity-75 flex justify-center items-center flex-col">
                            <p>
                                Don't have an account?{" "}
                                <span className="text-cyan-400 cursor-pointer" onClick={() => ischeck()}>
                                    Register
                                </span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;