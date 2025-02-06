import React, { useState } from 'react';
import {
  Menu,
  X,
  Home,
  Calendar,
  IndianRupee ,
  BetweenHorizontalStart ,
  User,
  Settings,
  LogOut,
  MessageSquare,
  BellRing
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store/appStore';
import { logout } from '../../services/doctor/doctorAuth';
import errorHandler from '../../utils/errorHandler';
import { resetDoctor } from '../../redux/slices/doctorSlice';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useNotifications from '@/customhooks/useNotifications';
import { markAllAsRead, markAsRead } from '@/services/user/user';
import { INotification } from '@/types';

const sideLinks = [
  { name: 'Dashboard', icon: <Home className="h-5 w-5 mr-3" />, pathName: "/doctor/dashboard", },
  { name: 'Appointments', icon: <Calendar className="h-5 w-5 mr-3" />, pathName: "/doctor/appointments", },
  { name: 'Generate Slots', icon: <BetweenHorizontalStart className="h-5 w-5 mr-3" />, pathName: "/doctor/slots", },
  { name: 'Revenue', icon: <IndianRupee  className="h-5 w-5 mr-3" />, pathName: "/doctor/revenue", },
  
  { name: 'Profile', icon: <User className="h-5 w-5 mr-3" />, pathName: "/doctor/profile", },
  { name: 'Chat', icon: <MessageSquare className="h-5 w-5 mr-3"/>, pathName: "/doctor/chat"},
  { name: 'Settings', icon: <Settings className="h-5 w-5 mr-3" />, pathName: "/doctor/settings", },
];

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, removeNotification, removeAllNotifications } = useNotifications(doctor._id);

  const handleNotificationClick = async (notification: INotification) => {
    await markAsRead(notification._id);
    removeNotification(notification._id);
    if (notification.type === 'appointment') {
      navigate('/doctor/appointments');
    }
  }

  const handleRemoveAllNotifications = async () => {
    try {
      removeAllNotifications();
      await markAllAsRead(doctor._id);
    } catch (error) {
      errorHandler(error);
    }
  }

  const handleLogout = async () => {
    try {
      const response = await logout(doctor.email);
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-blue-700 text-white transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-blue-800">
          <span className="text-xl font-bold">MeetDoc Doctors</span>
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
       
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {sideLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.pathName}
                className={({ isActive }) => `flex items-center px-4 py-3 text-sm rounded-lg hover:bg-blue-800 ${isActive && "bg-blue-800"}`}
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </div>
          

          <div className="absolute bottom-8 w-full px-4 left-0">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow">
                  <LogOut className="h-5 w-5" /> <span>Logout</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to log out?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm h-16 flex items-center">
          <div className="flex items-center justify-between lg:justify-end w-full px-4">
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-4">
              {/* notification */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <BellRing className="h-7 w-7" />
                    {notifications.length > 0 && <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <span className="font-semibold">Notifications</span>
                    {notifications.length > 0 && <Button onClick={handleRemoveAllNotifications} variant="ghost" size="sm">Mark all as read</Button>}
                  </div>
                  {notifications.length > 0 ? notifications.map((notification) => (
                    <DropdownMenuItem key={notification._id} onClick={() => handleNotificationClick(notification)}>
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-gray-500">{notification.message}</p>
                      </div>
                    </DropdownMenuItem>
                  )) : (
                    <DropdownMenuItem>
                      <div className="flex flex-col gap-1">
                        <p className="text-gray-500 font-text-sm">No notifications</p>
                      </div>
                    </DropdownMenuItem>
                  )}
               
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="ml-auto flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, Dr {doctor.name}
                </span>
                <img
                  src={doctor.photo || "defaultprofilephoto.jpg"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              </div>
            </div>
          </div>
        </header>
        {/* Main Content Area */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
