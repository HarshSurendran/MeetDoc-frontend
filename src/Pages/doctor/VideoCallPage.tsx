// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { Camera, CameraOff, Mic, MicOff, MonitorUp, Phone } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import {
//   connectwebrtcSocket,
//   sendSDP,
//   disconnectwebrtcSocket,
//   joinRoom,
//   onJoinRoom,
//   onPatientJoined,
//   onAnswer,
//   sendAnswer,
//   onOffer,
//   negotiationNeeded,
//   onNegotiationOffer,
//   sendNegotiationAnswer,
//   onNegotiationAnswer,
// } from '../../redux/actions/webrtcAction';
// import { AppDispatch } from '../../redux/store/appStore';
// import peerService from '../../services/peer/peerService';

// const VideoCallPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [isConnecting, setIsConnecting] = useState<boolean>(true);
//   const [isMuted, setIsMuted] = useState<boolean>(false);
//   const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
//   const [isLocalBig, setIsLocalBig] = useState<boolean>(false);
//   const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);

//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const localStreamRef = useRef<MediaStream | null>(null);
//   const { id: appointmentId } = useParams<{ id: string }>();

//   useEffect(() => {
//     dispatch(connectwebrtcSocket());
//     if (appointmentId) {
//       dispatch(joinRoom(appointmentId));
//       dispatch(
//         onJoinRoom((payload) =>
//           console.log('Recieved reply for join-room ', payload)
//         )
//       );
//       dispatch(
//         onOffer((payload) => {
//           console.log('Recieved offer ', payload);
//           handleOnOffer(payload.target, payload.offer);
//         })
//       );
//       dispatch(
//         onPatientJoined(async (payload) => {
//           console.log('Patient joined ', payload.userSocketId);
//           const offer = await peerService.getOffer();
//           console.log('Offer created ', offer);
//           if (offer) {
//             console.log('This is the remote socket id', payload.userSocketId);
//             dispatch(sendSDP(payload.userSocketId as string, offer));
//             dispatch(onAnswer((payload) => handleOnAnswer(payload)));
//           }
//           setRemoteSocketId(payload.userSocketId);
//           startCall();
//         })
//       );
//     }

//     return () => {
//       if (localStreamRef.current) {
//         localStreamRef.current.getTracks().forEach((track) => track.stop());
//       }
//       dispatch(disconnectwebrtcSocket());
//     };
//   }, [dispatch, appointmentId]);

//   useEffect(() => {
//     peerService.peer.addEventListener('track', (event) => {
//       console.log(
//         'Remote track added from useEffect ecent handler',
//         event.streams[0]
//       );
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     });
//   });

//   useEffect(() => {
//     peerService.peer.addEventListener(
//       'negotiationneeded',
//       handleNegotiationNeeded
//     );
//     return () => {
//       peerService.peer.removeEventListener(
//         'negotiationneeded',
//         handleNegotiationNeeded
//       );
//     };
//   });

//   const startCall = async () => {
//     try {
//       console.log('Starting call');
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       console.log('Stream:', stream);
//       localStreamRef.current = stream;

//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }

//       stream.getTracks().forEach((track) => {
//         peerService.peer.addTrack(track, stream);
//       });

//       // peerService.peer.ontrack = (event) => {
//       //   console.log("Remote track added peer.ontrack methid", event.streams[0]);
//       //   if (remoteVideoRef.current) {
//       //     remoteVideoRef.current.srcObject = event.streams[0];
//       //   }
//       // };
//     } catch (error) {
//       console.error('Error starting call:', error);
//     }
//   };

//   const handleNegotiationNeeded = useCallback(
//     async (event: Event) => {
//       event.preventDefault();
//       const offer = await peerService.getOffer();
//       console.log('Negotiation Offer created ', offer);
//       if (offer) {
//         console.log('This is the remote socket id', remoteSocketId);
//         dispatch(negotiationNeeded(remoteSocketId as string, offer));
//         dispatch(
//           onNegotiationAnswer(async ({ target, answer }) => {
//             console.log(
//               'Recieved negotitation answer , call starts heere',
//               target,
//               answer
//             );
//             await peerService.setRemoteDescriptionFn(answer);
//           })
//         );
//       }
//     },
//     [remoteSocketId, dispatch]
//   );

//   const handleOnAnswer = async (payload: {
//     target: string;
//     answer: RTCSessionDescriptionInit;
//   }) => {
//     try {
//       await peerService.setRemoteDescriptionFn(payload.answer);
//       console.log('Call accepted.', payload.answer);
//       setIsConnecting(false);
//       // for(const track of localStreamRef.current!.getTracks()) {
//       //   peerService.peer?.addTrack(track, localStreamRef.current!);
//       // }
//     } catch (error) {
//       console.error('Error handling Answer:', error);
//     }
//   };

