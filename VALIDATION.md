# validation with zod

this project uses zod for robust, type-safe validation on both client and server.

## schema files

### server: `server/schemas/authSchemas.js`
- email validation with normalization
- password complexity requirements
- reusable validation middleware
- structured error responses

### client: `client/src/schemas/authSchemas.ts`
- typescript types from zod schemas
- client-side validation functions
- password confirmation matching
- real-time error handling

## validation rules

### email
```javascript
z.string()
  .min(1, 'email is required')
  .email('invalid email format')
  .toLowerCase()
  .trim()
```

### password (login)
```javascript
z.string()
  .min(6, 'password must be at least 6 characters')
```

### password (register)
```javascript
z.string()
  .min(6, 'password must be at least 6 characters')
  .regex(/[a-z]/, 'password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'password must contain at least one uppercase letter')
  .regex(/\d/, 'password must contain at least one number')
```

### register form
```javascript
z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "passwords do not match",
  path: ["confirmPassword"]
})
```

## usage

### server middleware
```javascript
const { validateRequest, loginSchema } = require('../schemas/authSchemas');

router.post('/login', validateRequest(loginSchema), login);
```

### client validation
```javascript
import { validateLoginForm } from '../schemas/authSchemas';

const result = validateLoginForm(formData);
if (result.success) {
  // proceed with form submission
} else {
  setErrors(result.errors);
}
```

## benefits

- **type safety**: typescript types inferred from schemas
- **consistency**: same validation rules on client and server
- **better errors**: structured error messages with field paths
- **reusability**: schemas can be composed and extended
- **runtime safety**: validates data at runtime, not just compile time

## error format

server responses:
```json
{
  "error": "validation failed",
  "details": [
    {
      "field": "email",
      "message": "invalid email format"
    },
    {
      "field": "password",
      "message": "password must contain at least one uppercase letter"
    }
  ]
}
```

client errors:
```javascript
{
  email: "invalid email format",
  password: "password must contain at least one uppercase letter"
}
``` 