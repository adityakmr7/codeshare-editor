const express = require('express');

const app = express();

const {Server} = require('socket.io');


const http = require('http');
const ACTIONS = require('./src/actions');


const server = http.createServer(app);

const io = new Server(server);
const userSocketMap = {};

const getAllConnectedClient = (roomId) => {
    // MAP
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return{
            socketId,
            username: userSocketMap[socketId]
        }
    })

}
io.on('connection', (socket) => {
   
    socket.on(ACTIONS.JOIN, ({roomId,username}) => {
    
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClient(roomId);
        clients.forEach(({socketId}) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username: username,
                socketId: socket.id
            });
        })
    });

    socket.on(ACTIONS.CODE_CHANGE, ({roomId,code}) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code});
    })

    socket.on(ACTIONS.SYNC_CODE, ({socketId,code}) => {
        socket.to(socketId).emit(ACTIONS.CODE_CHANGE,{code, socketId});
    })



    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms]
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId : socket.id,
                username: userSocketMap[socket.id]
            })
        });
        delete userSocketMap[socket.id];
        socket.leave();
    })
})
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`running on port ${PORT}`))