//   const handleOnOffer = async (
//     target: string,
//     offer: RTCSessionDescriptionInit
//   ) => {
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
//       setIsConnecting(false);
//       console.log('Recieved offer and target', target);
//       const answer = await peerService.getAnswer(offer);
//       dispatch(sendAnswer(target, answer as RTCSessionDescriptionInit));
//       dispatch(
//         onNegotiationOffer(async ({ target, offer }) => {
//           console.log('Recieved negotiation offer', target);
//           const answer = await peerService.getAnswer(offer);
//           console.log('Answer created and sent to target', target);
//           dispatch(
//             sendNegotiationAnswer(target, answer as RTCSessionDescriptionInit)
//           );
//         })
//       );
//     } catch (error) {
//       console.error('Error handling Offer:', error);
//     }
//   };

//   const toggleAudio = () => {
//     if (localStreamRef.current) {
//       const audioTrack = localStreamRef.current.getAudioTracks()[0];
//       audioTrack.enabled = !audioTrack.enabled;
//       setIsMuted(!isMuted);
//     }
//   };

//   const toggleVideo = () => {
//     if (localStreamRef.current) {
//       const videoTrack = localStreamRef.current.getVideoTracks()[0];
//       videoTrack.enabled = !videoTrack.enabled;
//       setIsVideoOff(!isVideoOff);
//     }
//   };

