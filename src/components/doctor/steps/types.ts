export type PersonalDetails = {
    name: string;
    phone: string;
    email: string;
    gender: string;
    age: number;
    language: string[];
};

export type EducationDetails = {
    institution: string;
    degree: string;
    specialty: string;
    university: string;
    registrationNumber: string;
    city: string;
    yearOfCompletion: number;
    certificateFile?: File;
};

export type PostGraduationDetails = {
    institution: string;
    degree: string;
    specialty: string;
    superSpecialty: string;
    university: string;
    registrationNumber: string;
    city: string;
    yearOfCompletion: number;
    certificateFile?: File;
};

export type VerificationDetails = {
    specialty: string;
    proofFile?: File;
};

export type ExperienceDetails = {
    hospitalName: string;
    position: string;
    from: Date;
    to: Date;
};

export type FormData = {
    personalDetails: PersonalDetails;
    educationDetails: EducationDetails;
    postGraduationDetails: PostGraduationDetails;
    verificationDetails: VerificationDetails;
    experienceDetails: ExperienceDetails[];
    acceptedTerms: boolean;
    doctorId: string;
    isVerified: boolean;
};
