import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
 
} from "@/components/ui/card";
import {
  Badge,
} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Phone,
  Mail,
  GraduationCap,
  
  FileCheck,
  Briefcase,
 
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { checkDataSubmitted } from '@/services/doctor/doctorAuth';
import errorHandler from '@/utils/errorHandler';
import { FormData } from '@/components/doctor/steps/types';
import { getCertificate, verifyDoctor } from '@/services/admin/admin';


const DoctorVerificationPage: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<FormData | null>(null);

  useEffect(() => {
    getDoctorData();    
  }, [id]);

  const getDoctorData = async () => {
    try {
      if (id) {
        const response = await checkDataSubmitted(id);
        
        if (response) {
          const docData  = response.data.data;
          console.log('Doctor Data:', docData);
          const DegreeCertificateUrl = await getCertificate(docData.educationDetails.certificateFile);
          if (DegreeCertificateUrl) {
            docData.educationDetails.certificateFile = DegreeCertificateUrl;
          }
          if (docData.postGraduationDetails.certificateFile) {
            const PostGraduationCertificateUrl = await getCertificate(docData.postGraduationDetails.certificateFile);
            if (PostGraduationCertificateUrl) {
              docData.postGraduationDetails.certificateFile = PostGraduationCertificateUrl;
            }
          }
          
          console.log('Doctor Details:', docData);
          setData(docData);
        }        
      }
    } catch (error) {
      console.error('Failed to fetch doctor details:', error);
      errorHandler(error);
    }
  };

  const onVerify = async (id: string, status: boolean) => {
    const response = await verifyDoctor(id, status);
    if (response) {
      console.log('Doctor verification status updated:', response);
      setData((prevData) => {
        if (prevData) {
          return { ...prevData, isVerified: status };
        }
        return prevData;
      });
    }
    
  }

  const handleVerification = async (status: boolean) => {
    try {
      if (data?.doctorId) {
        await onVerify(data?.doctorId, status);
      }
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Doctor Verification</h1>
            <p className="text-gray-600">Review and verify doctor's credentials</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
              onClick={() => handleVerification(false)}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => handleVerification(true)}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Verify
            </Button>
          </div>
        </div>
      </div>

      {/* Personal Details Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="font-medium">{data?.personalDetails.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {data?.personalDetails.phone}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {data?.personalDetails.email}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Gender</label>
              <p className="font-medium">{data?.personalDetails.gender}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Age</label>
              <p className="font-medium">{data?.personalDetails.age} years</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Languages</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {data?.personalDetails.language.map((lang, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education Details Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Education Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">Institution</label>
              <p className="font-medium">{data?.educationDetails.institution}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Degree</label>
              <p className="font-medium">{data?.educationDetails.degree}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Specialty</label>
              <p className="font-medium">{data?.educationDetails.specialty}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">University</label>
              <p className="font-medium">{data?.educationDetails.university}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Registration Number</label>
              <p className="font-medium">{data?.educationDetails.registrationNumber}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Year of Completion</label>
              <p className="font-medium">{data?.educationDetails.yearOfCompletion}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Certificate</label>
              <a
                href={data?.educationDetails.certificateFile as string}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mt-1"
              >
                <FileCheck className="w-4 h-4" />
                View Certificate
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post Graduation Details Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Post Graduation Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">Institution</label>
              <p className="font-medium">{data?.postGraduationDetails.institution}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Degree</label>
              <p className="font-medium">{data?.postGraduationDetails.degree}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Specialty</label>
              <p className="font-medium">{data?.postGraduationDetails.specialty}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Super Specialty</label>
              <p className="font-medium">{data?.postGraduationDetails.superSpecialty}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Registration Number</label>
              <p className="font-medium">{data?.postGraduationDetails.registrationNumber}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Year of Completion</label>
              <p className="font-medium">{data?.postGraduationDetails.yearOfCompletion}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Certificate</label>
              <a
                href={data?.postGraduationDetails.certificateFile as string}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mt-1"
              >
                <FileCheck className="w-4 h-4" />
                View Certificate
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience Details Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Experience Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data?.experienceDetails.map((exp, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Hospital Name</label>
                    <p className="font-medium">{exp.hospitalName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Position</label>
                    <p className="font-medium">{exp.position}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Duration</label>
                    <p className="font-medium">
                      {formatDate(exp.from)} - {formatDate(exp.to)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Status</p>
              <Badge
                variant={data?.isVerified ? "default" : "secondary"}
                className={`mt-1 ${
                  data?.isVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {data?.isVerified ? "Verified" : "Pending Verification"}
              </Badge>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => handleVerification(false)}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handleVerification(true)}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Verify
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorVerificationPage;