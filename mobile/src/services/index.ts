// Export all services
export * from './api';
export * from './authService';
export * from './musicService';
export * from './artService';

// Export service classes as default imports
export { default as AuthService } from './authService';
export { default as MusicService } from './musicService';
export { default as ArtService } from './artService';
export { default as apiClient } from './api';
