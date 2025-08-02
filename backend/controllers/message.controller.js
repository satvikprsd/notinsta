import { Convo } from "../models/convo.model.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { getSocketId, io } from "../socket/socketio.js";

export const sendMessage = async (req, res) => {
    try {
        const receiverId = req.params.receiverId;
        const { text} = req.body;
        if (!text || !receiverId) {
            return res.status(400).json({ success: false, message: 'Please provide both text and receiver ID' });
        }
        const senderId = req.id;
        let convo = await Convo.findOne({ $or: [{ participants: [senderId, receiverId] }, { participants:  [receiverId, senderId]  }] });
        if (!convo) {
            const newConvo = await Convo.create({ participants: [senderId, receiverId] });
            convo = newConvo;
        }
        let newmessage = await Message.create({ sender: senderId, receiver: receiverId, message: text });
        if (newmessage) convo.messages.push(newmessage._id);
        await Promise.all([convo.save(), newmessage.save()]);

        newmessage = await newmessage.populate([{path: 'sender',select: 'username profilePic'},{path: 'receiver',select: 'username profilePic'}]);

        const receiverSocketID = getSocketId(receiverId);
        if(receiverSocketID){
            io.to(receiverSocketID).emit('newChat', newmessage);
        }

        return res.status(200).json({ success: true, message: 'Message sent successfully', newmessage});
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
        const receiverUser = await User.findById(receiverId).select('username profilePic');
        const senderId = req.id;
        const convo = await Convo.findOne({ $or: [{ participants: [senderId, receiverId]  }, { participants:  [receiverId, senderId]  }] }).populate({path: 'messages', populate:[ { path: 'sender', select: 'username profilePic' }, { path: 'receiver', select: 'username profilePic' } ]});
        // console.log(convo);
        if (!convo) {
            return res.status(200).json({ success: true, messages: [], receiver:receiverUser });
        }
        
        return res.status(200).json({ success: true, messages: convo.messages, receiver:receiverUser });
    }
    catch (error) {
        console.error(error);
    }
};