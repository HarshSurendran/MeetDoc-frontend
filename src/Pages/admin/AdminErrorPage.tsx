
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center bg-white shadow-lg rounded-lg p-8 max-w-md">
        <h1 className="text-5xl font-bold text-blue-600">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-2">
          Oops! The page you are looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="mt-6">
          <Button  onClick={() => navigate("/admin/dashboard")}>Go Home</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminErrorPage;
