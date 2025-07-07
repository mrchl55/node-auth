import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'email is required')
  .email('invalid email format')
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(6, 'password must be at least 6 characters')
  .regex(/[a-z]/, 'password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'password must contain at least one uppercase letter')
  .regex(/\d/, 'password must contain at least one number');

export const basicPasswordSchema = z
  .string()
  .min(6, 'password must be at least 6 characters');

export const loginSchema = z.object({
  email: emailSchema,
  password: basicPasswordSchema
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "passwords do not match",
  path: ["confirmPassword"]
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export const validateLoginForm = (data: any) => {
  try {
    return { success: true, data: loginSchema.parse(data), errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(err => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });
      return { success: false, data: null, errors };
    }
    return { success: false, data: null, errors: { general: 'validation failed' } };
  }
};

export const validateRegisterForm = (data: any) => {
  try {
    return { success: true, data: registerSchema.parse(data), errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(err => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });
      return { success: false, data: null, errors };
    }
    return { success: false, data: null, errors: { general: 'validation failed' } };
  }
}; 