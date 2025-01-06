import React, { useState } from 'react';
import StepIndicator from '../../components/doctor/steps/StepIndicator';
import EducationDetailsForm from '../../components/doctor/steps/EducationDetailsForm';
import VerificationForm from '../../components/doctor/steps/VerificationForm';
import PersonalDetailsForm from '../../components/doctor/steps/PersonalDetailsForm';
import SuccessPage from '../../components/doctor/steps/SuccessPage';
import { ExperienceDetails, FormData } from '../../components/doctor/steps/types';
import ExperienceDetailsForm from '../../components/doctor/steps/ExperienceDetailsForm';
import PostGraduationDetailsForm from '../../components/doctor/steps/PostGraduationForm';
import { verification } from '../../services/doctor/doctorAuth';

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
  });
  
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
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

  const handleSubmit = async () => {
    console.log('Submitting the data to backend...', formData);
    //send data to the backend and store to verify.
    const response = await verification(formData);
    console.log(response, " From the submission of verification data----");
    
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6">
          <StepIndicator currentStep={currentStep} totalSteps={6} />

          {currentStep === 1 && (
            <PersonalDetailsForm
              data={formData.personalDetails}
              onUpdate={(data) => updateFormData('personalDetails', data)}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <EducationDetailsForm
              data={formData.educationDetails}
              onUpdate={(data) => updateFormData('educationDetails', data)}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <PostGraduationDetailsForm
              data={formData.postGraduationDetails}
              onUpdate={(data) => updateFormData('postGraduationDetails', data)}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <VerificationForm
              data={formData.verificationDetails}
              onUpdate={(data) => updateFormData('verificationDetails', data)}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <ExperienceDetailsForm
              data={formData.experienceDetails}
              onUpdate={(data) => updateExperience( data as ExperienceDetails[])}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 6 && (
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
  );
};

export default DoctorVerification;
