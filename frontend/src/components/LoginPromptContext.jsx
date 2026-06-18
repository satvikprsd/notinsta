import React, { createContext, useContext, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import NotextLogo from "./notinstalogo.png";

const LoginPromptContext = createContext();

export const LoginPromptProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [promptMessage, setPromptMessage] = useState("Log in to enjoy all features of NotInsta.");
    const navigate = useNavigate();

    const showLoginPrompt = (message) => {
        if (message) {
            setPromptMessage(message);
        } else {
            setPromptMessage("Log in to interact with posts, view profiles, send messages, and more.");
        }
        setIsOpen(true);
    };

    const handleLogin = () => {
        setIsOpen(false);
        navigate("/login");
    };

    const handleSignUp = () => {
        setIsOpen(false);
        navigate("/signup");
    };

    return (
        <LoginPromptContext.Provider value={{ showLoginPrompt }}>
            {children}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="flex flex-col items-center justify-center p-6 w-[90%] max-w-[420px] bg-zinc-950/90 border border-white/10 text-white rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-300">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl scale-125 animate-pulse"></div>
                        <img src={NotextLogo} alt="NotInsta Logo" className="relative w-16 h-16 object-contain animate-bounce" />
                    </div>

                    <DialogTitle className="text-2xl font-bold tracking-tight mb-2 text-center bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Login Required
                    </DialogTitle>

                    <DialogDescription className="text-zinc-300 text-sm text-center mb-6 px-3 leading-relaxed">
                        {promptMessage}
                    </DialogDescription>

                    <div className="flex flex-col gap-3 w-full">
                        <Button
                            onClick={handleLogin}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-indigo-500/20 hover:cursor-pointer"
                        >
                            Log In
                        </Button>
                        <Button
                            onClick={handleSignUp}
                            variant="outline"
                            className="w-full border-white/10 text-white bg-white/5 hover:bg-white/10 font-semibold py-2.5 rounded-xl transition-all duration-300 transform active:scale-[0.98] hover:cursor-pointer"
                        >
                            Create Account
                        </Button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full text-zinc-500 hover:text-zinc-300 font-medium py-2 text-sm transition-colors duration-200 mt-1 focus:outline-none"
                        >
                            Keep Browsing as Guest
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </LoginPromptContext.Provider>
    );
};

export const useLoginPrompt = () => useContext(LoginPromptContext);
