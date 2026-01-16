import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import './Layout.css';

function Layout() {

    return (
        <>
            <div className="flex">
                <Navbar />
                <div className="" style={{ height: "100vh", width: "8.5vh" }}></div>
                <div className="main" style={{ border: "1px solid gray" }}>
                    <div className="fixed w-100 top-0 left-[8.5vh] right-0 Logo border border-gray-100">
                        <div className="logo">This is logo</div>
                    </div>
                    <div className="content">
                        <Outlet />
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default Layout;