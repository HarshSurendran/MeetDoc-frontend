import { useEffect, useState } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import errorHandler from '@/utils/errorHandler';
import { addSubscriptionScheme, deleteSubscriptionScheme, getDisabledSubscriptions, getSubscriptions } from '@/services/admin/admin';
import { ICreateSubscriptionScheme, ISubscriptionScheme } from '@/types';


const SubscriptionManagement = () => {
    const [schemes, setSchemes] = useState<ISubscriptionScheme[]>([
        {
            _id: "1",
            name: "Premium Plan",
            duration: 6,
            price: 1000,
            discount: 50,
            activeUsers: 156,
            isDisabled: false
        },
        {
            _id: "2",
            name: "Basic Plan",
            duration: 3,
            price: 600,
            discount: 30,
            activeUsers: 89,
            isDisabled: false
        }
    ]);
    const [disabledSchemes, setDisabledSchemes] = useState<ISubscriptionScheme[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newScheme, setNewScheme] = useState({
        name: '',
        duration: '',
        price: '',
        discount: ''
    });
    
    useEffect(() => {
        fetchSubscriptions();
        fetchDisabledSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await getSubscriptions();
            if (response.status) {
                console.log(response.data, "Fetched subscriptions");
                setSchemes(response.data.schemes);
            } else {
                toast.error('Error fetching subscriptions.');
            }
        } catch (error) {
            errorHandler(error);
        }
    }

    const fetchDisabledSubscriptions = async () => {
        try {
            const response = await getDisabledSubscriptions();
            if (response.status) {
                setDisabledSchemes(response.data.schemes);               
            }
        } catch (error) {
            errorHandler(error);
        }
    }

    const handleAddScheme = async () => {
        try {
            if(!newScheme.name || !newScheme.duration || !newScheme.price || !newScheme.discount) {
                toast.error('Please fill in all the fields.');
                return
            }
            const scheme: ICreateSubscriptionScheme = {
                name: newScheme.name,
                duration: parseInt(newScheme.duration),
                price: parseInt(newScheme.price),
                discount: parseInt(newScheme.discount),
            };
        
            const response = await addSubscriptionScheme(scheme);
            if (response.status) {
                console.log("Subscription scheme added successfully", response.data.scheme);
                setSchemes([...schemes, response.data.scheme]);
                toast.success('Subscription scheme added successfully.');
                setIsAddDialogOpen(false);
                setNewScheme({ name: '', duration: '', price: '', discount: '' });
            } else {
                toast.error('Error adding subscription scheme.');
            }
    
        } catch (error) {
            errorHandler(error);
        }
    };

    const handleDeleteScheme = async (id: string) => {
        try {
            const response = await deleteSubscriptionScheme(id);
            if (response.status) {
                toast.success('Subscription scheme deleted successfully.');
                const schemeToDisable = schemes.find(scheme => scheme._id === id);
                if (schemeToDisable) {
                    setDisabledSchemes([...disabledSchemes, schemeToDisable]);
                }
                setSchemes(schemes.filter(scheme => scheme._id !== id));
            } else {
                toast.error('Error deleting subscription scheme.');
            }
        } catch (error) {
            errorHandler(error);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" /> Add New Scheme
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add New Subscription Scheme</DialogTitle>
                            <DialogDescription>
                                Create a new subscription scheme for your users.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Scheme Name</Label>
                                <Input
                                    id="name"
                                    value={newScheme.name}
                                    onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
                                    placeholder="Premium Plan"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="duration">Duration (months)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={newScheme.duration}
                                    onChange={(e) => setNewScheme({ ...newScheme, duration: e.target.value })}
                                    placeholder="6"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={newScheme.price}
                                    onChange={(e) => setNewScheme({ ...newScheme, price: e.target.value })}
                                    placeholder="1000"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="discount">Discount (%)</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    value={newScheme.discount}
                                    onChange={(e) => setNewScheme({ ...newScheme, discount: e.target.value })}
                                    placeholder="50"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddScheme} className="bg-blue-600 hover:bg-blue-700">
                                Add Scheme
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Total Active Subscriptions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {schemes.reduce((acc, scheme) => acc + (scheme.activeUsers ?? 0), 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Total Schemes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {schemes.length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Average Discount
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {Math.round(schemes.reduce((acc, scheme) => acc + scheme.discount, 0) / schemes.length)}%
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Schemes Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Current Subscription Schemes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Active Users</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schemes.map((scheme) => (
                                    <TableRow key={scheme._id}>
                                        <TableCell className="font-medium">{scheme.name}</TableCell>
                                        <TableCell>{scheme.duration} months</TableCell>
                                        <TableCell>₹{scheme.price}</TableCell>
                                        <TableCell>{scheme.discount}%</TableCell>
                                        <TableCell>{scheme.activeUsers}</TableCell>
                                        <TableCell>{scheme.isDisabled ? 'Disabled' : 'Active'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-700"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700"
                                                    onClick={() => handleDeleteScheme(scheme._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>


            {disabledSchemes.length > 0 && <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Disabled Subscription Schemes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Active Users</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {disabledSchemes.map((scheme) => (
                                    <TableRow key={scheme._id}>
                                        <TableCell className="font-medium">{scheme.name}</TableCell>
                                        <TableCell>{scheme.duration} months</TableCell>
                                        <TableCell>₹{scheme.price}</TableCell>
                                        <TableCell>{scheme.discount}%</TableCell>
                                        <TableCell>{scheme.activeUsers}</TableCell>
                                        <TableCell>{scheme.isDisabled ? 'Disabled' : 'Active'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-700"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                {/* <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700"
                                                    onClick={() => handleDeleteScheme(scheme._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button> */}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>}
        </div>
    );
};

export default SubscriptionManagement;