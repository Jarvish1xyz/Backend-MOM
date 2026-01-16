import './LogReg.css';
import { Outlet } from "react-router-dom";

function LoginorSingup() {
    return (
        <>

            <div className="log flex justify-center items-center flex-col" style={{ height: '100vh' }}>
                <Outlet />
            </div>

        </>
    );
}

export default LoginorSingup;