import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Camera, UserRoundPen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/appStore';
import {
  changeProfilePhoto,
  getProfilePhoto,
  updateUser,
} from '@/services/user/user';
import errorHandler from '@/utils/errorHandler';
import toast from 'react-hot-toast';
import getCroppedImg from '@/utils/getCroppedImg';
import Cropper, { Area } from 'react-easy-crop';
import { addPhoto } from '@/redux/slices/userSlice';
import { IUser } from '@/types/IUser';

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const [userData, setUserData] = useState<Partial<IUser>>(user);
  const [photo, setPhoto] = useState(
    userData?.photo || 'defaultprofilephoto.jpg'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const dispatch = useDispatch();

  const handleSave = async () => {
    try {
      setIsEditing(false);
      const { photo, ...data } = userData;
      const response = await updateUser(user._id, data);
      if (response.status) {
        toast.success('Successfully updated!');
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleDateSelect = (newDate: Date) => {
    if (isEditing) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        date_of_birth: newDate,
      }));
    }
  };

  //Photo change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImageSrc(reader.result as string);
          setShowCropModal(true);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleDone = async () => {
    const croppedImage = await getCroppedImg(
      imageSrc!,
      croppedAreaPixels as Area
    );
    const file = new File([croppedImage], 'profile-picture.jpg', {
      type: 'image/jpeg',
    });
    setPhoto(URL.createObjectURL(file));
    sendFileToBackend(file);
    setShowCropModal(false);
  };

  const sendFileToBackend = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await changeProfilePhoto(
        userData._id as string,
        formData
      );
      if (response?.status) {
        toast.success('Profile Photo updated!');
      }
      const url = await getProfilePhoto(response.data.key);
      console.log(url, 'This is the profilephoto url ');
      dispatch(addPhoto(url));
    } catch (error) {
      errorHandler(error);
    }
  };

  const onCropComplete = async (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-blue-800 font-bold flex gap-2" >
            <UserRoundPen className="h-8 w-8 text-blue-600" />
            Profile Information
          </CardTitle>
          <Button
            variant={isEditing ? 'default' : 'outline'}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={photo}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
            />
            {isEditing && (
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-blue-600 hover:bg-blue-700"
                onClick={handleCameraClick}
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold">{userData.name}</h2>
            <div className="flex items-center justify-center mt-1">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 text-gray-600">{userData.rating}</span>
            </div>
          </div>
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

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={userData.name}
                disabled={!isEditing}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={userData.email}
                disabled={!isEditing}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={userData.phone}
                disabled={!isEditing}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Gender</Label>
              <Select
                disabled={!isEditing}
                value={userData.gender}
                onValueChange={(value) =>
                  setUserData({ ...userData, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={userData?.gender || 'Select gender'}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                    disabled={!isEditing}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(userData?.date_of_birth || new Date(), 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={userData.date_of_birth}
                    onSelect={(day) => day && handleDateSelect(day)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Occupation</Label>
              <Input
                value={userData?.occupation}
                disabled={!isEditing}
                onChange={(e) =>
                  setUserData({ ...userData, occupation: e.target.value })
                }
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <div>
              <Label>Locality</Label>
              <Input
                value={userData?.address?.locality}
                disabled={!isEditing}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    address: { 
                      locality: e.target.value,
                      district: userData.address?.district || '',
                      state: userData.address?.state || '',
                      country: userData.address?.country || '',
                      pincode: userData.address?.pincode || ''
                    },
                  })
                }
              />
            </div>

            <div>
              <Label>District</Label>
              <Input
                value={userData?.address?.district}
                disabled={!isEditing}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    address: { 
                      locality: userData.address?.locality || '',
                      district:  e.target.value,
                      state: userData.address?.state || '',
                      country: userData.address?.country || '',
                      pincode: userData.address?.pincode || ''
                    },
                  })
                }
              />
            </div>

            <div>
              <Label>Pincode</Label>
              <Input
                value={userData?.address?.pincode}
                disabled={!isEditing}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    address: { 
                      locality: userData.address?.locality || '',
                      district: userData.address?.district || '',
                      state: userData.address?.state || '',
                      country: userData.address?.country || '',
                      pincode:  e.target.value
                    },
                  })
                }
              />
            </div>

            <div>
              <Label>State</Label>
              <Input
                value={userData?.address?.state}
                disabled={!isEditing}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    address: {
                      locality: userData.address?.locality || '',
                      district: userData.address?.district || '',
                      pincode: userData.address?.pincode || '',
                      country: userData.address?.country || '',
                      state: e.target.value
                    },
                  })
                }
              />
            </div>

            <div>
              <Label>Country</Label>
              <Input
                value={userData?.address?.country}
                disabled={!isEditing}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    address: {
                      locality: userData.address?.locality || '',
                      district: userData.address?.district || '',
                      pincode: userData.address?.pincode || '',
                      state: userData.address?.state || '',
                      country: e.target.value
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
