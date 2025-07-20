const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  username: String,
  room: String,
  type: String,
  content: String,
  timestamp: Date
});

module.exports = mongoose.model('Message', MessageSchema);