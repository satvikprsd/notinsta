import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [],
        feed: [],
    },
    reducers: {
        setFeed: (state, action) => {
            state.feed = action.payload;
        },
    }
});

export const { setFeed } = postSlice.actions;

export default postSlice.reducer;