import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchIcon, Send, Video,  MoreVertical } from 'lucide-react';
import { 
  Card,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatSocketService } from '../../services/chat/chatService';
import { RootState } from '../../redux/store/appStore';

import { getMessages, getPatientsForChat, sendMessageApi, toggleIsRead } from '@/services/doctor/doctor';

import { changeLastMessage, setIsMessagesLoading, setIsPeopleLoading, setMessages, setPeoples, setSelectedUser } from '@/redux/slices/chatSlice';
import errorHandler from '@/utils/errorHandler';
import { User } from '@/types/chatTypes';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';



const DoctorChatInterface = () => {  
  // const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [messageInput, setMessageInput] = useState('');
  // const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  // const [patients, setPatients] = useState<Patient[]>([]);
  // const [typingUsers, setTypingUsers] = useState("");
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { selectedUser, messages, peoples, isMessagesLoading, isPeopleLoading, onlineUsers,} = useSelector((state: RootState) => state.chat);
  const {doctor, appointmentId} = useSelector((state: RootState) => state.doctor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  useEffect(() => {
    const token = localStorage.getItem('doctorAccessToken');
    if (token) {      
      chatSocketService.connect(token, doctor._id);
      fetchPeople();
    };    
    return () => {
      chatSocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "instant", block: "end" });
    }
  }, [messages]);
 
  const fetchPeople = useCallback(async () => {
    dispatch(setIsPeopleLoading(true));
    try {
      const response = await getPatientsForChat();
      if (response.status) {
        const transformedData = response.data.messages.map(({ _id, user, lastMessage, unreadCount }: { _id: string, user: any, lastMessage: any, unreadCount: number }) => ({
          id: _id.toString(),  
          name: user.name,
          avatar: user.photo || null, 
          lastMessage: lastMessage?.content || null, 
          lastSeen: lastMessage?.timestamp || new Date(), 
          unreadCount: unreadCount || 0,
          status: 'offline',
        }));
        dispatch(setPeoples(transformedData));      
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setIsPeopleLoading(false));
    }
     
  }, [])

  const fetchMessages = useCallback(async (patientId: string) => {
    dispatch(setIsMessagesLoading(true));
    try {
      const response = await getMessages(patientId);
      if (response.status) {
        dispatch(setMessages(response.data.messages));
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      dispatch(setIsMessagesLoading(false));
    }
  }, [selectedUser]);

  const handleSendMessage = async () => {
    if (messageInput.trim() && selectedUser) {
      const response = await  sendMessageApi(doctor._id, "doctor", selectedUser.id, messageInput);
      console.log("message sent", response);
      if (response?.status) {
        dispatch(setMessages([...messages, response.data]));
        dispatch(changeLastMessage({ userId: selectedUser.id, message: messageInput }));
      }
      chatSocketService.sendMessage(doctor._id, "doctor", selectedUser.id, messageInput);      
      setMessageInput('');
    }
  };

  const handleSelectUser = async (selectedUserData: User) => {
    dispatch(setSelectedUser(selectedUserData));
    console.log("selected user", selectedUserData)
    await toggleIsRead(doctor._id, selectedUserData.id);
  }

  const HandleVideoCall = async (selectedUser: User) => {
    if (appointmentId) {
      //todo: check whether appointment id matches the selected user
      const videoCallId = appointmentId;
      chatSocketService.sendVideoCallId(doctor._id, selectedUser.id, videoCallId);

      navigate(`/doctor/videocall/${videoCallId}`);
    } else {
      toast.error("Please select an appointment and start the call.");
    }
  }

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setMessageInput(e.target.value);
  //   if (selectedUser) {
  //     // chatSocketService.sendTypingStatus(selectedPatient.id);
  //   }
  // };

  const filteredPeoples = peoples.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="h-screen max-h-screen p-4 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full max-h-[calc(100vh-2rem)]">
        {/* Patient List */}
        <Card className="md:col-span-1 h-full">
          <div className="p-4 border-b">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {isPeopleLoading ? (
            //todo: change loading to shimmer 
            "Loading..."
          ) : (
          <ScrollArea className="h-[calc(100vh-10rem)]">
            {filteredPeoples.map((patient) => (
              <button
                key={patient.id}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-100 transition-colors ${
                  selectedUser?.id === patient.id ? 'bg-blue-50' : ''
                  }`}
                onClick={() => handleSelectUser(patient)}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={patient.avatar} />
                  <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold">{patient.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatTime(patient.lastSeen)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{patient.lastMessage}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`h-2 w-2 rounded-full ${
                      onlineUsers.includes(patient.id) ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-xs text-gray-500">{onlineUsers.includes(patient.id) ? 'online' : 'offline'}</span>
                  </div>
                </div>
                {patient.unreadCount ? (
                  <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {patient.unreadCount}
                  </span>
                ) : null}
              </button>
            ))}
        </ScrollArea>)
        }
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-3 h-full flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback>
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{selectedUser.name}</h2>
                    <p className="text-sm text-gray-500">
                    {onlineUsers.includes(selectedUser.id) 
                        ? 'Online'
                        : selectedUser.lastSeen 
                          ? `Last seen ${formatTime(selectedUser.lastSeen)}`
                          : 'Offline'
                      }
                      {/* {typingUsers[selectedUser.id] && ' • Typing...'} */}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button> */}
                  <Button variant="ghost" size="icon" onClick={()=> HandleVideoCall(selectedUser)}>
                    <Video className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>View Medical History</DropdownMenuItem>
                      <DropdownMenuItem>Block Patient</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages Area */}
              {isMessagesLoading ? "Loading..." :
                <ScrollArea className="flex-1 p-4 max-h-[calc(100vh-10rem)]">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={message._id}
                        ref={index === messages.length - 1 ? lastMessageRef : null}
                        className={`flex ${message.senderType == 'doctor' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${message.senderType == 'doctor'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                            }`}
                        >
                          <p>{message.content}</p>
                          <div className="flex justify-between">
                            <span className="text-xs opacity-70 mt-1 block">
                              {formatTime(message.timestamp)}
                            </span>
                            <span className="ml-2">
                              {message.senderType == 'doctor' ?  message.isRead ? '✓✓' : '✓' : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              }

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a patient to start chatting
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DoctorChatInterface;

