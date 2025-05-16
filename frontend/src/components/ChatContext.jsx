import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function useChat() {
    return useContext(ChatContext);
}

export function ChatProvider({ children }) {
    const [chatOpen, setChatOpen] = useState(false);

    return (
        <ChatContext.Provider value={{ chatOpen, setChatOpen }}>
            {children}
        </ChatContext.Provider>
    );
}

