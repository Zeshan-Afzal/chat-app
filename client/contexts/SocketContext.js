'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  const connectSocket = (token) => {
    if (token && !socket) {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      setSocket(newSocket);
    }
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.close();
      setSocket(null);
      setConnected(false);
    }
  };

  const joinRoom = (roomId) => {
    if (socket && connected) {
      socket.emit('join_room', roomId);
    }
  };

  const leaveRoom = (roomId) => {
    if (socket && connected) {
      socket.emit('leave_room', roomId);
    }
  };

  const sendMessage = (roomId, message, toEmail, fromEmail) => {
    if (socket && connected) {
      socket.emit('send_message', JSON.stringify({ roomId, text: message, toEmail, fromEmail }));
    }
  };

  const connectUser = (email) => {
    if (socket && connected) {
      socket.emit('connect_user', JSON.stringify({ email }));
    }
  };

  const markMessagesAsRead = (roomId, userId) => {
    if (socket && connected) {
      socket.emit('mark_messages_read', JSON.stringify({ roomId, userId }));
    }
  };

  const startTyping = (roomId, user) => {
    if (socket && connected) {
      socket.emit('typing_start', JSON.stringify({ roomId, user }));
    }
  };

  const stopTyping = (roomId, user) => {
    if (socket && connected) {
      socket.emit('typing_stop', JSON.stringify({ roomId, user }));
    }
  };

  const value = {
    socket,
    connected,
    connectSocket,
    disconnectSocket,
    joinRoom,
    leaveRoom,
    sendMessage,
    connectUser,
    markMessagesAsRead,
    startTyping,
    stopTyping,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
