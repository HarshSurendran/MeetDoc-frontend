import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Search, Users, MoreVertical, Edit } from 'lucide-react';
import { IUser } from '../../interfaces/user/IUser';
import { editUser, getUsers, toggleBlock } from '../../services/admin/admin';
import { useNavigate } from 'react-router-dom';
import errorHandler from '../../utils/errorHandler';
import EditUserModal from './EditUserModal';
import toast from 'react-hot-toast';

const UserManagementTable: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof IUser>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);  
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const fetchUser = async () => {
    try {
      const response: IUser[] = await getUsers();      
      if (response) {       
        setUsers(response);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleBlock = async (_id: string, event: React.MouseEvent) => {
    event.stopPropagation(); 
    try {
      const response = await toggleBlock(_id);      
      if (response) {
        setUsers(users.map((user) => {
          if (user._id === _id) {
            user.isBlocked = !user.isBlocked;
          }
          return user;
        }));
      }      
    } catch (error) {
      errorHandler(error);      
    }    
  };

  const handleSort = (field: keyof IUser) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (userId: string) => {
    navigate(`user/${userId}`);
  };

  const handleEditClick = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const userToEdit = users.find(user => user._id === userId);
    if (userToEdit) {
      setSelectedUser(userToEdit);
      setIsEditModalOpen(true);
    }
    setActiveDropdown(null);
  };

  const handleSaveUser = async (updatedUser: IUser) => {
    try {      
      const response = await editUser(updatedUser._id, updatedUser);
      if (response) {
        setUsers(users.map(user =>
          user._id === updatedUser._id ? updatedUser : user
        ));
        toast.success("Successfully edited.")
      }
      console.log(updatedUser, "Reached edit", response);
    } catch (error) {
      errorHandler(error);
    }
  };

  const toggleDropdown = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click
    setActiveDropdown(activeDropdown === userId ? null : userId);
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1;
    }
    return a[sortField] < b[sortField] ? 1 : -1;
  });



  const SortIcon: React.FC<{ field: keyof IUser }> = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline-block ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline-block ml-1" />
    );
  };

  return (
    <div className="p-3 max-w-full bg-white rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center text-blue-700">
          <Users className="w-6 h-6 mr-2" />
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-blue-50">
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-blue-700 cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name <SortIcon field="name" />
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-blue-700 cursor-pointer"
                onClick={() => handleSort('email')}
              >
                Email <SortIcon field="email" />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">Occupation</th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-blue-700 cursor-pointer"
                onClick={() => handleSort('rating')}
              >
                Rating <SortIcon field="rating" />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">Actions</th>              
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedUsers.map((user) => (
              <tr 
                key={user._id} 
                onClick={() => handleRowClick(user._id)}
                onMouseEnter={() => setHoveredRow(user._id)}
                onMouseLeave={() => {
                  setHoveredRow(null);
                  // Optional: Close dropdown when leaving row
                  // if (activeDropdown === user._id) {
                  //   setActiveDropdown(null);
                  // }
                }}
                className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.gender}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.occupation}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.rating}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2 dropdown-container">
                    <button 
                      onClick={(e) => handleBlock(user._id, e)}
                      className={`px-3 py-1 rounded-md text-white font-semibold transition-colors duration-200 ${
                        user.isBlocked
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>


                    <div className={`relative transition-opacity duration-150 ${
                      hoveredRow === user._id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <button
                        onClick={(e) => toggleDropdown(user._id, e)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-150"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                      {activeDropdown === user._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={(e) => handleEditClick(user._id, e)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
      {selectedUser && (
          <EditUserModal
            user={selectedUser}
            isOpen={isEditModalOpen}
          onClose={() => {
            setSelectedUser(null);
            setIsEditModalOpen(false)
          }
          }
            onSave={handleSaveUser}
          />
        )}
    </div>
    
  );
};

export default UserManagementTable;