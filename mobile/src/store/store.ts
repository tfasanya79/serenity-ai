import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import musicReducer from './slices/musicSlice';
import artReducer from './slices/artSlice';
import moodReducer from './slices/moodSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    music: musicReducer,
    art: artReducer,
    mood: moodReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export for easier imports
export default store;
