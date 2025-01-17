import { IStepIndicatorProps } from '@/types';
import React from 'react';


const StepIndicator: React.FC<IStepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {[...Array(totalSteps)].map((_, index) => (
        <React.Fragment key={index}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${
                  index + 1 === currentStep
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : index + 1 < currentStep
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                }`}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`w-12 h-0.5 ${
                index + 1 < currentStep ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
