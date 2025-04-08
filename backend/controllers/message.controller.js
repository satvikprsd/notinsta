import { Convo } from "../models/convo.model.js";
import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const receiverId = req.params.receiverId;
        const { text} = req.body;
        if (!text || !receiverId) {
            return res.status(400).json({ success: false, message: 'Please provide both text and receiver ID' });
        }
        const senderId = req.id;
        let convo = await Convo.findOne({ $or: [{ participants: { $all: [senderId, receiverId] } }, { participants: { $all: [receiverId, senderId] } }] });
        if (!convo) {
            const newConvo = await Convo.create({ participants: [senderId, receiverId] });
            convo = newConvo;
        }
        const newmessage = await Message.create({ sender: senderId, receiver: receiverId, message: text });
        if (newmessage) convo.messages.push(newmessage._id);
        await Promise.all([convo.save(), newmessage.save()]);

        //socket logic bacha hai

        return res.status(200).json({ success: true, message: 'Message sent successfully' });
    }
    catch (error) {
        console.error(error);
    }
};

export const getMessages = async (req, res) => {
    try {
        const receiverId = req.params.receiverId;
        if (!receiverId) {
            return res.status(400).json({ success: false, message: 'Please provide receiver ID' });
        }
        const senderId = req.id;
        const convo = await Convo.find({ $or: [{ participants: { $all: [senderId, receiverId] } }, { participants: { $all: [receiverId, senderId] } }] }).populate('messages');
        if (!convo) {
            return res.status(200).json({ success: true, messages: [] });
        }
        return res.status(200).json({ success: true, messages: convo.messages });
    }
    catch (error) {
        console.error(error);
    }
};