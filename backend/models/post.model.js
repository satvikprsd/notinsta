import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: {
            type: String,
            default: 'Blank',
            required: true
        },
        profilePic: {
            type: String,
            default: 'default.jpg'
        },
        comment: {
            type: String,
            required: true
        }
    },{ timestamps: true }],
},{ timestamps: true });

export const Post = mongoose.model('Post', postSchema);