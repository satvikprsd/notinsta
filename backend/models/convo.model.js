import mongoose from "mongoose";

const convoSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Convo = mongoose.model('Conversation', convoSchema);