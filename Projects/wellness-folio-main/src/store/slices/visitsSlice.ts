import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Visit {
  id: string;
  date: string;
  doctorName: string;
  specialty?: string;
  reason: string;
  summary: string;
  nextSteps?: string;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
}

interface VisitsState {
  visits: Visit[];
}

const initialState: VisitsState = {
  visits: [],
};

export const visitsSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    addVisit: (state, action: PayloadAction<Omit<Visit, 'id' | 'createdAt'>>) => {
      const newVisit: Visit = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.visits.push(newVisit);
    },
    updateVisit: (state, action: PayloadAction<Visit>) => {
      const index = state.visits.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.visits[index] = action.payload;
      }
    },
    deleteVisit: (state, action: PayloadAction<string>) => {
      state.visits = state.visits.filter(v => v.id !== action.payload);
    },
    loadVisits: (state, action: PayloadAction<Visit[]>) => {
      state.visits = action.payload;
    },
  },
});

export const { addVisit, updateVisit, deleteVisit, loadVisits } = visitsSlice.actions;
export default visitsSlice.reducer;