import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    await axios.post('http://localhost:5000/auth/login', { username, password });
    navigate(`/chat/${room}`, { state: { username } });
  };

  const register = async () => {
    await axios.post('http://localhost:5000/auth/register', { username, password });
    login();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Chat Login</h1>
        <input placeholder="Username" className="w-full mb-2 p-2 border rounded"
          onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" className="w-full mb-2 p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)} />
        <input placeholder="Room" className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setRoom(e.target.value)} />
        <button onClick={login} className="w-full bg-blue-500 text-white p-2 rounded mb-2">Login</button>
        <button onClick={register} className="w-full bg-gray-500 text-white p-2 rounded">Register</button>
      </div>
    </div>
  );
}