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
    medications: [
      {
        medicationName: string,
        dosage: string,
        frequency: string,
        quantity: number,
        _id: string
      }
    ],
    dosageInstructions: string, 
    followUpDate: Date,
    additionalNotes: string,
    createdAt: Date,
  updatedAt: Date,
  prescriptionPdfUrl?: string,
    __v: number
}
