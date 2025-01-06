// import Button from '../comps/Button';
// import Input from '../comps/Input';
// import Select from '../comps/Select';
// import { ExperienceDetails } from './types';

// interface ExperienceDetailsFormProps {
//   data: ExperienceDetails;
//   onUpdate: (data: Partial<ExperienceDetails>) => void;
//   onNext: () => void;
//   onBack: () => void;
// }

// const ExperienceDetailsForm: React.FC<ExperienceDetailsFormProps> = ({
//   data,
//   onUpdate,
//   onNext,
//   onBack,
// }) => {
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onNext();
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">

//       <Input
//         label="Hospital Name"
//         value={data.hospitalName}
//         onChange={(e) => onUpdate({ hospitalName: e.target.value })}
//       />
//       <Select
//         label="Position"
//         value={data.position}
//         onChange={(e) => onUpdate({ position: e.target.value })}
//         options={[
//           { value: 'resident', label: 'Resident' },
//           { value: 'consultant', label: 'Consultant' },
//           { value: 'hod', label: 'Head of Department' },
//         ]}
//         required
//       />







//       <div className="flex justify-between">
//         <Button type="button" variant="secondary" onClick={onBack}>
//           Back
//         </Button>
//         <Button type="submit">Next</Button>
//       </div>
//     </form>
//   );
// };

// export default ExperienceDetailsForm;

import toast from 'react-hot-toast';
import Button from '../comps/Button';
import Input from '../comps/Input';
import Select from '../comps/Select';
import { ExperienceDetails } from './types';
import { useState } from 'react';

interface ExperienceDetailsFormProps {
  data: ExperienceDetails[];
  onUpdate: (data: Partial<ExperienceDetails[]>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ExperienceDetailsForm: React.FC<ExperienceDetailsFormProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  console.log(data, typeof (data));
  const [experiences, setExperiences] = useState<ExperienceDetails[]>(data);
  console.log(experiences, typeof (experiences));
  

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { hospitalName: '', position: '', from: new Date, to: new Date },
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
  };

  const isDateValid = (fromDate: Date, toDate: Date): boolean => {
    if (!fromDate|| !toDate) return false;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    console.log(from, to, new Date())
    return from < to && from < new Date() && to <= new Date();
  };
  
  const handleExperienceChange = (index: number, field: keyof ExperienceDetails, value: any) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = value;
    setExperiences(updatedExperiences);    
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!experiences.every(exp => isDateValid(exp.from, exp.to))) {
      toast.error('Please ensure all date ranges are valid.');
      return;
    }
    onUpdate(experiences)
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
            onChange={(e) => handleExperienceChange(index, 'hospitalName', e.target.value)}
            required
          />
          <Select
            label="Position"
            value={experience.position}
            onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
            options={[
              { value: 'resident', label: 'Resident' },
              { value: 'consultant', label: 'Consultant' },
              { value: 'hod', label: 'Head of Department' },
            ]}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="From Date"
              type="date"
              value={`${experience.from ? new Date(experience.from).toISOString().split('T')[0] : ''}`}
              onChange={(e) => handleExperienceChange(index, 'from', e.target.value)}
              required
            />
            <Input
              label="To Date"
              type="date"
              value={`${experience.to ? new Date(experience.to).toISOString().split('T')[0] : ''}`}
              onChange={(e) => handleExperienceChange(index, 'to', e.target.value)}
              required
            />
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
