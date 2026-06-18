import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import { useChat } from "./ChatContext";
import { LoginPromptProvider } from "./LoginPromptContext";

const MainPage = () => {
    const {ChatPageRef} = useChat();
    return (
        <LoginPromptProvider>
            <div ref={ChatPageRef} className="w-screen h-screen fade-in">
                <SideBar />
                <>
                    <Outlet />
                </>
            </div>
        </LoginPromptProvider>
    );
};

export default MainPage;