#!/bin/bash

echo "setting up node-auth project..."

# install root dependencies
echo "installing root dependencies..."
npm install

# install server dependencies
echo "installing server dependencies..."
cd server && npm install && cd ..

# install client dependencies
echo "installing client dependencies..."
cd client && npm install && cd ..

# copy environment file
echo "setting up environment..."
if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    echo "created server/.env file - please update with your database credentials"
fi

echo "setup complete!"
echo ""
echo "to start the application:"
echo "  npm run dev"
echo ""
echo "this will start both the backend (port 5000) and frontend (port 3000)"
