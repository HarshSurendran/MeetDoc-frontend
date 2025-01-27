import React, { useEffect, useRef, useState } from 'react'
import peerService from "../../services/peer/peerService";
import SocketService from '../../services/webrtcSocket/webrtcService'
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { io, Socket } from 'socket.io-client';
import { set } from 'date-fns';
import { Card } from '@/components/ui/card';
import { start } from 'repl';


const SOCKET_SERVER_URL = import.meta.env.VITE_WEBRTC_SOCKET_BASE_URL

const UserVideoCallTest = () => {
    const videoId = useParams().id;
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    const [connected, setConnected] = useState<boolean>(false);
    const count = useRef(0);
    const [isConnecting, setIsConnecting] = useState<boolean>(true);
    const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
    
    useEffect(() => {
        if (!videoId) {
            toast.error('Invalid video id. Please try again.');
            return
        }
        const socket = io(SOCKET_SERVER_URL || 'http://localhost:3000/webrtc', {            
            transports: ['websocket'],
        });        
        
        if (socket) {           
            setupListeners(socket);
            peerService.initializePeerConnection()

            peerService.peer.ontrack = (event) => {
                console.log("Ontrack event called. incoming remote stream")
                remoteStreamRef.current = event.streams[0];
            }

            
            // addLocalStreamToConnection();            
            socket.emit('join-room', {
                roomId: videoId
            });                
        } else {
            toast.error('Socket not initialized. Please try again.');
        }
        return () => {
            count.current++;           
            console.log('Disconnecting from socket for webrtc from cleanup function ', count.current);
            // turnOffListeners(socket);
            socket?.disconnect(); 
            if (localStreamRef.current) {
                console.log("stoping local stream from cleanup function");
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
            }
            peerService.closeConnection();
        }
    }, []);

    useEffect(() => {
        console.log("reached new usefvt",)
        if (localVideoRef.current && localStreamRef.current) {
            console.log("insode new localvideo")
          localVideoRef.current.srcObject = localStreamRef.current;
        }
       
    }, [localVideoRef.current, localStreamRef.current]);
    
    useEffect(() => {
        if (remoteVideoRef.current && remoteStreamRef.current) {
            remoteVideoRef.current.srcObject = remoteStreamRef.current;
        }
    }, [remoteVideoRef.current, remoteStreamRef.current]);


    // const addLocalStreamToConnection = async () => {       
    //     const stream = await navigator.mediaDevices.getUserMedia({
    //         video: true,
    //         audio: true,
    //     });
    //     localStreamRef.current = stream;

    //     stream.getTracks().forEach((track) => {
    //         console.log('Adding local track');
    //         peerService.peer.addTrack(track, stream);
    //     });

    //     peerService.peer.ontrack = (event) => {
    //         console.log('Received remote stream', remoteVideoRef.current);
    //         if (remoteVideoRef.current) {
    //             remoteVideoRef.current.srcObject = event.streams[0];
    //         }
    //     };

    //     if (localVideoRef.current) {
    //         localVideoRef.current.srcObject = stream;
    //     }
    // };    
    
    const setupListeners = async (socket: Socket) => {
        if (!socket) return;
        socket.on('connect', () => {
            console.log('Connected to WebSocket for webrtc', socket.id);
            setConnected(true);
        });        
        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket for webrtc');
        });
        socket.on('join-room', (payload) => {
            console.log('Recieved reply for join-room  ', payload);
        });
        // socket.on('NewUserJoined', async (payload) => {
        //     startCall();
        //     console.log('Recieved reply for NewUserJoined ', payload);
        //     setRemoteSocketId(payload.userSocketId);
        //     const offer = await peerService.getOffer();
        //     if (!offer) {
        //         console.log("offer not created");
        //         return
        //     }
        //     console.log("created offer ");
        //     socket.emit('offer', { target: payload.userSocketId, offer });
        
        // });
        // socket.on("answer", ({ target, answer }) => {
        //     console.log("Recieved answer from ", target);
        //     peerService.setRemoteDescriptionFn(answer);
        // });
        socket.on("offer", async ({ target, offer }) => {
            startCall();
            setRemoteSocketId(target);
            setIsConnecting(false);
            console.log("Recieved offer from ", target);
            const answer = await peerService.getAnswer(offer);
            socket.emit("answer", { target, answer });
          
        })
        socket.on("ice-candidate", ({ target, candidate }) => {
            console.log("Recieved ICE candidate from ", target);
            peerService.addIceCandidate(candidate);
        });
        socket.on("negotiation-needed", async ({ target, offer }) => {
            console.log("Recieved negotiation offer from ", target);
            const answer = await peerService.getAnswer(offer);
            socket.emit("negotiation-answer", { target, answer });
        });
        socket.on("negotiation-answer", async ({ target, answer }) => {
            console.log("Recieved negotiation answer from ", target);
            await peerService.setRemoteDescriptionFn(answer);
        });
        socket.on('end-call', (payload) => {
            console.log(`End call received from ${payload.target}`);
            peerService.peer?.close();
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            toast.success('Call ended');
        });
    }

    // const turnOffListeners = async (socket: Socket) => {
    //     if (!socket) return;
    //     console.log("Reached cleanup function to turn off events")

    //     socket.off('connect', () => {
    //         console.log('Connected to WebSocket for webrtc', socket.id);
    //         setConnected(true);
    //     });

    //     socket.off('disconnect', () => {
    //         console.log('Disconnected from WebSocket for webrtc');
    //     });

    //     socket.off('join-room', (payload) => {
    //         console.log('Recieved reply for join-room  ', payload);
    //     });
    //     socket.off('NewUserJoined', async (payload) => {
           
    //         console.log('Recieved reply for NewUserJoined ', payload);
    //         setRemoteSocketId(payload.userSocketId);
    //         const offer = await peerService.getOffer();
    //         if (!offer) {
    //             console.log("offer not created");
    //             return
    //         }
    //         console.log("created offer ");
    //         socket.emit('offer', { target: payload.userSocketId, offer });
        
    //     });
    //     socket.off("answer", ({ target, answer }) => {
    //         console.log("Recieved answer from ", target);
    //         peerService.setRemoteDescriptionFn(answer);
    //     });
    //     socket.off("ice-candidate", ({ target, candidate }) => {
    //         console.log("Recieved ICE candidate from ", target);
    //         peerService.addIceCandidate(candidate);
    //     });
    //     //Not needed in this file
    //     socket.off("negotiation-needed", async ({ target, offer }) => {
    //         console.log("Recieved negotiation offer from ", target);
    //         const answer = await peerService.getAnswer(offer);
    //         socket.emit("negotiation-answer", { target, answer });
    //     });
    //     socket.off("negotiation-answer", async ({ target, answer }) => {
    //         console.log("Recieved negotiation answer from ", target);
    //         await peerService.setRemoteDescriptionFn(answer);
    //     });
    //     socket.off('end-call', (payload) => {
    //         console.log(`End call received from ${payload.target}`);
    //         peerService.peer?.close();
    //         if (localStreamRef.current) {
    //             localStreamRef.current.getTracks().forEach(track => track.stop());
    //         }
    //         toast.success('Call ended');
    //     });
    // }

    const startCall = async () => {
        try {
            console.log('Starting call');
            setIsConnecting(false);
          
           
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            localStreamRef.current = stream;
    
            if (localVideoRef.current) {
                console.log('localVideoRef.current', localVideoRef.current);
                localVideoRef.current.srcObject = stream;
            }
    
            stream.getTracks().forEach((track) => {
                peerService.peer.addTrack(track, stream);
            });
    
            peerService.peer.ontrack = (event) => {
                console.log("remote stream iincoming")
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            }
          
        } catch (error) {
            console.error('Error starting call:', error);
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

  return  (
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
      
      {/* <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-6">
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
      </div> */}
    </div>
  );
}

export default UserVideoCallTest
