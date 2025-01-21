import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Camera, CameraOff, Mic, MicOff, MonitorUp, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { connectwebrtcSocket, sendSDP, disconnectwebrtcSocket, joinRoom, onJoinRoom, onPatientJoined, onAnswer, sendAnswer, onOffer, negotiationNeeded, onNegotiationOffer, sendNegotiationAnswer, onNegotiationAnswer } from '../../redux/actions/webrtcAction';
import { AppDispatch } from '../../redux/store/appStore';
import peerService from '../../services/peer/peerService';


const VideoCallPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isLocalBig, setIsLocalBig] = useState<boolean>(false);
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const { id: appointmentId } = useParams<{ id: string }>();

  useEffect(() => {
    dispatch(connectwebrtcSocket());
    if (appointmentId) {
      dispatch(joinRoom(appointmentId));      
      dispatch(onJoinRoom((payload) => console.log("Recieved reply for join-room ", payload)));
      dispatch(onOffer((payload) => {
        console.log("Recieved offer ", payload)
        handleOnOffer(payload.target, payload.offer);
      } ));
      dispatch(onPatientJoined(async (payload) => {
        console.log("Patient joined ", payload.userSocketId);
        const offer = await peerService.getOffer();
        console.log("Offer created ", offer);
        if (offer) {
          console.log("This is the remote socket id", payload.userSocketId);
          dispatch(sendSDP(payload.userSocketId as string, offer));
          dispatch(onAnswer((payload) => handleOnAnswer(payload)));  
        }
        setRemoteSocketId(payload.userSocketId);
        startCall();
      }));
    }

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      dispatch(disconnectwebrtcSocket());
    };
  }, [dispatch, appointmentId]);

  useEffect(() => {
    peerService.peer.addEventListener('track', (event) => {
      console.log("Remote track added from useEffect ecent handler", event.streams[0]);
      if (remoteVideoRef.current) { 
        
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    })

  });

  useEffect(() => {
    peerService.peer.addEventListener('negotiationneeded', handleNegotiationNeeded);
    return () => {
      peerService.peer.removeEventListener('negotiationneeded', handleNegotiationNeeded);
    }
  })

  const startCall = async () => {
    try {
      console.log('Starting call');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      console.log('Stream:', stream);
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        peerService.peer.addTrack(track, stream);
      });

      // peerService.peer.ontrack = (event) => {
      //   console.log("Remote track added peer.ontrack methid", event.streams[0]);
      //   if (remoteVideoRef.current) {
      //     remoteVideoRef.current.srcObject = event.streams[0];
      //   }
      // };
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const handleNegotiationNeeded = useCallback(async (event: Event) => {
    event.preventDefault();
    const offer = await peerService.getOffer();
    console.log("Negotiation Offer created ", offer);
    if (offer) {
      console.log("This is the remote socket id", remoteSocketId);
      dispatch(negotiationNeeded(remoteSocketId as string, offer));
      dispatch(onNegotiationAnswer(async ({target, answer}) => {
        console.log("Recieved negotitation answer , call starts heere", target, answer);
        await peerService.setRemoteDescriptionFn(answer);
      }))
    }

  }, [remoteSocketId, dispatch])

  const handleOnAnswer = async (payload: { target: string, answer: RTCSessionDescriptionInit }) => {
    try {
      await peerService.setRemoteDescriptionFn(payload.answer);
      console.log("Call accepted.", payload.answer);
      setIsConnecting(false);
      // for(const track of localStreamRef.current!.getTracks()) {
      //   peerService.peer?.addTrack(track, localStreamRef.current!);
      // }
    } catch (error) {
      console.error('Error handling Answer:', error);
    }
  };

  const handleOnOffer = async (target: string, offer: RTCSessionDescriptionInit) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        peerService.peer.addTrack(track, stream);
      });
      setIsConnecting(false);
      console.log("Recieved offer and target", target);      
      const answer = await peerService.getAnswer(offer);
      dispatch(sendAnswer(target, answer as RTCSessionDescriptionInit));
      dispatch(onNegotiationOffer(async ({ target, offer }) => {
        console.log("Recieved negotiation offer", target);
        const answer = await peerService.getAnswer(offer);
        console.log("Answer created and sent to target", target);
        dispatch(sendNegotiationAnswer(target, answer as RTCSessionDescriptionInit));
      }));
     
    } catch (error) {
      console.error('Error handling Offer:', error);
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

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    dispatch(disconnectwebrtcSocket());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {isConnecting ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Connecting to call...</h2>
          </Card>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className={`grid ${isLocalBig ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'} gap-4`}>
            <div className={`relative ${isLocalBig ? 'md:col-span-3' : 'md:col-span-2'}`}>
              <video
                ref={isLocalBig ? localVideoRef : remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-[60vh] object-cover rounded-lg bg-gray-900"
              />
              <Button
                onClick={() => setIsLocalBig(!isLocalBig)}
                className="absolute top-4 right-4 bg-gray-800/70 hover:bg-gray-700"
              >
                <MonitorUp className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <video
                ref={isLocalBig ? remoteVideoRef : localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-[60vh] object-cover rounded-lg bg-gray-900"
              />
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              onClick={toggleAudio}
              variant={isMuted ? "destructive" : "default"}
              className="rounded-full p-4"
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            <Button
              onClick={toggleVideo}
              variant={isVideoOff ? "destructive" : "default"}
              className="rounded-full p-4"
            >
              {isVideoOff ? <CameraOff className="h-6 w-6" /> : <Camera className="h-6 w-6" />}
            </Button>
            <Button
              onClick={endCall}
              variant="destructive"
              className="rounded-full p-4"
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallPage;