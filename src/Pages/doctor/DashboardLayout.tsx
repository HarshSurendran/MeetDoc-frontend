import React, { useState } from 'react';
import { Menu, X, Home, Calendar, DollarSign, User, Settings, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store/appStore';
import { logout } from '../../services/doctor/doctorAuth';
import errorHandler from '../../utils/errorHandler';
import { resetDoctor } from '../../redux/slices/doctorSlice';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logout(doctor.email);
      if (response) {
        localStorage.setItem("doctorAccessToken", "");
        dispatch(resetDoctor());
        navigate("/doctor/login");
      }
    } catch (error) {
      errorHandler(error);      
    }

  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-blue-700 text-white transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 bg-blue-800">
          <span className="text-xl font-bold">MeetDoc</span>
          <button 
            className="lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* change a tag to Link tag */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            <a href="/dashboard" className="flex items-center px-4 py-3 text-sm rounded-lg bg-blue-800">
              <Home className="h-5 w-5 mr-3" />
              Dashboard
            </a>
            <a href="/appointments" className="flex items-center px-4 py-3 text-sm rounded-lg hover:bg-blue-800">
              <Calendar className="h-5 w-5 mr-3" />
              Appointments
            </a>
            <a href="/revenue" className="flex items-center px-4 py-3 text-sm rounded-lg hover:bg-blue-800">
              <DollarSign className="h-5 w-5 mr-3" />
              Revenue
            </a>
            <a href="/profile" className="flex items-center px-4 py-3 text-sm rounded-lg hover:bg-blue-800">
              <User className="h-5 w-5 mr-3" />
              Profile
            </a>
            <a href="/settings" className="flex items-center px-4 py-3 text-sm rounded-lg hover:bg-blue-800">
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </a>
          </div>

          <div className="absolute bottom-8 w-full px-4 left-0">
            <button onClick={handleLogout} className="flex items-center px-4 py-3 text-sm rounded-lg hover:bg-blue-800 w-full">
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm h-16 flex items-center">
          <div className="flex items-center justify-between w-full px-4">
            <button 
              className="lg:hidden" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-auto flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, Dr { doctor.name }</span>
              <img 
                src="pic from database"
                alt="Profile" 
                className="h-8 w-8 rounded-full"
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;