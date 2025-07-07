const { z } = require('zod');

const emailSchema = z
  .string()
  .min(1, 'email is required')
  .email('invalid email format')
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string()
  .min(6, 'password must be at least 6 characters')
  .regex(/[a-z]/, 'password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'password must contain at least one uppercase letter')
  .regex(/\d/, 'password must contain at least one number');

const basicPasswordSchema = z
  .string()
  .min(6, 'password must be at least 6 characters');

const loginSchema = z.object({
  email: emailSchema,
  password: basicPasswordSchema
});

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return res.status(400).json({ error: 'invalid request data' });
    }
  };
};

module.exports = {
  emailSchema,
  passwordSchema,
  basicPasswordSchema,
  loginSchema,
  registerSchema,
  validateRequest
}; 