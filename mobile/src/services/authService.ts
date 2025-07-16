import * as SecureStore from 'expo-secure-store';
import { apiPost } from './api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age?: number;
  mentalHealthGoals?: string[];
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    age?: number;
    mentalHealthGoals?: string[];
  };
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

// Auth service class
export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_KEY = 'user_data';

  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiPost<AuthResponse>('/auth/login', credentials);
    
    // Store tokens and user data
    await this.storeAuthData(response);
    
    return response;
  }

  // Register user
  static async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiPost<AuthResponse>('/auth/register', userData);
    
    // Store tokens and user data
    await this.storeAuthData(response);
    
    return response;
  }

  // Refresh access token
  static async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiPost<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });

    // Store new tokens
    await SecureStore.setItemAsync(this.TOKEN_KEY, response.token);
    await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, response.refreshToken);

    return response;
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await apiPost('/auth/logout');
    } catch (error) {
      // Continue with local logout even if server call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local storage
      await this.clearAuthData();
    }
  }

  // Store authentication data
  private static async storeAuthData(authData: AuthResponse): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(this.TOKEN_KEY, authData.token),
      SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, authData.refreshToken),
      SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(authData.user)),
    ]);
  }

  // Clear authentication data
  private static async clearAuthData(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(this.TOKEN_KEY),
      SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(this.USER_KEY),
    ]);
  }

  // Get stored token
  static async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(this.TOKEN_KEY);
  }

  // Get stored refresh token
  static async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY);
  }

  // Get stored user data
  static async getUser(): Promise<AuthResponse['user'] | null> {
    try {
      const userData = await SecureStore.getItemAsync(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Failed to parse user data:', error);
      return null;
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  // Update user profile
  static async updateProfile(updates: Partial<AuthResponse['user']>): Promise<AuthResponse['user']> {
    const response = await apiPost<AuthResponse['user']>('/auth/profile', updates);
    
    // Update stored user data
    await SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(response));
    
    return response;
  }

  // Change password
  static async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiPost('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    await apiPost('/auth/reset-password', { email });
  }

  // Verify email
  static async verifyEmail(token: string): Promise<void> {
    await apiPost('/auth/verify-email', { token });
  }

  // Resend verification email
  static async resendVerificationEmail(): Promise<void> {
    await apiPost('/auth/resend-verification');
  }
}

export default AuthService;
