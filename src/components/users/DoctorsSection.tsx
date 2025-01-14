import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { getDoctorsForLandingPage, getProfilePhoto } from "@/services/user/user";

interface DoctorDetails {
  name: string,
  specialisation: string,
  consultation: number,
  photo: string,
}

const DoctorsSection = () => {
  const [doctors, setDoctors] = useState<DoctorDetails[]>([
    { name: "Afsal Madathingal", specialisation: "General Medicine", consultation: 783, photo: "src/assets/heroimage2.avif" },
    { name: "Afsal Madathingal", specialisation: "General Medicine", consultation: 783, photo: "src/assets/heroimage2.avif" },
    { name: "Afsal Madathingal", specialisation: "General Medicine", consultation: 783, photo: "src/assets/heroimage2.avif" },
    { name: "Afsal Madathingal", specialisation: "General Medicine", consultation: 783, photo: "src/assets/heroimage2.avif" },
])
    
  useEffect(() => {
    fetchDoctors();    
  }, [])

  const fetchDoctors = async () => {
    const response = await getDoctorsForLandingPage();
    if (response.status) {
      let doctorArray = response.data.doctors;
      doctorArray.forEach(async (doctor: DoctorDetails) => {
        const response = await getProfilePhoto(doctor.photo);
        if (response.status) {
          doctor.photo = response.data.url;
        }
      })
      setDoctors(response.data.doctors);
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
            {doctors.map((doctor, index) => (
              <Card key={index} className="p-4 text-center hover:shadow-lg transition-shadow">
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
