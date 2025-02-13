// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Camera, CameraOff, Mic, MicOff, Phone } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import {
//   connectwebrtcSocket,
//   disconnectwebrtcSocket,
//   joinRoom,
//   onJoinRoom,
//   onPatientJoined,
//   sendSDP,
//   onOffer,
//   sendAnswer,
//   onAnswer,
//   onEndCall,
//   onNegotiationOffer,
//   sendNegotiationAnswer,
// } from '../redux/actions/webrtcAction';
// import { AppDispatch } from '../redux/store/appStore';
// import peerService from '../services/peer/peerService';
// import ReviewModal from '@/components/users/ReviewModal';
// import { getAppointment } from '@/services/user/user';

// const VideoCallPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { id: roomId } = useParams<{ id: string }>();
  
//   // State
//   const [isConnecting, setIsConnecting] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);
//   const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
//   const [reviewModalOpen, setReviewModalOpen] = useState(false);
//   const [doctorId, setDoctorId] = useState<string | null>(null);
  
//   // Refs
//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const localStreamRef = useRef<MediaStream | null>(null);
//   const isInitiatorRef = useRef(false);

//   // Handle incoming remote video stream
//   const handleRemoteStream = useCallback((event: RTCTrackEvent) => {
//     if (remoteVideoRef.current && event.streams[0]) {
//       remoteVideoRef.current.srcObject = event.streams[0];
//     }
//   }, []);

//   // Initialize local stream
//   const initializeLocalStream = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       localStreamRef.current = stream;
      
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }

//       stream.getTracks().forEach((track) => {
//         peerService.peer.addTrack(track, stream);
//       });

//       return stream;
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//       throw error;
//     }
//   }, []);

//   // Handle incoming offer
//   const handleOffer = useCallback(async (target: string, offer: RTCSessionDescriptionInit) => {
//     try {
//       await initializeLocalStream();
//       await peerService.peer.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await peerService.peer.createAnswer();
//       await peerService.peer.setLocalDescription(answer);
//       dispatch(sendAnswer(target, answer));
//       setRemoteSocketId(target);
//       setIsConnecting(false);
//     } catch (error) {
//       console.error('Error handling offer:', error);
//     }
//   }, [dispatch, initializeLocalStream]);

//   // Handle incoming answer
//   const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
//     try {
//       await peerService.peer.setRemoteDescription(new RTCSessionDescription(answer));
//       setIsConnecting(false);
//     } catch (error) {
//       console.error('Error handling answer:', error);
//     }
//   }, []);

//   // Setup WebRTC connection
//   useEffect(() => {
//     if (!roomId) return;

//     const setup = async () => {
//       dispatch(connectwebrtcSocket());
      
//       // Initialize peer connection
//       await peerService.initializePeerConnection();
//       peerService.peer.ontrack = handleRemoteStream;

//       // Join room
//       dispatch(joinRoom(roomId));

//       // Listen for new user joined
//       dispatch(onPatientJoined(async (payload) => {
//         isInitiatorRef.current = true;
//         setRemoteSocketId(payload.userSocketId);
//         await initializeLocalStream();
//         const offer = await peerService.getOffer();
//         if (offer) {
//           dispatch(sendSDP(payload.userSocketId, offer));
//         }
//       }));

//       // Listen for offer
//       dispatch(onOffer(async ({ target, offer }) => {
//         await handleOffer(target, offer);
//       }));

//       // Listen for answer
//       dispatch(onAnswer(async ({ answer }) => {
//         await handleAnswer(answer);
//       }));

//       // Listen for negotiation offer
//       dispatch(onNegotiationOffer(async ({ target, offer }) => {
//         const answer = await peerService.getAnswer(offer);
//         dispatch(sendNegotiationAnswer(target, answer as RTCSessionDescriptionInit));
//       }));

//       // Listen for call end
//       dispatch(onEndCall(() => {
//         endCall();
//       }));
//     };

//     setup();

//     return () => {
//       if (localStreamRef.current) {
//         localStreamRef.current.getTracks().forEach(track => track.stop());
//       }
//       peerService.closeConnection();
//       dispatch(disconnectwebrtcSocket({ target: remoteSocketId as string }));
//     };
//   }, [dispatch, roomId, handleRemoteStream, handleOffer, handleAnswer, initializeLocalStream]);

//   // Media control handlers
//   const toggleAudio = useCallback(() => {
//     if (localStreamRef.current) {
//       const audioTrack = localStreamRef.current.getAudioTracks()[0];
//       audioTrack.enabled = !audioTrack.enabled;
//       setIsMuted(!isMuted);
//     }
//   }, [isMuted]);

