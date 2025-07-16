#!/bin/bash

# SerenityAI MVP - Quick Start Script
# This script sets up and runs the complete SerenityAI MVP

echo "🚀 Starting SerenityAI MVP..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")"

echo " Setting up Python environment..."
cd ai-services
python3 -m pip install -r requirements.txt

echo "🔧 Starting AI services..."
python3 main.py &
AI_PID=$!

echo "✅ SerenityAI AI Services are running!"
echo "🤖 AI services: http://localhost:8000"
echo "📖 API docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt signal
trap 'echo "🛑 Stopping services..."; kill $AI_PID 2>/dev/null; exit 0' INT
wait
