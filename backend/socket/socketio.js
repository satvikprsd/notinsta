import {Server} from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.URL,
        methods: ['GET', 'POST']
    }
})

const userSocketIds = {}

export const getSocketId = (userId) => userSocketIds[userId];

io.on('connection', (socket)=> {
    const userID = socket.handshake.query.userID;
    if(userID) userSocketIds[userID] = socket.id;

    io.emit('getOnlineUsers', Object.keys(userSocketIds))

    socket.on('typing_started', (receiverId) => {
        const receiverSocketId = getSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('user_typing', { userId: userID });
        }
    });

    socket.on('typing_stopped', (receiverId) => {
        const receiverSocketId = getSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('user_stopped_typing', { userId: userID });
        }
    });

    socket.on('disconnect', ()=>{
        if(userID) delete userSocketIds[userID];
        io.emit('getOnlineUsers', Object.keys(userSocketIds))
    })
})

export {app, server, io};