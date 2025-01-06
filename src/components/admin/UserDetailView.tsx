import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Camera, Calendar, Clock, User, MapPin, Phone, Mail, Briefcase } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IUser } from '@/interfaces/user/IUser';
import { getUser } from '@/services/admin/admin';
import errorHandler from '@/utils/errorHandler';
import demoProfile from '../../assets/heroimage.jpg'

interface Consultation {
  date: string;
  doctorName: string;
  specialization: string;
  status: 'completed' | 'cancelled' | 'upcoming';
  amount: number;
}

const UserDetailView = () => {
  const [user, setUser] = useState<Partial<IUser> | null>({

  });
  const { id } = useParams();
  const [imageError, setImageError] = useState<string | null>(null);
  
  // Sample appointment data - replace with actual data
  const appointmentData = [
    { month: 'Jan', appointments: 2 },
    { month: 'Feb', appointments: 3 },
    { month: 'Mar', appointments: 1 },
    { month: 'Apr', appointments: 4 },
    { month: 'May', appointments: 2 },
    { month: 'Jun', appointments: 3 },
  ];
  // Sample consultation history - replace with actual data
  const consultationHistory: Consultation[] = [
    {
      date: '2024-01-15',
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
      status: 'completed',
      amount: 150
    },
    {
      date: '2024-02-01',
      doctorName: 'Dr. Johnson',
      specialization: 'Dermatology',
      status: 'completed',
      amount: 120
    },
    // Add more consultation records as needed
  ];

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, []);
  
  const fetchUser = async (id: string) => {
    try {
      const response = await getUser(id);
      if (response) {
        console.log(response, "Response from get uiser");
        setUser(response.data);
      }
    } catch (error) {
      errorHandler(error);
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setImageError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    if (file.size > maxSize) {
      setImageError('Image size should be less than 5MB');
      return;
    }

    setImageError(null);
    // Handle the image upload to backend here
  };

  const getStatusColor = (status: Consultation['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'upcoming':
        return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image Section */}
            <div className="relative">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-100">
                <img 
                  src= {user?.photo || demoProfile }  
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <label 
                htmlFor="profile-upload" 
                className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50"
              >
                <Camera className="w-5 h-5 text-gray-600" />
              </label>
              <input
                id="profile-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{user?.name}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{user?.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span>{user?.occupation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Born </span>
                </div>
              </div>
            </div>
          </div>

          {imageError && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{imageError}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Address Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">District</p>
              <p className="font-medium">{ user?.address?.district}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Locality</p>
              <p className="font-medium">{user?.address?.locality}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">State</p>
              <p className="font-medium">{user?.address?.state}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Country</p>
              <p className="font-medium">{user?.address?.country}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pincode</p>
              <p className="font-medium">{ user?.address?.pincode}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Graph */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Appointment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Consultation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Consultation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultationHistory.map((consultation, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(consultation.date).toLocaleDateString()}</TableCell>
                  <TableCell>{consultation.doctorName}</TableCell>
                  <TableCell>{consultation.specialization}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                      {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">${consultation.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailView;