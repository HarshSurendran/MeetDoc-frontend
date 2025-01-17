import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Camera, Save, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addDoctor, addPhoto, resetDoctor } from '@/redux/slices/doctorSlice';
import {
  changeProfilePhoto,
  getPhotoUrl,
  updateProfile,
} from '@/services/doctor/doctor';
import { IDoctorProfile } from '@/types/IDoctor';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '@/utils/getCroppedImg';
import errorHandler from '@/utils/errorHandler';
import { RootState } from '@/redux/store/appStore';

const DoctorProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const [profile, setProfile] = useState<Partial<IDoctorProfile>>(doctor);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDone = async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc!,
        croppedAreaPixels as Area
      );
      const file = new File([croppedImage], 'profile-picture.jpg', {
        type: 'image/jpeg',
      });
      console.log(
        'This is the url for the dp',
        URL.createObjectURL(file),
        file
      );
      setProfile((prev) => ({ ...prev, photo: URL.createObjectURL(file) }));
      sendFileToBackend(file);
      setShowCropModal(false);
    } catch (error) {
      console.log(error, 'Error from handle done.');
      errorHandler(error);
    }
  };

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const sendFileToBackend = async (file: File) => {
    try {
      const response = await changeProfilePhoto(file);
      if (response?.status) {
        const key = response?.data.key;
        const url = await getPhotoUrl(key);
        console.log('Url from s3 bucket', url);
        if (profile._id) {
          dispatch(addPhoto(url));
          setProfile((prev) => ({ ...prev, photo: url }));
          toast.success('Profile photo updated.');
        } else {
          toast.error('Unexpected error, Please login again');
          dispatch(resetDoctor());
        }
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    if (profile._id) {
      const { photo, ...data } = profile;
      const response = await updateProfile(data);

      if (response.status) {
        dispatch(addDoctor(profile));
        toast.success('Profile updated successfully.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-2">
      <Card className="max-w-7xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-blue-800">
              Doctor Profile
            </CardTitle>
            <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  src={profile.photo || 'defaultprofilephoto.jpg'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-blue-600">{profile.specialisation}</p>
                <div className="flex items-center justify-center space-x-1 text-yellow-500">
                  {profile.rating
                    ? '★'.repeat(Math.floor(profile?.rating))
                    : '★'}
                  <span className="text-gray-600 ml-1">
                    ({profile.rating || 0})
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>Name</Label>
                <Input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="bg-white"
                />
              </div>
              <div className="space-y-4">
                <Label>Email</Label>
                <Input
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="bg-white"
                />
              </div>
              <div className="space-y-4">
                <Label>Phone</Label>
                <Input
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  className="bg-white"
                />
              </div>
              <div className="space-y-4">
                <Label>Gender</Label>
                <Select
                  disabled={!isEditing}
                  value={profile.gender}
                  onValueChange={(value) =>
                    setProfile({ ...profile, gender: value })
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={
                    profile.date_of_birth
                      ? profile.date_of_birth.toISOString().split('T')[0]
                      : new Date().toISOString().split('T')[0]
                  }
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      date_of_birth: new Date(e.target.value),
                    })
                  }
                  disabled={!isEditing}
                  className="bg-white"
                />
              </div>
              <div className="space-y-4">
                <Label>Consultation Fee</Label>
                <Input
                  type="number"
                  value={profile.fee}
                  onChange={(e) =>
                    setProfile({ ...profile, fee: Number(e.target.value) })
                  }
                  disabled={!isEditing}
                  className="bg-white"
                />
              </div>
            </div>

            {/* Qualification Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Qualification</Label>
                  <Input
                    value={profile.qualification}
                    disabled={true}
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-4">
                  <Label>Specialisation</Label>
                  <Input
                    value={profile.specialisation}
                    disabled={true}
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Locality</Label>
                  <Input
                    value={profile.address ? profile.address.locality : ''}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: {
                          locality: e.target.value,
                          district: profile.address?.district || '',
                          state: profile.address?.state || '',
                          pincode: profile.address?.pincode || '',
                          country: profile.address?.country || '',
                        },
                      })
                    }
                    disabled={!isEditing}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-4">
                  <Label>District</Label>
                  <Input
                    value={profile.address ? profile.address.district : ''}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: {
                          locality: profile.address?.locality || '',
                          district: e.target.value,
                          state: profile.address?.state || '',
                          pincode: profile.address?.pincode || '',
                          country: profile.address?.country || '',
                        },
                      })
                    }
                    disabled={!isEditing}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-4">
                  <Label>State</Label>
                  <Input
                    value={profile.address ? profile.address.state : ''}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: {
                          locality: profile.address?.locality || '',
                          district: profile.address?.district || '',                          
                          pincode: profile.address?.pincode || '',
                          country: profile.address?.country || '',
                          state: e.target.value
                      },
                      })
                    }
                    disabled={!isEditing}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-4">
                  <Label>Pincode</Label>
                  <Input
                    value={profile.address ? profile.address.pincode : ''}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: {
                          locality: profile.address?.locality || '',
                          district: profile.address?.district || '',
                          state: profile.address?.state || '',
                          country: profile.address?.country || '',
                          pincode: e.target.value,
                        },
                      })
                    }
                    disabled={!isEditing}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-4">
                  <Label>Country</Label>
                  <Input
                    value={profile.address ? profile.address.country : ''}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: {
                          locality: profile.address?.locality || '',
                          district: profile.address?.district || '',
                          state: profile.address?.state || '',
                          pincode: profile.address?.pincode || '',
                          country: e.target.value,
                        },
                      })
                    }
                    disabled={!isEditing}
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-4">
              <Label>About</Label>
              <Textarea
                value={profile.about}
                onChange={(e) =>
                  setProfile({ ...profile, about: e.target.value })
                }
                disabled={!isEditing}
                className="bg-white min-h-[100px]"
              />
            </div>

            {/* Languages Section */}
            <div className="space-y-4">
              <Label>Languages</Label>
              <Input
                value={profile.languages?.join(', ') || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    languages: e.target.value
                      .split(',')
                      .map((lang) => lang.trim()),
                  })
                }
                disabled={!isEditing}
                placeholder="Enter languages separated by commas"
                className="bg-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg relative w-[90%] max-w-xl">
            <h2 className="text-lg font-bold mb-4 text-center">
              Crop your image
            </h2>

            <div className="relative h-64 overflow-hidden rounded-md border">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              )}
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <Button
                onClick={() => setShowCropModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDone}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfilePage;
