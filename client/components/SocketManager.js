'use client';

import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

export default function SocketManager() {
  const { token, user } = useAuth();
  const { connectSocket, disconnectSocket, connectUser } = useSocket();

  useEffect(() => {
    if (token && user) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }
  }, [token, user, connectSocket, disconnectSocket]);

  useEffect(() => {
    if (user?.email) {
      connectUser(user.email);
    }
  }, [user?.email, connectUser]);

  // Ensure we send connect_user right after socket connects
  useEffect(() => {
    if (user?.email) {
      connectUser(user.email);
    }
  }, [user?.email, connectUser]);

  return null;
}
