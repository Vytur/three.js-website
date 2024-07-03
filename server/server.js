const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database.js');
const cors = require('cors');

const SECRET_KEY = 'my-secret-key';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173', 
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization'],
        credentials: true
    }
});

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));

const seed = 1;

// Register route
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Validate username length
    if (username.length < 3 || password.length > 32) {
        return res.status(400).json({ message: 'Username must be at least 3 and 32 characters long' });
    }

    // Validate password length
    if (password.length < 8 || password.length > 16) {
        return res.status(400).json({ message: 'Password must be between 8 and 16 characters long' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(`INSERT INTO users (username, password, email) VALUES (?, ?, ?)`, [username, hashedPassword, email], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Middleware to verify JWT for socket connections
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        socket.user = decoded;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.user.username);

    socket.emit('seed', seed);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('move', (data) => {
        console.log('Move received:', data);
        socket.broadcast.emit('move', data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 