import Header from '@/components/admin/Header';
import SideBar from '@/components/admin/SideBar';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';



const AdminLayout = () => {    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);  

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">         
            <Header  toggleSidebar={toggleSidebar} />
            <div className="flex flex-1">
                <SideBar isSidebarOpen={isSidebarOpen}  />
                <main className="flex-1 p-4 lg:p-8">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;