//   const toggleVideo = useCallback(() => {
//     if (localStreamRef.current) {
//       const videoTrack = localStreamRef.current.getVideoTracks()[0];
//       videoTrack.enabled = !videoTrack.enabled;
//       setIsVideoOff(!isVideoOff);
//     }
//   }, [isVideoOff]);

//   const endCall = useCallback(async () => {
//     // Stop all tracks
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach(track => track.stop());
//       localStreamRef.current = null;
//     }

//     // Clear video elements
//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = null;
//     }
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = null;
//     }

//     // Close peer connection
//     await peerService.closeConnection();
    
//     // Disconnect socket
//     dispatch(disconnectwebrtcSocket({ target: remoteSocketId as string }));

//     // Show review modal if appointment exists
//     if (roomId) {
//       try {
//         const response = await getAppointment(roomId);
//         if (response.status) {
//           setDoctorId(response.data.appointment.doctorId);
//           setReviewModalOpen(true);
//         }
//       } catch (error) {
//         console.error('Error fetching appointment:', error);
//       }
//     }
//   }, [dispatch, remoteSocketId, roomId]);

//   if (isConnecting) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <Card className="p-8 text-center">
//           <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-800">
//             Connecting to call...
//           </h2>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <>
//       {reviewModalOpen && <ReviewModal doctorId={doctorId as string} appointmentId={roomId as string} />}
//       <div className="relative h-screen bg-black flex flex-col">
//         <div className="flex-grow relative">
//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             className="absolute inset-0 w-full h-full object-cover"
//           />
//           <video
//             ref={localVideoRef}
//             autoPlay
//             playsInline
//             muted
//             className="absolute bottom-4 right-4 w-1/4 max-w-[300px] aspect-video object-cover rounded-lg border-2 border-white"
//           />
//         </div>
        
//         <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-6">
//           <div className="bg-gray-800/70 rounded-full p-2 flex space-x-4">
//             <Button
//               onClick={toggleAudio}
//               variant={isMuted ? 'destructive' : 'secondary'}
//               className="rounded-full p-3"
//             >
//               {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
//             </Button>
//             <Button
//               onClick={toggleVideo}
//               variant={isVideoOff ? 'destructive' : 'secondary'}
//               className="rounded-full p-3"
//             >
//               {isVideoOff ? <CameraOff className="h-6 w-6" /> : <Camera className="h-6 w-6" />}
//             </Button>
//             <Button
//               onClick={endCall}
//               variant="destructive"
//               className="rounded-full p-3"
//             >
//               <Phone className="h-6 w-6" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default VideoCallPage;


import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, CameraOff, Mic, MicOff, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  connectwebrtcSocket,
  disconnectwebrtcSocket,
  joinRoom,
  onJoinRoom,
  onPatientJoined,
  sendSDP,
  onOffer,
  sendAnswer,
  onAnswer,
  onEndCall,
  onNegotiationOffer,
  sendNegotiationAnswer,
} from '../redux/actions/webrtcAction';
import { AppDispatch } from '../redux/store/appStore';
import peerService from '../services/peer/peerService';
import ReviewModal from '@/components/users/ReviewModal';
import { getAppointment } from '@/services/user/user';

const VideoCallPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id: roomId } = useParams<{ id: string }>();
  
  // State
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  
  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const isInitiatorRef = useRef(false);
  const peerConnectionEstablished = useRef(false);

  // Handle incoming remote video stream
  const handleRemoteStream = useCallback((event: RTCTrackEvent) => {
    console.log('Remote track received:', event.streams[0]);
    if (remoteVideoRef.current && event.streams[0]) {
      remoteVideoRef.current.srcObject = event.streams[0];
    }
  }, []);

  // Initialize local stream
  const initializeLocalStream = useCallback(async () => {
    try {
      if (localStreamRef.current) {
        return localStreamRef.current;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }, []);

  // Add tracks to peer connection
  const addTracksToConnection = useCallback((stream: MediaStream) => {
    const senders = peerService.peer.getSenders();
    if (senders.length === 0) {
      stream.getTracks().forEach((track) => {
        peerService.peer.addTrack(track, stream);
      });
    }
  }, []);

  // Handle incoming offer
  const handleOffer = useCallback(async (target: string, offer: RTCSessionDescriptionInit) => {
    try {
      if (peerService.peer.signalingState !== "stable") {
        console.log('Ignoring offer in non-stable state');
        return;
      }

      const stream = await initializeLocalStream();
      addTracksToConnection(stream);
      
      await peerService.peer.setRemoteDescription(offer);
      const answer = await peerService.peer.createAnswer();
      await peerService.peer.setLocalDescription(answer);
      
      dispatch(sendAnswer(target, answer));
      setRemoteSocketId(target);
      setIsConnecting(false);
      peerConnectionEstablished.current = true;
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }, [dispatch, initializeLocalStream, addTracksToConnection]);

  // Handle incoming answer
  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    try {
      if (peerService.peer.signalingState === "stable") {
        console.log('Ignoring answer in stable state');
        return;
      }

      await peerService.peer.setRemoteDescription(answer);
      setIsConnecting(false);
      peerConnectionEstablished.current = true;
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }, []);

  // Create and send offer
  const createAndSendOffer = useCallback(async (targetId: string) => {
    try {
      if (!peerConnectionEstablished.current) {
        const stream = await initializeLocalStream();
        addTracksToConnection(stream);
        
        const offer = await peerService.peer.createOffer();
        await peerService.peer.setLocalDescription(offer);
        dispatch(sendSDP(targetId, offer));
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }, [dispatch, initializeLocalStream, addTracksToConnection]);

  // Setup WebRTC connection
  useEffect(() => {
    if (!roomId) return;

    const setup = async () => {
      // Reset peer connection
      const peer = await peerService.initializePeerConnection();
      peerConnectionEstablished.current = false;
      
      // Setup event handlers
      peerService.peer.ontrack = handleRemoteStream;
      
      // Connect to socket and join room
      dispatch(connectwebrtcSocket());
      dispatch(joinRoom(roomId));

      // Listen for new user joined
      dispatch(onPatientJoined(async (payload) => {
        console.log('New user joined:', payload.userSocketId);
        isInitiatorRef.current = true;
        setRemoteSocketId(payload.userSocketId);
        await createAndSendOffer(payload.userSocketId);
      }));

      // Listen for offer
      dispatch(onOffer(async ({ target, offer }) => {
        console.log('Received offer from:', target);
        await handleOffer(target, offer);
      }));

      // Listen for answer
      dispatch(onAnswer(async ({ answer }) => {
        console.log('Received answer');
        await handleAnswer(answer);
      }));

      // Listen for negotiation offer
      dispatch(onNegotiationOffer(async ({ target, offer }) => {
        console.log('Received negotiation offer');
        if (peerService.peer.signalingState === "stable") {
          const answer = await peerService.getAnswer(offer);
          dispatch(sendNegotiationAnswer(target, answer as RTCSessionDescriptionInit));
        }
      }));

      // Listen for call end
      dispatch(onEndCall(() => {
        console.log('Call ended by remote peer');
        endCall();
      }));
    };

    setup();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      peerService.closeConnection();
      dispatch(disconnectwebrtcSocket({ target: remoteSocketId as string }));
    };
  }, [
    dispatch, 
    roomId, 
    handleRemoteStream, 
    handleOffer, 
    handleAnswer, 
    createAndSendOffer
  ]);

  // Media control handlers
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!isMuted);
      }
    }
  }, [isMuted]);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!isVideoOff);
      }
    }
  }, [isVideoOff]);

  const endCall = useCallback(async () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Close peer connection
    await peerService.closeConnection();
    peerConnectionEstablished.current = false;
    
    // Disconnect socket
    dispatch(disconnectwebrtcSocket({ target: remoteSocketId as string }));

    // Show review modal if appointment exists
    if (roomId) {
      try {
        const response = await getAppointment(roomId);
        if (response.status) {
          setDoctorId(response.data.appointment.doctorId);
          setReviewModalOpen(true);
        }
      } catch (error) {
        console.error('Error fetching appointment:', error);
      }
    }
  }, [dispatch, remoteSocketId, roomId]);

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">
            Connecting to call...
          </h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      {reviewModalOpen && <ReviewModal doctorId={doctorId as string} appointmentId={roomId as string} />}
      <div className="relative h-screen bg-black flex flex-col">
        <div className="flex-grow relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-4 right-4 w-1/4 max-w-[300px] aspect-video object-cover rounded-lg border-2 border-white"
          />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-6">
          <div className="bg-gray-800/70 rounded-full p-2 flex space-x-4">
            <Button 
              onClick={toggleAudio} 
              variant={isMuted ? 'destructive' : 'secondary'}
              className="rounded-full p-3"
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            <Button 
              onClick={toggleVideo} 
              variant={isVideoOff ? 'destructive' : 'secondary'}
              className="rounded-full p-3"
            >
              {isVideoOff ? <CameraOff className="h-6 w-6" /> : <Camera className="h-6 w-6" />}
            </Button>
            <Button 
              onClick={endCall} 
              variant="destructive"
              className="rounded-full p-3"
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoCallPage;