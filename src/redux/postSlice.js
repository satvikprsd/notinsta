import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [],
        feed: [],
    },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setFeed: (state, action) => {
            state.feed = action.payload;
        },
    }
});

export const { setPosts, setFeed } = postSlice.actions;

export default postSlice.reducer;