import { io, Socket } from "socket.io-client"



class WebrtcSocketService {
    socket: Socket | null = null;

    constructor() {
       this.connect();
    }

    getSocketInstance() {
        return this.socket;
    }

    connect() {
        console.log("Reached conenct function hurraaaayyyyyy");
          
    }

    private 


}

export default new WebrtcSocketService();