import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadPrescriptions } from '@/store/slices/prescriptionsSlice';
import { loadMedications, loadMedicationLogs } from '@/store/slices/medicationsSlice';
import { loadVisits } from '@/store/slices/visitsSlice';
import { loadProfile } from '@/store/slices/profileSlice';
import type { Prescription } from '@/store/slices/prescriptionsSlice';
import type { Medication, MedicationLog } from '@/store/slices/medicationsSlice';
import type { Visit } from '@/store/slices/visitsSlice';
import type { HealthProfile } from '@/store/slices/profileSlice';

export const useLocalStorage = () => {
  const dispatch = useDispatch();

  // Load data from localStorage on app start
  useEffect(() => {
    try {
      const prescriptions = localStorage.getItem('health-prescriptions');
      if (prescriptions) {
        dispatch(loadPrescriptions(JSON.parse(prescriptions) as Prescription[]));
      }

      const medications = localStorage.getItem('health-medications');
      if (medications) {
        dispatch(loadMedications(JSON.parse(medications) as Medication[]));
      }

      const medicationLogs = localStorage.getItem('health-medication-logs');
      if (medicationLogs) {
        dispatch(loadMedicationLogs(JSON.parse(medicationLogs) as MedicationLog[]));
      }

      const visits = localStorage.getItem('health-visits');
      if (visits) {
        dispatch(loadVisits(JSON.parse(visits) as Visit[]));
      }

      const profile = localStorage.getItem('health-profile');
      if (profile) {
        dispatch(loadProfile(JSON.parse(profile) as HealthProfile));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, [dispatch]);

  // Save data to localStorage
  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const clearAllData = () => {
    localStorage.removeItem('health-prescriptions');
    localStorage.removeItem('health-medications');
    localStorage.removeItem('health-medication-logs');
    localStorage.removeItem('health-visits');
    localStorage.removeItem('health-profile');
    window.location.reload();
  };

  return { saveToStorage, clearAllData };
};