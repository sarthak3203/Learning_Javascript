import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import PrescriptionVault from '@/components/PrescriptionVault';
import MedicationTracker from '@/components/MedicationTracker';
import VisitLogs from '@/components/VisitLogs';
import HealthProfile from '@/components/HealthProfile';
import HealthTimeline from '@/components/HealthTimeline';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { saveToStorage } = useLocalStorage();
  
  // Subscribe to Redux state and save to localStorage
  const prescriptions = useSelector((state: RootState) => state.prescriptions.prescriptions);
  const medications = useSelector((state: RootState) => state.medications.medications);
  const medicationLogs = useSelector((state: RootState) => state.medications.logs);
  const visits = useSelector((state: RootState) => state.visits.visits);
  const profile = useSelector((state: RootState) => state.profile.profile);

  useEffect(() => {
    saveToStorage('health-prescriptions', prescriptions);
  }, [prescriptions, saveToStorage]);

  useEffect(() => {
    saveToStorage('health-medications', medications);
  }, [medications, saveToStorage]);

  useEffect(() => {
    saveToStorage('health-medication-logs', medicationLogs);
  }, [medicationLogs, saveToStorage]);

  useEffect(() => {
    saveToStorage('health-visits', visits);
  }, [visits, saveToStorage]);

  useEffect(() => {
    if (profile) {
      saveToStorage('health-profile', profile);
    }
  }, [profile, saveToStorage]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onViewChange={setActiveView} />;
      case 'prescriptions':
        return <PrescriptionVault />;
      case 'medications':
        return <MedicationTracker />;
      case 'visits':
        return <VisitLogs />;
      case 'profile':
        return <HealthProfile />;
      case 'timeline':
        return <HealthTimeline />;
      default:
        return <Dashboard onViewChange={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default Index;
