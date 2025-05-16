import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        onlineUsers: [],
        conversations: [],
        chatorder: [],
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
        }
    }
});

export const {setSocket, setOnlineUsers, setConversations, setChatOrder} = chatSlice.actions;
export default chatSlice.reducer;