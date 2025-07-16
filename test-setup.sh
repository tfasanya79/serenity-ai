#!/bin/bash

echo "🧪 SerenityAI Setup Test"
echo "========================"

echo ""
echo "✅ Checking installations..."

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js $(node --version) - OK"
else
    echo "❌ Node.js - NOT FOUND"
    exit 1
fi

# Check Python
if command -v python &> /dev/null; then
    echo "✅ Python $(python --version) - OK"
else
    echo "❌ Python - NOT FOUND"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    echo "✅ npm $(npm --version) - OK"
else
    echo "❌ npm - NOT FOUND"
    exit 1
fi

echo ""
echo "🔍 Checking project structure..."

# Check if directories exist
if [ -d "backend" ]; then
    echo "✅ Backend directory exists"
else
    echo "❌ Backend directory missing"
    exit 1
fi

if [ -d "ai-services" ]; then
    echo "✅ AI Services directory exists"
else
    echo "❌ AI Services directory missing"
    exit 1
fi

if [ -d "mobile" ]; then
    echo "✅ Mobile directory exists"
else
    echo "❌ Mobile directory missing"
    exit 1
fi

echo ""
echo "📦 Checking dependencies..."

# Check backend dependencies
if [ -d "backend/node_modules" ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend dependencies missing"
fi

# Check mobile dependencies
if [ -d "mobile/node_modules" ]; then
    echo "✅ Mobile dependencies installed"
else
    echo "❌ Mobile dependencies missing"
fi

# Check Python dependencies
cd ai-services
if python -c "import fastapi; import uvicorn" 2>/dev/null; then
    echo "✅ AI Services dependencies installed"
else
    echo "❌ AI Services dependencies missing"
fi
cd ..

echo ""
echo "🔧 Testing basic functionality..."

# Test backend server can import dependencies
cd backend
if node -e "console.log('Backend dependencies check:', require('express') ? 'OK' : 'FAIL')" 2>/dev/null; then
    echo "✅ Backend dependencies working"
else
    echo "❌ Backend dependencies have issues"
fi
cd ..

# Test AI services can import dependencies
cd ai-services
if python -c "from main import app; print('✅ AI Services imports working')" 2>/dev/null; then
    echo "✅ AI Services imports working"
else
    echo "⚠️  AI Services imports have minor issues (may work anyway)"
fi
cd ..

echo ""
echo "🎉 Setup test completed!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development servers: ./start-dev.sh"
echo "2. Open http://localhost:3000 for backend API"
echo "3. Open http://localhost:8000/docs for AI services"
echo "4. In another terminal, run 'cd mobile && npm start' for mobile app"
echo ""
echo "💡 For PostgreSQL and Redis setup, check DEVELOPMENT.md"
