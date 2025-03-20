import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, FilePenLine, Pill } from "lucide-react";
import errorHandler from '@/utils/errorHandler';
import { useParams } from 'react-router-dom';
import { getMedicalHistory } from '@/services/doctor/doctor';
import { IFullPrescription } from '@/types';


const MedicalHistory: React.FC = () => {
    const [prescriptions, setPrescriptions] = React.useState<IFullPrescription[]>();
   
   
    const userId = useParams().id;
    useEffect(() => {
        if (userId) {
            fetchMedicalHistory(userId);
        }
    }, [userId]);

    const fetchMedicalHistory = async (userId: string) => {
        try {
            const response = await getMedicalHistory(userId);
            if (response.status) {
              console.log("medical history", response.data);
              setPrescriptions(response.data.medicalHistory?.prescriptions);
            }
        } catch (error) {
            errorHandler(error)
        }
    }


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Medical History
          </h1>
          <p className="text-gray-500 mt-2">
            Patient: {prescriptions ? prescriptions[0]?.patientId?.name: userId}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {prescriptions?.length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Last Consultation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {prescriptions && prescriptions.length > 0 
                  ? format(new Date(prescriptions[0].createdAt), 'MMM dd, yyyy')
                  : 'N/A'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Next Follow-up
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {prescriptions && prescriptions.length > 0 
                  ? format(new Date(prescriptions[0].followUpDate), 'MMM dd, yyyy')
                  : 'N/A'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Prescriptions List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Prescription History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <Accordion type="single" collapsible className="w-full">
                {prescriptions && prescriptions.map((prescription) => (
                  <AccordionItem 
                    key={prescription._id} 
                    value={prescription._id}
                    className="border border-gray-200 rounded-lg mb-4 overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-2 hover:bg-blue-50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50">
                            {format(new Date(prescription.createdAt), 'MMM dd, yyyy')}
                          </Badge>
                          <span className="font-semibold text-gray-700">
                            Dr. {prescription.doctorId.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {prescription.doctorId.specialisation}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3">
                      <div className="space-y-4">
                        {/* Diagnosis */}
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1">Diagnosis</h4>
                          <p className="text-gray-600">{prescription.diagnosis}</p>
                        </div>

                        {/* Medications */}
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Medications</h4>
                          <div className="grid gap-2">
                            {prescription.medications.map((med, idx) => (
                              <div 
                                key={idx}
                                className="flex items-start gap-2 bg-gray-50 p-3 rounded-md"
                              >
                                <Pill className="h-5 w-5 text-blue-500 mt-1" />
                                <div>
                                  <p className="font-medium text-gray-700">{med.medicationName}</p>
                                  <p className="text-sm text-gray-500">
                                    {med.dosage} - {med.frequency}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Instructions */}
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1">
                            Dosage Instructions
                          </h4>
                          <p className="text-gray-600">{prescription.dosageInstructions}</p>
                        </div>

                        {/* Follow-up */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-5 w-5 text-blue-500" />
                          <span>
                            Follow-up on {format(new Date(prescription.followUpDate), 'MMMM dd, yyyy')}
                          </span>
                        </div>

                        {/* Additional Notes */}
                        {prescription.additionalNotes && (
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-1">
                              Additional Notes
                            </h4>
                            <p className="text-gray-600">{prescription.additionalNotes}</p>
                          </div>
                        )}

                        {/* PDF Link */}
                        {prescription.prescriptionPdfUrl && (
                          <a
                            href={prescription.prescriptionPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                          >
                            <FilePenLine className="h-5 w-5" />
                            <span>View Prescription PDF</span>
                          </a>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
                {!prescriptions && (
                    <div className="text-center text-gray-500">
                      No prescriptions found
                    </div>
                  )
                }
              </Accordion>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalHistory;