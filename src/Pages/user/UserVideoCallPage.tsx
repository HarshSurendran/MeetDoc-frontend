import React, { useEffect, useRef, useState } from 'react';
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
  sendAnswer,
  onOffer,
  onEndCall,
  onNegotiationOffer,
  sendNegotiationAnswer,
} from '../../redux/actions/webrtcAction';
import { AppDispatch } from '../../redux/store/appStore';
import peerService from '../../services/peer/peerService';
import ReviewModal from '@/components/users/ReviewModal';
import { getAppointment } from '@/services/user/user';

const UserVideoCallPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [doctorId, setDoctorId] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const { id: videoId } = useParams<{ id: string }>();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const navigate = useNavigate();
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(connectwebrtcSocket());
    if (videoId) {
      dispatch(joinRoom(videoId));
      dispatch(
        onJoinRoom((payload) =>
          console.log('Recieved reply for join-room ',)
        )
      );
      dispatch(
        onOffer((payload) => {
          console.log('Recieved offer ');
          setRemoteSocketId(payload.target);
          handleOnOffer(payload.target, payload.offer);
        })
      );
      dispatch(onEndCall(() => {
        console.log('Call ended ');
        endCall();
      }));
      // dispatch(
      //   onPatientJoined(async (payload) => {
      //     console.log('Patient joined ', payload.userSocketId);
      //     const offer = await peerService.getOffer();
      //     console.log('Offer created ', offer);
      //     if (offer) {
      //       console.log('This is the remote socket id', payload.userSocketId);
      //       dispatch(sendSDP(payload.userSocketId as string, offer));
      //       dispatch(onAnswer((payload) => handleOnAnswer(payload)));
      //     }
      //     setRemoteSocketId(payload.userSocketId);
      //     startCall();
      //   })
      // );
    }

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      dispatch(disconnectwebrtcSocket({target: remoteSocketId as string}));
    };
  }, [dispatch, videoId]);

  useEffect(() => {
    peerService.peer.addEventListener('track', handleRemoteVideoStream);

    return () => {
      peerService.peer.removeEventListener('track', handleRemoteVideoStream);
    };
  }, [] );

  const handleRemoteVideoStream = (event: RTCTrackEvent) => {
    console.log('Remote track added from useEffect ecent handler');
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = event.streams[0];
    }
  }
  
  const handleOnOffer = async (
    target: string,
    offer: RTCSessionDescriptionInit
  ) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        peerService.peer.addTrack(track, stream);
      });

      setIsConnecting(false);

      const answer = await peerService.getAnswer(offer);
      dispatch(sendAnswer(target, answer as RTCSessionDescriptionInit));
      dispatch(
        onNegotiationOffer(async ({ target, offer }) => {
          const answer = await peerService.getAnswer(offer);
          dispatch(
            sendNegotiationAnswer(target, answer as RTCSessionDescriptionInit)
          );
        })
      );
    } catch (error) {
      console.error('Error handling Offer:', error);
    }
  };

  function stopStream(stream: MediaStream) {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = async () => {
    
    if (localStreamRef.current) {      
          stopStream(localStreamRef.current);
          localStreamRef.current = null;
        }
      
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      
        if (peerService.peer) {
          peerService.peer.close();
        }
      
    dispatch(disconnectwebrtcSocket({ target: remoteSocketId as string }));
    
    if(videoId){
      const response = await getAppointment(videoId as string);
      if (response.status) {
        const appointmentData = response.data.appointment
        setDoctorId(appointmentData.doctorId);
      }
      setReviewModalOpen(true);
    }
  };

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
      {reviewModalOpen && <ReviewModal doctorId={doctorId as string} appointmentId={ videoId as string} /> }
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

export default UserVideoCallPage;