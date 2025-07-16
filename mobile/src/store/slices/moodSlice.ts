import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface MoodEntry {
  id: string;
  mood: number; // 1-10 scale
  emotions: string[];
  notes?: string;
  timestamp: string;
  activities?: string[];
  triggers?: string[];
}

export interface MoodAnalytics {
  averageMood: number;
  moodTrend: 'improving' | 'declining' | 'stable';
  commonEmotions: string[];
  insights: string[];
}

interface MoodState {
  currentMood: number | null;
  moodHistory: MoodEntry[];
  analytics: MoodAnalytics | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MoodState = {
  currentMood: null,
  moodHistory: [],
  analytics: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const logMoodEntry = createAsyncThunk(
  'mood/logEntry',
  async (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    // TODO: Implement actual API call
    const response = await fetch('/api/mood/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    return response.json();
  }
);

export const fetchMoodHistory = createAsyncThunk(
  'mood/fetchHistory',
  async () => {
    // TODO: Implement actual API call
    const response = await fetch('/api/mood/history');
    return response.json();
  }
);

export const fetchMoodAnalytics = createAsyncThunk(
  'mood/fetchAnalytics',
  async () => {
    // TODO: Implement actual API call
    const response = await fetch('/api/mood/analytics');
    return response.json();
  }
);

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    setCurrentMood: (state, action: PayloadAction<number>) => {
      state.currentMood = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logMoodEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logMoodEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.moodHistory.unshift(action.payload);
        state.currentMood = action.payload.mood;
      })
      .addCase(logMoodEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to log mood entry';
      })
      .addCase(fetchMoodHistory.fulfilled, (state, action) => {
        state.moodHistory = action.payload;
      })
      .addCase(fetchMoodAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  },
});

export const { setCurrentMood, clearError } = moodSlice.actions;
export default moodSlice.reducer;
