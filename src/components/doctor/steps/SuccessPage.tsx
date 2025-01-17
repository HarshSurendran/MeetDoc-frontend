import { useState } from 'react';
import Button from '../comps/Button';
import { ISuccessPageProps } from '@/types';


const SuccessPage: React.FC<ISuccessPageProps> = ({
  data,
  onUpdate,
  onSubmit,
  onBack,
}) => {
  const [isticked, setIsTicked] = useState(data.acceptedTerms);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
    console.log('Verification complete.');
  };

  const toggleTerms = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTicked(e.target.checked);
    onUpdate(e.target.checked);
  };

  return (
    <div className="space-y-4">
      <div className="border p-4 rounded-md bg-gray-50 max-h-60 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Terms and Conditions</h2>
        <p className="text-sm text-gray-700">
          Please read these terms and conditions carefully before using the
          MeetDoc online consultation platform. By accessing or using the
          platform, you agree to be bound by these terms and conditions. If you
          do not agree with any of these terms, please refrain from using the
          platform.
          <br />
          <br />
          General Terms
          <br />
          1.1. MeetDoc provides an online platform that connects patients with
          doctors for consultations via video calls and chat.
          <br />
          1.2. You must be at least 18 years old to use the services provided on
          this platform.
          <br />
          1.3. You agree to provide accurate, complete, and up-to-date
          information during registration and consultation.
          <br />
          <br />
          User Responsibilities
          <br />
          2.1. By using the platform, you acknowledge that you are solely
          responsible for the information you provide, including personal
          details, medical history, and any documents shared during
          consultations.
          <br />
          2.2. You agree not to misuse the platform for any unlawful purpose or
          in any way that could harm the platform or its users.
          <br />
          2.3. You agree not to impersonate others or create fake profiles.
          <br />
          <br />
          Doctor Responsibilities
          <br />
          3.1. Doctors on the MeetDoc platform are independent practitioners who
          provide consultations through the platform.
          <br />
          3.2. The platform ensures that all doctors are verified, but it does
          not guarantee the accuracy of any medical advice given. Always seek a
          second opinion if necessary.
          <br />
          3.3. Doctors are responsible for maintaining patient confidentiality
          and ensuring that medical consultations are conducted professionally.
          <br />
          <br />
          Medical Information and Advice
          <br />
          4.1. The platform provides a medium for consultations but does not
          offer medical advice directly. All medical advice is provided by the
          consulting doctor.
          <br />
          4.2. The information provided during consultations should not be used
          as a substitute for professional medical diagnosis or treatment.
          <br />
          4.3. You should seek immediate medical attention if you experience any
          health issues.
          <br />
          <br />
          Privacy and Confidentiality
          <br />
          5.1. Your personal data, medical information, and consultation details
          will be kept confidential and will only be shared with the doctor you
          consult with, as necessary for the consultation.
          <br />
          5.2. MeetDoc will comply with applicable privacy laws and regulations
          to protect your data.
          <br />
          5.3. By using the platform, you consent to the collection, use, and
          storage of your data as outlined in our Privacy Policy.
          <br />
          <br />
          Booking and Payment
          <br />
          6.1. Patients are required to book an appointment in advance.
          Appointments are subject to availability.
          <br />
          6.2. Payment for consultations must be made before the consultation is
          conducted. Payments can be made through the available online payment
          methods.
          <br />
          6.3. Fees for consultations are non-refundable unless specified
          otherwise.
          <br />
          <br />
          Cancellation and Rescheduling
          <br />
          7.1. Patients may cancel or reschedule an appointment at least 24
          hours before the scheduled time to avoid charges.
          <br />
          7.2. Doctors have the right to cancel or reschedule an appointment if
          necessary, and patients will be notified accordingly.
          <br />
          <br />
          Liability
          <br />
          8.1. MeetDoc will not be held liable for any damages or losses
          incurred as a result of using the platform, including but not limited
          to inaccurate medical advice, technical issues, or inability to access
          the platform.
          <br />
          8.2. You agree to indemnify and hold harmless MeetDoc and its
          employees, affiliates, and contractors from any claims arising from
          your use of the platform.
          <br />
          <br />
          Changes to Terms and Conditions
          <br />
          9.1. MeetDoc reserves the right to modify these terms and conditions
          at any time. Any changes will be communicated through the platform or
          via email.
          <br />
          9.2. Continued use of the platform after such modifications
          constitutes your acceptance of the updated terms.
          <br />
          <br />
          Governing Law
          <br />
          10.1. These terms and conditions shall be governed by and construed in
          accordance with the laws of the jurisdiction in which MeetDoc
          operates.
          <br />
          10.2. Any disputes arising from the use of the platform shall be
          subject to the exclusive jurisdiction of the courts in the relevant
          jurisdiction.
          <br />
          <br />
          Please read the following terms and conditions carefully before using
          our services. By using our platform, you agree to the following:
          <br />
          1. You are required to provide accurate information.
          <br />
          2. The platform provides online consultations only.
          <br />
          3. You agree to keep all medical consultations confidential.
          <br />
          4. All medical consultations are for informational purposes only.
          <br />
          {/* Continue adding terms as necessary */}
        </p>
      </div>

      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={data.acceptedTerms}
            onChange={(e) => toggleTerms(e)}
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            I accept the terms and conditions
          </span>
        </label>
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        {isticked ? (
          <Button type="button" onClick={handleSubmit}>
            Submit
          </Button>
        ) : (
          <button
            className="px-4 py-2 rounded text-black
    bg-gray-400 cursor-not-allowed }"
          >
            {' '}
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
