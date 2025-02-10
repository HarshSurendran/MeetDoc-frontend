import  { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Calendar,
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  User,
  Menu,
  BellRing,
  LogOut,
  MessageCircleMore,
  ClipboardPlus 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from '@/services/user/userAuth';
import NavigationLink from '@/components/users/NavigationLink';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser } from '@/redux/slices/userSlice';
import toast from 'react-hot-toast';
import errorHandler from '@/utils/errorHandler';
import { RootState } from '@/redux/store/appStore';
import useNotifications from '@/customhooks/useNotifications';
import { INotification } from '@/types';
import { markAllAsRead, markAsRead } from '@/services/user/user';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Chat', href: '/chat', icon: MessageCircleMore },
  { name: 'Prescriptions', href: '/prescription', icon: ClipboardPlus },
  { name: 'Your Reviews', href: '/reviews', icon: BellRing },
  { name: "Add Members", href: '/usermanagement', icon: Menu},
  { name: 'Profile', href: '/profile', icon: User },
];

const UserDashboardLayout = () => {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const { notifications, removeNotification, removeAllNotifications } = useNotifications(user._id);

    
  const handleLogout = async () => {
    try {
      const response = await logout(user._id);
      console.log(response, 'Response from axios.');
      dispatch(resetUser());
      localStorage.setItem('userAccessToken', '');
      toast.success('Successfully logged out!');
      navigate('/');
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleNotificationClick = async (notification: INotification) => {
    await markAsRead(notification._id);
    removeNotification(notification._id);
    if (notification.type === 'appointment') {
      navigate('/appointments');
    }

  }

  const handleRemoveAllNotifications = async () => {
    try {
      removeAllNotifications();
      await markAllAsRead(user._id);
    } catch (error) {
      errorHandler(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col gap-0">
                  <div className="border-b p-6">
                    <h2 className="text-xl font-bold text-blue-600">MeetDoc</h2>
                  </div>
                  <nav className="flex-1">
                    {navigation.map((item) => (
                      <NavigationLink key={item.name} item={item} currentPath={currentPath} setCurrentPath={setCurrentPath} isMobile={true} />
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <h2 className="text-xl font-bold text-blue-600">MeetDoc</h2>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
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

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="pl-1 relative h-10 w-16 rounded-full focus-visible:ring-0 hover:bg-white">
                  <img
                    src={user.photo || "defaultprofilephoto.png"}
                    alt="User"
                    className="rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden md:flex h-[calc(100vh-4rem)] w-64 flex-col border-r bg-white">
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => (
              <NavigationLink key={item.name} currentPath={currentPath} setCurrentPath={setCurrentPath} item={item} />
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6"> 
          <div className="bg-white rounded-lg shadow">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;