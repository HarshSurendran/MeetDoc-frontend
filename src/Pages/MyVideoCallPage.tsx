import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector, } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, CameraOff, Mic, MicOff, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  connectwebrtcSocket,
  disconnectwebrtcSocket,
  joinRoom,
  onPatientJoined,
  sendSDP,
  onOffer,
  sendAnswer,
  onAnswer,
  onEndCall,
  onNegotiationOffer,
  sendNegotiationAnswer,
  negotiationNeeded,
  onNegotiationAnswer,
  sendIceCandidate,
  onIceCandidate,
} from '../redux/actions/webrtcAction';
import { AppDispatch, RootState,} from '../redux/store/appStore';
import ReviewModal from '@/components/users/ReviewModal';
import { getAppointment } from '@/services/user/user';
import { initializePeerConnection } from '@/services/peer/myPeerService';

const MyVideoCallPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id: roomId } = useParams<{ id: string }>();
  const doctor = useSelector((state: RootState) => state.doctor.doctor._id);
  const navigate = useNavigate();
  
  // State
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  
  // Refs
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const isInitiatorRef = useRef(false);
  const peerConnectionEstablished = useRef(false);
  const remoteSocketIdRef = useRef<string | null>(null);


  const handleRemoteStream = useCallback((stream: MediaStream) => {
    console.log("remotevideoREf and stream ", remoteVideoRef.current, stream.getTracks());
    if (remoteVideoRef.current && stream) {
      console.log('Handling remote stream adding to remotevideo elelemtn:');
      remoteVideoRef.current.srcObject = stream;
    }
  }, []);

  const initializeLocalStream = useCallback(async () => {
    try {
      console.log('Initializing local stream');
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

  const addTracksToConnection = useCallback((stream: MediaStream) => {
    try {
      if (peerRef.current) {
        console.log('Adding tracks to peerRef.current connection');
        const senders = peerRef.current.getSenders();
        if (senders.length === 0) {
          stream.getTracks().forEach((track) => {
            peerRef.current?.addTrack(track, stream);
          });
        }
      }
    } catch (error) {
      console.log('Error adding tracks to connection:', error);
    }
  }, []);

  const handleOffer = useCallback(async (target: string, offer: RTCSessionDescriptionInit) => {
    try {
      if (peerRef.current) {
        if (peerRef.current.signalingState !== "stable") {
          console.log('Ignoring offer in non-stable state');
          return;
        }

        const stream = await initializeLocalStream();
        addTracksToConnection(stream);
      
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);
      
        dispatch(sendAnswer(target, answer));
        setIsConnecting(false);
        peerConnectionEstablished.current = true;
      } else {
        console.log('Peer connection not established');
      }
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }, [dispatch, initializeLocalStream, addTracksToConnection]);

  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    try {
      if (peerRef.current) {
        if (peerRef.current.signalingState === "stable") {
          console.log('Ignoring answer in stable state');
          return;
        }

        await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setIsConnecting(false);
        peerConnectionEstablished.current = true;
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }, []);

  const createAndSendOffer = useCallback(async (targetId: string) => {
    try {
      console.log("checking peer ", peerRef.current)
      if (!peerConnectionEstablished.current && peerRef.current) {
        console.log('Creating and sending offer');
        const stream = await initializeLocalStream();
        addTracksToConnection(stream);
        
        const offer = await peerRef.current.createOffer();
        await peerRef.current.setLocalDescription(new RTCSessionDescription(offer));
        dispatch(sendSDP(targetId, offer));
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }, [dispatch, initializeLocalStream, addTracksToConnection]);
    
  const sendNegotiationOffer = useCallback(async (targetId: string) => {
    try {
      if (!peerConnectionEstablished.current && peerRef.current) {
        const stream = await initializeLocalStream();
        addTracksToConnection(stream);
        
        const offer = await peerRef.current.createOffer();
        await peerRef.current.setLocalDescription(new RTCSessionDescription(offer));
        dispatch(negotiationNeeded(targetId, offer));
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }, [dispatch, initializeLocalStream, addTracksToConnection]);
    
  const handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      console.log("Sendign new ICE candidate");
      if (remoteSocketIdRef.current) {
        dispatch(sendIceCandidate(remoteSocketIdRef.current as string, event.candidate));
      }
    }
  }
    
  function handleICEConnectionStateChangeEvent() {
    if (peerRef.current) {
      console.log("ICE connection state changed to -----------------------------------: ", peerRef.current.iceConnectionState);
      switch (peerRef.current.iceConnectionState) {
        case "closed":
        case "failed":
          endCall();
          break;
      }
    }
  }

  function handleSignalingStateChangeEvent() {
    if (peerRef.current) {
      console.log("Signaling state changed to: ", peerRef.current.signalingState);
      switch (peerRef.current.signalingState) {
        case "closed":
          endCall();
          break;
      }
    }
  }

  // Set remote socket id
  useEffect(() => {
    remoteSocketIdRef.current = remoteSocketId;
  }, [remoteSocketId]);

  // Setup WebRTC connection
  useEffect(() => {
    if (!roomId) return;
    const setup = async () => {
      peerConnectionEstablished.current = false;
      const pc: RTCPeerConnection = await initializePeerConnection();
      console.log('Peer connection created:', pc);
      peerRef.current = pc;
        
      if (!roomId || !peerRef.current) {
        console.log("Room id or peer not defined");
        return;
      }
      
      peerRef.current.onnegotiationneeded = async () => {
        console.log('Negotiation needed event listener of peerRef.current connection called. 123123123');
        sendNegotiationOffer(remoteSocketId as string);
      };

      peerRef.current.onicecandidate = async (event) => {
        handleICECandidateEvent(event);
      }

      peerRef.current.ontrack = event => {
        const remoteStream = event.streams[0];
        console.log("Remote stream received", remoteStream.getTracks());
        handleRemoteStream(remoteStream);
      };
          
      // peerRef.current.onremovetrack = handleRemoveTrackEvent;
      peerRef.current.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
      peerRef.current.onsignalingstatechange = handleSignalingStateChangeEvent;
          
      dispatch(connectwebrtcSocket());
      dispatch(joinRoom(roomId));

      dispatch(onPatientJoined(async (payload) => {
        console.log('New patient joined:', payload.userSocketId);
        isInitiatorRef.current = true;
        setRemoteSocketId(payload.userSocketId);
        console.log("remote socket id", remoteSocketId);
        await createAndSendOffer(payload.userSocketId);
      }));

      dispatch(onOffer(async ({ target, offer }) => {
        console.log('Received offer from:', target);
        setRemoteSocketId(target);
        await handleOffer(target, offer);
      }));

      dispatch(onAnswer(async ({ answer }) => {
        console.log('Received answer');
        await handleAnswer(answer);
      }));

      dispatch(onNegotiationOffer(async ({ target, offer }) => {
        console.log('Received negotiation offer');
        try {
          if (peerRef.current) {
            if (peerRef.current.signalingState !== "stable") {
              console.log('Ignoring offer in non-stable state');
              return;
            }
  
            const stream = await initializeLocalStream();
            addTracksToConnection(stream);
      
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerRef.current.createAnswer();
            await peerRef.current.setLocalDescription(answer);
      
            dispatch(sendNegotiationAnswer(target, answer));
            setRemoteSocketId(target);
            setIsConnecting(false);
            peerConnectionEstablished.current = true;
          }
        } catch (error) {
          console.error('Error handling negotiation offer and creating answer:', error);
        }
      }));

      dispatch(onNegotiationAnswer(async ({ answer }) => {
        console.log('Received negotiation answer');
        await handleAnswer(answer);
      }));
        
      dispatch(onIceCandidate(async (candidate) => {
        console.log('Received ICE candidate---------------------yeyyyyyyyyyyyyyyyy');
        const candidateObj = new RTCIceCandidate(candidate);
        await peerRef.current?.addIceCandidate(candidateObj);
      }));
        
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
      peerRef.current?.close();
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
    await peerRef.current?.close();
    peerConnectionEstablished.current = false;
    
    // Disconnect socket
    dispatch(disconnectwebrtcSocket({ target: remoteSocketId as string }));

    // Redirect to prescription page if doctor
    if (doctor) {
      console.log("reached doctor end call");
      navigate(`/doctor/prescription/${roomId}`);
      return
    }

    // Show review modal if user
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

  return (
    <>
      {isConnecting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center min-h-screen bg-gray-50">
          <Card className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">
              Connecting to call...
            </h2>
          </Card>
        </div>
      )}
      
      {reviewModalOpen ? <ReviewModal doctorId={doctorId as string} appointmentId={roomId as string} /> : <div className="relative h-screen bg-black flex flex-col">
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
      </div>}
    </>
  );
};

export default MyVideoCallPage;