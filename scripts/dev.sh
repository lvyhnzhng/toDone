#!/bin/bash

echo "🚀 Starting toDone development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if MongoDB is running
if ! docker ps | grep -q "todone-mongodb"; then
    echo "📦 Starting MongoDB..."
    docker-compose up -d mongodb
    
    # Wait for MongoDB to be ready
    echo "⏳ Waiting for MongoDB to be ready..."
    sleep 10
fi

# Start backend
echo "🔧 Starting backend..."
cd backend
go mod tidy
go run main.go &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 5

# Start frontend
echo "🎨 Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Development environment started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8080"
echo "🗄️  MongoDB: localhost:27017"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait 