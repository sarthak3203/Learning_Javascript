import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string[];
  startDate: string;
  endDate?: string;
  status: 'ongoing' | 'completed';
  lastTaken?: string;
  category?: string;
  notes?: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  takenAt: string;
  dosage: string;
}

interface MedicationsState {
  medications: Medication[];
  logs: MedicationLog[];
}

const initialState: MedicationsState = {
  medications: [],
  logs: [],
};

export const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    addMedication: (state, action: PayloadAction<Omit<Medication, 'id'>>) => {
      const newMedication: Medication = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.medications.push(newMedication);
    },
    updateMedication: (state, action: PayloadAction<Medication>) => {
      const index = state.medications.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.medications[index] = action.payload;
      }
    },
    deleteMedication: (state, action: PayloadAction<string>) => {
      state.medications = state.medications.filter(m => m.id !== action.payload);
      state.logs = state.logs.filter(log => log.medicationId !== action.payload);
    },
    markMedicationTaken: (state, action: PayloadAction<{ medicationId: string; dosage: string }>) => {
      const medication = state.medications.find(m => m.id === action.payload.medicationId);
      if (medication) {
        medication.lastTaken = new Date().toISOString();
      }
      const newLog: MedicationLog = {
        id: Date.now().toString(),
        medicationId: action.payload.medicationId,
        takenAt: new Date().toISOString(),
        dosage: action.payload.dosage,
      };
      state.logs.push(newLog);
    },
    loadMedications: (state, action: PayloadAction<Medication[]>) => {
      state.medications = action.payload;
    },
    loadMedicationLogs: (state, action: PayloadAction<MedicationLog[]>) => {
      state.logs = action.payload;
    },
  },
});

export const { 
  addMedication, 
  updateMedication, 
  deleteMedication, 
  markMedicationTaken, 
  loadMedications, 
  loadMedicationLogs 
} = medicationsSlice.actions;
export default medicationsSlice.reducer;