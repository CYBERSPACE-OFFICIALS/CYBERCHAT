import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const socket = io('http://localhost:5000');

export default function Chat() {
  const { state } = useLocation();
  const { room } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const chatRef = useRef();

  useEffect(() => {
    socket.emit('joinRoom', { username: state.username, room });
    socket.on('message', (msg) => setMessages((prev) => [...prev, msg]));
  }, [room, state.username]);

  const sendMessage = async () => {
    if (image) {
      const form = new FormData();
      form.append('image', image);
      const res = await axios.post('http://localhost:5000/upload', form);
      socket.emit('sendMessage', {
        username: state.username,
        room,
        type: 'image',
        content: res.data.url,
      });
      setImage(null);
    } else if (input.trim()) {
      socket.emit('sendMessage', {
        username: state.username,
        room,
        type: 'text',
        content: input,
      });
      setInput('');
    }
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-blue-500 text-white text-center p-3 font-bold">Room: {room}</div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="bg-white p-2 rounded shadow">
            <div className="text-xs text-gray-500">{msg.username}</div>
            {msg.type === 'text' ? (
              <div>{msg.content}</div>
            ) : (
              <img src={msg.content} alt="upload" className="max-w-xs rounded mt-1" />
            )}
          </div>
        ))}
        <div ref={chatRef}></div>
      </div>
      <div className="p-2 flex gap-2 border-t">
        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-1/5" />
        <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 p-2 border rounded" />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">Send</button>
      </div>
    </div>
  );
}