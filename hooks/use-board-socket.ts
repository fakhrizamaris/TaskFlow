// web/hooks/use-board-socket.ts
'use client';

import { useEffect, useCallback } from 'react';
import { useSocket } from './use-socket';
import { useRouter } from 'next/navigation';

/**
 * Hook untuk real-time sync pada board tertentu
 * Menangani join/leave room dan emit update
 */
export const useBoardSocket = (boardId: string) => {
  const { socket, isConnected } = useSocket();
  const router = useRouter();

  // Join room saat mount, leave saat unmount
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit('join-board', boardId);
    console.log(`✅ Joined board room: ${boardId}`);

    // Listen untuk update dari user lain
    const handleRefresh = (message: string) => {
      console.log('🔄 Refresh signal received:', message);
      router.refresh();
    };

    socket.on('refresh-board', handleRefresh);

    return () => {
      socket.emit('leave-board', boardId);
      socket.off('refresh-board', handleRefresh);
      console.log(`👋 Left board room: ${boardId}`);
    };
  }, [socket, isConnected, boardId, router]);

  // Function untuk broadcast update ke user lain
  const emitBoardUpdate = useCallback(
    (message: string = 'Board updated') => {
      if (!socket || !isConnected) {
        console.warn('⚠️ Socket not connected, cannot emit update');
        return;
      }

      // Delay sedikit agar DB sempat update
      setTimeout(() => {
        socket.emit('update-board', { boardId, message });
        console.log(`📤 Emitted board update: ${message}`);
      }, 300);
    },
    [socket, isConnected, boardId]
  );

  return {
    isConnected,
    emitBoardUpdate,
  };
};
