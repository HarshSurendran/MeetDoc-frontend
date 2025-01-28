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
  Legend,
} from 'recharts';
import { Users, Calendar, IndianRupee, GraduationCap  } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMonthlyData, getRevenueData, getVerificationRequests, totalData } from '@/services/admin/admin';
import errorHandler from '@/utils/errorHandler';
import { FormData } from '../../types/doctorTypes';
import { useNavigate } from 'react-router-dom';
import { IComparisonData, IComparisonDataDto, IRevenueDataDto, ISingleData, IRevenueData } from '@/types/IAdminDashboardData';


const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


const AdminDashboard: React.FC = () => {
  const [VerificationRequests, setVerificationRequests] = useState<FormData[]>([]);
  const [graphDataDto, setGraphDataDto] = useState<IComparisonDataDto>();
  const [graphData, setGraphData] = useState<IComparisonData[]>([]);
  const [revenueData, setRevenueData] = useState<IRevenueData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalDoctors, setTotalDoctors] = useState<number>(0);
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState(2023);
  const navigate = useNavigate();

  useEffect(() => {
    getRequests();
    getGraphData(selectedYear);
    getRevenueGraphData();    
    getTotalData();
    setTotalRevenue(getTotalRevenuePerYear(revenueData, selectedYear));
  }, []);

  useEffect(() => {
    if (!graphData) return;
    console.log(graphDataDto, "This is the graph data dto"); 
    setGraphData(transformData(graphDataDto as IComparisonDataDto, selectedYear));
    console.log(graphData,"This is the graph data");
  }, [selectedYear]);

  const getRequests = async () => {
    try {
      const res = await getVerificationRequests();
      const filteredData = res.data.filter(
        (doc: FormData) => doc.isVerified === false
      );
      setVerificationRequests(filteredData);
    } catch (error) {
      errorHandler(error);
    }
  };

  const transformRevenueData = (revenueData: IRevenueDataDto[]): IRevenueData[] => {
   
    const yearWiseRevenue: { [key: number]: { year: number, revenueByMonth: { [key: number]: number }, totalRevenue: number } } = {};

    revenueData.forEach(({ year, revenueByMonth, totalRevenue }) => {
      if (year !== null) {
        if (!yearWiseRevenue[year]) {
          yearWiseRevenue[year] = { year, revenueByMonth: {}, totalRevenue: 0 };
        }
        yearWiseRevenue[year].totalRevenue += totalRevenue;

        revenueByMonth.forEach(({ month, amount }) => {
          if (month !== null) {
            yearWiseRevenue[year].revenueByMonth[month] =
              (yearWiseRevenue[year].revenueByMonth[month] || 0) + amount;
          }
        });
      }
    });

    const formattedRevenueData = Object.values(yearWiseRevenue).map(({ year, revenueByMonth, totalRevenue }) => ({
      year,
      revenueByMonth: Object.entries(revenueByMonth)
        .map(([month, amount]) => ({ month: parseInt(month), amount }))
        .sort((a, b) => a.month - b.month),
      totalRevenue
    }));
    

    return formattedRevenueData;
  };

  const getTotalRevenuePerYear = (revenueData: IRevenueData[], selectedYear: number) => {
    return revenueData.find(item => item.year === selectedYear)?.totalRevenue || 0;
  };

  const getTotalData = async () => {
    try {
      const response = await totalData();
      if (response.status) {
        setTotalDoctors(response.data.doctors);
        setTotalUsers(response.data.users);
        setTotalAppointments(response.data.appointments);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const getRevenueGraphData = async () => {
    try {
      const response = await getRevenueData();
     
      if (response.status) {
        const formattedData: IRevenueData[] = transformRevenueData(response.data.result);
        setRevenueData(formattedData);
 
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  // const getGraphData = async (year: number) => {
  //   try {
  //     const response = await getMonthlyData();
  //     setGraphDataDto(response.data);
  //     if (response.status) {
  //       const transformedData: IComparisonData[] = transformData(response.data, year);
  //       setGraphData(transformedData);
  //     }
  //   } catch (error) {
  //     errorHandler(error);
  //   }
  // }

  const getGraphData = async (year: number) => {
    try {
      // setIsLoading(true); // Start loading
      const response = await getMonthlyData();
      setGraphDataDto(response.data);
      if (response.status) {
        const transformedData = transformData(response.data, year);
        setGraphData(transformedData);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      // setIsLoading(false); // End loading
    }
  };

  function handleYearChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const year = parseInt(event.target.value);
    setSelectedYear(year);
  };

  // function transformData(rawData: IComparisonDataDto, targetYear: number): IComparisonData[] {
  //   console.log("rawData", rawData);
  //   const dataMap = new Map();

  //   function insertData(results: ISingleData[], key: string) {
  //     results.forEach(({ _id, count }) => {
  //           if (_id.year === targetYear) {
  //               const monthName = monthNames[_id.month - 1];
  //               if (!dataMap.has(monthName)) {
  //                   dataMap.set(monthName, { name: monthName, users: 0, doctors: 0, appointments: 0 });
  //               }
  //               dataMap.get(monthName)[key] = count;
  //           }
  //       });
  //   }

  //   insertData(rawData?.userResults , "users");
  //   insertData(rawData?.doctorResults, "doctors");
  //   insertData(rawData?.appointmentResults, "appointments");

    
  //   return monthNames
  //       .map((month) => dataMap.get(month) || { name: month, users: 0, doctors: 0, appointments: 0 })
  //       .filter((item) => item.users || item.doctors || item.appointments); 
  // }
  
  function transformData(rawData: IComparisonDataDto, targetYear: number): IComparisonData[] {
    const dataMap = new Map();
  
    // Handle missing data with optional chaining and default to empty array
    const userResults = rawData?.userResults || [];
    const doctorResults = rawData?.doctorResults || [];
    const appointmentResults = rawData?.appointmentResults || [];
  
    function insertData(results: ISingleData[], key: string) {
      results.forEach(({ _id, count }) => {
        if (_id.year === targetYear) {
          const monthName = monthNames[_id.month - 1];
          if (!dataMap.has(monthName)) {
            dataMap.set(monthName, { name: monthName, users: 0, doctors: 0, appointments: 0 });
          }
          dataMap.get(monthName)[key] = count;
        }
      });
    }
  
    insertData(userResults, "users");
    insertData(doctorResults, "doctors");
    insertData(appointmentResults, "appointments");
  
    return monthNames
      .map((month) => dataMap.get(month) || { name: month, users: 0, doctors: 0, appointments: 0 })
      .filter((item) => item.users || item.doctors || item.appointments);
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: 'Total Users',
            value: {totalUsers},
            icon: <Users className="h-6 w-6 text-blue-600" />,
            bgColor: 'bg-blue-50',
          },
          {
            title: 'Total Doctors',
            value: {totalDoctors},
            icon: <GraduationCap className="h-6 w-6 text-green-600" />,
            bgColor: 'bg-green-50',
          },
          {
            title: 'Appointments',
            value: {totalAppointments},
            icon: <Calendar className="h-6 w-6 text-purple-600" />,
            bgColor: 'bg-purple-50',
          },
          {
            title: 'Total Income',
            value: {totalRevenue},
            icon: <IndianRupee className="h-6 w-6 text-orange-600" />,
            bgColor: 'bg-orange-50',
          },
        ].map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{Object.values(stat.value)[0]}</p>
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
              <LineChart data={revenueData.find(item => item.year === selectedYear)?.revenueByMonth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Comparative Analysis</h2>
            <div>
              <label htmlFor="year-select" className="sr-only">Select Year</label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={handleYearChange}
                className="p-2 border rounded-md"
              >
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphData}>
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

        {/* <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Comparative Analysis</h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphData}>
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
        </Card> */}
      </div>

      {/* Verification Table */}
      {VerificationRequests.length === 0 ? (
        ''
      ) : (
        <Card className="overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Pending Verification</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full ">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {VerificationRequests.map((doctor) => (
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
      )}
    </>
  );
};

export default AdminDashboard;
