import { Password } from "@mui/icons-material";
import joi from "joi";

const userEmailSchema = joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages(
        {
            "string.email": "Please enter a valid email.",
            "string.empty": "Email is required"
        }
    );

const userPasswordSchema = joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .required()
    .messages({
        "string.min": "Password should be at least 8 characters long",
        "string.pattern.base":
            "Password should include uppercase, lowercase, number, and special character",
        "string.empty": "Password is required",
    });

export const validateEmail = (email: string) => {
    const { error } = userEmailSchema.validate(email);
    if (error) {
        return error.details[0].message;
    }
    return null;    
}

export const validatePassword = (password: string) => {
    const { error } = userPasswordSchema.validate(password);
    if (error) {
        return error.details[0].message;
    }
    return null;
}