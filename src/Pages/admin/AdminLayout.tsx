import Header from '@/components/admin/Header';
import SideBar from '@/components/admin/SideBar';
import { Outlet } from 'react-router-dom';



const AdminLayout = () => {    
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">         
            <Header />
            <div className="flex flex-1">
                <SideBar />
                <main className="flex-1 p-4 lg:p-8">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;