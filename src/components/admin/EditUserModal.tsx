import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IUser } from '../../types/IUser';
import {
  validateEmail,
  validateFullName,
  validatePhone,
  validatePincode,
} from '@/utils/userValidator/uservalidator';
import toast from 'react-hot-toast';
import { IEditUserModalProps } from '@/types';



const EditUserModal: React.FC<IEditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<IUser>({ ...user });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const valEmail = validateEmail(formData.email);
      const valName = validateFullName(formData.name);

      if (formData.phone) {
        const valPhone = validatePhone(formData.phone);
        if (valPhone) {
          toast.error(valPhone);
          throw new Error();
        }
      }

      if (formData.address?.pincode || formData.address?.pincode === '0') {
        console.log(formData.address.pincode)
        const errorPincode = validatePincode(formData.address.pincode);
        if (errorPincode) {
          toast.error(errorPincode);
          throw new Error();
        }
      }

      if (valEmail || valName) {
        toast.error(valEmail || valName);
        throw new Error();
      }
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User Information</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={handleGenderChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={
                    formData.date_of_birth
                      ? new Date(formData.date_of_birth)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address.district">District</Label>
                <Input
                  id="address.district"
                  name="address.district"
                  value={formData.address?.district}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address.locality">Locality</Label>
                <Input
                  id="address.locality"
                  name="address.locality"
                  value={formData.address?.locality}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address.pincode">Pincode</Label>
                <Input
                  id="address.pincode"
                  name="address.pincode"
                  value={formData.address?.pincode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address.state">State</Label>
                <Input
                  id="address.state"
                  name="address.state"
                  value={formData.address?.state}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address.country">Country</Label>
                <Input
                  id="address.country"
                  name="address.country"
                  value={formData.address?.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
