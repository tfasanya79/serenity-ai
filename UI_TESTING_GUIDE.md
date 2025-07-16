# 🧪 SerenityAI UI Testing Guide

## Quick Start Commands

### Start Development Environment
```bash
cd /mnt/c/home/soc_kungen/projects/serenity-ai
./start-dev.sh
```

### Start Mobile App Only
```bash
cd mobile
npm start
```

## 📱 UI Testing Checklist

### 1. **Authentication Flow**
- [ ] **Login Screen** - Verify login form appears
- [ ] **Sign Up** - Test user registration
- [ ] **Password Reset** - Test forgot password flow
- [ ] **Auto-login** - Check if user stays logged in
- [ ] **Logout** - Verify logout functionality

### 2. **Home Screen**
- [ ] **Welcome Message** - Check personalized greeting
- [ ] **Navigation Menu** - Test bottom tabs/drawer
- [ ] **Quick Actions** - Verify main feature buttons
- [ ] **Recent Activity** - Check history display

### 3. **Music Generation**
- [ ] **Music Style Selection** - Test genre options
- [ ] **Mood Input** - Verify mood selection works
- [ ] **Generation Button** - Test music creation
- [ ] **Playback Controls** - Play, pause, stop, repeat
- [ ] **Save/Share** - Test saving generated music
- [ ] **Volume Controls** - Test audio levels

### 4. **Art Generation**
- [ ] **Art Style Selection** - Test visual style options
- [ ] **Color Palette** - Verify color choices
- [ ] **Generation Button** - Test art creation
- [ ] **Image Display** - Check generated art shows
- [ ] **Save/Share** - Test saving generated art
- [ ] **Zoom/Pan** - Test image interactions

### 5. **Meditation Assistant**
- [ ] **Guided Sessions** - Test meditation options
- [ ] **Timer Function** - Verify countdown works
- [ ] **Background Sounds** - Test ambient audio
- [ ] **Progress Tracking** - Check session history
- [ ] **Reminders** - Test notification settings

### 6. **Journal/Reflection**
- [ ] **Text Input** - Test writing interface
- [ ] **Mood Tracking** - Verify mood logging
- [ ] **Entry Saving** - Test save functionality
- [ ] **Entry History** - Check past entries
- [ ] **Search** - Test finding old entries

### 7. **Settings & Profile**
- [ ] **Profile Picture** - Test image upload
- [ ] **Personal Info** - Test editing details
- [ ] **App Preferences** - Test theme, notifications
- [ ] **Privacy Settings** - Test data controls
- [ ] **Help/Support** - Test help sections

### 8. **Performance Testing**
- [ ] **App Launch Time** - Should load quickly
- [ ] **Navigation Speed** - Smooth transitions
- [ ] **Generation Speed** - AI responses reasonable
- [ ] **Memory Usage** - No excessive consumption
- [ ] **Battery Usage** - Reasonable power consumption

### 9. **Error Handling**
- [ ] **Network Errors** - Test offline behavior
- [ ] **Invalid Inputs** - Test error messages
- [ ] **Server Errors** - Test API failure handling
- [ ] **Permission Errors** - Test camera/storage access
- [ ] **Crash Recovery** - Test app stability

### 10. **Accessibility**
- [ ] **Screen Reader** - Test voice navigation
- [ ] **High Contrast** - Test visibility options
- [ ] **Font Size** - Test text scaling
- [ ] **Touch Targets** - Test button sizes
- [ ] **Voice Control** - Test voice commands

## 🔧 Development Tools

### Available Scripts
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test

# Development with hot reload
npm run dev

# Build for production
npm run build
```

### Debugging Tools
- **React Native Debugger** - For component inspection
- **Expo DevTools** - For performance monitoring
- **Console Logs** - Check for errors in terminal
- **Network Tab** - Monitor API calls
- **Redux DevTools** - Check state management

## 📊 Expected Behavior

### Loading States
- Spinners during AI generation
- Skeleton screens during data loading
- Progress bars for long operations

### Success States
- Confirmation messages for saves
- Generated content displays properly
- Smooth animations between screens

### Error States
- Clear error messages
- Retry buttons where appropriate
- Graceful degradation when offline

## 🚀 Performance Targets

- **App Launch**: < 3 seconds
- **Screen Navigation**: < 500ms
- **Music Generation**: < 30 seconds
- **Art Generation**: < 45 seconds
- **Memory Usage**: < 150MB
- **Battery**: < 5% per hour of active use

## 🔍 Common Issues & Solutions

### App Won't Start
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Reset Expo cache
expo start --clear
```

### UI Not Updating
```bash
# Force reload
Press 'r' in terminal or shake device

# Check for TypeScript errors
npm run type-check
```

### Audio Not Playing
- Check device volume
- Verify audio permissions
- Test with different audio formats

### Images Not Loading
- Check internet connection
- Verify image URLs
- Test with different image sizes

## 📱 Testing on Different Devices

### Phone Testing
- **Small screens** (iPhone SE, Android compact)
- **Large screens** (iPhone Pro Max, Android XL)
- **Tablets** (iPad, Android tablets)

### Platform Testing
- **iOS** (iPhone, iPad)
- **Android** (Various manufacturers)
- **Web** (Chrome, Safari, Firefox)

### Connection Testing
- **WiFi** (Fast, slow connections)
- **Mobile Data** (3G, 4G, 5G)
- **Offline Mode** (No connection)

## 📋 Test Results Template

```
Device: [Device Name]
OS: [iOS/Android Version]
Date: [Test Date]
Tester: [Your Name]

✅ PASSED: [Feature worked correctly]
❌ FAILED: [Feature didn't work - describe issue]
⚠️ ISSUE: [Feature works but has minor problems]

Overall Rating: [1-10]
Notes: [Additional observations]
```

## 🎯 Next Steps After Testing

1. **Document Issues** - Record all bugs found
2. **Performance Analysis** - Check app performance metrics
3. **User Feedback** - Gather feedback from test users
4. **Fix Priority** - Prioritize critical issues
5. **Regression Testing** - Re-test after fixes

Happy Testing! 🚀
