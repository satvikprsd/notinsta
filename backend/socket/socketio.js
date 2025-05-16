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

    socket.on('disconnect', ()=>{
        if(userID) delete userSocketIds[userID];
        io.emit('getOnlineUsers', Object.keys(userSocketIds))
    })
})

export {app, server, io};