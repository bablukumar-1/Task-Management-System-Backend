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
      // .normalizeEmail()
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

const userLoginValidator = () => [
  body("email")
    .isString().withMessage("Email must be a string")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isLength({ max: 254 }).withMessage("Email cannot exceed 254 characters")
    .isEmail().withMessage("Please enter a valid email")
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false }),

  body("password")
    .isString().withMessage("Password must be a string")
    .notEmpty().withMessage("Password is required")
    .isLength({ max: 64 }).withMessage("Password cannot exceed 64 characters"),
];

export { userRegistrationValidator,userLoginValidator };
