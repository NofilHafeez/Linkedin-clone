  'use client';

  import { createContext, useContext, useEffect, useState } from 'react';
  import { io, Socket } from 'socket.io-client';

  const SocketContext = createContext<Socket | null>(null);

  export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000', {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }, []);

    return (
      <SocketContext.Provider value={socket}>
        {children}
      </SocketContext.Provider>
    );
  };

  export const useSocket = () => useContext(SocketContext);
