# node-auth

simple authentication system with node.js, react, mysql, and mongodb.

## what it does

- jwt authentication with 30min session timeout
- input validation on both client and server
- basic security stuff (sql injection, xss, csrf protection)
- responsive design that works on mobile
- supports both mysql and mongodb
- auto logout when token expires

## tech stack

- **backend**: node.js, express, jwt, bcrypt
- **frontend**: react, css, html
- **databases**: mysql, mongodb
- **security**: helmet, rate limiting, input validation

## how it's organized

```
node-auth/
├── server/          # backend stuff
│   ├── config/      # database configs
│   ├── controllers/ # route handlers
│   ├── middleware/  # custom middleware
│   ├── models/      # database models
│   ├── routes/      # api routes
│   └── utils/       # helper functions
├── client/          # frontend react app
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── styles/
│   └── public/
```

## setup

### what you need

- node.js (v16+)
- mysql (v8.0+) 
- mongodb (v4.4+)

### getting started

1. **clone and install**
   ```bash
   git clone <repo-url>
   cd node-auth
   npm run install:all
   ```

2. **setup databases**
   
   **mysql:**
   ```sql
   CREATE DATABASE node_auth;
   CREATE USER 'auth_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON node_auth.* TO 'auth_user'@'localhost';
   ```

   **mongodb:**
   - just make sure it's running on port 27017
   - database gets created automatically

3. **environment config**
   ```bash
   cp server/.env.example server/.env
   ```
   then edit the `.env` file with your database stuff and jwt secret

4. **run it**
   ```bash
   npm run dev
   ```

   then go to:
   - frontend: http://localhost:3000
   - backend api: http://localhost:5000

## api endpoints

- `POST /api/auth/register` - sign up new user
- `POST /api/auth/login` - login user
- `POST /api/auth/logout` - logout user
- `GET /api/auth/verify` - check if token is valid
- `GET /api/auth/profile` - get user info (protected route)

## security stuff

- passwords get hashed with bcrypt
- jwt tokens for auth
- input validation on both sides
- rate limiting to prevent spam
- cors setup
- security headers
- environment variables protected

## how it's built

follows solid principles and clean architecture:

- each module does one thing well
- easy to extend without breaking stuff
- database implementations are swappable
- clean interfaces
- loose coupling between components

## decisions made

1. **databases**: both mysql and mongodb to show flexibility
2. **sessions**: jwt tokens instead of server sessions for scalability
3. **frontend**: react for component structure
4. **security**: prioritized security over performance
5. **organization**: modular structure for easier maintenance

## testing

```bash
# backend tests
cd server && npm test

# frontend tests
cd client && npm test
```

## deployment

```bash
# build for production
npm run build

# start production server
npm start
``` 