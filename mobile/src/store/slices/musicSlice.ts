import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MusicService, MusicGenerationRequest, GeneratedMusic } from '../../services/musicService';

export interface MusicState {
  currentTrack: GeneratedMusic | null;
  playlist: GeneratedMusic[];
  history: GeneratedMusic[];
  isGenerating: boolean;
  isPlaying: boolean;
  error: string | null;
}

const initialState: MusicState = {
  currentTrack: null,
  playlist: [],
  history: [],
  isGenerating: false,
  isPlaying: false,
  error: null,
};

// Async thunks
export const generateMusic = createAsyncThunk(
  'music/generate',
  async (params: MusicGenerationRequest) => {
    const response = await MusicService.generateMusic(params);
    return response.music;
  }
);

export const fetchMusicHistory = createAsyncThunk(
  'music/fetchHistory',
  async (params: { page?: number; limit?: number } = {}) => {
    const response = await MusicService.getMusicHistory(params.page, params.limit);
    return response.music;
  }
);

export const rateMusic = createAsyncThunk(
  'music/rate',
  async ({ musicId, rating, feedback }: { musicId: string; rating: number; feedback?: string }) => {
    await MusicService.rateMusic({ musicId, rating, feedback });
    return { musicId, rating };
  }
);

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<GeneratedMusic>) => {
      state.currentTrack = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    addToPlaylist: (state, action: PayloadAction<GeneratedMusic>) => {
      state.playlist.push(action.payload);
    },
    removeFromPlaylist: (state, action: PayloadAction<string>) => {
      state.playlist = state.playlist.filter(track => track.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateMusic.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateMusic.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.currentTrack = action.payload;
        state.history.unshift(action.payload);
      })
      .addCase(generateMusic.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.error.message || 'Music generation failed';
      })
      .addCase(fetchMusicHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(rateMusic.fulfilled, (state, action) => {
        const { musicId, rating } = action.payload;
        // Update rating in current track
        if (state.currentTrack?.id === musicId) {
          state.currentTrack.rating = rating;
        }
        // Update rating in history
        const historyItem = state.history.find(item => item.id === musicId);
        if (historyItem) {
          historyItem.rating = rating;
        }
        // Update rating in playlist
        const playlistItem = state.playlist.find(item => item.id === musicId);
        if (playlistItem) {
          playlistItem.rating = rating;
        }
      });
  },
});

export const { setCurrentTrack, setIsPlaying, addToPlaylist, removeFromPlaylist, clearError } = musicSlice.actions;
export default musicSlice.reducer;
