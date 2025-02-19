import Pagination from '@/components/Pagination';
import { Card } from '@/components/ui/card';
import HeaderPostLogin from '@/components/users/HeaderPostLogin';
import { getAllDoctors, getProfilePhoto } from '@/services/user/user';
import { IDoctorDetails } from '@/types';
import errorHandler from '@/utils/errorHandler';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AllDoctorsPage = () => {
    const [doctors, setDoctors] = useState<IDoctorDetails[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState('10'); 
    const [totalDocs, setTotalDocs] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctors(currentPage, Number(pageSize));
    }, [pageSize, currentPage]);

    const fetchDoctors = async (page: number, limit:number) => {
        try {
            const response = await getAllDoctors(page, limit);
            if (response?.status) {
                    setTotalDocs(response.data.totalDocs)
                  let doctorArray = response.data.doctors;
                  const updatedDoctors = await Promise.all(
                    doctorArray.map(async (doctor: IDoctorDetails) => {
                      if (doctor.photo) {
                        const photoResponse = await getProfilePhoto(doctor.photo);
                        return { ...doctor, photo: photoResponse || doctor.photo };
                      }
                      return { ...doctor}
                    })
                  );
                  setDoctors(updatedDoctors);
                }
        } catch (error) {
            console.log("Entered page error handler")
            errorHandler(error);
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize: string) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    return (
        <>
        <HeaderPostLogin />
        <div className="py-10 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold">Our Doctors</h2>
                    {/* todo: Add Search button */}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {doctors.map((doctor) => (
                        <Card key={doctor._id} onClick={()=> navigate(`/doctordetail/${doctor._id}`)} className="p-4  hover:shadow-lg transition-shadow">
                        <img src={doctor.photo || "../../../public/doctor1.jpg" } alt={doctor.name} className="w-24 h-24 rounded-full mx-auto my-4" />
                        <div className="my-4 flex flex-col items-center">
                            <h3 className="font-semibold text-center">Dr. {doctor.name}</h3>
                            <h2 className="font-light">{doctor.specialisation}</h2>
                            <div className="flex gap-2 "> 
                             <h2 className="font-light">Rating : </h2>
                              <b>{doctor.rating}  </b>
                              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            </div>
                        </div>
                  </Card>
                    ))}
                </div>
            <Pagination
                currentPage={currentPage}
                pageSize={Number(pageSize)}
                totalItems={totalDocs}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
            </div>
            </div>
            </>

    );
}

export default AllDoctorsPage
