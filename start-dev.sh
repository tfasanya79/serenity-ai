#!/bin/bash

# Simple script to start the SerenityAI services for testing

echo "🚀 Starting SerenityAI Development Environment"
echo "=============================================="

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check required ports
echo "Checking required ports..."
check_port 3000 || exit 1
check_port 8000 || exit 1

echo ""
echo "🔧 Starting Backend API (Port 3000)..."
cd backend
npm run dev &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

echo ""
echo "🤖 Starting AI Services (Port 8000)..."
cd ../ai-services
python main.py &
AI_PID=$!
echo "AI Services PID: $AI_PID"

echo ""
echo "⚡ Services started successfully!"
echo "Backend API: http://localhost:3000"
echo "AI Services: http://localhost:8000"
echo "AI Services Docs: http://localhost:8000/docs"

echo ""
echo "📱 To start the mobile app, run in another terminal:"
echo "cd mobile && npm start"

echo ""
echo "Press Ctrl+C to stop all services"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID $AI_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

trap cleanup SIGINT

# Wait for services
wait
