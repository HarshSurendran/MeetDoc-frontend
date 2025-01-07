import { logout } from "@/services/doctor/doctorAuth";
import Button from "../comps/Button";
import { useDispatch } from "react-redux";
import { resetDoctor } from "@/redux/slices/doctorSlice";
import { useNavigate } from "react-router-dom";
import errorHandler from "@/utils/errorHandler";

interface CompletedPageProps {
    doctorId: string
}

const CompletedPage: React.FC<CompletedPageProps> = ({ doctorId }) => {  
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await logout(doctorId);
            if (response) {
              localStorage.setItem('doctorAccessToken', '');
              dispatch(resetDoctor());
              navigate('/doctor/login');
            }
          } catch (error) {
            errorHandler(error);
          }       
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
            <div className="p-6">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-center">CONGRATS</h2>
                    <p className="text-wrap text-gray-700 mx-3">
                    Welcome to our platform! We’re thrilled to have you join our community of dedicated healthcare professionals. Our officials will immediately verify your credentials and mail you about the verification and soon you can start your service in our platform. Thank You.
               
                    </p>
                    <div className="flex justify-evenly">
                        <Button type="button" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
                </div>
                </div>
        </div>

    );
};

export default CompletedPage;