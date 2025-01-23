import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/appStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { resetVideoCall } from '@/redux/slices/chatSlice';
import { chatSocketService } from '@/services/chat/chatService';

const CallNotificationModal: React.FC = () => {
    const dispatch = useDispatch();
    const chat = useSelector((state: RootState) => state.chat);
    const navigate = useNavigate();

  const handleAcceptCall = () => {
    if (chat.incomingVideoCall.isIncoming) {
      dispatch(resetVideoCall());
      chatSocketService.acceptVideoCall(chat.incomingVideoCall.from, chat.incomingVideoCall.to, chat.incomingVideoCall.videoCallId);
      navigate(`/video-call/${chat.incomingVideoCall.videoCallId}`);
    }
  };

  const handleRejectCall = () => {
    if (chat.incomingVideoCall.isIncoming) {
        dispatch(resetVideoCall());
        chatSocketService.rejectVideoCall(chat.incomingVideoCall.from, chat.incomingVideoCall.to, chat.incomingVideoCall.videoCallId);      
    }
  };

  if (!chat.incomingVideoCall.isIncoming) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2>Incoming Video Call</h2>
        <p>From: {chat.incomingVideoCall.from}</p>
        <div className="flex space-x-4 mt-4">
          <Button onClick={handleAcceptCall} variant="default">Accept</Button>
          <Button onClick={handleRejectCall} variant="destructive">Reject</Button>
        </div>
      </div>
    </div>
  );
};


export default CallNotificationModal
