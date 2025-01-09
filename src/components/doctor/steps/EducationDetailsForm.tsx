import toast from 'react-hot-toast';
import Button from '../comps/Button';
import Input from '../comps/Input';
import Select from '../comps/Select';
import { EducationDetails } from '../../../types/Authtypes/doctorTypes';
import {
  validateInstituteName,
  validateUniversityName,
} from '../../../utils/doctorValidator/docValidator';

interface EducationFormProps {
  data: EducationDetails;
  onUpdate: (data: Partial<EducationDetails>) => void;
  onBack: () => void;
  onNext: () => void;
}

const EducationDetailsForm: React.FC<EducationFormProps> = ({
  data,
  onUpdate,
  onBack,
  onNext,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.certificateFile) {
      toast.error('You must upload your certificate.');
      return;
    }
    const year = data.yearOfCompletion;
    const currentYear = new Date().getFullYear();
    if (year >= currentYear || year <= 1950) {
      toast.error('Please enter a valid year in YYYY format.');
      return;
    }
    const instituteNameError = validateInstituteName(data.institution);
    if (instituteNameError) {
      toast.error(instituteNameError);
      return;
    }
    const universityNameError = validateUniversityName(data.university);
    if (universityNameError) {
      toast.error(universityNameError);
      return;
    }
    onNext();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const acceptedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    if (file) {
      if (!acceptedTypes.includes(file.type)) {
        toast.error('Please upload a valid certificate (PDF, PNG, or JPEG).');
        e.target.value = '';
        return;
      }
      if (file.size > maxFileSize) {
        toast.error('File size should not exceed 2MB.');
        return;
      }
      onUpdate({ certificateFile: file });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-center">Graduation Details</h2>

      <Input
        label="Institution"
        value={data.institution}
        onChange={(e) => onUpdate({ institution: e.target.value })}
        required
      />
      <Input
        label="University"
        value={data.university}
        onChange={(e) => onUpdate({ university: e.target.value })}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Registration Number"
          value={data.registrationNumber}
          onChange={(e) => onUpdate({ registrationNumber: e.target.value })}
          required
        />
        <Input
          label="City"
          value={data.city}
          onChange={(e) => onUpdate({ city: e.target.value })}
          required
        />
        <Select
          label="Degree of Education"
          value={data.degree}
          onChange={(e) => onUpdate({ degree: e.target.value })}
          options={[
            { value: 'mbbs', label: 'MBBS' },
            { value: 'bds', label: 'BDS' },
            { value: 'bams', label: 'BAMS' },
          ]}
          required
        />
        <Input
          label="Specialty"
          value={data.specialty}
          onChange={(e) => onUpdate({ specialty: e.target.value })}
          required
        />
        <Input
          label="Year of Completion"
          type="number"
          value={data.yearOfCompletion}
          onChange={(e) => {
            onUpdate({ yearOfCompletion: parseInt(e.target.value) });
          }}
          required
        />
        <div>
          <Input
            type="file"
            label="Degree Certificate"
            onChange={(e) => {
              handleFileChange(e);
            }}
          />
          {data.certificateFile && (
            <p>Selected file: {data.certificateFile.name}</p>
          )}
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

export default EducationDetailsForm;
