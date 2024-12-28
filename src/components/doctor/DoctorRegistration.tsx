// types.ts
type EducationDetails = {
    institution: string;
    degree: string;
    specialty: string;
    university: string;
    city: string;
    yearOfDegree: string;
    certificateFile?: File;
  };
  
  type VerificationDetails = {
    specialty: string;
    proofFile?: File;
  };
  
  type PersonalDetails = {
    hospitalName: string;
    position: string;
  };
  
  type UserDetails = {
    fullName: string;
    phone: string;
    email: string;
    gender: string;
    age: number;
    language: string;
    acceptedTerms: boolean;
  };
  
  type FormData = {
    educationDetails: EducationDetails;
    verificationDetails: VerificationDetails;
    personalDetails: PersonalDetails;
    userDetails: UserDetails;
  };
  
  // DoctorRegistration.tsx
  import React, { useState } from 'react';
  
  const DoctorRegistration: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
      educationDetails: {
        institution: '',
        degree: '',
        specialty: '',
        university: '',
        city: '',
        yearOfDegree: '',
      },
      verificationDetails: {
        specialty: '',
      },
      personalDetails: {
        hospitalName: '',
        position: '',
      },
      userDetails: {
        fullName: '',
        phone: '',
        email: '',
        gender: '',
        age: 0,
        language: '',
        acceptedTerms: false,
      },
    });
  
    const handleNext = () => {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
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
  
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
          <div className="p-6">
            <StepIndicator currentStep={currentStep} totalSteps={5} />
            
            {currentStep === 1 && (
              <EducationForm 
                data={formData.educationDetails}
                onUpdate={(data) => updateFormData('educationDetails', data)}
                onNext={handleNext}
              />
            )}
            
            {currentStep === 2 && (
              <VerificationForm
                data={formData.verificationDetails}
                onUpdate={(data) => updateFormData('verificationDetails', data)}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            
            {currentStep === 3 && (
              <PersonalDetailsForm
                data={formData.personalDetails}
                onUpdate={(data) => updateFormData('personalDetails', data)}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            
            {currentStep === 4 && (
              <UserDetailsForm
                data={formData.userDetails}
                onUpdate={(data) => updateFormData('userDetails', data)}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            
            {currentStep === 5 && (
              <SuccessPage data={formData.userDetails}
              onUpdate={(data) => updateFormData('userDetails', data)}
              onNext={handleNext}
              onBack={handleBack} />
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default DoctorRegistration;
  
  // components/StepIndicator.tsx
  interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
  }
  
  const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
    return (
      <div className="flex items-center justify-center mb-8">
        {[...Array(totalSteps)].map((_, index) => (
          <React.Fragment key={index}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${
                  index + 1 === currentStep
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : index + 1 < currentStep
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-12 h-0.5 ${
                  index + 1 < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  // components/Input.tsx
  interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
  }
  
  const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500
            ${error ? 'border-red-500' : 'border-gray-300'}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  };
  
  // components/Select.tsx
  interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string; label: string }[];
    error?: string;
  }
  
  const Select: React.FC<SelectProps> = ({ label, options, error, ...props }) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <select
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500
            ${error ? 'border-red-500' : 'border-gray-300'}`}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  };
  
  // components/Button.tsx
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
  }
  
  const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
    const baseStyles = 'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants = {
      primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
    };
  
    return (
      <button
        className={`${baseStyles} ${variants[variant]}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
  // steps/EducationForm.tsx
  interface EducationFormProps {
    data: EducationDetails;
    onUpdate: (data: Partial<EducationDetails>) => void;
    onNext: () => void;
  }
  
  const EducationForm: React.FC<EducationFormProps> = ({ data, onUpdate, onNext }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onNext();
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Institution"
          value={data.institution}
          onChange={(e) => onUpdate({ institution: e.target.value })}
          required
        />
        <Select
          label="Degree of Education"
          value={data.degree}
          onChange={(e) => onUpdate({ degree: e.target.value })}
          options={[
            { value: 'mbbs', label: 'MBBS' },
            { value: 'md', label: 'MD' },
            { value: 'ms', label: 'MS' },
          ]}
          required
        />
        <Input
          label="Specialty"
          value={data.specialty}
          onChange={(e) => onUpdate({ specialty: e.target.value })}
          required
        />
        <div className="flex justify-end space-x-4">
          <Button type="submit">Next</Button>
        </div>
      </form>
    );
  };
  
  // steps/VerificationForm.tsx
  interface VerificationFormProps {
    data: VerificationDetails;
    onUpdate: (data: Partial<VerificationDetails>) => void;
    onNext: () => void;
    onBack: () => void;
  }
  
  const VerificationForm: React.FC<VerificationFormProps> = ({ data, onUpdate, onNext, onBack }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onNext();
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Level of Specialty"
          value={data.specialty}
          onChange={(e) => onUpdate({ specialty: e.target.value })}
          options={[
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'expert', label: 'Expert' },
          ]}
          required
        />
        <Input
          type="file"
          label="Upload Proof"
          onChange={(e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) onUpdate({ proofFile: file });
          }}
          required
        />
        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    );
  };
  
  // steps/PersonalDetailsForm.tsx
  interface PersonalDetailsFormProps {
    data: PersonalDetails;
    onUpdate: (data: Partial<PersonalDetails>) => void;
    onNext: () => void;
    onBack: () => void;
  }
  
  const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ data, onUpdate, onNext, onBack }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onNext();
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Hospital Name"
          value={data.hospitalName}
          onChange={(e) => onUpdate({ hospitalName: e.target.value })}
          required
        />
        <Select
          label="Position"
          value={data.position}
          onChange={(e) => onUpdate({ position: e.target.value })}
          options={[
            { value: 'resident', label: 'Resident' },
            { value: 'consultant', label: 'Consultant' },
            { value: 'hod', label: 'Head of Department' },
          ]}
          required
        />
        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    );
  };
  
  // steps/UserDetailsForm.tsx
  interface UserDetailsFormProps {
    data: UserDetails;
    onUpdate: (data: Partial<UserDetails>) => void;
    onNext: () => void;
    onBack: () => void;
  }
  
  const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ data, onUpdate, onNext, onBack }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onNext();
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={data.fullName}
          onChange={(e) => onUpdate({ fullName: e.target.value })}
          required
        />
        <Input
          label="Phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onUpdate({ phone: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => onUpdate({ email: e.target.value })}
          required
        />
        <Select
          label="Gender"
          value={data.gender}
          onChange={(e) => onUpdate({ gender: e.target.value })}
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
          required
        />
        <Input
          label="Age"
          type="number"
          value={data.age.toString()}
          onChange={(e) => onUpdate({ age: parseInt(e.target.value) })}
          required
        />
        <Select
          label="Language"
          value={data.language}
          onChange={(e) => onUpdate({ language: e.target.value })}
          options={[
            { value: 'english', label: 'English' },
            { value: 'spanish', label: 'Spanish' },
            { value: 'french', label: 'French' },
          ]}
          required
        />
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={data.acceptedTerms}
              onChange={(e) => onUpdate({ acceptedTerms: e.target.checked })}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I accept the terms and conditions
            </span>
          </label>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Next</Button>
        </div>
    </form>
);
};


const SuccessPage: React.FC<UserDetailsFormProps> = ({  onNext,  }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };
  
    return (
        <div>
            <button onClick={handleSubmit}>Success</button>
        </div>
    )
}