import { createContext, useContext, useRef, useState } from "react";

const ChatContext = createContext();

export function useChat() {
    return useContext(ChatContext);
}

export function ChatProvider({ children }) {
    const [chatOpen, setChatOpen] = useState(false);
    const ChatPageRef = useRef(null);

    return (
        <ChatContext.Provider value={{ chatOpen, setChatOpen, ChatPageRef}}>
            {children}
        </ChatContext.Provider>
    );
}

