import { configureStore } from '@reduxjs/toolkit';
import prescriptionsReducer from './slices/prescriptionsSlice';
import medicationsReducer from './slices/medicationsSlice';
import visitsReducer from './slices/visitsSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    prescriptions: prescriptionsReducer,
    medications: medicationsReducer,
    visits: visitsReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;