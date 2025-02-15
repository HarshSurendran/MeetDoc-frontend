import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { getDoctorsForLandingPage, getProfilePhoto } from "@/services/user/user";
import { useNavigate } from "react-router-dom";
import { IDoctorDetails } from "@/types";



const DoctorsSection = () => {
  const [doctors, setDoctors] = useState<IDoctorDetails[]>([
    { _id: "1", name: "Afsal Madathingal", specialisation: "General Medicine", consultation: 783, photo: "heroimage.jpg" },
    { _id: "2", name: "Afsal Madathingal", specialisation: "General Medicine", consultation: 783, photo: "heroimage.jpg" },
    { _id: "3", name: "Afsal Madathingal", specialisation: "General Medicine", consultation: 783, photo: "heroimage.jpg" },
    { _id: "4", name: "Afsal Madathingal", specialisation: "General Medicine", consultation: 783, photo: "heroimage.jpg" },
  ]);
  const navigate = useNavigate();
    
  useEffect(() => {
    fetchDoctors();
  }, [])

  const fetchDoctors = async () => {
    const response = await getDoctorsForLandingPage();
    if (response.status) {
      let doctorArray = response.data.doctors;
      const updatedDoctors = await Promise.all(
        doctorArray.map(async (doctor: IDoctorDetails) => {
          const photoResponse = await getProfilePhoto(doctor.photo);
          return { ...doctor, photo: photoResponse || doctor.photo };
        })
      );
      console.log(updatedDoctors, "Updated Doctors");
      setDoctors(updatedDoctors);
      console.log(doctorArray)
    }
  }
  
    return (
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Our Doctors</h2>
            <Button variant="outline">View All Doctors</Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor._id} onClick={()=> navigate(`/doctordetail/${doctor._id}`)} className="p-4 text-center hover:shadow-lg transition-shadow">
                    <img src={doctor.photo} alt={doctor.name} className="w-24 h-24 rounded-full mx-auto my-4" />
                    <div className="my-4">
                        <h3 className="font-semibold text-center">Dr. {doctor.name}</h3>
                        <h2 className="font-light">{doctor.specialisation}</h2>
                        <h2 className="font-light">Consultations : <b>{doctor.consultation}</b></h2>
                    </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
};
  
export default DoctorsSection;
