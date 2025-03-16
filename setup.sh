#!/bin/bash

# Create necessary directories
mkdir -p uploads/projects
mkdir -p logs

# Set permissions
chmod -R 755 uploads logs

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file. Please update it with your API keys."
fi

# Install dependencies
echo "Installing backend dependencies..."
npm install

echo "Installing frontend dependencies..."
cd frontend && npm install
cd ..

# Create uploads and logs directories in Docker volume paths
docker volume create aicems_uploads
docker volume create aicems_logs

echo "Setup completed successfully!"
echo "Next steps:"
echo "1. Update the .env file with your API keys"
echo "2. Run 'docker-compose up --build' to start the application"
echo "3. Access the application at:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:8000"
echo "   - Chat Server: http://localhost:8080"
