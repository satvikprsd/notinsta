import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  }, { timestamps: true });

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
    comments: [commentSchema],
},{ timestamps: true });

export const Post = mongoose.model('Post', postSchema);