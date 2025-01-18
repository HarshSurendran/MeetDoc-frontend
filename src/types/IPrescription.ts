export interface IMedication {
  medicationName: string;
  dosage: string;
  frequency: string;
  quantity: number;
}

export interface IPrescription { 
  diagnosis: string;
  medications: IMedication[]; 
  dosageInstructions?: string;
  followUpDate: Date; 
  additionalNotes?: string; 
}

export interface ICreatePrescriptionDto {
    patientId: string;
    doctorId: string;  
    diagnosis: string;
    medications: IMedication[]; 
    dosageInstructions?: string;
    followUpDate: Date; 
    additionalNotes?: string;
}