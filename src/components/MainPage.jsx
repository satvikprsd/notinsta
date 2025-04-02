import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

const MainPage = () => {
    return (
        <div className="bg-black w-screen h-screen">
            <SideBar />
            <>
                <Outlet />
            </>
        </div>
    );
};

export default MainPage;