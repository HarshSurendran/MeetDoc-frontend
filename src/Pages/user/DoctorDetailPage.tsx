import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Globe, GraduationCap, Languages } from "lucide-react";
import { fetchSingleDoctor } from '@/services/user/user';
import errorHandler from '@/utils/errorHandler';
import SlotsView from '@/components/users/DoctorDetailView/SlotsView';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { IDoctorProfile } from '@/interfaces/doctor/IDoctor';
import HeaderPostLogin from '@/components/users/HeaderPostLogin';
 

const DoctorDetailPage = () => {
  const [doctor, setDoctor] = useState<Partial<IDoctorProfile>>({
    name: "Dr. Sarah Johnson",
    gender: "Female",
    address: {
        district: "string",
      locality: "string",
      pincode: "string",
      state: "string",
       country: "string",
    },
    qualification: "MBBS, MD - General Medicine",
    specialisation: "General Medicine",
    about: "Dr. Sarah Johnson is a highly experienced general physician with over 15 years of practice. She specializes in preventive care and chronic disease management.",
    languages: ["English", "Spanish", "French"],
    fee: 150,
    rating: 4.8,
    photo: "defaultprofilephoto.jpg"
  });
  const params = useParams();
  const doctorId = params.id;

  useEffect(() => {
    fetchDoctor();
  }, []);
  
  const fetchDoctor = async () => {
    try {
      if (doctorId) {        
        const response = await fetchSingleDoctor(doctorId);
        if (response.status) {
          setDoctor(response.data.doctor);
        }
      } else {
        toast.error("Doctor Id is not valid. Please go back and try again.")
      }
    } catch (error) {
      errorHandler(error);
    }
  }
  

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderPostLogin/>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="w-48 h-48 rounded-full border-4 border-white shadow-lg"
            />
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">{doctor.name}</h1>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <span>{doctor.qualification}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>{doctor.rating} Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About Doctor</h2>
                <p className="text-gray-600">{doctor.about}</p>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>{`${doctor.address?.district}, ${doctor.address?.state}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span>{doctor.specialisation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-blue-600" />
                    <span>{doctor?.languages.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    <span>${doctor.fee} per consultation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <SlotsView doctor={{ id: doctor?._id || "", name: doctor.name||"", specialisation: doctor.specialisation||"", fee: doctor.fee||0 } } />
          </div>

          {/* Right Column - Reviews */}
          <div>
            <Card className='lg:min-h-screen'>
              <CardContent className="p-6 ">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              
                <div className="mt-4">
                  <Button className="w-full">
                    Check Availability
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;