// web/hooks/use-socket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Koneksi ke Socket Server kita
    const socketInstance = io('http://localhost:3001', {
      transports: ['websocket'], // Paksa pakai websocket biar lebih stabil
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    // Bersihkan koneksi saat user tutup web
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected };
};
