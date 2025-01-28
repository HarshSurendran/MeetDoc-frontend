import { Card } from '@/components/ui/card';
import { getGraphData } from '@/services/doctor/doctor';
import { ISingleData } from '@/types/IAdminDashboardData';
import { IDoctorDashboard, IDoctorDashboardDto } from '@/types/IDoctorDashboard';
import errorHandler from '@/utils/errorHandler';
import { useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


const DashboardComparativeAnalysis = () => {
    const [selectedYear, setSelectedYear] = useState("2025");
  const [graphDataDto, setGraphDataDto] = useState<IDoctorDashboardDto>();
  const [graphData, setGraphData] = useState<IDoctorDashboard[]>();

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      
      setSelectedYear(event.target.value);
    }

    useEffect(() => {
        fetchGraphData()
    }, []);
  
  useEffect(() => {
    if (!graphDataDto) return; 
    const transformedData = transformData(graphDataDto, parseInt(selectedYear));
    setGraphData(transformedData);
    }, [selectedYear]);

    const fetchGraphData = async () => {
        try {
            const response = await getGraphData();
          if (response.status) {
              console.log("graphdata",response.data)
            setGraphDataDto(response.data);
            const transformedData = transformData(response.data, parseInt(selectedYear));
            console.log("This is the transformed Data", transformedData);
            setGraphData(transformedData);
            
            }
        } catch (error) {
            errorHandler(error)
        }
  }
  
  function transformData(rawData: IDoctorDashboardDto, targetYear: number): IDoctorDashboard[] {
      const dataMap = new Map();
    
      const slotResults = rawData?.slots || [];
      const appointmentResults = rawData?.appointments || [];
    
      function insertData(results: ISingleData[], key: string) {
        results.forEach(({ _id, count }) => {
          if (_id.year === targetYear) {
            const monthName = monthNames[_id.month - 1];
            if (!dataMap.has(monthName)) {
              dataMap.set(monthName, { name: monthName, slots: 0, appointments: 0 });
            }
            dataMap.get(monthName)[key] = count;
          }
        });
      }
    
      insertData(slotResults, "slots");
      insertData(appointmentResults, "appointments");
    
      return monthNames
        .map((month) => dataMap.get(month) || { name: month, users: 0, doctors: 0, appointments: 0 })
        .filter((item) => item.slots || item.appointments);
    }


  return (
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
                <Bar dataKey="slots" fill="#2563eb" />
                <Bar dataKey="appointments" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
  )
}

export default DashboardComparativeAnalysis
