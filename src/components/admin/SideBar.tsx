
import { Calendar, DollarSign, LogOut, Users } from 'lucide-react'
import React, {  useState } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
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
} from "@/components/ui/alert-dialog"
import { logout } from '@/services/admin/adminAuth';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/appStore';
import errorHandler from '@/utils/errorHandler';

const SideBar = () => {
    const sideMenu = [
        { name: 'Dashboard', icon: <Users className="h-5 w-5" />, pathName: "/admin/dashboard", },
        { name: 'Users', icon: <Users className="h-5 w-5" />, pathName: "/admin/users", },
        { name: 'Doctors', icon: <Users className="h-5 w-5" />, pathName: "/admin/doctors", },
        { name: 'Appointments', icon: <Calendar className="h-5 w-5" />, pathName: "/admin/appointments", },
        { name: 'Revenue', icon: <DollarSign className="h-5 w-5" />, pathName: "revenue", },
        { name: 'Verification', icon: <Users className="h-5 w-5" />, pathName: "verification", }
    ]

    const admin = useSelector((state: RootState) => state.admin.admin);
    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log("Logout clicked");
        try {
            const response = await logout(admin._id);
            if (response) {
                localStorage.setItem("adminAccessToken", "");
                navigate("/admin/login");
            }
        } catch (error) {
            errorHandler(error);
        }
        
    }
    
  

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r h-full sticky top-0">            
            <nav className=" p-4 space-y-2 flex-1 overflow-y-auto">
                {sideMenu.map((item) => (
                    <NavLink to={item.pathName}
                        key={item.name}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 w-full px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>
            {/* Logout Button */}            
            <div className="p-4 mt-auto">
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
        </aside>
    );
};

export default SideBar;
