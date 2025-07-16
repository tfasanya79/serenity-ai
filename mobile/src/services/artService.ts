import { apiPost, apiGet } from './api';

// Types
export interface ArtGenerationRequest {
  mood: string;
  style: string;
  colors: string[];
  description?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  therapeuticGoals?: string[];
}

export interface GeneratedArt {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  style: string;
  mood: string;
  colors: string[];
  description?: string;
  dimensions: {
    width: number;
    height: number;
  };
  createdAt: string;
  rating?: number;
  metadata?: {
    generationTime?: number;
    aiModel?: string;
    prompt?: string;
  };
}

export interface ArtGenerationResponse {
  art: GeneratedArt;
  message: string;
  generationId: string;
}

export interface ArtHistoryResponse {
  art: GeneratedArt[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ArtRatingRequest {
  artId: string;
  rating: number;
  feedback?: string;
}

export interface ArtProgressResponse {
  generationId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  estimatedTimeRemaining?: number;
  message?: string;
}

// Art service class
export class ArtService {
  // Generate art
  static async generateArt(request: ArtGenerationRequest): Promise<ArtGenerationResponse> {
    const response = await apiPost<ArtGenerationResponse>('/art/generate', request);
    return response;
  }

  // Get art generation progress
  static async getGenerationProgress(generationId: string): Promise<ArtProgressResponse> {
    const response = await apiGet<ArtProgressResponse>(`/art/generate/${generationId}/progress`);
    return response;
  }

  // Get art history
  static async getArtHistory(page: number = 1, limit: number = 20): Promise<ArtHistoryResponse> {
    const response = await apiGet<ArtHistoryResponse>(`/art/history?page=${page}&limit=${limit}`);
    return response;
  }

  // Get specific art piece
  static async getArt(artId: string): Promise<GeneratedArt> {
    const response = await apiGet<GeneratedArt>(`/art/${artId}`);
    return response;
  }

  // Rate art
  static async rateArt(request: ArtRatingRequest): Promise<void> {
    await apiPost('/art/rate', request);
  }

  // Delete art
  static async deleteArt(artId: string): Promise<void> {
    await apiPost(`/art/${artId}/delete`);
  }

  // Get art recommendations
  static async getRecommendations(mood?: string, style?: string): Promise<GeneratedArt[]> {
    const params = new URLSearchParams();
    if (mood) params.append('mood', mood);
    if (style) params.append('style', style);
    
    const response = await apiGet<GeneratedArt[]>(`/art/recommendations?${params.toString()}`);
    return response;
  }

  // Get art analytics
  static async getArtAnalytics(): Promise<{
    totalGenerated: number;
    favoriteStyles: Array<{ style: string; count: number }>;
    favoriteMoods: Array<{ mood: string; count: number }>;
    favoriteColors: Array<{ color: string; count: number }>;
    averageRating: number;
  }> {
    const response = await apiGet<{
      totalGenerated: number;
      favoriteStyles: Array<{ style: string; count: number }>;
      favoriteMoods: Array<{ mood: string; count: number }>;
      favoriteColors: Array<{ color: string; count: number }>;
      averageRating: number;
    }>('/art/analytics');
    return response;
  }

  // Save art to favorites
  static async addToFavorites(artId: string): Promise<void> {
    await apiPost(`/art/${artId}/favorite`);
  }

  // Remove art from favorites
  static async removeFromFavorites(artId: string): Promise<void> {
    await apiPost(`/art/${artId}/unfavorite`);
  }

  // Get favorite art
  static async getFavorites(): Promise<GeneratedArt[]> {
    const response = await apiGet<GeneratedArt[]>('/art/favorites');
    return response;
  }

  // Download art
  static async downloadArt(artId: string, format: 'jpg' | 'png' | 'webp' = 'jpg'): Promise<{
    downloadUrl: string;
    expiresAt: string;
  }> {
    const response = await apiGet<{
      downloadUrl: string;
      expiresAt: string;
    }>(`/art/${artId}/download?format=${format}`);
    return response;
  }

  // Share art
  static async shareArt(artId: string, shareType: 'link' | 'social'): Promise<{
    shareUrl: string;
    message: string;
  }> {
    const response = await apiPost<{
      shareUrl: string;
      message: string;
    }>(`/art/${artId}/share`, { type: shareType });
    return response;
  }

  // Get art styles
  static async getStyles(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    preview?: string;
  }>> {
    const response = await apiGet<Array<{
      id: string;
      name: string;
      description: string;
      preview?: string;
    }>>('/art/styles');
    return response;
  }

  // Get art moods
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
    }>>('/art/moods');
    return response;
  }

  // Create art collection
  static async createCollection(name: string, artIds: string[]): Promise<{
    id: string;
    name: string;
    artworks: GeneratedArt[];
    createdAt: string;
  }> {
    const response = await apiPost<{
      id: string;
      name: string;
      artworks: GeneratedArt[];
      createdAt: string;
    }>('/art/collections', { name, artIds });
    return response;
  }

  // Get collections
  static async getCollections(): Promise<Array<{
    id: string;
    name: string;
    artworkCount: number;
    createdAt: string;
  }>> {
    const response = await apiGet<Array<{
      id: string;
      name: string;
      artworkCount: number;
      createdAt: string;
    }>>('/art/collections');
    return response;
  }

  // Get collection artworks
  static async getCollectionArtworks(collectionId: string): Promise<GeneratedArt[]> {
    const response = await apiGet<GeneratedArt[]>(`/art/collections/${collectionId}/artworks`);
    return response;
  }

  // Generate art variations
  static async generateVariations(artId: string, count: number = 3): Promise<GeneratedArt[]> {
    const response = await apiPost<GeneratedArt[]>(`/art/${artId}/variations`, { count });
    return response;
  }

  // Enhance art resolution
  static async enhanceResolution(artId: string, scale: number = 2): Promise<{
    enhancedImageUrl: string;
    originalImageUrl: string;
  }> {
    const response = await apiPost<{
      enhancedImageUrl: string;
      originalImageUrl: string;
    }>(`/art/${artId}/enhance`, { scale });
    return response;
  }

  // Get color palettes
  static async getColorPalettes(): Promise<Array<{
    id: string;
    name: string;
    colors: string[];
    description?: string;
  }>> {
    const response = await apiGet<Array<{
      id: string;
      name: string;
      colors: string[];
      description?: string;
    }>>('/art/color-palettes');
    return response;
  }

  // Generate color palette from image
  static async generateColorPalette(imageUrl: string): Promise<{
    dominantColors: string[];
    complementaryColors: string[];
    palette: string[];
  }> {
    const response = await apiPost<{
      dominantColors: string[];
      complementaryColors: string[];
      palette: string[];
    }>('/art/color-palette', { imageUrl });
    return response;
  }
}

export default ArtService;
