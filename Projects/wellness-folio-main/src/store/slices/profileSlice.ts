import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HealthProfile {
  id: string;
  name: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
  };
  vaccinations: {
    name: string;
    date: string;
    provider?: string;
  }[];
  medicalNotes?: string;
  updatedAt: string;
}

interface ProfileState {
  profile: HealthProfile | null;
}

const initialState: ProfileState = {
  profile: null,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    createProfile: (state, action: PayloadAction<Omit<HealthProfile, 'id' | 'updatedAt'>>) => {
      state.profile = {
        ...action.payload,
        id: 'profile-1',
        updatedAt: new Date().toISOString(),
      };
    },
    updateProfile: (state, action: PayloadAction<Partial<HealthProfile>>) => {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    addAllergy: (state, action: PayloadAction<string>) => {
      if (state.profile && !state.profile.allergies.includes(action.payload)) {
        state.profile.allergies.push(action.payload);
        state.profile.updatedAt = new Date().toISOString();
      }
    },
    removeAllergy: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.allergies = state.profile.allergies.filter(a => a !== action.payload);
        state.profile.updatedAt = new Date().toISOString();
      }
    },
    addCondition: (state, action: PayloadAction<string>) => {
      if (state.profile && !state.profile.chronicConditions.includes(action.payload)) {
        state.profile.chronicConditions.push(action.payload);
        state.profile.updatedAt = new Date().toISOString();
      }
    },
    removeCondition: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.chronicConditions = state.profile.chronicConditions.filter(c => c !== action.payload);
        state.profile.updatedAt = new Date().toISOString();
      }
    },
    addVaccination: (state, action: PayloadAction<{ name: string; date: string; provider?: string }>) => {
      if (state.profile) {
        state.profile.vaccinations.push(action.payload);
        state.profile.updatedAt = new Date().toISOString();
      }
    },
    removeVaccination: (state, action: PayloadAction<number>) => {
      if (state.profile) {
        state.profile.vaccinations.splice(action.payload, 1);
        state.profile.updatedAt = new Date().toISOString();
      }
    },
    loadProfile: (state, action: PayloadAction<HealthProfile>) => {
      state.profile = action.payload;
    },
  },
});

export const { 
  createProfile, 
  updateProfile, 
  addAllergy, 
  removeAllergy, 
  addCondition, 
  removeCondition, 
  addVaccination, 
  removeVaccination, 
  loadProfile 
} = profileSlice.actions;
export default profileSlice.reducer;