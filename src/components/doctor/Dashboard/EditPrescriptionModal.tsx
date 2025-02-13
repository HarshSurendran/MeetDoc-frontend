import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { EditPrescriptionModalProps, IMedication, IUpdatePrescriptionDto } from '@/types';



const EditPrescriptionModal: React.FC<EditPrescriptionModalProps> = ({
  prescription,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [diagnosis, setDiagnosis] = useState(prescription?.diagnosis || "");
  const [medications, setMedications] = useState<IMedication[]>(prescription.medications);
  const [additionalNotes, setAdditionalNotes] = useState(prescription.additionalNotes);

  const handleAddMedication = () => {
    setMedications([...medications, { medicationName: '', dosage: '', frequency: '', quantity: 1 }]);
  };

  const handleRemoveMedication = (index: number) => {
    if (medications.length > 1) {
      const newMedications = medications.filter((_, i) => i !== index);
      setMedications(newMedications);
    } else {
      toast("Cannot remove medication because atleast one is requried");
    }
  };

  const handleMedicationChange = (
    index: number,
    field: keyof IMedication,
    value: string
  ) => {
    const newMedications = medications.map((med, i) => {
      if (i === index) {
        return { ...med, [field]: value };
      }
      return med;
    });
    setMedications(newMedications);
  };

  const handleSubmit = () => {
    // Validate medications
    const hasEmptyMedication = medications.some(
      med => !med.medicationName || !med.dosage || !med.frequency || !med.quantity
    );

    if (hasEmptyMedication) {
        toast.error("Please fill in all medication fields.");
      return;
    }

    if (!diagnosis.trim()) {
        toast.error("Diagnosis cannot be empty.");
      return;
    }

    const updatedPrescription: IUpdatePrescriptionDto = {
      ...prescription,
      patientId: prescription.patientId._id,
      doctorId: prescription.doctorId._id,
      prescriptionForId: prescription.prescriptionForId || "",
      diagnosis,
      medications,
      additionalNotes,
    };

    onSubmit(updatedPrescription);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-700">
            Edit Prescription
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Patient and Doctor Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-700">Patient</p>
              <p className="text-sm">{prescription.patientId.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Doctor</p>
              <p className="text-sm">{prescription.doctorId.name}</p>
              <p className="text-sm text-gray-500">{prescription.doctorId.specialisation}</p>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="space-y-2">
            <Label htmlFor="diagnosis" className="text-blue-700">Diagnosis</Label>
            <Input
              id="diagnosis"
              value={diagnosis || ""}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Medications */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-blue-700">Medications</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMedication}
                className="text-blue-600"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Medication
              </Button>
            </div>

            {medications.map((medication, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg relative">
                <div>
                  <Label htmlFor={`med-name-${index}`} className="text-sm">Name</Label>
                  <Input
                    id={`med-name-${index}`}
                    value={medication.medicationName}
                    onChange={(e) => handleMedicationChange(index, 'medicationName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`med-dosage-${index}`} className="text-sm">Dosage</Label>
                  <Input
                    id={`med-dosage-${index}`}
                    value={medication.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`med-frequency-${index}`} className="text-sm">Frequency</Label>
                  <Input
                    id={`med-frequency-${index}`}
                    value={medication.frequency}
                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`med-quantity-${index}`} className="text-sm">Quantity</Label>
                  <Input
                    id={`med-frequency-${index}`}
                    value={medication.quantity}
                    onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)}
                  />
                </div>
                {medications.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -right-2 -top-2 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveMedication(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-blue-700">Additional Notes</Label>
            <Textarea
              id="notes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPrescriptionModal;