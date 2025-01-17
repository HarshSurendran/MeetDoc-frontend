import Button from '../comps/Button';

interface StartPageProps {
  onNext: () => void;
}

const StartForm: React.FC<StartPageProps> = ({ onNext }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center">Welcome to MeetDoc</h2>
      <p className="text-wrap text-gray-700 mx-3">
        We are thrilled to have you join our community of dedicated healthcare
        professionals. Your expertise will be a valuable addition to our mission
        of providing accessible, quality healthcare to patients worldwide.
        <br />
        To ensure the highest level of trust and security for our patients, we
        kindly ask you to complete our Know Your Customer (KYC) process. This
        essential step helps us verify your credentials and maintain the
        integrity of our platform. Simply click the button below to begin the
        KYC process, and follow the prompts to provide the necessary
        documentation. Thank you for your cooperation and commitment to
        providing exceptional care.
      </p>
      <div className="flex justify-evenly">
        <Button type="button" onClick={onNext}>
          Verify
        </Button>
      </div>
    </div>
  );
};

export default StartForm;
