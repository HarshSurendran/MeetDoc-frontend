import { Card } from '@mui/material';
import React from 'react';
import { FormData } from '../../types/doctorTypes';
import { getVerificationRequests } from '@/services/admin/admin';
import errorHandler from '@/utils/errorHandler';
import { useNavigate } from 'react-router-dom';

const Verification = () => {
  const [pendingRequests, setpendingRequests] = React.useState<FormData[]>([]);
  const [approvedRequests, setapprovedRequests] = React.useState<FormData[]>(
    []
  );
  const navigate = useNavigate();

  React.useEffect(() => {
    getRequests();
  }, []);

  const getRequests = async () => {
    try {
      const res = await getVerificationRequests();
      const pendingData = res.data.filter(
        (doc: FormData) => doc.isVerified === false
      );
      setpendingRequests(pendingData);
      const approvedData = res.data.filter(
        (doc: FormData) => doc.isVerified === true
      );
      setapprovedRequests(approvedData);
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card className="overflow-hidden mb-6">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Pending Verification</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3  text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3  text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3  text-sm font-medium text-gray-500">
                  Gender
                </th>
                <th className="px-6 py-3  text-sm font-medium text-gray-500">
                  Age
                </th>
                <th className="px-6 py-3  text-sm font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingRequests.map((doctor) => (
                <tr key={doctor.doctorId}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {doctor?.personalDetails.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doctor?.personalDetails.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doctor?.personalDetails.gender}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doctor?.personalDetails.age}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      className="px-3 py-1 rounded-md bg-blue-50 text-blue-600  hover:bg-blue-100"
                      onClick={() =>
                        navigate(`/admin/doctordetails/${doctor.doctorId}`)
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="overflow-hidden mb-6">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Approved Verification</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3  text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3  text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3  text-sm font-medium text-gray-500">
                  Gender
                </th>
                <th className="px-6 py-3  text-sm font-medium text-gray-500">
                  Age
                </th>
                <th className="px-6 py-3  text-sm font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {approvedRequests.map((doctor) => (
                <tr key={doctor.doctorId}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {doctor?.personalDetails.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doctor?.personalDetails.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doctor?.personalDetails.gender}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doctor?.personalDetails.age}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      className="px-3 py-1 rounded-md bg-blue-50 text-blue-600  hover:bg-blue-100"
                      onClick={() =>
                        navigate(`/admin/doctordetails/${doctor.doctorId}`)
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Verification;
