import { body } from "express-validator";

const userRegistrationValidator = () => {
  return [
    // EMAIL
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail()
      .isLength({ max: 254 })
      .withMessage("Email cannot exceed 254 characters"),

    // USERNAME
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters")
      .isLength({ max: 20 })
      .withMessage("Username cannot exceed 20 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Username can only contain letters, numbers and underscore"),

    // FULL NAME
    body("fullname")
      .trim()
      .notEmpty()
      .withMessage("Full name is required")
      .isLength({ min: 3 })
      .withMessage("Full name must be at least 3 characters")
      .isLength({ max: 50 })
      .withMessage("Full name cannot exceed 50 characters")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Full name can only contain letters and spaces"),

    // PASSWORD
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .isLength({ max: 64 })
      .withMessage("Password cannot exceed 64 characters")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[^a-zA-Z0-9]/)
      .withMessage("Password must contain at least one special character"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Please Enter a valid email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .normalizeEmail()
      .isLength({ max: 254 })
      .withMessage("Email cannot exceed 254 characters"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters")
      .isLength({ max: 64 })
      .withMessage("password cannot exceed 64 character")
      .matches(/[a-z]/)
      .withMessage("Password contains at least one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must be atleast one Uppercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must be contain at least one number")
      .matches(/[^azA-Z0-9]/)
      .withMessage("Password contain at least one special chaeracter"),
  ];
};
export { userRegistrationValidator,userLoginValidator };
