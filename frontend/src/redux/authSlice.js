import { Portal } from "@radix-ui/react-dialog";
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        savedPosts: [],
        profile : null,
        selectedChat: null,
    },
    reducers:{
        setAuthUser: (state,action)=>{
            state.user = action.payload
        },
        setSuggestedUsers: (state,action) => {
            state.suggestedUsers = action.payload
        },
        setSavedPosts: (state,action) => {
            state.savedPosts = action.payload
        },
        setProfile: (state,action) => {
            state.profile = action.payload
        },
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload
        }
    }
});

export const {setAuthUser,setSuggestedUsers, setSavedPosts, setProfile, setSelectedChat} = authSlice.actions;
export default authSlice.reducer;