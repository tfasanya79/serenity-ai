// Test suite for SerenityAI MVP
import { Alert } from 'react-native';
import { AuthService, MusicService, ArtService } from '../services';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: string;
}

class MVPTestSuite {
  private results: TestResult[] = [];

  // Test API configuration
  async testApiConfiguration(): Promise<TestResult> {
    const testName = 'API Configuration';
    try {
      // Test if API client is properly configured
      const apiClient = require('../services/api').default;
      
      if (!apiClient) {
        throw new Error('API client not configured');
      }

      const baseURL = apiClient.defaults.baseURL;
      if (!baseURL) {
        throw new Error('Base URL not configured');
      }

      return {
        name: testName,
        passed: true,
        details: `API configured with base URL: ${baseURL}`,
      };
    } catch (error: any) {
      return {
        name: testName,
        passed: false,
        error: error.message,
      };
    }
  }

  // Test authentication service
  async testAuthenticationService(): Promise<TestResult> {
    const testName = 'Authentication Service';
    try {
      // Test if auth service methods exist
      const methods = [
        'login',
        'register',
        'logout',
        'getToken',
        'getUser',
        'isAuthenticated',
      ];

      for (const method of methods) {
        if (typeof (AuthService as any)[method] !== 'function') {
          throw new Error(`AuthService.${method} is not a function`);
        }
      }

      // Test token storage (should not throw)
      const token = await AuthService.getToken();
      const user = await AuthService.getUser();
      const isAuth = await AuthService.isAuthenticated();

      return {
        name: testName,
        passed: true,
        details: `All auth methods available. Current state: ${isAuth ? 'authenticated' : 'not authenticated'}`,
      };
    } catch (error: any) {
      return {
        name: testName,
        passed: false,
        error: error.message,
      };
    }
  }

  // Test music service
  async testMusicService(): Promise<TestResult> {
    const testName = 'Music Service';
    try {
      const methods = [
        'generateMusic',
        'getMusicHistory',
        'getMusic',
        'rateMusic',
        'getGenres',
        'getMoods',
      ];

      for (const method of methods) {
        if (typeof (MusicService as any)[method] !== 'function') {
          throw new Error(`MusicService.${method} is not a function`);
        }
      }

      return {
        name: testName,
        passed: true,
        details: 'All music service methods available',
      };
    } catch (error: any) {
      return {
        name: testName,
        passed: false,
        error: error.message,
      };
    }
  }

  // Test art service
  async testArtService(): Promise<TestResult> {
    const testName = 'Art Service';
    try {
      const methods = [
        'generateArt',
        'getArtHistory',
        'getArt',
        'rateArt',
        'getStyles',
        'getMoods',
      ];

      for (const method of methods) {
        if (typeof (ArtService as any)[method] !== 'function') {
          throw new Error(`ArtService.${method} is not a function`);
        }
      }

      return {
        name: testName,
        passed: true,
        details: 'All art service methods available',
      };
    } catch (error: any) {
      return {
        name: testName,
        passed: false,
        error: error.message,
      };
    }
  }

  // Test Redux store
  async testReduxStore(): Promise<TestResult> {
    const testName = 'Redux Store';
    try {
      const { store } = require('../store/store');
      
      if (!store) {
        throw new Error('Redux store not configured');
      }

      const state = store.getState();
      const requiredSlices = ['auth', 'music', 'art'];

      for (const slice of requiredSlices) {
        if (!state[slice]) {
          throw new Error(`${slice} slice not found in store`);
        }
      }

      return {
        name: testName,
        passed: true,
        details: `Store configured with slices: ${Object.keys(state).join(', ')}`,
      };
    } catch (error: any) {
      return {
        name: testName,
        passed: false,
        error: error.message,
      };
    }
  }

  // Test theme configuration
  async testThemeConfiguration(): Promise<TestResult> {
    const testName = 'Theme Configuration';
    try {
      const { theme } = require('../theme/theme');
      
      if (!theme) {
        throw new Error('Theme not configured');
      }

      const requiredColors = ['primary', 'secondary', 'background', 'surface'];
      
      for (const color of requiredColors) {
        if (!theme.colors[color]) {
          throw new Error(`Theme color '${color}' not defined`);
        }
      }

      return {
        name: testName,
        passed: true,
        details: `Theme configured with ${Object.keys(theme.colors).length} colors`,
      };
    } catch (error: any) {
      return {
        name: testName,
        passed: false,
        error: error.message,
      };
    }
  }

  // Test navigation configuration
  async testNavigationConfiguration(): Promise<TestResult> {
    const testName = 'Navigation Configuration';
    try {
      const { AppNavigator } = require('../navigation/AppNavigator');
      
      if (!AppNavigator) {
        throw new Error('AppNavigator not configured');
      }

      return {
        name: testName,
        passed: true,
        details: 'Navigation configured correctly',
      };
    } catch (error: any) {
      return {
        name: testName,
        passed: false,
        error: error.message,
      };
    }
  }

  // Run all tests
  async runAllTests(): Promise<TestResult[]> {
    console.log('🧪 Running SerenityAI MVP Test Suite...');
    
    this.results = [];
    
    const tests = [
      this.testApiConfiguration,
      this.testAuthenticationService,
      this.testMusicService,
      this.testArtService,
      this.testReduxStore,
      this.testThemeConfiguration,
      this.testNavigationConfiguration,
    ];

    for (const test of tests) {
      try {
        const result = await test.call(this);
        this.results.push(result);
        
        if (result.passed) {
          console.log(`✅ ${result.name}: PASSED`);
          if (result.details) {
            console.log(`   ${result.details}`);
          }
        } else {
          console.log(`❌ ${result.name}: FAILED`);
          if (result.error) {
            console.log(`   Error: ${result.error}`);
          }
        }
      } catch (error: any) {
        console.log(`❌ ${test.name}: FAILED`);
        console.log(`   Unexpected error: ${error.message}`);
        
        this.results.push({
          name: test.name,
          passed: false,
          error: `Unexpected error: ${error.message}`,
        });
      }
    }

    return this.results;
  }

  // Get test summary
  getTestSummary(): {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
    status: 'PASS' | 'FAIL';
  } {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    const passRate = total > 0 ? (passed / total) * 100 : 0;
    
    return {
      total,
      passed,
      failed,
      passRate,
      status: failed === 0 ? 'PASS' : 'FAIL',
    };
  }

  // Show test results alert
  showTestResults(): void {
    const summary = this.getTestSummary();
    
    const message = `
Test Results:
✅ Passed: ${summary.passed}
❌ Failed: ${summary.failed}
📊 Pass Rate: ${summary.passRate.toFixed(1)}%
📋 Status: ${summary.status}

${summary.status === 'PASS' 
  ? 'All tests passed! SerenityAI MVP is ready.' 
  : 'Some tests failed. Check console for details.'
}`;

    Alert.alert(
      'SerenityAI MVP Test Results',
      message,
      [{ text: 'OK', style: 'default' }]
    );
  }
}

// Export singleton instance
export const mvpTestSuite = new MVPTestSuite();
export default mvpTestSuite;
