import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        onlineUsers: [],
        conversations: [],
        chatorder: [],
        lastMsgs: [],
    },
    reducers:{
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload
        },
        setConversations: (state,action) => {
            state.conversations = action.payload
        },
        setChatOrder: (state, action) => {
            state.chatorder = action.payload
        },
        setLastMsgs: (state, action) => {
            state.lastMsgs = action.payload
        }
    }
});

export const {setSocket, setOnlineUsers, setConversations, setChatOrder, setLastMsgs} = chatSlice.actions;
export default chatSlice.reducer;