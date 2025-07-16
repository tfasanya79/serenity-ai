import { apiPost, apiGet } from './api';

// Types
export interface MusicGenerationRequest {
  mood: string;
  genre: string;
  duration: number;
  preferences?: {
    instruments?: string[];
    tempo?: 'slow' | 'medium' | 'fast';
    intensity?: 'low' | 'medium' | 'high';
  };
  therapeuticGoals?: string[];
}

export interface GeneratedMusic {
  id: string;
  title: string;
  audioUrl: string;
  duration: number;
  genre: string;
  mood: string;
  createdAt: string;
  rating?: number;
  metadata?: {
    bpm?: number;
    key?: string;
    instruments?: string[];
    generationTime?: number;
  };
}

export interface MusicGenerationResponse {
  music: GeneratedMusic;
  message: string;
  generationId: string;
}

export interface MusicHistoryResponse {
  music: GeneratedMusic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MusicRatingRequest {
  musicId: string;
  rating: number;
  feedback?: string;
}

export interface MusicProgressResponse {
  generationId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  estimatedTimeRemaining?: number;
  message?: string;
}

// Music service class
export class MusicService {
  // Generate music
  static async generateMusic(request: MusicGenerationRequest): Promise<MusicGenerationResponse> {
    const response = await apiPost<MusicGenerationResponse>('/music/generate', request);
    return response;
  }

  // Get music generation progress
  static async getGenerationProgress(generationId: string): Promise<MusicProgressResponse> {
    const response = await apiGet<MusicProgressResponse>(`/music/generate/${generationId}/progress`);
    return response;
  }

  // Get music history
  static async getMusicHistory(page: number = 1, limit: number = 20): Promise<MusicHistoryResponse> {
    const response = await apiGet<MusicHistoryResponse>(`/music/history?page=${page}&limit=${limit}`);
    return response;
  }

  // Get specific music track
  static async getMusic(musicId: string): Promise<GeneratedMusic> {
    const response = await apiGet<GeneratedMusic>(`/music/${musicId}`);
    return response;
  }

  // Rate music
  static async rateMusic(request: MusicRatingRequest): Promise<void> {
    await apiPost('/music/rate', request);
  }

  // Delete music
  static async deleteMusic(musicId: string): Promise<void> {
    await apiPost(`/music/${musicId}/delete`);
  }

  // Get music recommendations
  static async getRecommendations(mood?: string, genre?: string): Promise<GeneratedMusic[]> {
    const params = new URLSearchParams();
    if (mood) params.append('mood', mood);
    if (genre) params.append('genre', genre);
    
    const response = await apiGet<GeneratedMusic[]>(`/music/recommendations?${params.toString()}`);
    return response;
  }

  // Get music analytics
  static async getMusicAnalytics(): Promise<{
    totalGenerated: number;
    favoriteGenres: Array<{ genre: string; count: number }>;
    favoriteMoods: Array<{ mood: string; count: number }>;
    totalListeningTime: number;
    averageRating: number;
  }> {
    const response = await apiGet<{
      totalGenerated: number;
      favoriteGenres: Array<{ genre: string; count: number }>;
      favoriteMoods: Array<{ mood: string; count: number }>;
      totalListeningTime: number;
      averageRating: number;
    }>('/music/analytics');
    return response;
  }

  // Save music to favorites
  static async addToFavorites(musicId: string): Promise<void> {
    await apiPost(`/music/${musicId}/favorite`);
  }

  // Remove music from favorites
  static async removeFromFavorites(musicId: string): Promise<void> {
    await apiPost(`/music/${musicId}/unfavorite`);
  }

  // Get favorite music
  static async getFavorites(): Promise<GeneratedMusic[]> {
    const response = await apiGet<GeneratedMusic[]>('/music/favorites');
    return response;
  }

  // Download music
  static async downloadMusic(musicId: string): Promise<{ downloadUrl: string; expiresAt: string }> {
    const response = await apiGet<{ downloadUrl: string; expiresAt: string }>(`/music/${musicId}/download`);
    return response;
  }

  // Share music
  static async shareMusic(musicId: string, shareType: 'link' | 'social'): Promise<{
    shareUrl: string;
    message: string;
  }> {
    const response = await apiPost<{ shareUrl: string; message: string }>(`/music/${musicId}/share`, {
      type: shareType,
    });
    return response;
  }

  // Get music genres
  static async getGenres(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    icon?: string;
  }>> {
    const response = await apiGet<Array<{
      id: string;
      name: string;
      description: string;
      icon?: string;
    }>>('/music/genres');
    return response;
  }

  // Get music moods
  static async getMoods(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    color?: string;
    icon?: string;
  }>> {
    const response = await apiGet<Array<{
      id: string;
      name: string;
      description: string;
      color?: string;
      icon?: string;
    }>>('/music/moods');
    return response;
  }

  // Create playlist
  static async createPlaylist(name: string, musicIds: string[]): Promise<{
    id: string;
    name: string;
    tracks: GeneratedMusic[];
    createdAt: string;
  }> {
    const response = await apiPost<{
      id: string;
      name: string;
      tracks: GeneratedMusic[];
      createdAt: string;
    }>('/music/playlists', { name, musicIds });
    return response;
  }

  // Get playlists
  static async getPlaylists(): Promise<Array<{
    id: string;
    name: string;
    trackCount: number;
    createdAt: string;
  }>> {
    const response = await apiGet<Array<{
      id: string;
      name: string;
      trackCount: number;
      createdAt: string;
    }>>('/music/playlists');
    return response;
  }

  // Get playlist tracks
  static async getPlaylistTracks(playlistId: string): Promise<GeneratedMusic[]> {
    const response = await apiGet<GeneratedMusic[]>(`/music/playlists/${playlistId}/tracks`);
    return response;
  }
}

export default MusicService;
