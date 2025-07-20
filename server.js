const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const authRoutes = require('./routes/auth');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

mongoose.connect('mongodb://localhost/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authRoutes);

// Image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ url: `http://localhost:5000/uploads/${req.file.filename}` });
});

// Socket.io logic
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    socket.to(room).emit('message', {
      type: 'text',
      username: 'System',
      content: `${username} joined ${room}`,
      timestamp: new Date()
    });
  });

  socket.on('sendMessage', async ({ username, room, type, content }) => {
    const message = new Message({ username, room, type, content, timestamp: new Date() });
    await message.save();
    io.to(room).emit('message', message);
  });
});

server.listen(5000, () => console.log('Server on port 5000'));