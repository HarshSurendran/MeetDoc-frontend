import Button from '../comps/Button';
import Select from '../comps/Select';
import { IVerificationFormProps } from '@/types';



const VerificationForm: React.FC<IVerificationFormProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onNext();
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   const acceptedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  //   const maxFileSize = 2 * 1024 * 1024; // 2MB

  //   if (file) {
  //     // Validate file type
  //     if (!acceptedTypes.includes(file.type)) {
  //       toast.error('Please upload a valid certificate (PDF, PNG, or JPEG).');
  //       e.target.value = '';
  //       return;
  //     }

  //     // Validate file size
  //     if (file.size > maxFileSize) {
  //       toast.error('File size should not exceed 2MB.');
  //       return;
  //     }

  //     // Update state
  //     onUpdate({ proofFile: file });
  //   }
  // };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Level of Specialty"
        value={data.specialty}
        onChange={(e) => onUpdate({ specialty: e.target.value })}
        options={[
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'expert', label: 'Expert' },
        ]}
        required
      />
      {/* <Input
        type="file"
        label="Upload Proof"
        onChange={(e) => {
          handleFileChange(e);
        }}
        required
      /> */}
      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default VerificationForm;