//   const endCall = () => {
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => track.stop());
//     }
//     dispatch(disconnectwebrtcSocket());
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       {isConnecting ? (
//         <div className="flex items-center justify-center min-h-[80vh]">
//           <Card className="p-8 text-center">
//             <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
//             <h2 className="text-xl font-semibold text-gray-800">
//               Connecting to call...
//             </h2>
//           </Card>
//         </div>
//       ) : (
//         <div className="max-w-6xl mx-auto">
//           <div
//             className={`grid ${isLocalBig ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'} gap-4`}
//           >
//             <div
//               className={`relative ${isLocalBig ? 'md:col-span-3' : 'md:col-span-2'}`}
//             >
//               <video
//                 ref={isLocalBig ? localVideoRef : remoteVideoRef}
//                 autoPlay
//                 playsInline
//                 className="w-full h-[60vh] object-cover rounded-lg bg-gray-900"
//               />
//               <Button
//                 onClick={() => setIsLocalBig(!isLocalBig)}
//                 className="absolute top-4 right-4 bg-gray-800/70 hover:bg-gray-700"
//               >
//                 <MonitorUp className="h-4 w-4" />
//               </Button>
//             </div>
//             <div className="relative">
//               <video
//                 ref={isLocalBig ? remoteVideoRef : localVideoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className="w-full h-[60vh] object-cover rounded-lg bg-gray-900"
//               />
//             </div>
//           </div>

//           <div className="flex justify-center items-center gap-4 mt-8">
//             <Button
//               onClick={toggleAudio}
//               variant={isMuted ? 'destructive' : 'default'}
//               className="rounded-full p-4"
//             >
//               {isMuted ? (
//                 <MicOff className="h-6 w-6" />
//               ) : (
//                 <Mic className="h-6 w-6" />
//               )}
//             </Button>
//             <Button
//               onClick={toggleVideo}
//               variant={isVideoOff ? 'destructive' : 'default'}
//               className="rounded-full p-4"
//             >
//               {isVideoOff ? (
//                 <CameraOff className="h-6 w-6" />
//               ) : (
//                 <Camera className="h-6 w-6" />
//               )}
//             </Button>
//             <Button
//               onClick={endCall}
//               variant="destructive"
//               className="rounded-full p-4"
//             >
//               <Phone className="h-6 w-6" />
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoCallPage;


// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Camera, CameraOff, Mic, MicOff, Phone } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import * as WebRTCActions from '../../redux/actions/webrtcAction';
// import { AppDispatch } from '../../redux/store/appStore';
// import peerService from '../../services/peer/peerService';
// import { toggleRedicrectToChat } from '@/redux/slices/chatSlice';

// const VideoCallPage: React.FC = () => {
  // const dispatch = useDispatch<AppDispatch>();
  // const navigate = useNavigate();
  // const [callState, setCallState] = useState({
  //   isConnecting: true,
  //   isMuted: false,
  //   isVideoOff: false,
  // });
  // const redirectToChat = useSelector((state: any) => state.chat.redirectToChat);

  // const localVideoRef = useRef<HTMLVideoElement>(null);
  // const remoteVideoRef = useRef<HTMLVideoElement>(null);
  // const localStreamRef = useRef<MediaStream | null>(null);
  // const { id: videoCallId } = useParams<{ id: string }>();

  // const updateCallState = (updates: Partial<typeof callState>) => {
  //   setCallState(prev => ({ ...prev, ...updates }));
  // };

  // const setupWebRTCListeners = useCallback(() => {
  //   dispatch(WebRTCActions.connectwebrtcSocket());
    
  //   if (!videoCallId) return;

  //   dispatch(WebRTCActions.joinRoom(videoCallId));
    
  //   const handlePatientJoined = async (payload: { userSocketId: string }) => {
  //     const offer = await peerService.getOffer();
  //     if (offer) {
  //       dispatch(WebRTCActions.sendSDP(payload.userSocketId, offer));
  //       await startCall();
  //     }
  //   };

  //   dispatch(WebRTCActions.onPatientJoined(handlePatientJoined));
    
  //   dispatch(WebRTCActions.onOffer(async ({ target, offer }) => {
  //     await handleOnOffer(target, offer);
  //   }));

  //   return () => {
  //     dispatch(WebRTCActions.disconnectwebrtcSocket());
  //   };
  // }, [dispatch, videoCallId]);

  // useEffect(() => {
  //   const cleanup = setupWebRTCListeners();
  //   return cleanup;
  // }, [setupWebRTCListeners]);

  // useEffect(() => {
  //   const handleRemoteTrack = (event: RTCTrackEvent) => {
  //     if (remoteVideoRef.current) {
  //       console.log("Remote track added", event.streams[0]);
  //       remoteVideoRef.current.srcObject = event.streams[0];
  //     }
  //   };

  //   peerService.peer.addEventListener('track', handleRemoteTrack);
  //   return () => {
  //     peerService.peer.removeEventListener('track', handleRemoteTrack);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (redirectToChat) {
  //     dispatch(toggleRedicrectToChat(false));
  //     navigate('/chat');
  //   }
  // }, [redirectToChat, navigate]);

  // const startCall = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
      
  //     localStreamRef.current = stream;
      
  //     if (localVideoRef.current) {
  //       localVideoRef.current.srcObject = stream;
  //     }

  //     stream.getTracks().forEach(track => {
  //       peerService.peer.addTrack(track, stream);
  //     });

  //     peerService.peer.ontrack = (event) => {
  //       console.log("Remote track added peer.ontrack methid", event.streams[0]);
  //       if (remoteVideoRef.current) {
  //         remoteVideoRef.current.srcObject = event.streams[0];
  //       }
  //     };

  //     updateCallState({ isConnecting: false });
  //   } catch (error) {
  //     console.error('Error starting call:', error);
  //   }
  // };

  // const handleOnOffer = async (target: string, offer: RTCSessionDescriptionInit) => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
      
  //     localStreamRef.current = stream;
      
  //     if (localVideoRef.current) {
  //       localVideoRef.current.srcObject = stream;
  //     }

  //     stream.getTracks().forEach(track => {
  //       peerService.peer.addTrack(track, stream);
  //     });

  //     const answer = await peerService.getAnswer(offer);
  //     dispatch(WebRTCActions.sendAnswer(target, answer as RTCSessionDescriptionInit));

  //     peerService.peer.ontrack = (event) => {
  //       console.log("Remote track added peer.ontrack methid", event.streams[0]);
  //       if (remoteVideoRef.current) {
  //         remoteVideoRef.current.srcObject = event.streams[0];
  //       }
  //     };
      
  //     updateCallState({ isConnecting: false });
  //   } catch (error) {
  //     console.error('Error handling Offer:', error);
  //   }
  // };

  // const toggleAudio = () => {
  //   if (localStreamRef.current) {
  //     const audioTrack = localStreamRef.current.getAudioTracks()[0];
  //     audioTrack.enabled = !audioTrack.enabled;
  //     updateCallState({ isMuted: !callState.isMuted });
  //   }
  // };

  // const toggleVideo = () => {
  //   if (localStreamRef.current) {
  //     const videoTrack = localStreamRef.current.getVideoTracks()[0];
  //     videoTrack.enabled = !videoTrack.enabled;
  //     updateCallState({ isVideoOff: !callState.isVideoOff });
  //   }
  // };

  // const endCall = () => {
  //   if (localStreamRef.current) {
  //     localStreamRef.current.getTracks().forEach(track => track.stop());
  //   }
  //   dispatch(WebRTCActions.disconnectwebrtcSocket());
  //   navigate(`/doctor/prescription`);
  // };



import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, CameraOff, Mic, MicOff, MonitorUp, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  connectwebrtcSocket,
  sendSDP,
  disconnectwebrtcSocket,
  joinRoom,
  onJoinRoom,
  onPatientJoined,
  onAnswer,
  sendAnswer,
  onOffer,
  negotiationNeeded,
  onNegotiationOffer,
  sendNegotiationAnswer,
  onNegotiationAnswer,
  onEndCall,
} from '../../redux/actions/webrtcAction';
import { AppDispatch } from '../../redux/store/appStore';
import peerService from '../../services/peer/peerService';

const VideoCallPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isLocalBig, setIsLocalBig] = useState<boolean>(false);
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const navigate = useNavigate();


  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const { id: appointmentId } = useParams<{ id: string }>();

  useEffect(() => {
    dispatch(connectwebrtcSocket());
    if (appointmentId) {
      dispatch(joinRoom(appointmentId));
      dispatch(
        onJoinRoom((payload) =>
          console.log('Recieved reply for join-room ', payload)
        )
      );
      // dispatch(
      //   onOffer((payload) => {
      //     console.log('Recieved offer ', payload);
      //     handleOnOffer(payload.target, payload.offer);
      //   })
      // );
      dispatch(
        onPatientJoined(async (payload) => {
          console.log('Patient joined ', payload.userSocketId);
          const offer = await peerService.getOffer();
          console.log('Offer created ', offer);
          if (offer) {
            console.log('This is the remote socket id', payload.userSocketId);
            dispatch(sendSDP(payload.userSocketId as string, offer));
            dispatch(onAnswer((payload) => handleOnAnswer(payload)));
          }
          setRemoteSocketId(payload.userSocketId);
          startCall();
        })
      );
    }

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      dispatch(disconnectwebrtcSocket({target: remoteSocketId as string}));
    };
  }, [dispatch, appointmentId]);

  const handleRemoteVideoStream = (event: RTCTrackEvent) => {
    console.log(
      'Remote track added from useEffect ecent handler',
      event.streams[0]
    );
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = event.streams[0];
    }
  }

  useEffect(() => {
    peerService.peer.addEventListener('track', handleRemoteVideoStream);
    return () => {
      peerService.peer.removeEventListener('track', handleRemoteVideoStream);
    }
  },[]);

  useEffect(() => {
    peerService.peer.addEventListener(
      'negotiationneeded',
      handleNegotiationNeeded
    );
    return () => {
      peerService.peer.removeEventListener(
        'negotiationneeded',
        handleNegotiationNeeded
      );
    };
  },[]);

  const startCall = async () => {
    try {
      console.log('Starting call');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log('Stream:', stream);
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        peerService.peer.addTrack(track, stream);
      });

      dispatch(onEndCall(() => {
        console.log('Call ended ');
        endCall();
      }));

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

  const handleNegotiationNeeded = useCallback(
    async (event: Event) => {
      event.preventDefault();
      const offer = await peerService.getOffer();
      console.log('Negotiation Offer created ', offer);
      if (offer) {
        console.log('This is the remote socket id', remoteSocketId);
        dispatch(negotiationNeeded(remoteSocketId as string, offer));
        dispatch(
          onNegotiationAnswer(async ({ target, answer }) => {
            console.log(
              'Recieved negotitation answer , call starts heere',
              target,
              answer
            );
            await peerService.setRemoteDescriptionFn(answer);
          })
        );
      }
    },
    [remoteSocketId, dispatch]
  );

  const handleOnAnswer = async (payload: {
    target: string;
    answer: RTCSessionDescriptionInit;
  }) => {
    try {
      await peerService.setRemoteDescriptionFn(payload.answer);
      console.log('Call accepted.', payload.answer);
      setIsConnecting(false);
      // for(const track of localStreamRef.current!.getTracks()) {
      //   peerService.peer?.addTrack(track, localStreamRef.current!);
      // }
    } catch (error) {
      console.error('Error handling Answer:', error);
    }
  };

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
      console.log('Recieved offer and target', target);
      const answer = await peerService.getAnswer(offer);
      dispatch(sendAnswer(target, answer as RTCSessionDescriptionInit));
      dispatch(
        onNegotiationOffer(async ({ target, offer }) => {
          console.log('Recieved negotiation offer', target);
          const answer = await peerService.getAnswer(offer);
          console.log('Answer created and sent to target', target);
          dispatch(
            sendNegotiationAnswer(target, answer as RTCSessionDescriptionInit)
          );
        })
      );
    } catch (error) {
      console.error('Error handling Offer:', error);
    }
  };

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
    navigate(`/doctor/prescription/${appointmentId}`);
  };

  function stopStream(stream: MediaStream) {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

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
  );
};

export default VideoCallPage;