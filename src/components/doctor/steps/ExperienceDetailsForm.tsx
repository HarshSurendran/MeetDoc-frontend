import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../comps/Button';
import Input from '../comps/Input';
import Select from '../comps/Select';
import { ExperienceDetails } from '../../../types/doctorTypes';
import { IExperienceDetailsFormProps } from '@/types';



const ExperienceDetailsForm: React.FC<IExperienceDetailsFormProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [experiences, setExperiences] = useState<ExperienceDetails[]>(data);
  const [experienceErrors, setExperienceErrors] = useState<
    { from?: string; to?: string }[]
  >([]);

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { hospitalName: '', position: '', from: new Date(), to: new Date() },
    ]);
    setExperienceErrors([...experienceErrors, {}]);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    const updatedErrors = experienceErrors.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
    setExperienceErrors(updatedErrors);
    onUpdate(updatedExperiences);
  };

  const isDateValid = (
    fromDate: string,
    toDate: string,
    index: number
  ): boolean => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const today = new Date();

    const newErrors = { ...experienceErrors[index] };

    if (from >= to) {
      newErrors.from = 'Start date must be before end date';
      newErrors.to = 'End date must be after start date';
    } else {
      newErrors.from = undefined;
      newErrors.to = undefined;
    }

    if (from > today) {
      newErrors.from = 'Start date cannot be in the future';
    }

    if (to > today) {
      newErrors.to = 'End date cannot be in the future';
    }

    const updatedErrors = [...experienceErrors];
    updatedErrors[index] = newErrors;
    setExperienceErrors(updatedErrors);

    return !newErrors.from && !newErrors.to;
  };

  const handleExperienceChange = (
    index: number,
    field: keyof ExperienceDetails,
    value: any
  ) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = value;
    setExperiences(updatedExperiences);

    if (field === 'from' || field === 'to') {
      isDateValid(
        new Date(updatedExperiences[index].from).toISOString().split('T')[0],
        new Date(updatedExperiences[index].to).toISOString().split('T')[0],
        index
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allValid = experiences.every((exp, index) =>
      isDateValid(
        new Date(exp.from).toISOString().split('T')[0],
        new Date(exp.to).toISOString().split('T')[0],
        index
      )
    );

    if (!allValid) {
      toast.error('Please ensure all date ranges are valid.');
      return;
    }

    onUpdate(experiences);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-center">Experience Details</h2>

      {experiences.map((experience, index) => (
        <div key={index} className="border p-4 rounded-lg space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              className="text-black text-xl"
              onClick={() => handleRemoveExperience(index)}
            >
              &times;
            </button>
          </div>

          <Input
            label="Hospital Name"
            value={experience.hospitalName}
            onChange={(e) =>
              handleExperienceChange(index, 'hospitalName', e.target.value)
            }
            required
          />
          <Select
            label="Position"
            value={experience.position}
            onChange={(e) =>
              handleExperienceChange(index, 'position', e.target.value)
            }
            options={[
              { value: 'resident', label: 'Resident' },
              { value: 'consultant', label: 'Consultant' },
              { value: 'hod', label: 'Head of Department' },
            ]}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="From Date"
                type="date"
                value={
                  experience.from
                    ? new Date(experience.from).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  handleExperienceChange(index, 'from', e.target.value)
                }
                required
              />
              {experienceErrors[index]?.from && (
                <p className="text-sm text-red-500">
                  {experienceErrors[index].from}
                </p>
              )}
            </div>
            <div>
              <Input
                label="To Date"
                type="date"
                value={
                  experience.to
                    ? new Date(experience.to).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  handleExperienceChange(index, 'to', e.target.value)
                }
                required
              />
              {experienceErrors[index]?.to && (
                <p className="text-sm text-red-500">
                  {experienceErrors[index].to}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={handleAddExperience}
        className="w-full"
      >
        + Add Experience
      </Button>

      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default ExperienceDetailsForm;
