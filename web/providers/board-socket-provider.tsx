// web/providers/board-socket-provider.tsx
'use client';

import { createContext, useContext, useEffect, useCallback, ReactNode, useState } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { useRouter } from 'next/navigation';

interface OnlineUser {
  id: string;
  name: string;
  image?: string;
}

interface UserInteraction {
  type: 'hover-list' | 'drag-start' | 'drag-end' | 'typing-start' | 'typing-end';
  targetId: string;
  userId: string;
  userName: string;
  userImage?: string;
}

interface BoardSocketContextType {
  isConnected: boolean;
  onlineUsers: OnlineUser[];
  emitBoardUpdate: (message?: string) => void;
  emitInteraction: (type: UserInteraction['type'], targetId: string) => void;
  lastUpdate: { message: string; userName: string } | null;
  activeInteractions: Record<string, UserInteraction>; // Key: targetId
}

const BoardSocketContext = createContext<BoardSocketContextType>({
  isConnected: false,
  onlineUsers: [],
  emitBoardUpdate: () => {},
  emitInteraction: () => {},
  lastUpdate: null,
  activeInteractions: {},
});

export const useBoardSocketContext = () => useContext(BoardSocketContext);

interface BoardSocketProviderProps {
  children: ReactNode;
  boardId: string;
  currentUser: {
    id: string;
    name: string;
    image?: string;
  };
}

export const BoardSocketProvider = ({ children, boardId, currentUser }: BoardSocketProviderProps) => {
  const { socket, isConnected } = useSocket();
  const router = useRouter();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [lastUpdate, setLastUpdate] = useState<{ message: string; userName: string } | null>(null);
  const [activeInteractions, setActiveInteractions] = useState<Record<string, UserInteraction>>({});

  // Join room saat mount, leave saat unmount
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join dengan data user
    socket.emit('join-board', {
      boardId,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        image: currentUser.image,
      },
    });
    console.log(`✅ Joined board room: ${boardId}`);

    // Listen untuk update daftar user online
    const handleUsersUpdated = (users: OnlineUser[]) => {
      console.log('👥 Online users updated:', users);
      setOnlineUsers(users);
    };

    // Listen untuk update dari user lain
    const handleRefresh = (data: { message: string; userName: string }) => {
      console.log('🔄 Refresh signal received:', data);
      setLastUpdate(data);
      router.refresh();

      // Clear notification after 3 seconds
      setTimeout(() => setLastUpdate(null), 3000);
    };

    // Listen Interaksi Realtime
    const handleInteraction = (data: UserInteraction) => {
      // console.log('Realtime interaction:', data);

      setActiveInteractions((prev) => {
        const newInteractions = { ...prev };

        // Jika interaksi selesai (end), hapus dari state
        if (data.type.endsWith('-end')) {
          // Cara hapus: Kita cari interaksi yang userId-nya sama dan target-nya relevan
          // Tapi sederhananya kita pakai targetId sebagai key untuk activity list/card
          delete newInteractions[data.targetId];
        } else {
          // Simpan interaksi aktif
          newInteractions[data.targetId] = data;

          // Auto remove hover/typing status after 5 seconds (safety net agar tidak stuck)
          if (data.type === 'hover-list' || data.type === 'typing-start') {
            setTimeout(() => {
              setActiveInteractions((current) => {
                const updated = { ...current };
                if (updated[data.targetId]?.userId === data.userId) {
                  delete updated[data.targetId];
                }
                return updated;
              });
            }, 5000);
          }
        }
        return newInteractions;
      });
    };

    socket.on('users-updated', handleUsersUpdated);
    socket.on('refresh-board', handleRefresh);
    socket.on('user-interaction', handleInteraction);

    return () => {
      socket.emit('leave-board', boardId);
      socket.off('users-updated', handleUsersUpdated);
      socket.off('refresh-board', handleRefresh);
      socket.off('user-interaction', handleInteraction);
      console.log(`👋 Left board room: ${boardId}`);
    };
  }, [socket, isConnected, boardId, router, currentUser]);

  // Function untuk broadcast update ke user lain
  const emitBoardUpdate = useCallback(
    (message: string = 'Board updated') => {
      if (!socket || !isConnected) {
        console.warn('⚠️ Socket not connected, cannot emit update');
        return;
      }

      // Delay sedikit agar DB sempat update
      setTimeout(() => {
        socket.emit('update-board', {
          boardId,
          message,
          userName: currentUser.name,
        });
        console.log(`📤 Emitted board update: ${message}`);
      }, 300);
    },
    [socket, isConnected, boardId, currentUser.name]
  );

  // Function untuk broadcast interaksi (hover, drag, typing)
  const emitInteraction = useCallback(
    (type: UserInteraction['type'], targetId: string) => {
      if (!socket || !isConnected) return;

      socket.emit('user-interaction', {
        boardId,
        type,
        targetId,
        userId: currentUser.id,
        userName: currentUser.name,
        userImage: currentUser.image,
      });
    },
    [socket, isConnected, boardId, currentUser]
  );

  return <BoardSocketContext.Provider value={{ isConnected, onlineUsers, emitBoardUpdate, emitInteraction, lastUpdate, activeInteractions }}>{children}</BoardSocketContext.Provider>;
};
