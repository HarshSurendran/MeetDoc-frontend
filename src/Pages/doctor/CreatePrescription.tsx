import React from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Popover, PopoverContent, PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, Trash2, Calendar as CalendarIcon, FileText, Pill , MessageSquare, ClipboardMinus
} from 'lucide-react';
import { format } from 'date-fns';
import { useForm, useFieldArray } from 'react-hook-form';
import { ICreatePrescriptionDto, IPrescription } from '@/types';
import { createPrescription, getAppointment } from '@/services/doctor/doctor';
import errorHandler from '@/utils/errorHandler';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/appStore';
import { useNavigate, useParams } from 'react-router-dom';



const PrescriptionForm: React.FC = () => {
  const form = useForm<IPrescription>({
    defaultValues: {
      diagnosis: '',
      medications: [{ medicationName: '', dosage: '', frequency: '', quantity: 0 }],
      dosageInstructions: '',
      additionalNotes: '',
      followUpDate: undefined
    },
    mode: 'onBlur'
  });
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const { control, handleSubmit } = form;
  const appointmentId = useParams<{ id: string }>().id;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications"
  });
  const navigate = useNavigate();

  async function sendPrescriptionToBackend(data: IPrescription) {
    try {
      if (!appointmentId) {
        toast.error("Failed to fetch appointment details");
      }
      const appointmentResponse = await getAppointment(appointmentId as string);
      if (!appointmentResponse.status) {
        toast.error("Failed to fetch appointment details");
      }
      const appointment = appointmentResponse.data.appointment;


     const createPrescriptionData: ICreatePrescriptionDto = {
       diagnosis: data.diagnosis,
       medications: data.medications,
       dosageInstructions: data.dosageInstructions,
       additionalNotes: data.additionalNotes,
       followUpDate: data.followUpDate,
       patientId: appointment.patientId, 
       doctorId: doctor._id
     }
     const response = await createPrescription(createPrescriptionData);
     if (response.status) {
       toast.success("Prescription created successfully");
       //todo: redirect to bussiness page(payment details page)
       navigate(`/doctor/dashboard`)
     }
     
    } catch (error) {
     errorHandler(error);    
   }
  }

  const onSubmit = (data: IPrescription) => {
    sendPrescriptionToBackend(data);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1 bg-blue-50 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Create Digital Prescription
          </CardTitle>
          <CardDescription>Enter prescription details for your patient</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Diagnosis Section */}
              <FormField
                control={control}
                name="diagnosis"
                rules={{ required: "Diagnosis is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                      <ClipboardMinus className="h-5 w-5" /> Diagnosis</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter patient diagnosis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Medications Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Medications
                  </FormLabel>
                  <Button
                    type="button"
                    onClick={() => append({ medicationName: '', dosage: '', frequency: '', quantity: 0 })}
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </div>

                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="p-4 border-blue-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          {/* Medication Name */}
                          <FormField
                            control={control}
                            name={`medications.${index}.medicationName`}
                            rules={{ required: "Medication name is required" }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Medication Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter medication name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Dosage */}
                          <FormField
                            control={control}
                            name={`medications.${index}.dosage`}
                            rules={{ required: "Dosage is required" }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Dosage</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 500mg" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Frequency */}
                          <FormField
                            control={control}
                            name={`medications.${index}.frequency`}
                            rules={{ required: "Frequency is required" }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Frequency</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Twice a day" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Quantity */}
                          <FormField
                            control={control}
                            name={`medications.${index}.quantity`}
                            rules={{ required: "Quantity is required" }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="Enter quantity" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Remove Medication */}
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => remove(index)}
                            className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <div className="space-y-2">
                <FormLabel className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Additional Notes
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter any additional notes"
                    {...form.register("additionalNotes")}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </div>

              {/* Follow-up Date Section */}
              <FormField
                control={control}
                name="followUpDate"
                rules={{ required: "Follow-up date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Follow-up Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal border-blue-200">
                          {field.value ? format(field.value, "PPP") : "Select follow-up date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Create Prescription
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionForm;
