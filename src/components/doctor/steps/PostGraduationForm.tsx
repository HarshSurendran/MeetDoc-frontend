import toast from 'react-hot-toast';
import Button from '../comps/Button';
import Input from '../comps/Input';
import Select from '../comps/Select';
import { PostGraduationDetails } from './types';
import {
  validateInstituteName,
  validateUniversityName,
} from '../../../utils/doctorValidator/docValidator';
import { useState } from 'react';

interface PostGraduationFormProps {
  data: PostGraduationDetails;
  onUpdate: (data: Partial<PostGraduationDetails>) => void;
  onBack: () => void;
  onNext: () => void;
}

const PostGraduationDetailsForm: React.FC<PostGraduationFormProps> = ({
    data,
    onUpdate,
    onBack,
    onNext,
}) => {
    const [hasPostGraduation, setHasPostGraduation] = useState(true);
  

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hasPostGraduation) {
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
        } else {
            onUpdate({
                institution: '',
                degree: '',
                specialty: '',
                superSpecialty: '',
                university: '',
                city: '',
                yearOfCompletion: 0,
                registrationNumber: '',
                certificateFile: undefined,
            });
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
        <>           
            <h2 className="text-xl font-bold text-center">Post Graduation Details</h2>
            <div className="flex items-center justify-center my-4">
        <input
          type="checkbox"
          id="postGraduation"
          checked={hasPostGraduation}
          onChange={() => setHasPostGraduation(!hasPostGraduation)}
          className="mr-2"
        />
        <label htmlFor="postGraduation" className="text-sm">
          Have you completed your Post Graduation?
                </label>
                
      </div>
            <form onSubmit={handleSubmit} className={`space-y-4`} >
                <div className={` ${hasPostGraduation ? "" : "pointer-events-none opacity-50"}`}>
                <Input
                    label="Institution"
                    value={data.institution}
                    onChange={(e) => onUpdate({ institution: e.target.value })}
                    
                />
                <Input
                    label="University"
                    value={data.university}
                    onChange={(e) => onUpdate({ university: e.target.value })}
                    
                />
                <Input
                    label="Registration Number"
                    value={data.registrationNumber}
                    onChange={(e) => onUpdate({ registrationNumber: e.target.value })}
                    
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                        label="Degree of Education"
                        value={data.degree}
                        onChange={(e) => onUpdate({ degree: e.target.value })}
                        options={[
                            { value: 'md', label: 'MD' },
                            { value: 'mds', label: 'MDS' },
                        ]}
                        
                    />
                    <Input
                        label="Specialty"
                        value={data.specialty}
                        onChange={(e) => onUpdate({ specialty: e.target.value })}
                        
                    />
                    <Input
                        label="Super Specialty"
                        value={data.superSpecialty}
                        onChange={(e) => onUpdate({ superSpecialty: e.target.value })}
                        
                    />
                    <Input
                        label="Year of Completion"
                        type="number"
                        value={data.yearOfCompletion}
                        onChange={(e) => {
                            onUpdate({ yearOfCompletion: parseInt(e.target.value) });
                        }}
                        
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
                    </div>
                <div className="flex justify-between">
                    <Button type="button" variant="secondary" onClick={onBack}>
                        Back
                    </Button>
                    <Button type="submit">Next</Button>
                </div>
            </form> 
        </>
    );
};

export default PostGraduationDetailsForm;
