import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Search, Users } from 'lucide-react';
import { IUser } from '../../interfaces/user/IUser';
import { getUsers, toggleBlock } from '../../services/admin/admin';
import errorHandler from '../../utils/errorHandler';

const UserManagementTable: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof IUser>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response: IUser[] = await getUsers();
      // console.log(response);
      if (response) {
        console.log(response);
        setUsers(response);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleBlock = async (_id: string) => {
    try {
      const response = await toggleBlock(_id);
      console.log();
      if (response) {
        setIsBlocked((isBlocked) => !isBlocked);
        setUsers(
          users.map((user) => {
            if (user._id === _id) {
              user.isBlocked = !user.isBlocked;
            }
            return user;
          })
        );
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

  const filteredUsers = users.filter(
    (user) =>
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">
                Occupation
              </th>
              {/* <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">Address</th> */}
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-blue-700 cursor-pointer"
                onClick={() => handleSort('rating')}
              >
                Rating <SortIcon field="rating" />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedUsers.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-500">{user.gender}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.occupation}
                </td>
                {/* <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="max-w-xs">
                    {`${user.address?.street}, ${user.address?.city}`}
                    <br />
                    {`${user.address?.state}, ${user.address?.country}`}
                  </div>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.rating}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleBlock(user._id)}
                    className={`px-3 py-1 rounded-md text-white font-semibold transition-colors duration-200 ${
                      user.isBlocked
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;
