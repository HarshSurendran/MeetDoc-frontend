import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { getDoctorsForLandingPage, getProfilePhoto } from "@/services/user/user";
import { useNavigate } from "react-router-dom";
import { IDoctorDetails } from "@/types";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/appStore";
import { Star } from "lucide-react";


const DoctorsSection = () => {
  const [doctors, setDoctors] = useState<IDoctorDetails[]>([
    { _id: "1", name: "Afsal Madathingal", specialisation: "General Medicine", rating: 4.5, photo: "heroimage.jpg" },
    { _id: "2", name: "Harsh Surendran", specialisation: "Cardiologist", rating: 4.2, photo: "heroimage.jpg" },
    { _id: "3", name: "SivaPrasad ", specialisation: "Gynac", rating: 4.2, photo: "heroimage.jpg" },
    { _id: "4", name: "Akhilesh N", specialisation: "General Medicine", rating: 3.8, photo: "heroimage.jpg" },
  ]);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.isAuthenticated);
    
  useEffect(() => {
    fetchDoctors();
  }, [])

  const handleClick = () => {
    if (user) {
      navigate("users/doctors");
    } else {
      toast("Please login to find a doctor.");
      navigate("/login");
    } 
  }

  const fetchDoctors = async () => {
    const response = await getDoctorsForLandingPage();
    if (response.status) {
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
  }
  
    return (
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Our Doctors</h2>
            <Button variant="outline" onClick={handleClick}>View All Doctors</Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor._id} onClick={()=> navigate(`/doctordetail/${doctor._id}`)} className="p-4  hover:shadow-lg transition-shadow">
                    <img src={doctor.photo || "doctor1.jpg" } alt={doctor.name} className="w-24 h-24 rounded-full mx-auto my-4" />
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
        </div>
      </div>
    );
};
  
export default DoctorsSection;
