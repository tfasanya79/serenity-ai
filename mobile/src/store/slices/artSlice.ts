import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ArtService, ArtGenerationRequest, GeneratedArt } from '../../services/artService';

export interface ArtState {
  currentArt: GeneratedArt | null;
  gallery: GeneratedArt[];
  history: GeneratedArt[];
  isGenerating: boolean;
  error: string | null;
}

const initialState: ArtState = {
  currentArt: null,
  gallery: [],
  history: [],
  isGenerating: false,
  error: null,
};

// Async thunks
export const generateArt = createAsyncThunk(
  'art/generate',
  async (params: ArtGenerationRequest) => {
    const response = await ArtService.generateArt(params);
    return response.art;
  }
);

export const fetchArtHistory = createAsyncThunk(
  'art/fetchHistory',
  async (params: { page?: number; limit?: number } = {}) => {
    const response = await ArtService.getArtHistory(params.page, params.limit);
    return response.art;
  }
);

export const rateArt = createAsyncThunk(
  'art/rate',
  async ({ artId, rating, feedback }: { artId: string; rating: number; feedback?: string }) => {
    await ArtService.rateArt({ artId, rating, feedback });
    return { artId, rating };
  }
);

const artSlice = createSlice({
  name: 'art',
  initialState,
  reducers: {
    setCurrentArt: (state, action: PayloadAction<GeneratedArt>) => {
      state.currentArt = action.payload;
    },
    addToGallery: (state, action: PayloadAction<GeneratedArt>) => {
      state.gallery.push(action.payload);
    },
    removeFromGallery: (state, action: PayloadAction<string>) => {
      state.gallery = state.gallery.filter(art => art.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateArt.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateArt.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.currentArt = action.payload;
        state.history.unshift(action.payload);
      })
      .addCase(generateArt.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.error.message || 'Art generation failed';
      })
      .addCase(fetchArtHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(rateArt.fulfilled, (state, action) => {
        const { artId, rating } = action.payload;
        // Update rating in current art
        if (state.currentArt?.id === artId) {
          state.currentArt.rating = rating;
        }
        // Update rating in history
        const historyItem = state.history.find(item => item.id === artId);
        if (historyItem) {
          historyItem.rating = rating;
        }
        // Update rating in gallery
        const galleryItem = state.gallery.find(item => item.id === artId);
        if (galleryItem) {
          galleryItem.rating = rating;
        }
      });
  },
});

export const { setCurrentArt, addToGallery, removeFromGallery, clearError } = artSlice.actions;
export default artSlice.reducer;
