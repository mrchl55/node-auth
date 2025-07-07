# api documentation

## base url
`http://localhost:5000/api`

## authentication endpoints

### register user
**POST** `/auth/register`

**request body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**response (201):**
```json
{
  "message": "user created successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

### login user
**POST** `/auth/login`

**request body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**response (200):**
```json
{
  "message": "login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

### verify token
**GET** `/auth/verify`

**headers:**
```
Authorization: Bearer jwt-token-here
```

**response (200):**
```json
{
  "valid": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

### get user profile
**GET** `/auth/profile`

**headers:**
```
Authorization: Bearer jwt-token-here
```

**response (200):**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

### logout
**POST** `/auth/logout`

**response (200):**
```json
{
  "message": "logged out successfully"
}
```

## error responses

**validation error (400):**
```json
{
  "error": "validation failed",
  "details": [
    {
      "field": "email",
      "message": "valid email required"
    }
  ]
}
```

**authentication error (401):**
```json
{
  "error": "invalid credentials"
}
```

**server error (500):**
```json
{
  "error": "something went wrong"
}
``` 