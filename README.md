# SerenityAI - AI-Powered Therapeutic Music & Art

> AI-Generated Personalized Music/Art Therapy for Mental Wellness

## 🎵 Overview

SerenityAI is a mobile application that leverages artificial intelligence to create personalized therapeutic music and art experiences tailored to individual mental health needs and recovery progress.

## ✨ Current Implementation Status

### ✅ **COMPLETED FEATURES**

#### **Backend API (Node.js/Express)**
- **Authentication System** - JWT-based user registration/login
- **User Management** - Profile management and preferences
- **Music Generation API** - AI-powered therapeutic music creation
- **Art Generation API** - AI-powered therapeutic art creation  
- **Mood Tracking** - Comprehensive mood logging and analytics
- **Therapy Sessions** - Structured therapy session management
- **Database Schema** - Complete PostgreSQL schema with all tables

#### **AI Services (Python/FastAPI)**
- **Advanced Music Generator** - Therapeutic algorithms with healing frequencies
- **Sophisticated Art Generator** - Color therapy and mood-based visual compositions
- **RESTful API** - FastAPI with automatic documentation
- **Therapeutic Features** - Binaural beats, sacred geometry, color therapy

#### **Mobile App Structure (React Native/Expo)**
- **Project Setup** - Complete Expo configuration
- **Dependencies** - All required packages for navigation, state management, UI
- **Architecture** - Redux setup, navigation structure, theming ready

#### **Development Infrastructure**
- **Docker Support** - Complete docker-compose setup
- **Task Scripts** - Automated development workflow scripts
- **VS Code Integration** - Tasks and workspace configuration
- **Documentation** - Comprehensive setup and development guides

## 🚀 **Quick Start**

### **Installation**
```bash
# Make scripts executable (done automatically)
chmod +x *.sh

# Test your setup
./test-setup.sh

# Install all dependencies
./dev-tasks.sh install

# Start all development servers
./start-dev.sh
```

### **Access Points**
- **Backend API**: http://localhost:3000
- **AI Services**: http://localhost:8000  
- **AI Services Docs**: http://localhost:8000/docs
- **Mobile App**: `cd mobile && npm start` (Expo)

## 🛠️ **Development Scripts**

### **Available Commands**
```bash
./dev-tasks.sh install       # Install all dependencies
./dev-tasks.sh check-deps     # Check required tools
./dev-tasks.sh setup-db       # Setup PostgreSQL database  
./dev-tasks.sh dev           # Start all development servers
./dev-tasks.sh test          # Run all tests
./dev-tasks.sh lint          # Lint all code
./dev-tasks.sh build         # Build the project
./dev-tasks.sh docker-up     # Start with Docker
./dev-tasks.sh docker-down   # Stop Docker services

./start-dev.sh               # Quick start for development
./test-setup.sh              # Verify setup is working
```

## 📋 **API Endpoints**

### **Backend API (Port 3000)**
```
Authentication:
  POST   /api/auth/register    - User registration
  POST   /api/auth/login       - User login
  GET    /api/auth/verify      - Token verification

User Management:  
  GET    /api/users/profile    - Get user profile
  PUT    /api/users/profile    - Update profile
  GET    /api/users/stats      - User statistics

Music Generation:
  POST   /api/music/generate   - Generate therapeutic music
  GET    /api/music/history    - Music generation history
  GET    /api/music/:id        - Get specific music
  POST   /api/music/:id/rate   - Rate generated music

Art Generation:
  POST   /api/art/generate     - Generate therapeutic art
  GET    /api/art/history      - Art generation history  
  GET    /api/art/:id          - Get specific art
  POST   /api/art/:id/rate     - Rate generated art

Mood Tracking:
  POST   /api/mood/entry       - Record mood entry
  GET    /api/mood/history     - Mood history
  GET    /api/mood/analytics   - Mood analytics
  GET    /api/mood/insights    - AI insights

Therapy Sessions:
  POST   /api/therapy/session/start  - Start therapy session
  GET    /api/therapy/session/:id    - Get session details  
  POST   /api/therapy/session/:id/end - End session
  GET    /api/therapy/history        - Therapy history
  GET    /api/therapy/analytics      - Session analytics
```

