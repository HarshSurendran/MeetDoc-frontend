
// import React, { useCallback, useEffect, useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { ScrollArea } from '../ui/scroll-area';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/store/appStore';
// import errorHandler from '@/utils/errorHandler';
// import { fetchPrescriptions } from '@/services/user/user';
// import { IPrescription } from '@/types';
// import { Calendar, User } from 'lucide-react';

// const PrescriptionSection = ({ userType }: { userType: string }) => {
//     const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
//     const user = useSelector((state: RootState) => state.user.user)

//     const getPrescriptions = useCallback( async () => {
//        try {
//          const response = await fetchPrescriptions();
//          if (response.status) {
//              setPrescriptions(response.data.prescriptions)
//          }
//        } catch (error) {
//            errorHandler(error);
//        }
//     }, [user._id])
    
//     useEffect(() => {
//         getPrescriptions();
//     }, [getPrescriptions])








//   return (
//     <div className="container mx-auto p-4">
//       <Card className="w-full">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-blue-800">
//             {userType === 'doctor' ? 'My Patient Appointments' : 'My Appointments'}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ScrollArea className="h-[600px] pr-4">
//             <div className="space-y-4">
//               {prescriptions.map((prescription) => (
//                 <Card
//                   key={prescription._id}
//                   className="hover:shadow-lg transition-shadow cursor-pointer"
//                   onClick={() => {
//                     setSelectedAppointment(prescription);
//                     setIsDetailsOpen(true);
//                   }}
//                 >
//                   <CardContent className="p-4">
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2">
//                           <User className="h-5 w-5 text-blue-600" />
//                           <span className="font-semibold">
//                             {prescription.patientName : prescription.doctorName}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 mt-2">
//                           <Calendar className="h-4 w-4 text-gray-500" />
//                           <span className="text-sm text-gray-600">{prescription.date}</span>
//                           <Clock className="h-4 w-4 text-gray-500 ml-2" />
//                           <span className="text-sm text-gray-600">{prescription.time}</span>
                          
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Badge className={getStatusColor(prescription.bookingStatus)}>
//                           {prescription.bookingStatus}
//                         </Badge>
//                         {isprescriptionStartingSoon(prescription) && (
//                           <Button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleJoinCall(appointment);
//                             }}
//                             className="bg-blue-600 hover:bg-blue-700"
//                           >
//                             <Text className="h-4 w-4 mr-2" />
//                             {userType === 'doctor' ? 'Start Chat' : 'Join Chat'}
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </ScrollArea>
//         </CardContent>
//       </Card>

//       <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
//         {selectedAppointment && (
//           <DialogContent className="max-w-2xl">
//             <DialogHeader>
//               <DialogTitle className="text-xl font-bold text-blue-800">
//                 Appointment Details
//               </DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm text-gray-500">Patient Name</label>
//                   <p className="font-semibold">{selectedAppointment.patientName}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-500">Doctor Name</label>
//                   <p className="font-semibold">{selectedAppointment.doctorName}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-500">Date & Time </label>
//                   <p className="font-semibold">
//                     {selectedAppointment.date} at {selectedAppointment.time}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-500">Duration/ Booked on</label>
//                   <p className="font-semibold">{selectedAppointment.duration} minutes/ {selectedAppointment.bookingTime}</p>
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="text-sm text-gray-500">Reason for Visit</label>
//                   <p className="font-semibold">{selectedAppointment.reason}</p>
//                 </div>
//               </div>
              
//               {isAppointmentStartingSoon(selectedAppointment) && (
//                 <div className="flex justify-end mt-4">
//                   <Button
//                     onClick={() => handleJoinCall(selectedAppointment)}
//                     className="bg-blue-600 hover:bg-blue-700"
//                   >
//                     <Video className="h-4 w-4 mr-2" />
//                     {userType === 'doctor' ? 'Start Chat' : 'Join Chat'}
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </DialogContent>
//         )}
//       </Dialog>
//     </div>
//   );
// };


// export default PrescriptionSection


import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import errorHandler from '@/utils/errorHandler';
import { fetchPrescriptions } from '@/services/user/user';
import { IFullPrescription } from '@/types';
import { format } from 'date-fns';


const PrescriptionPage: React.FC = () => {
  const [selectedPrescription, setSelectedPrescription] = useState<IFullPrescription | null>(null);

  const [prescriptions, setPrescriptions] = useState<IFullPrescription[]>([]);

  useEffect(() => {
      getPrescriptions();
  }, [])

  const getPrescriptions = useCallback( async () => {
    try {
      const response = await fetchPrescriptions();
      if (response.status) {
        setPrescriptions(response.data.prescriptions);
        console.log(prescriptions)
      }
    } catch (error) {
        errorHandler(error);
    }
  }, [])

  const generatePDF = async (prescription: IFullPrescription) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
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
    </div>
  );
};

export default PrescriptionPage;