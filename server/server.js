const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173', 
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

app.use(express.static(path.join(__dirname, 'public')));

const seed = 1;

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('seed', seed);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('move', (data) => {
        console.log('Move received:', data);
        socket.broadcast.emit('move', data);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 