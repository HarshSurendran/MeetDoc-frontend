import { getNotification } from '@/services/user/user';
import { INotification } from '@/types';
import errorHandler from '@/utils/errorHandler';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_NOTIFICATION_SOCKET_URL;

const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    const socket: Socket = io(SOCKET_SERVER_URL ||'http://localhost:3000/notification', {
      auth: { userId },
      withCredentials: true,
      transports: ['websocket'],
    });

    getNoti();

    socket.on('connect', () => {
      console.log('Connected to WebSocket for notifications');
    });
        
    socket.on('notification', (notification: INotification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const getNoti = async () => {
    try {
      if(userId === null) return
      const response = await getNotification(userId);
      console.log(response)
      if (response?.status) {
        setNotifications((prev) => [...prev, ...response.data]);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return notifications;
};

export default useNotifications;