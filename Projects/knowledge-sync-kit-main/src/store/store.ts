import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './slices/notesSlice';
import flashcardsReducer from './slices/flashcardsSlice';
import timerReducer from './slices/timerSlice';

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    flashcards: flashcardsReducer,
    timer: timerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;