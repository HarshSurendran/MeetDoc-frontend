import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { UserPlus, Users, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import errorHandler from '@/utils/errorHandler';
import { addPatient, deletePatient, getAllPatients } from '@/services/user/user';
import toast from 'react-hot-toast';
import { ICreatePatient, IPatient } from '@/types';



const PatientManagementPage = () => {
  const [familyMembers, setFamilyMembers] = useState<IPatient[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  console.log("This is family members", familyMembers);
  const form = useForm({
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      relation: "",
      gender: "",
    },
  });
    
    useEffect(() => {
      fetchPatients();
    }, [])
    
    const fetchPatients = async () => {
        try {
            const response = await getAllPatients();
            if (response?.status) {
                console.log("Other patients", response.data.patients);
                setFamilyMembers(response.data.patients);
            }
        
      } catch (error) {
          console.log(error);
          errorHandler(error);
      }
  }

  const onSubmit = async (data: { fullName: string; dateOfBirth: string; relation: string; gender: string; }) => {
    const newMember: ICreatePatient = {
      name: data.fullName,
      dateOfBirth: new Date(data.dateOfBirth),
      relation: data.relation,
      gender: data.gender,
    };
    console.log(newMember, "This is the data to add patient");
    // setFamilyMembers((prev) => [...prev, newMember]);

    const response = await addPatient(newMember);
    if (response.status) {
      setFamilyMembers( response.data.patients)
      toast.success('Patient added successfully');
    } else {
      toast.error('Failed to add patient, try again after sometime.');
    }
    setShowAddForm(false);
    form.reset();
  };

  const deleteMember = async (id: string) => {
    try {
      const response = await deletePatient(id);
      if (response.status) {
        toast.success('Patient deleted successfully.');
        setFamilyMembers(familyMembers.filter(member => member._id !== id));
      } else {
        toast.error('Failed to delete patient, try again after sometime.');
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const relations = [
    "Father", "Mother", "Spouse", "Son", "Daughter",
    "Brother", "Sister", "Grandfather", "Grandmother"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Family Members
          </h1>
          <p className="text-gray-500 mt-2">
            Add up to three family members to your account
          </p>
        </div>

        {/* Add Member Button */}
        {familyMembers?.length < 3 && !showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="mb-6 bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Family Member
          </Button>
        )}
        {!familyMembers && (
          <Button
          onClick={() => setShowAddForm(true)}
          className="mb-6 bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Family Member
        </Button>
        )}

        {/* Maximum Members Alert */}
        {familyMembers?.length >= 3 && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertDescription>
              You've reached the maximum number of family members (3).
            </AlertDescription>
          </Alert>
        )}

        {/* Add Member Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Add New Family Member
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="relation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relation</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {relations.map((relation) => (
                              <SelectItem key={relation} value={relation.toLowerCase()}>
                                {relation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Add Member
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Family Members List */}
        <div className="grid gap-4">
          {familyMembers?.map((member) => (
            <Card key={member._id} className="bg-white">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {member.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>Date of Birth: {format(new Date(member.dateOfBirth), 'MMMM dd, yyyy')}</p>
                      <p>Relation: {member.relation}</p>
                      <p>Gender: {member.gender}</p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteMember(member._id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientManagementPage;