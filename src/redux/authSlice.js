import { Portal } from "@radix-ui/react-dialog";
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        profile : null,
    },
    reducers:{
        setAuthUser: (state,action)=>{
            state.user = action.payload
        },
        setSuggestedUsers: (state,action) => {
            state.suggestedUsers = action.payload
        },
        setProfile: (state,action) => {
            state.profile = action.payload
        }
    }
});

export const {setAuthUser,setSuggestedUsers, setProfile} = authSlice.actions;
export default authSlice.reducer;