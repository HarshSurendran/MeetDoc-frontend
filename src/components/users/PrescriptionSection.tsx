import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import errorHandler from '@/utils/errorHandler';
import { fetchPrescriptions } from '@/services/user/user';
import { IFullPrescription } from '@/types';
import { format } from 'date-fns';
import Pagination from '../Pagination';


const PrescriptionPage: React.FC = () => {
  const [selectedPrescription, setSelectedPrescription] = useState<IFullPrescription | null>(null);
  const [prescriptions, setPrescriptions] = useState<IFullPrescription[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('5'); 
  const [totalDocs, setTotalDocs] = useState(0);

  useEffect(() => {
      getPrescriptions(currentPage, Number(pageSize));
  }, [currentPage, pageSize]);

  const getPrescriptions = useCallback( async (page: number, limit: number) => {
    try {
      const response = await fetchPrescriptions(page, limit);
      if (response.status) {
        setPrescriptions(response.data.prescriptions);
        setTotalDocs(response.data.totalDocs);
      }
    } catch (error) {
        errorHandler(error);
    }
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const generatePDF = async (prescription: IFullPrescription) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // PDF Content
    page.drawText('Prescription Details', {
      x: 50,
      y: height - 50,
      size: 24,
      font,
      color: rgb(0, 0, 0.7)
    });

    page.drawText(`Patient ID: ${prescription.patientId}`, {
      x: 50,
      y: height - 100,
      size: 12,
      font
    });

    page.drawText(`Doctor ID: ${prescription.doctorId}`, {
      x: 50,
      y: height - 120,
      size: 12,
      font
    });

    page.drawText(`Diagnosis: ${prescription.diagnosis}`, {
      x: 50,
      y: height - 140,
      size: 12,
      font
    });

    // Medications
    prescription.medications.forEach((med, index) => {
      page.drawText(`Medication ${index + 1}: ${med.medicationName}`, {
        x: 50,
        y: height - (180 + index * 40),
        size: 12,
        font
      });
      page.drawText(`Dosage: ${med.dosage}, Frequency: ${med.frequency}, Quantity: ${med.quantity}`, {
        x: 50,
        y: height - (200 + index * 40),
        size: 12,
        font
      });
    });

    page.drawText(`Follow-up Date: ${new Date(prescription.followUpDate).toLocaleDateString()}`, {
      x: 50,
      y: height - 300,
      size: 12,
      font
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `prescription_${prescription._id}.pdf`;
    link.click();
  };

  return (
    <div className="container mx-auto p-4 bg-white min-h-screen">
      <div className="grid md:grid-cols-[300px_1fr] gap-4">
        {/* Prescription List */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">My Prescriptions</h2>
          {prescriptions.map(prescription => (
            <Card 
              key={prescription._id} 
              className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                selectedPrescription?._id === prescription._id ? 'border-blue-500 border-2' : ''
              }`}
              onClick={() => setSelectedPrescription(prescription)}
            >
              <CardHeader>
                <CardTitle className="text-blue-700">Prescription for {prescription.diagnosis}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Patient: {prescription.prescriptionFor || prescription.patientId.name}</p>
                <p className="text-sm text-gray-600"> Dr. {prescription.doctorId.name}</p>
                <p className="text-sm text-gray-600">Date: {format(new Date(prescription.followUpDate), 'MMM dd, yyyy')}</p>
                <p className="text-sm text-gray-600">
                  Medications: {prescription.medications.map(m => m.medicationName).join(', ')}
                </p>
              </CardContent>
            </Card>
          ))}
          
        </div>

        {/* Prescription Details */}
        <div>
          {selectedPrescription ? (
            <Card className="w-full">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800">Prescription Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-blue-700">Patient </p>
                    <p>{selectedPrescription?.prescriptionFor || selectedPrescription.patientId.name}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-700">Doctor </p>
                    <p>{selectedPrescription.doctorId.name}</p>
                  </div>
                

                <div>
                  <p className="font-semibold text-blue-700">Diagnosis</p>
                  <p>{selectedPrescription.diagnosis}</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-700">Date</p>
                  <p>{format(new Date(selectedPrescription.followUpDate), 'MMM dd, yyyy')}</p>
                  </div>
                  </div>



                <div>
                  <p className="font-semibold text-blue-700 mb-2">Medications</p>
                  {selectedPrescription.medications.map((medication, index) => (
                    <Card key={index} className="mb-2 bg-blue-50/50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{medication.medicationName}</p>
                            <p className="text-sm text-gray-600">
                              {medication.dosage} - {medication.frequency}
                            </p>
                          </div>
                          <span className="text-blue-700 font-semibold">
                            Qty: {medication.quantity}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-blue-700">Additional Notes</p>
                  <p>{selectedPrescription.additionalNotes}</p>
                </div>

                <div>
                  <p className="font-semibold text-blue-700">Follow-up Date</p>
                  <p>{format(new Date(selectedPrescription.followUpDate), 'MMM dd, yyyy')}</p>
                </div>

                <div className="flex space-x-4 mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-500 text-blue-700 hover:bg-blue-50"
                    onClick={() => generatePDF(selectedPrescription)}
                  >
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center text-gray-500 p-10">
              <Eye className="mx-auto mb-4 h-12 w-12 text-blue-300" />
              <p>Select a prescription to view details</p>
            </div>
          )}
        </div>
      </div>
      <Pagination
            currentPage={currentPage}
            pageSize={Number(pageSize)}
            totalItems={totalDocs}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
    </div>
  );
};

export default PrescriptionPage;