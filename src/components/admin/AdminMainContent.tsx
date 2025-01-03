import { Card } from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';  
import { 
    Users, 
    Calendar, 
    DollarSign,
  } from 'lucide-react';

  const revenueData = [
    { day: 0, amount: 60 },
    { day: 1, amount: 5 },
    { day: 2, amount: 0 },
    { day: 3, amount: 35 },
    { day: 4, amount: 90 },
    { day: 5, amount: 95 },
    { day: 6, amount: 35 },
    { day: 7, amount: 28 },
    { day: 8, amount: 75 },
    { day: 9, amount: 58 }
  ];
  
  const comparisonData = [
    { name: 'Jan', users: 20, doctors: 15, appointments: 45 },
    { name: 'Feb', users: 28, doctors: 18, appointments: 25 },
    { name: 'Mar', users: 15, doctors: 12, appointments: 30 },
    { name: 'Apr', users: 25, doctors: 22, appointments: 35 },
    { name: 'May', users: 30, doctors: 15, appointments: 50 }
  ];

const AdminMainContent = () => {

  return (
    <>
    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { 
                title: 'Total Users', 
                value: '389',
                icon: <Users className="h-6 w-6 text-blue-600" />,
                bgColor: 'bg-blue-50'
              },
              { 
                title: 'Total Doctors', 
                value: '109',
                icon: <Users className="h-6 w-6 text-green-600" />,
                bgColor: 'bg-green-50'
              },
              { 
                title: 'Appointments', 
                value: '12',
                icon: <Calendar className="h-6 w-6 text-purple-600" />,
                bgColor: 'bg-purple-50'
              },
              { 
                title: 'Total Income', 
                value: '₹23,900',
                icon: <DollarSign className="h-6 w-6 text-orange-600" />,
                bgColor: 'bg-orange-50'
              }
            ].map((stat) => (
              <Card key={stat.title} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Comparative Analysis</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" fill="#2563eb" />
                    <Bar dataKey="doctors" fill="#16a34a" />
                    <Bar dataKey="appointments" fill="#9333ea" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Verification Table */}
          <Card className="overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Pending Verification</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Gender</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Age</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    {
                      name: 'Harsh Surendran',
                      email: 'harshsurendran@gmail.com',
                      gender: 'Male',
                      age: '24'
                    },
                    {
                      name: 'Harsh Surendran',
                      email: 'harshsurendran@gmail.com',
                      gender: 'Male',
                      age: '24'
                    }
                  ].map((user, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.gender}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.age}</td>
                      <td className="px-6 py-4 text-sm">
                        <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
                          Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
    </>
  )
}

export default AdminMainContent
