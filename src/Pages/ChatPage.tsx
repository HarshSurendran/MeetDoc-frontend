import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MoreVertical, PhoneCall, Video } from 'lucide-react';
import { getMessages } from '@/services/doctor/doctor';

// Types
interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  read: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  role: 'doctor' | 'patient';
}



const ChatPage: React.FC = ({   }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const currentUser = {
    id: 'user1',
    name: 'Harsh',
    avatar: 'https://example.com/avatar.jpg',
    isOnline: true,
    lastSeen: new Date(),
    role: 'patient',
  }

  const otherUser = {
    id: 'user2',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
    isOnline: true,
    lastSeen: new Date(),
    role: 'patient',
  }

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('YOUR_SOCKET_SERVER_URL');
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('message', handleNewMessage);
    newSocket.on('typing', handleTypingStatus);
    newSocket.on('read', handleReadStatus);

    fetchMessages(otherUser.id);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchMessages = useCallback(async (patientId: string) => {
    const response = await getMessages(patientId);
    if (response.status) {
      // dispatch(setMessages(response.data.messages));
      setMessages(response.data.messages)
    }
}, [otherUser])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleNewMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
    socket?.emit('read', { messageId: message.id, userId: currentUser.id });
  };

  const handleTypingStatus = (status: { userId: string; isTyping: boolean }) => {
    if (status.userId === otherUser.id) {
      setIsTyping(status.isTyping);
    }
  };

  const handleReadStatus = (messageIds: string[]) => {
    setMessages(prev =>
      prev.map(msg =>
        messageIds.includes(msg.id) ? { ...msg, read: true } : msg
      )
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Emit typing status
    socket?.emit('typing', { userId: currentUser.id, receiverId: otherUser.id });
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit('stopTyping', { userId: currentUser.id, receiverId: otherUser.id });
    }, 1000);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUser.id,
      receiverId: otherUser.id,
      timestamp: new Date(),
      read: false,
    };

    socket?.emit('message', message);
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="max-w-4xl w-full mx-auto bg-white shadow-lg">
        {/* Chat Header */}
        <div className="border-b p-4 bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={otherUser.avatar} />
                <AvatarFallback>
                  {otherUser.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{otherUser.name}</h2>
                <div className="text-sm">
                  {otherUser.isOnline ? (
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Online
                    </span>
                  ) : (
                    <span>
                      Last seen{' '}
                      {otherUser.lastSeen
                        ? format(otherUser.lastSeen, 'HH:mm')
                        : 'recently'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <PhoneCall className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="h-[calc(100vh-180px)] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentUser.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.senderId === currentUser.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{message.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.senderId === currentUser.id ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {format(new Date(message.timestamp), 'HH:mm')}
                    {message.senderId === currentUser.id && (
                      <span className="ml-2">
                        {message.read ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-gray-500 text-sm">
                {otherUser.name} is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t p-4 bg-white">
          <div className="flex items-center space-x-2">
            <Input
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;