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
        const newMessage = await Message.create({ sender: senderId, receiver: receiverId, message: text });
        
        convo.messages.push(newMessage._id);
        convo.lastMessage = newMessage._id;
        convo.lastMessageAt = newMessage.createdAt;

        const currentUnreadCount = convo.unreadCounts.get(receiverId) || 0;
        convo.unreadCounts.set(receiverId.toString(), currentUnreadCount + 1);

        convo.save()

        const populatedMessage = await newMessage.populate([{path: 'sender',select: 'username profilePic'},{path: 'receiver',select: 'username profilePic'}]);

        const receiverSocketID = getSocketId(receiverId);
        if(receiverSocketID){
            io.to(receiverSocketID).emit('newChat', populatedMessage);
        }

        return res.status(200).json({ success: true, message: 'Message sent successfully', newMessage: populatedMessage });
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
        if (convo.unreadCounts.get(senderId) > 0) await Convo.findByIdAndUpdate(convo._id, { $set: {[`unreadCounts.${senderId}`]: 0} });

        return res.status(200).json({ success: true, messages: convo.messages, receiver:receiverUser });
    }
    catch (error) {
        console.error(error);
    }
};

export const getAllLastMessages = async (req, res) => {
    try {
        const userId = req.id;
        const convos = await Convo.find({ participants: userId })
            .populate({
                path: 'messages',
                options: { sort: { createdAt: -1 }},
            })
        const chats = convos.map(convo => {
            const otherUser = convo.participants.find(p => p._id.toString() !== userId);
            return {
                participant: otherUser,
                lastMessage: convo.messages[0] || null
            };
        });

        return res.status(200).json({ success: true, chats });
    } catch (error) {
        console.error(error);
    }
};
