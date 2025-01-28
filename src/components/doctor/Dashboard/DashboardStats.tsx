import React, { useEffect } from 'react';
import { Users, Star, IndianRupee } from 'lucide-react';
import { IStatsCardProps } from '@/types';
import { getDashboardData } from '@/services/doctor/doctor';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/appStore';

export interface IDashboardStats {
  title: string,
  value: number,
  icon: React.ReactNode,
  trend?: {
    isPositive: boolean,
    value: number
  }
}


const StatsCard: React.FC<IStatsCardProps> = ({ title, value, icon, trend }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {trend && (
          <p
            className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last
            month
          </p>
        )}
      </div>
      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
        {icon}
      </div>
    </div>
  </div>
);

const DashboardStats: React.FC = () => {
  const [appointmentCount, setAppointmentCount] = React.useState(0);
  const [totalIncome, setTotalIncome] = React.useState(0);
  const doctorRating = useSelector((state: RootState) => state.doctor.doctor.rating);
  
  useEffect(() => {
    getAllData()
  }, []);

  const getAllData = async () => {
    const response = await getDashboardData();
    if (response.status) {
      console.log(response.data);
      setAppointmentCount(response.data.appointmentCount);
      setTotalIncome(response.data.revenue);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">      
      <StatsCard
        title="Total Income"
        value={`₹${totalIncome}`}
        icon={<IndianRupee className="h-6 w-6" />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard
        title="Appointments"
        value={appointmentCount}
        icon={<Users className="h-6 w-6" />}
        trend={{ value: 8, isPositive: true }}
      />
      <StatsCard
        title="Rating"
        value={doctorRating || 0}
        icon={<Star className="h-6 w-6" />}
      />
    </div>
  );
};

export default DashboardStats;
