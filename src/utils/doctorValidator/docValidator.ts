import Joi from 'joi';

const instituteName = Joi.string()
  .pattern(/^[A-Za-z]+(?:\s[A-Za-z]+)+$/)
  .min(3)
  .max(100)
  .required()
  .messages({
    'string.base': 'Name of Institute must be a text.',
    'string.pattern.base':
      'Name of the institute must consist at least two words.',
    'string.empty': 'Name of the institute is required.',
    'string.min': 'Name of the institute must be at least 3 characters long.',
    'string.max': 'Name of Institute must be less than 100 characters long.',
    'any.required': 'Name of Institute is required.',
  });

export const validateInstituteName = (name: string) => {
  const { error } = instituteName.validate(name);
  if (error) {
    return error.details[0].message;
  }
  return null;
};

const universityName = Joi.string()
  .pattern(/^[A-Za-z]+(?:\s[A-Za-z]+)+$/)
  .min(3)
  .max(100)
  .required()
  .messages({
    'string.base': 'Name of University must be a text.',
    'string.pattern.base':
      'Name of the University must consist at least two words.',
    'string.empty': 'Name of the University is required.',
    'string.min': 'Name of the University must be at least 3 characters long.',
    'string.max': 'Name of University must be less than 100 characters long.',
    'any.required': 'Name of University is required.',
  });

export const validateUniversityName = (name: string) => {
  const { error } = universityName.validate(name);
  if (error) {
    return error.details[0].message;
  }
  return null;
};
