import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

let socket: Socket | null = null;

export const connectSocket = (baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003') => {
  if (socket && socket.connected) return socket;

  const token = Cookies.get('token') || undefined;
  socket = io(baseUrl, {
    autoConnect: true,
    transports: ['websocket'],
    auth: { token },
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.debug('[socket] connected', socket?.id);
  });
  socket.on('disconnect', (reason: string | undefined) => {
    console.debug('[socket] disconnected', reason);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
