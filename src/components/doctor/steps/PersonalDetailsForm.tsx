import toast from 'react-hot-toast';
import Button from '../comps/Button';
import Input from '../comps/Input';
import Select from '../comps/Select';
import { useState } from 'react';
import {
  validateEmail,
  validateFullName,
  validatePhone,
} from '../../../utils/userValidator/uservalidator';
import { IPersonalDetailsFormErrors, IPersonalDetailsFormProps } from '@/types';


const PersonalDetailsForm: React.FC<IPersonalDetailsFormProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [lang, setLang] = useState<string[]>([...data.language]);
  const [errors, setErrors] = useState<IPersonalDetailsFormErrors>({
    name: '',
    age: '',
    phone: '',
    email: '',
    gender: '',
    language: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      name: '',
      age: '',
      phone: '',
      email: '',
      gender: '',
      language: '',
    });
    const age = data.age;
    if (age < 20 || age > 80) {
      toast.error('Age must be above 20 and below 80.');
      setErrors((prev) => {
        return {
          ...prev,
          age: 'Age must be above 20 and below 80',
        };
      });
      return;
    }

    const emailError = validateEmail(data.email);
    if (emailError) {
      toast.error(emailError);
      setErrors((prev) => {
        return {
          ...prev,
          email: emailError,
        };
      });
      return;
    }
    const nameError = validateFullName(data.name);
    if (nameError) {
      toast.error(nameError);
      setErrors((prev) => {
        return {
          ...prev,
          name: nameError,
        };
      });
      return;
    }
    const phoneError = validatePhone(data.phone);
    if (phoneError) {
      toast.error(phoneError);
      setErrors((prev) => {
        return {
          ...prev,
          phone: phoneError,
        };
      });
      return;
    }
    onUpdate({ language: lang });
    onNext();
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const language = e.target.value;
    if (!lang.includes(language)) {
      setLang((data) => [...data, language]);
    }
  };

  const removeLanguage = (removedLang: string) => {
    setLang((data) => data.filter((language) => language !== removedLang));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-center">Personal Details</h2>
      <Input
        label="Full Name"
        name="name"
        value={data.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        required
      />
      {errors.name && <p className="text-red-500">{errors.name}</p>}
      <Input
        label="Phone"
        name="phone"
        type="tel"
        value={data.phone}
        onChange={(e) => onUpdate({ phone: e.target.value })}
        required
      />
      {errors.phone && <p className="text-red-500">{errors.phone}</p>}
      <Input
        label="Email"
        name="email"
        type="email"
        value={data.email}
        onChange={(e) => onUpdate({ email: e.target.value })}
        required
      />
      {errors.email && <p className="text-red-500">{errors.email}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Gender"
          name="gender"
          value={data.gender}
          onChange={(e) => onUpdate({ gender: e.target.value })}
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
          required
        />

        <Input
          label="Age"
          name="age"
          type="number"
          value={data.age}
          onChange={(e) => onUpdate({ age: parseInt(e.target.value) })}
          required
        />
        {errors.age && <p className="text-red-500">{errors.age}</p>}
      </div>

      <div>
        <Select
          label="Language"
          name="language"
          onChange={(e) => handleLanguageChange(e)}
          options={[
            { value: 'English', label: 'English' },
            { value: 'Hindi', label: 'Hindi' },
            { value: 'Malayalam', label: 'Malayalam' },
            { value: 'Kannada', label: 'Kannada' },
          ]}
        />
        {/* Selected Languages */}
        <div className="mt-2 flex flex-wrap gap-2">
          {lang.map((lang) => (
            <div
              key={lang}
              className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
            >
              {lang}
              <button
                type="button"
                onClick={() => removeLanguage(lang)}
                className="ml-2 text-blue-700 hover:text-blue-900"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default PersonalDetailsForm;
