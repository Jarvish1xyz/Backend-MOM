import { useEffect, useState } from "react";
// import Sidebar from "./Sidebar";
import './Navbar.css';


function Navbar() {
    const [islogo, setIslogo] = useState(false);
    const [isside, setIsside] = useState(false);

    const change = () => {
        setIslogo(!islogo)
        setIsside(!isside)
    }

    const dir = () => {

    }

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            change();
        }
    };

    // Attach event listener to the whole window
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        // Cleanup on unmount
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    },);


    return (
        <>
            <nav>
                <div className="navbar fixed flex-col flex">
                    <div id="side" className={`${islogo ? "sidec" : "side"} m-3 fixed z-40`} onClick={change}
                        style={{ cursor: 'pointer', height: 'auto', width: 'auto' }}>
                        <div className={`mb-1 w-7 h-1 rounded-full bg-blue-500 ${islogo ? "line-1c" : "line-1"}`}></div>
                        <div className={`mb-1 mt-1 w-7 h-1 rounded-full bg-blue-500 ${islogo ? "line-2c" : "line-2"}`}></div>
                        <div className={`mt-1 w-7 h-1 rounded-full bg-blue-500 ${islogo ? "line-3c" : "line-3"}`}></div>
                    </div>
                    <div className={`p-1  rtl rounded-lg sidebar ${isside ? "nolist" : "islist"} `}>
                        <div className="sidelist mt-10 rounded-s-lg">
                            <div className={`rounded-lg flex ${islogo ? "p" : "l"}`}>
                                <div className={`rounded-md float-left flex justify-center items-center ${islogo ? "c" : "i"}`} onClick={islogo ? dir : change}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" className="w-5 h-5 fill-black">
                                        <path d="M1472 992v480q0 26-19 45t-45 19h-384v-384H768v384H384q-26 0-45-19t-19-45V992q0-1 .5-3t.5-3l575-474 575 474q1 2 1 6zm223-69-62 74q-8 9-21 11h-3q-13 0-21-7L896 424l-692 577q-12 8-24 7-13-2-21-11l-62-74q-8-10-7-23.5t11-21.5l719-599q32-26 76-26t76 26l244 204V288q0-14 9-23t23-9h192q14 0 23 9t9 23v408l219 182q10 8 11 21.5t-7 23.5z" />
                                    </svg>
                                </div>
                                <div className="rounded-lg flex justify-center items-center">Home</div>
                            </div>
                            <div className={`rounded-lg flex ${islogo ? "p" : "l"}`}>
                                <div className={`rounded-md float-left flex justify-center items-center ${islogo ? "c" : "i"}`} onClick={islogo ? dir : change}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" className="w-5 h-5 fill-black">
                                        <path d="M1472 992v480q0 26-19 45t-45 19h-384v-384H768v384H384q-26 0-45-19t-19-45V992q0-1 .5-3t.5-3l575-474 575 474q1 2 1 6zm223-69-62 74q-8 9-21 11h-3q-13 0-21-7L896 424l-692 577q-12 8-24 7-13-2-21-11l-62-74q-8-10-7-23.5t11-21.5l719-599q32-26 76-26t76 26l244 204V288q0-14 9-23t23-9h192q14 0 23 9t9 23v408l219 182q10 8 11 21.5t-7 23.5z" />
                                    </svg>
                                </div>
                                <div className="rounded-lg flex justify-center items-center">Members</div>
                            </div>
                            <div className={`rounded-lg flex ${islogo ? "p" : "l"}`}>
                                <div className={`rounded-md float-left flex justify-center items-center ${islogo ? "c" : "i"}`} onClick={islogo ? dir : change}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" className="w-5 h-5 fill-black">
                                        <path d="M1472 992v480q0 26-19 45t-45 19h-384v-384H768v384H384q-26 0-45-19t-19-45V992q0-1 .5-3t.5-3l575-474 575 474q1 2 1 6zm223-69-62 74q-8 9-21 11h-3q-13 0-21-7L896 424l-692 577q-12 8-24 7-13-2-21-11l-62-74q-8-10-7-23.5t11-21.5l719-599q32-26 76-26t76 26l244 204V288q0-14 9-23t23-9h192q14 0 23 9t9 23v408l219 182q10 8 11 21.5t-7 23.5z" />
                                    </svg>
                                </div>
                                <div className="rounded-lg flex justify-center items-center">Events</div>
                            </div>
                            <div className={`rounded-lg flex ${islogo ? "p" : "l"}`}>
                                <div className={`rounded-md float-left flex justify-center items-center ${islogo ? "c" : "i"}`} onClick={islogo ? dir : change}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" className="w-5 h-5 fill-black">
                                        <path d="M1472 992v480q0 26-19 45t-45 19h-384v-384H768v384H384q-26 0-45-19t-19-45V992q0-1 .5-3t.5-3l575-474 575 474q1 2 1 6zm223-69-62 74q-8 9-21 11h-3q-13 0-21-7L896 424l-692 577q-12 8-24 7-13-2-21-11l-62-74q-8-10-7-23.5t11-21.5l719-599q32-26 76-26t76 26l244 204V288q0-14 9-23t23-9h192q14 0 23 9t9 23v408l219 182q10 8 11 21.5t-7 23.5z" />
                                    </svg>
                                </div>
                                <div className="rounded-lg flex justify-center items-center">Question solving</div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;