#!/bin/bash

# SerenityAI Development Task Runner
# This script provides common development tasks for the SerenityAI project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Check if required tools are installed
check_dependencies() {
    print_header "Checking Dependencies"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v18 or higher."
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.8 or higher."
        exit 1
    fi
    
    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL CLI not found. Make sure PostgreSQL is installed and accessible."
    fi
    
    # Check Redis
    if ! command -v redis-cli &> /dev/null; then
        print_warning "Redis CLI not found. Make sure Redis is installed and running."
    fi
    
    print_status "Dependencies check completed"
}

# Install all dependencies
install_deps() {
    print_header "Installing Dependencies"
    
    # Install root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Install mobile dependencies
    print_status "Installing mobile dependencies..."
    cd mobile
    npm install
    cd ..
    
    # Install AI services dependencies
    print_status "Installing AI services dependencies..."
    cd ai-services
    pip3 install -r requirements.txt
    cd ..
    
    print_status "All dependencies installed successfully"
}

# Setup database
setup_database() {
    print_header "Setting up Database"
    
    # Check if database exists
    if psql -U serenity_user -d serenity_ai -c "SELECT 1" &> /dev/null; then
        print_warning "Database already exists. Skipping creation."
    else
        print_status "Creating database..."
        # You may need to modify these commands based on your PostgreSQL setup
        createdb serenity_ai
        psql -d serenity_ai -c "CREATE USER serenity_user WITH PASSWORD 'serenity_password';"
        psql -d serenity_ai -c "GRANT ALL PRIVILEGES ON DATABASE serenity_ai TO serenity_user;"
    fi
    
    # Run schema
    print_status "Running database schema..."
    psql -U serenity_user -d serenity_ai -f backend/database/schema.sql
    
    print_status "Database setup completed"
}

# Start development servers
start_dev() {
    print_header "Starting Development Servers"
    
    # Start backend in background
    print_status "Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Start AI services in background
    print_status "Starting AI services..."
    cd ai-services
    python3 main.py &
    AI_PID=$!
    cd ..
    
    # Start mobile app
    print_status "Starting mobile app..."
    cd mobile
    npm start &
    MOBILE_PID=$!
    cd ..
    
    print_status "All servers started successfully"
    print_status "Backend: http://localhost:3000"
    print_status "AI Services: http://localhost:8000"
    print_status "Mobile: Follow Expo instructions"
    
    # Wait for interrupt
    echo -e "${GREEN}Press Ctrl+C to stop all servers${NC}"
    
    # Cleanup function
    cleanup() {
        print_status "Stopping servers..."
        kill $BACKEND_PID $AI_PID $MOBILE_PID 2>/dev/null
        print_status "All servers stopped"
        exit 0
    }
    
    trap cleanup SIGINT
    wait
}

# Run tests
run_tests() {
    print_header "Running Tests"
    
    # Backend tests
    print_status "Running backend tests..."
    cd backend
    npm test
    cd ..
    
    # AI services tests
    print_status "Running AI services tests..."
    cd ai-services
    python3 -m pytest
    cd ..
    
    # Mobile tests
    print_status "Running mobile tests..."
    cd mobile
    npm test
    cd ..
    
    print_status "All tests completed"
}

# Lint code
lint_code() {
    print_header "Linting Code"
    
    # Backend linting
    print_status "Linting backend code..."
    cd backend
    npm run lint
    cd ..
    
    # Mobile linting
    print_status "Linting mobile code..."
    cd mobile
    npm run lint
    cd ..
    
    print_status "Code linting completed"
}

# Build project
build_project() {
    print_header "Building Project"
    
    # Build backend
    print_status "Building backend..."
    cd backend
    npm run build
    cd ..
    
    # Build mobile
    print_status "Building mobile..."
    cd mobile
    npm run build
    cd ..
    
    print_status "Project build completed"
}

# Docker operations
docker_up() {
    print_header "Starting Docker Services"
    docker-compose up -d
    print_status "Docker services started"
}

docker_down() {
    print_header "Stopping Docker Services"
    docker-compose down
    print_status "Docker services stopped"
}

# Show help
show_help() {
    echo "SerenityAI Development Task Runner"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  check-deps    Check if all required dependencies are installed"
    echo "  install       Install all project dependencies"
    echo "  setup-db      Setup and initialize the database"
    echo "  dev           Start all development servers"
    echo "  test          Run all tests"
    echo "  lint          Lint all code"
    echo "  build         Build the project"
    echo "  docker-up     Start services with Docker Compose"
    echo "  docker-down   Stop Docker services"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install     # Install all dependencies"
    echo "  $0 dev         # Start development servers"
    echo "  $0 test        # Run all tests"
}

# Main script logic
case "$1" in
    "check-deps")
        check_dependencies
        ;;
    "install")
        install_deps
        ;;
    "setup-db")
        setup_database
        ;;
    "dev")
        start_dev
        ;;
    "test")
        run_tests
        ;;
    "lint")
        lint_code
        ;;
    "build")
        build_project
        ;;
    "docker-up")
        docker_up
        ;;
    "docker-down")
        docker_down
        ;;
    "help"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
