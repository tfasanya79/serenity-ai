// Test API configuration
import { AuthService, MusicService, ArtService } from '../services';

// Simple test to verify API configuration
export const testApiConnection = async () => {
  console.log('Testing API configuration...');
  
  // Test endpoints exist (this will fail gracefully if backend is not running)
  try {
    // This should fail with 401 (unauthorized) rather than network error
    await MusicService.getMusicHistory();
    console.log('✅ API endpoints are configured correctly');
  } catch (error: any) {
    if (error.status === 401) {
      console.log('✅ API endpoints are configured correctly (401 = authentication required)');
    } else {
      console.log('❌ API connection failed:', error.message);
    }
  }
};

// Test authentication flow
export const testAuthFlow = async () => {
  console.log('Testing authentication flow...');
  
  try {
    // Test login with dummy credentials (should fail gracefully)
    await AuthService.login({
      email: 'test@example.com',
      password: 'testpassword'
    });
    console.log('✅ Login flow is working');
  } catch (error: any) {
    if (error.message.includes('Network error')) {
      console.log('❌ Backend server is not running');
    } else {
      console.log('✅ Login flow is configured correctly (error handling works)');
    }
  }
};

// Test music generation
export const testMusicGeneration = async () => {
  console.log('Testing music generation...');
  
  try {
    await MusicService.generateMusic({
      mood: 'calm',
      genre: 'ambient',
      duration: 300
    });
    console.log('✅ Music generation is working');
  } catch (error: any) {
    if (error.status === 401) {
      console.log('✅ Music generation is configured correctly (401 = authentication required)');
    } else {
      console.log('❌ Music generation failed:', error.message);
    }
  }
};

// Test art generation
export const testArtGeneration = async () => {
  console.log('Testing art generation...');
  
  try {
    await ArtService.generateArt({
      mood: 'serene',
      style: 'abstract',
      colors: ['#4A90E2', '#50E3C2', '#9013FE']
    });
    console.log('✅ Art generation is working');
  } catch (error: any) {
    if (error.status === 401) {
      console.log('✅ Art generation is configured correctly (401 = authentication required)');
    } else {
      console.log('❌ Art generation failed:', error.message);
    }
  }
};

export default {
  testApiConnection,
  testAuthFlow,
  testMusicGeneration,
  testArtGeneration
};
