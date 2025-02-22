import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store/appStore';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const HeaderPostLogin = () => {
    const { user } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const handleProfileClick = () => {
        navigate('/dashboard');
    }
  return (
    <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-xl text-blue-600">MeetDoc</div>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
              <Link to="/" className="text-gray-600 hover:text-blue-600">Services</Link>
              <Link to="/" className="text-gray-600 hover:text-blue-600">About</Link>
              <Link to="/" className="text-gray-600 hover:text-blue-600">Contact</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleProfileClick}>Welcome, {user.name} <User className="h-5 w-5" /></Button>
              
            </div>
          </div>
        </div>
      </nav>
  )
}

export default HeaderPostLogin
