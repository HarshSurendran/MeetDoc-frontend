import React, { useEffect, useState } from 'react';
import StepIndicator from '../../components/doctor/steps/StepIndicator';
import EducationDetailsForm from '../../components/doctor/steps/EducationDetailsForm';
import VerificationForm from '../../components/doctor/steps/VerificationForm';
import PersonalDetailsForm from '../../components/doctor/steps/PersonalDetailsForm';
import SuccessPage from '../../components/doctor/steps/SuccessPage';
import { ExperienceDetails, FormData } from '../../components/doctor/steps/types';
import ExperienceDetailsForm from '../../components/doctor/steps/ExperienceDetailsForm';
import PostGraduationDetailsForm from '../../components/doctor/steps/PostGraduationForm';
import { checkDataSubmitted, verification } from '../../services/doctor/doctorAuth';
import StartForm from '@/components/doctor/steps/StartForm';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/appStore';
import toast from 'react-hot-toast';
import errorHandler from '@/utils/errorHandler';
import CompletedPage from '@/components/doctor/steps/CompletedPage';
import { sendCertificate } from '@/services/doctor/doctor';


const DoctorVerification: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    educationDetails: {
      institution: '',
      degree: '',
      specialty: '',
      university: '',
      city: '',
      yearOfCompletion: 1900,
      registrationNumber: '',
    },
    postGraduationDetails: {
      institution: '',
      degree: '',
      specialty: '',
      superSpecialty: '',
      university: '',
      city: '',
      yearOfCompletion: 1900,
      registrationNumber: '',
    },
    verificationDetails: {
      specialty: '',
    },
    experienceDetails: [{
      hospitalName: "", position: "",
      from: new Date,
      to: new Date
    }],
    personalDetails: {
      name: '',
      phone: '',
      email: '',
      gender: '',
      age: 0,
      language: [],
    },
    acceptedTerms: false,
    doctorId: '',
    isVerified: false,
  });
  const [completed, setCompleted] = useState(false);
  const doctorData = useSelector((state: RootState) => state.doctor.doctor);

  useEffect(() => {
    dataSubmitted();
  },[]);
  
  const dataSubmitted = async () => {
    try {
     const response = await checkDataSubmitted(doctorData._id);
     if(response) {
       setCompleted(true);
     } 
   } catch (error) {
     console.log(error);
   }
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 7));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const updateFormData = (step: keyof FormData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }));
  };

  const updateExperience = (data: ExperienceDetails[]) => {
    setFormData((prev) => {
      return {
        ...prev,
        ["experienceDetails"] : [...data], 
      }
    })
  }

  const toggleTerms = (data: boolean) => {
    setFormData((prev) => ({
      ...prev,
      acceptedTerms: data,
    }));
  };

  const sendCertificatesToBackend = async (educationFile: File | undefined, postGraduationFile: File | undefined) => {
    console.log("Inside sendCertificatesToBackend function", educationFile, postGraduationFile);
    const keys = { educationFile: '', postGraduationFile: '' };
    if (educationFile) {
      const response = await sendCertificate(educationFile);
      console.log(response, "Response from the education file upload");
      if(response) keys.educationFile = response?.data.key;      
    }
    if (postGraduationFile) {
      const response = await sendCertificate(postGraduationFile);
      if(response) keys.postGraduationFile = response?.data.key;      
    }
    return keys;  
  }

  const handleSubmit = async () => {
    try {      
      formData["doctorId"] = doctorData._id;      
      const keys = await sendCertificatesToBackend(formData.educationDetails.certificateFile as File, formData.postGraduationDetails.certificateFile as File);

      const updatedFormData: FormData = { ...formData, educationDetails: { ...formData.educationDetails, certificateFile: keys.educationFile }, postGraduationDetails: { ...formData.postGraduationDetails, certificateFile: keys.postGraduationFile } };
      
      console.log(updatedFormData, "Updated form data with keys");

      const response = await verification(updatedFormData);
      console.log(response, " From the submission of verification data----");

      if (response) {
        toast.success("Verification data submitted successfully");
        setCompleted(true);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <>    {
      completed ? < CompletedPage doctorId={ doctorData._id } /> : <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
          <div className="p-6">
            <StepIndicator currentStep={currentStep} totalSteps={6} />

            {currentStep === 1 && (
              <StartForm             
                onNext={handleNext}              
              />
            )}

            {currentStep === 2 && (
              <PersonalDetailsForm
                data={formData.personalDetails}
                onUpdate={(data) => updateFormData('personalDetails', data)}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && (
              <EducationDetailsForm
                data={formData.educationDetails}
                onUpdate={(data) => updateFormData('educationDetails', data)}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 4 && (
              <PostGraduationDetailsForm
                data={formData.postGraduationDetails}
                onUpdate={(data) => updateFormData('postGraduationDetails', data)}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 5 && (
              <VerificationForm
                data={formData.verificationDetails}
                onUpdate={(data) => updateFormData('verificationDetails', data)}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 6 && (
              <ExperienceDetailsForm
                data={formData.experienceDetails}
                onUpdate={(data) => updateExperience(data as ExperienceDetails[])}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 7 && (
              <SuccessPage
                data={formData}
                onUpdate={(data) => toggleTerms(data)}
                onSubmit={handleSubmit}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      </div>
    }
    </>

  );
};

export default DoctorVerification;
