import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TimerState {
  isRunning: boolean;
  currentTime: number;
  isBreak: boolean;
  totalFocusTime: number;
  completedSessions: number;
}

const initialState: TimerState = {
  isRunning: false,
  currentTime: 25 * 60, // 25 minutes in seconds
  isBreak: false,
  totalFocusTime: 0,
  completedSessions: 0,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: (state) => {
      state.isRunning = true;
    },
    pauseTimer: (state) => {
      state.isRunning = false;
    },
    resetTimer: (state) => {
      state.isRunning = false;
      state.currentTime = state.isBreak ? 5 * 60 : 25 * 60;
    },
    tick: (state) => {
      if (state.isRunning && state.currentTime > 0) {
        state.currentTime -= 1;
        
        // Add to total focus time if it's a focus session
        if (!state.isBreak) {
          state.totalFocusTime += 1;
        }
        
        // Auto switch when time reaches 0
        if (state.currentTime === 0) {
          state.isRunning = false;
          if (!state.isBreak) {
            state.completedSessions += 1;
            state.isBreak = true;
            state.currentTime = 5 * 60; // 5 minute break
          } else {
            state.isBreak = false;
            state.currentTime = 25 * 60; // 25 minute focus
          }
        }
      }
    },
    switchMode: (state) => {
      state.isBreak = !state.isBreak;
      state.currentTime = state.isBreak ? 5 * 60 : 25 * 60;
      state.isRunning = false;
    },
  },
});

export const { startTimer, pauseTimer, resetTimer, tick, switchMode } = timerSlice.actions;
export default timerSlice.reducer;