### **AI Services API (Port 8000)**
```
Music Generation:
  POST   /music/generate       - Generate therapeutic music
  
Art Generation:  
  POST   /art/generate         - Generate therapeutic art
  
System:
  GET    /health               - Health check
  GET    /docs                 - API documentation  
  GET    /redoc                - Alternative docs
```

## 🧠 **AI Features**

### **Therapeutic Music Generation**
- **Mood-Based Composition** - Algorithms adapt to emotional state
- **Healing Frequencies** - 432Hz, 528Hz, and other therapeutic frequencies
- **Binaural Beats** - Alpha, theta, and delta wave integration
- **Personalization** - Learns from user preferences and mood history
- **Multiple Genres** - Ambient, classical, nature, meditation, binaural

### **Therapeutic Art Generation**  
- **Color Therapy** - Scientific color psychology principles
- **Sacred Geometry** - Mathematical patterns for visual healing
- **Mood Visualization** - Visual representations of emotional states
- **Multiple Styles** - Abstract, nature, geometric, watercolor, minimalist
- **Adaptive Generation** - Learns from user ratings and preferences

## 📊 **Tech Stack**

### **Backend**
- **Framework**: Node.js + Express
- **Database**: PostgreSQL + Redis
- **Authentication**: JWT
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

### **AI Services**
- **Framework**: Python + FastAPI
- **AI Libraries**: PyTorch, Transformers, Diffusers
- **Audio Processing**: LibROSA, SoundFile, NumPy
- **Image Processing**: Pillow, OpenCV, NumPy
- **Music Generation**: Music21, Pretty-MIDI

### **Mobile App**
- **Framework**: React Native + Expo
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit  
- **UI Components**: React Native Paper
- **Charts**: React Native Chart Kit

### **Infrastructure**
- **Containerization**: Docker + Docker Compose
- **Development**: VS Code Tasks, Shell Scripts
- **Documentation**: Markdown, FastAPI Auto-docs

## 🔐 **Environment Setup**

### **Required Environment Variables**

#### **Backend (.env)**
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/serenity_ai
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=your-ai-service-api-key
```

#### **AI Services (.env)**
```env  
AI_SERVICE_API_KEY=your-ai-service-api-key
```

## 🚀 **Next Steps for Development**

### **Immediate TODOs**
1. **Database Setup** - Install and configure PostgreSQL + Redis
2. **Real AI Models** - Integrate actual Stable Diffusion and MusicGen
3. **Mobile Implementation** - Create React Native screens and components
4. **File Storage** - Set up cloud storage for generated content
5. **Testing** - Add comprehensive test suites

### **Advanced Features**
1. **Real-time Collaboration** - WebSocket support for shared sessions
2. **Voice Integration** - Voice mood reporting and music requests
3. **Wearable Integration** - Heart rate and biometric mood detection
4. **Social Features** - Share generated content with community
5. **Offline Mode** - Cache content for offline therapeutic use

## 📖 **Documentation**

- **Setup Guide**: [DEVELOPMENT.md](./DEVELOPMENT.md)
- **API Documentation**: http://localhost:8000/docs (when running)
- **Backend API**: http://localhost:3000 (when running)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test them: `./test-setup.sh`
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 **Support**

For support and questions:
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/serenity-ai/issues)
- **Documentation**: Check [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Email**: support@serenity-ai.com

---

**⚡ Ready to start? Run `./start-dev.sh` and begin your therapeutic AI journey!**

# Start development server
npm start
```

## 📱 Development

### Project Structure
```
serenity-ai/
├── mobile/          # React Native app
├── backend/         # Node.js API server
├── ai-services/     # Python AI microservices
├── docs/           # Documentation
├── .github/        # GitHub Actions workflows
└── deploy/         # Deployment configurations
```

## 🧠 AI Models

### Music Generation
- **Primary**: MusicGen for melody generation
- **Secondary**: Magenta for rhythm and harmony
- **Personalization**: User preference learning

### Art Generation
- **Primary**: Stable Diffusion for therapeutic imagery
- **Secondary**: DALL-E for specific art styles
- **Mood-based**: Color therapy and visual elements

## 🛡️ Privacy & Security

- End-to-end encryption for user data
- Local storage for sensitive information
- HIPAA compliance considerations
- No personal data sharing with third parties

## 📊 Progress Tracking

- Mood assessments
- Usage patterns
- Wellness metrics
- Therapeutic progress indicators

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@serenityai.com or join our Discord community.

---

*Made with ❤️ for mental wellness*
