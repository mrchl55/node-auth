const { body, validationResult } = require('express-validator');

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('valid email required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
];

const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('valid email required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('password must contain at least one lowercase letter, one uppercase letter, and one number'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'validation failed',
      details: errors.array()
    });
  }
  next();
};

module.exports = {
  validateLogin,
  validateRegister,
  handleValidationErrors
}; 