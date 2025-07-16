# SerenityAI Development Setup Guide

## Prerequisites

Before setting up the SerenityAI project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** (v12 or higher)
- **Redis** (v6 or higher)
- **Git**

### For Mobile Development:
- **React Native CLI**
- **Expo CLI**: `npm install -g expo-cli`
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - macOS only)

## Project Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/yourusername/serenity-ai.git
cd serenity-ai

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install mobile dependencies
cd ../mobile
npm install

# Install AI services dependencies
cd ../ai-services
pip install -r requirements.txt
```

### 2. Database Setup

1. **Create PostgreSQL Database:**
```sql
CREATE DATABASE serenity_ai;
CREATE USER serenity_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE serenity_ai TO serenity_user;
```

2. **Run Database Schema:**
```bash
cd backend
psql -U serenity_user -d serenity_ai -f database/schema.sql
```

3. **Set up Redis:**
```bash
# Start Redis server
redis-server

# Or if using Docker:
docker run -d -p 6379:6379 redis:latest
```

### 3. Environment Configuration

1. **Backend Environment:**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

2. **Mobile Environment:**
```bash
cd mobile
# Create .env file with your API endpoints
echo "API_BASE_URL=http://localhost:3000" > .env
```

3. **AI Services Environment:**
```bash
cd ai-services
# Create .env file
echo "AI_SERVICE_API_KEY=your-ai-service-api-key" > .env
```

### 4. Start Development Servers

1. **Start Backend Server:**
```bash
cd backend
npm run dev
# Server will start on http://localhost:3000
```

2. **Start AI Services:**
```bash
cd ai-services
python main.py
# AI services will start on http://localhost:8000
```

3. **Start Mobile App:**
```bash
cd mobile
npm start
# Expo will start and show QR code for device testing
```

## Development Workflow

### Backend Development

The backend is built with Node.js and Express, featuring:

- **Authentication**: JWT-based authentication
- **Database**: PostgreSQL with Redis caching
- **API Routes**:
  - `/api/auth` - Authentication endpoints
  - `/api/users` - User management
  - `/api/music` - Music generation
  - `/api/art` - Art generation
  - `/api/mood` - Mood tracking
  - `/api/therapy` - Therapy sessions

### AI Services Development

The AI services are built with Python and FastAPI:

- **Music Generation**: Therapeutic music creation
- **Art Generation**: Therapeutic art creation
- **Endpoints**:
  - `/music/generate` - Generate therapeutic music
  - `/art/generate` - Generate therapeutic art
  - `/health` - Health check

### Mobile Development

The mobile app is built with React Native and Expo:

- **Navigation**: React Navigation
- **State Management**: Redux Toolkit
- **UI Components**: React Native Paper
- **Key Features**:
  - User authentication
  - Mood tracking
  - Music generation
  - Art generation
  - Therapy sessions
  - Progress analytics

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### AI Services Tests
```bash
cd ai-services
pytest
```

### Mobile Tests
```bash
cd mobile
npm test
```

## Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm run deploy
```

### AI Services Deployment
```bash
cd ai-services
# Deploy to cloud service (AWS, Google Cloud, etc.)
```

### Mobile Deployment
```bash
cd mobile
# For Android
expo build:android

# For iOS
expo build:ios
```

## API Documentation

### Backend API

The backend API is documented using OpenAPI/Swagger. After starting the server, visit:
- `http://localhost:3000/api/docs` (when implemented)

### AI Services API

The AI services API is documented using FastAPI's automatic documentation:
- `http://localhost:8000/docs` - Interactive API docs
- `http://localhost:8000/redoc` - Alternative documentation

## Project Structure

```
serenity-ai/
├── backend/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── database/           # Database schemas
│   ├── middleware/         # Express middleware
│   └── server.js           # Main server file
├── ai-services/            # Python AI services
│   ├── main.py            # FastAPI main file
│   ├── music_generator.py # Music generation logic
│   ├── art_generator.py   # Art generation logic
│   └── requirements.txt   # Python dependencies
├── mobile/                 # React Native mobile app
│   ├── src/               # Source code
│   ├── assets/            # Images and assets
│   ├── App.tsx            # Main app component
│   └── package.json       # Mobile dependencies
└── README.md              # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@serenity-ai.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/serenity-ai/issues)
- Documentation: [Visit our docs](https://docs.serenity-ai.com)

---

**Note**: This is a development setup guide. For production deployment, additional security measures, environment configurations, and optimizations should be implemented.
