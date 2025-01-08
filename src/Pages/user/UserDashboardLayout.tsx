import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  LogOut
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

const UserDashboardLayout = () => {
    const [currentPath, setCurrentPath] = useState('/dashboard');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Feedback', href: '/feedback', icon: MessageSquare },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  
    
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
                  <BellRing className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                  <span className="font-semibold">Notifications</span>
                  <Button variant="ghost" size="sm">Mark all as read</Button>
                </div>
                {/* Sample notifications */}
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">Appointment Reminder</p>
                    <p className="text-sm text-gray-500">Dr. Smith tomorrow at 10 AM</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">New Report Available</p>
                    <p className="text-sm text-gray-500">Your lab results are ready</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <img
                    src="Heroimageblue.png"
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
          {/* Quick Stats */}
          <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Upcoming Appointments
                </CardTitle>
                <Calendar className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">3</div>
                <p className="text-xs text-gray-500">Next: Tomorrow 10:00 AM</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Pending Reports
                </CardTitle>
                <FileText className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">2</div>
                <p className="text-xs text-gray-500">Lab results awaiting</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Recent Payments
                </CardTitle>
                <CreditCard className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">$150</div>
                <p className="text-xs text-gray-500">Last payment: 2 days ago</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Feedback Rating
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">4.8</div>
                <p className="text-xs text-gray-500">Based on 12 consultations</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-lg shadow">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;