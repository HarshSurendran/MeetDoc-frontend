import toast from 'react-hot-toast';
import Button from '../comps/Button';
import Input from '../comps/Input';
import Select from '../comps/Select';
import { PersonalDetails } from '../../../types/Authtypes/doctorTypes';
import { useState } from 'react';
import {
  validateEmail,
  validateFullName,
  validatePhone,
} from '../../../utils/userValidator/uservalidator';

interface PersonalDetailsFormProps {
  data: PersonalDetails;
  onUpdate: (data: Partial<PersonalDetails>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [lang, setLang] = useState<string[]>([...data.language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = data.age;
    if (age < 20 || age > 80) {
      toast.error('Age must be above 20 and below 80.');
      return;
    }
    const emailError = validateEmail(data.email);
    if (emailError) {
      toast.error(emailError);
      return;
    }
    const nameError = validateFullName(data.name);
    if (nameError) {
      toast.error(nameError);
      return;
    }
    const phoneError = validatePhone(data.phone);
    if (phoneError) {
      toast.error(phoneError);
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
        value={data.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        required
      />
      <Input
        label="Phone"
        type="tel"
        value={data.phone}
        onChange={(e) => onUpdate({ phone: e.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        value={data.email}
        onChange={(e) => onUpdate({ email: e.target.value })}
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Gender"
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
          type="number"
          value={data.age}
          onChange={(e) => onUpdate({ age: parseInt(e.target.value) })}
          required
        />
      </div>

      <div>
        <Select
          label="Language"
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
