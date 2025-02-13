import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Download } from 'lucide-react';
import errorHandler from '@/utils/errorHandler';
import { editPrescription, getPrescriptions } from '@/services/doctor/doctor';
import EditPrescriptionModal from './EditPrescriptionModal';
import { IFullPrescription, IUpdatePrescriptionDto } from '@/types';
import toast from 'react-hot-toast';


const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState<IFullPrescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<IFullPrescription | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  

  useEffect(() => {
    fetchPrescriptions();    
  }, [])

  const fetchPrescriptions = async () => {
    try {
      const response = await getPrescriptions();
      if (response.status) {
        setPrescriptions(response.data.prescriptions);
      }
    } catch (error) {
      errorHandler(error);
    }
  }

  const handleEditClick = (prescription: IFullPrescription) => {
    setSelectedPrescription(prescription);
    setIsEditModalOpen(true);
    console.log('Editing prescription:', prescription._id);
  };

  const handleEditSubmit = async (updatedPrescription: IUpdatePrescriptionDto) => {
    try {
      console.log("submited data", updatedPrescription)
      setPrescriptions((prevPrescriptions) =>
              prevPrescriptions.map((prescription) => {
                if(prescription._id === updatedPrescription._id) {
                  return {
                    ...prescription,
                    diagnosis: updatedPrescription.diagnosis,
                    medications: updatedPrescription.medications,
                    additionalNotes: updatedPrescription.additionalNotes || '',
                    followUpDate: updatedPrescription.followUpDate,
                  };
                }
                return prescription;
              })
            );
     
      const response = await editPrescription(updatedPrescription);
      if (response.status) {
        toast.success('Prescription updated successfully.');
      }
    } catch (error) {
      errorHandler(error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-700">Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Follow-up Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription._id}>
                    <TableCell className="font-medium">
                      {format(new Date(prescription.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{prescription?.prescriptionFor || prescription.patientId.name}</TableCell>
                    <TableCell>{prescription.diagnosis}</TableCell>
                    <TableCell>
                      {format(new Date(prescription.followUpDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => setSelectedPrescription(prescription)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <Card className="w-full">
                              <CardHeader className="bg-blue-50">
                                <CardTitle className="text-blue-800">Prescription Details</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4 p-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="font-semibold text-blue-700">Patient </p>
                                    <p>{prescription?.prescriptionFor || prescription.patientId.name}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-blue-700">Doctor </p>
                                    <p>{prescription.doctorId.name}</p>
                                  </div>
                                            
                            
                                  <div>
                                    <p className="font-semibold text-blue-700">Diagnosis</p>
                                    <p>{prescription.diagnosis}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-blue-700">Date</p>
                                    <p>{format(new Date(prescription.createdAt), 'MMM dd, yyyy')}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="font-semibold text-blue-700 mb-2">Medications</p>
                                  {prescription.medications.map((medication, index) => (
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
                                  <p>{prescription.additionalNotes}</p>
                                </div>

                            
                                <div>
                                  <p className="font-semibold text-blue-700">Follow-up Date</p>
                                  <p>{format(new Date(prescription.followUpDate), 'MMM dd, yyyy')}</p>
                                </div>
                            
                                <div className="flex space-x-4 mt-4">
                                  <Button
                                    variant="outline"
                                    className="w-full border-blue-500 text-blue-700 hover:bg-blue-50"
                                  // onClick={() => generatePDF(prescription)}
                                  >
                                    <Download className="mr-2 h-4 w-4" /> Download PDF
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                            
                            
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditClick(prescription)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        { isEditModalOpen &&
                          <EditPrescriptionModal
                            prescription={selectedPrescription as IFullPrescription}
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            onSubmit={handleEditSubmit}
                          />}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionList;