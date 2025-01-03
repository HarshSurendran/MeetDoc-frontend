import React from 'react';
import DashboardLayout from './DashboardLayout';
import DashboardStats from '../../components/doctor/DashboardStats';
import AppointmentScheduler from '../../components/doctor/AppointmentScheduler';


const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardStats />
        <AppointmentScheduler />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;