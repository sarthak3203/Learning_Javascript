import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Prescription {
  id: string;
  date: string;
  doctor: string;
  medications: string[];
  notes?: string;
  photo?: string;
  createdAt: string;
}

interface PrescriptionsState {
  prescriptions: Prescription[];
}

const initialState: PrescriptionsState = {
  prescriptions: [],
};

export const prescriptionsSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    addPrescription: (state, action: PayloadAction<Omit<Prescription, 'id' | 'createdAt'>>) => {
      const newPrescription: Prescription = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.prescriptions.push(newPrescription);
    },
    updatePrescription: (state, action: PayloadAction<Prescription>) => {
      const index = state.prescriptions.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.prescriptions[index] = action.payload;
      }
    },
    deletePrescription: (state, action: PayloadAction<string>) => {
      state.prescriptions = state.prescriptions.filter(p => p.id !== action.payload);
    },
    loadPrescriptions: (state, action: PayloadAction<Prescription[]>) => {
      state.prescriptions = action.payload;
    },
  },
});

export const { addPrescription, updatePrescription, deletePrescription, loadPrescriptions } = prescriptionsSlice.actions;
export default prescriptionsSlice.reducer;