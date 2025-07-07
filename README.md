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
│   └── schemas/     # validation schemas
├── client/          # frontend react app
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── styles/
│   └── public/
```

## local setup

### prerequisites

- node.js (v16+)
- npm or yarn
- mongodb (v4.4+) or mysql (v8.0+)

### step-by-step setup

1. **clone the repo**
   ```bash
   git clone <repo-url>
   cd node-auth
   ```

2. **install dependencies**
   ```bash
   npm install
   npm run install:all
   ```

3. **setup database**
   
   **option a: mongodb (recommended)**
   ```bash
   # install mongodb (macos)
   brew install mongodb-community
   
   # start mongodb service
   brew services start mongodb-community
   
   # mongodb will create the database automatically
   ```

   **option b: mysql**
   ```sql
   # create database and user
   CREATE DATABASE node_auth;
   CREATE USER 'auth_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON node_auth.* TO 'auth_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **configure environment variables**
   
   **server configuration:**
   ```bash
   # copy example file
   cp server/env.example server/.env
   
   # edit server/.env with your settings
   ```
   
   **client configuration:**
   ```bash
   # copy example file
   cp client/env.example client/.env
   
   # edit client/.env if needed (defaults should work)
   ```

5. **start the application**
   ```bash
   # start both server and client
   npm run dev
   ```
   
   or start them separately:
   ```bash
   # terminal 1 - start server
   npm run server:dev
   
   # terminal 2 - start client
   npm run client:dev
   ```

6. **access the application**
   - frontend: http://localhost:3000
   - backend api: http://localhost:3001

### environment variables

**server/.env**
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/node-auth

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

**client/.env**
```env
# API URL for backend server
REACT_APP_API_URL=http://localhost:3001/api
```

### troubleshooting

**port conflicts:**
- if port 3000 is busy, react will ask to use another port
- if port 3001 is busy, change PORT in server/.env

**database connection issues:**
- make sure mongodb is running: `brew services list | grep mongodb`
- check mongodb logs: `brew services info mongodb-community`
- for mysql, verify credentials and database exists

**authentication issues:**
- make sure JWT_SECRET is at least 32 characters
- check that both server and client are using same ports
- verify CORS settings in server/.env

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

## development

### available scripts

```bash
# development
npm run dev              # start both server and client
npm run server:dev       # start server only
npm run client:dev       # start client only

# testing
npm test                 # run all tests
npm run test:server      # run server tests
npm run test:client      # run client tests

# code quality
npm run lint             # lint all code
npm run lint:fix         # fix linting issues
npm run typecheck        # check typescript types
npm run validate         # run all checks (lint + typecheck + test)

# production
npm run build            # build for production
npm start                # start production server
```

### database switching

to switch between mongodb and mysql:
1. change `DB_TYPE` in server/.env
2. configure the appropriate database connection variables
3. restart the server

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

## deployment

```bash
# build for production
npm run build

# start production server
npm start
``` 