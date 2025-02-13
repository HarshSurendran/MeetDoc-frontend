import joi from 'joi';

const userEmailSchema = joi
  .string()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    'string.email': 'Please enter a valid email.',
    'string.empty': 'Email is required',
  });

const userPasswordSchema = joi
  .string()
  .pattern(
    new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
    )
  )
  .required()
  .messages({
    'string.min': 'Password should be at least 8 characters long',
    'string.pattern.base':
      'Password should include uppercase, lowercase, number, and special character',
    'string.empty': 'Password is required',
  });

const fullName = joi
  .string()
  .pattern(/^[A-Za-z]+(?:\s[A-Za-z]+)+$/)
  .min(3)
  .max(100)
  .required()
  .messages({
    'string.base': 'Full name must be a text.',
    'string.pattern.base': 'Full name must consist of at least two words.',
    'string.empty': 'Full name is required.',
    'string.min': 'Full name must be at least 3 characters long.',
    'string.max': 'Full name must be less than 100 characters long.',
    'any.required': 'Full name is required.',
  });

const phone = joi
  .string()
  .pattern(/^\d{10}$/)
  .messages({
    'string.pattern.base': 'Phone must be a 10-digit number.',
    'string.empty': 'Phone number is required.',
  });

// const dateOfBirth = joi.date().messages({
//   'date.base': 'Date of birth must be a valid date.',
//   'date.empty': 'Date of birth is required.',
// });



const pinCode = joi.string()
    .pattern(/^\d{6}$/)
    .messages({
        "string.pattern.base": "Please enter a valid Pincode.",
        "string.empty": "Pin code is required.",
    });

// const state = joi.string().messages({
//     "string.empty": "State is required.",
// });
//   const city = joi.string().messages({
//     "string.empty": "City is required.",
//   })

// const gender = joi.string().valid('Male', 'Female', 'Others').messages({
//   'string.invalid': 'Gender must be one of the following: male, female, others',
//   'string.empty': 'Gender is required.',
// });

export const validateEmail = (email: string) => {
  const { error } = userEmailSchema.validate(email);
  if (error) {
    return error.details[0].message;
  }
  return null;
};

export const validatePassword = (password: string) => {
  const { error } = userPasswordSchema.validate(password);
  if (error) {
    return error.details[0].message;
  }
  return null;
};

export const validateFullName = (name: string) => {
  const { error } = fullName.validate(name);
  if (error) {
    return error.details[0].message;
  }
  return null;
};

export const validatePincode = (pincode: string) => {
    const { error } = pinCode.validate(pincode);
    if (error) {
        return error.details[0].message;
    }
    return null;
}

export const validatePhone = (phoneNumber: string) => {
    const { error } = phone.validate(phoneNumber);
    if (error) {
        return error.details[0].message;
    }
    return null;
}
