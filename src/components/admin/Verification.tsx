import { Card } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FormData } from '../../types/doctorTypes';
import { getVerificationRequests, getVerifiedDoctors } from '@/services/admin/admin';
import errorHandler from '@/utils/errorHandler';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination';

const Verification = () => {
  const [pendingRequests, setpendingRequests] = React.useState<FormData[]>([]);
  const [approvedRequests, setapprovedRequests] = React.useState<FormData[]>([]);
  const [currentPageOfVerifiedDoctors, setCurrentPageOfVerifiedDoctors] = useState(1);
  const [pageSizeOfVerifiedDoctors, setPageSizeOfVerifiedDoctors] = useState('10'); 
  const [totalDocsOfVerifiedDoctors, setTotalDocsOfVerifiedDoctors] = useState(0);
  const [currentPageOfDocs, setCurrentPageOfDocs] = useState(1);
  const [pageSizeOfDocs, setPageSizeOfDocs] = useState('10'); 
  const [totalDocsOfDocs, setTotalDocsOfDocs] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    getRequests();
  }, []);

  useEffect(() => {
    getVerifiedDocs(currentPageOfVerifiedDoctors, Number(pageSizeOfVerifiedDoctors));
  }, [currentPageOfVerifiedDoctors, pageSizeOfVerifiedDoctors]);

  const getRequests = async () => {
    try {
      const response = await getVerificationRequests(currentPageOfDocs, Number(pageSizeOfDocs));
      if (response.status) {
        setpendingRequests(response.data.requests);
        setTotalDocsOfDocs(response.data.totalDocs);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const getVerifiedDocs = async (page: number, limit: number) => {
    try {
      const response = await getVerifiedDoctors(page, limit);
      if (response.status) {
        setTotalDocsOfVerifiedDoctors(response.data.totalDocs);
        setapprovedRequests(response.data.doctors);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handlePageChangeForVerifiedDoctors = (page: number) => {
    setCurrentPageOfVerifiedDoctors(page);
  };

  const handlePageSizeChangeForVerifiedDoctors = (newPageSize: string) => {
    setPageSizeOfVerifiedDoctors(newPageSize);
    setCurrentPageOfVerifiedDoctors(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPageOfDocs(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSizeOfDocs(newPageSize);
    setCurrentPageOfDocs(1);
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
        <Pagination
        currentPage={currentPageOfDocs}
        pageSize={Number(pageSizeOfDocs)}
        totalItems={totalDocsOfDocs}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
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
                    {doctor?.personalDetails?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doctor?.personalDetails?.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doctor?.personalDetails?.gender}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doctor?.personalDetails?.age}
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
        <Pagination
        currentPage={currentPageOfVerifiedDoctors}
        pageSize={Number(pageSizeOfVerifiedDoctors)}
        totalItems={totalDocsOfVerifiedDoctors}
        onPageChange={handlePageChangeForVerifiedDoctors}
        onPageSizeChange={handlePageSizeChangeForVerifiedDoctors}
      />
      </Card>
    </div>
  );
};

export default Verification;
