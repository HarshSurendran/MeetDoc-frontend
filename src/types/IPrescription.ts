export interface IMedication {
  medicationName: string;
  dosage: string;
  frequency: string;
  quantity: number;
}

export interface IPrescription {
  _id?: string;
  diagnosis: string;
  medications: IMedication[]; 
  dosageInstructions?: string;
  followUpDate: Date; 
  additionalNotes?: string; 
  createdAt?: Date
}

export interface ICreatePrescriptionDto {
  patientId: string;
  prescriptionFor: string;
  prescriptionForId: string;
  doctorId: string;  
  diagnosis: string;
  medications: IMedication[]; 
  dosageInstructions?: string;
  followUpDate: Date; 
  additionalNotes?: string;
}

export interface IUpdatePrescriptionDto {
  _id: string;
  patientId: string;
  prescriptionFor?: string;
  prescriptionForId: string;
  doctorId: string;  
  diagnosis: string;
  medications: IMedication[]; 
  dosageInstructions?: string;
  followUpDate: Date; 
  additionalNotes?: string;
}


export interface IFullPrescription {
  _id: string
  patientId: {
    _id: string,
    name: string,
    gender: string
  },
  doctorId: {
    _id: string,
    name: string,
    specialisation: string
  },
  diagnosis: string,
  medications: IMedication[],
  dosageInstructions: string, 
  followUpDate: Date,
  additionalNotes: string,
  createdAt: Date,
  updatedAt: Date,
  prescriptionFor?: string,
  prescriptionForId?: string,
  prescriptionPdfUrl?: string,
  __v: number,
}


export interface EditPrescriptionModalProps {
  prescription: IFullPrescription;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedPrescription: IUpdatePrescriptionDto) => void;
}

