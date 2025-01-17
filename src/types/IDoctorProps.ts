import { EducationDetails, ExperienceDetails, FormData, PersonalDetails, PostGraduationDetails, VerificationDetails } from "./doctorTypes";

export interface IStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface ICompletedPageProps {
    doctorId: string
}

export interface IEducationFormProps {
  data: EducationDetails;
  onUpdate: (data: Partial<EducationDetails>) => void;
  onBack: () => void;
  onNext: () => void;
}

export interface IExperienceDetailsFormProps {
    data: ExperienceDetails[];
    onUpdate: (data: Partial<ExperienceDetails[]>) => void;
    onNext: () => void;
    onBack: () => void;
}
  

export interface IPersonalDetailsFormProps {
  data: PersonalDetails;
  onUpdate: (data: Partial<PersonalDetails>) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface IPostGraduationFormProps {
    data: PostGraduationDetails;
    onUpdate: (data: Partial<PostGraduationDetails>) => void;
    onBack: () => void;
    onNext: () => void;
}
  
export interface IStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export interface ISuccessPageProps {
    data: FormData;
    onUpdate: (data: boolean) => void;
    onSubmit: () => void;
    onBack: () => void;
  }
  

  export interface IVerificationFormProps {
    data: VerificationDetails;
    onUpdate: (data: Partial<VerificationDetails>) => void;
    onNext: () => void;
    onBack: () => void;
  }