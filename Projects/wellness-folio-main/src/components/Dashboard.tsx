import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RootState } from '@/store/store';
import { FileText, Pill, Calendar, User, Activity, AlertCircle } from "lucide-react";
import heroImage from "@/assets/medical-hero.jpg";

interface DashboardProps {
  onViewChange: (view: string) => void;
}

const Dashboard = ({ onViewChange }: DashboardProps) => {
  const prescriptions = useSelector((state: RootState) => state.prescriptions.prescriptions);
  const medications = useSelector((state: RootState) => state.medications.medications);
  const visits = useSelector((state: RootState) => state.visits.visits);
  const profile = useSelector((state: RootState) => state.profile.profile);

  const activeMedications = medications.filter(med => med.status === 'ongoing');
  const recentVisits = visits.slice(0, 3);
  const recentPrescriptions = prescriptions.slice(0, 3);

  // Check for overdue medications (simplified logic)
  const overdueCount = activeMedications.filter(med => {
    if (!med.lastTaken) return true;
    const lastTaken = new Date(med.lastTaken);
    const now = new Date();
    const hoursSinceLastTaken = (now.getTime() - lastTaken.getTime()) / (1000 * 60 * 60);
    
    // Simple check: if medication should be taken daily and it's been more than 24 hours
    return med.frequency.includes('daily') && hoursSinceLastTaken > 24;
  }).length;

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <Card className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1
          }}
        />
        <CardContent className="relative p-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to HealthVault
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Your secure, private health management system. All data stays on your device.
            </p>
            {profile ? (
              <p className="text-sm text-foreground">
                Hello, {profile.name}! Stay on top of your health journey.
              </p>
            ) : (
              <Button onClick={() => onViewChange('profile')} variant="outline">
                Complete Your Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewChange('prescriptions')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{prescriptions.length}</div>
            <p className="text-xs text-muted-foreground">Total records</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewChange('medications')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{activeMedications.length}</div>
            <p className="text-xs text-muted-foreground">Currently taking</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewChange('visits')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctor Visits</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{visits.length}</div>
            <p className="text-xs text-muted-foreground">Total visits</p>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer hover:shadow-md transition-shadow ${overdueCount > 0 ? 'border-warning bg-warning/5' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medication Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overdueCount > 0 ? 'text-warning' : 'text-success'}`}>
              {overdueCount > 0 ? overdueCount : '✓'}
            </div>
            <p className="text-xs text-muted-foreground">
              {overdueCount > 0 ? 'Overdue medications' : 'All up to date'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Recent Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeMedications.length > 0 ? (
              <div className="space-y-3">
                {activeMedications.slice(0, 3).map((med) => (
                  <div key={med.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-muted-foreground">{med.dosage} • {med.frequency}</p>
                    </div>
                    <Badge variant={med.lastTaken ? "default" : "secondary"}>
                      {med.lastTaken ? 'Taken' : 'Pending'}
                    </Badge>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => onViewChange('medications')}
                >
                  View All Medications
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Pill className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No medications added yet</p>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={() => onViewChange('medications')}
                >
                  Add Medication
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentVisits.length > 0 ? (
              <div className="space-y-3">
                {recentVisits.map((visit) => (
                  <div key={visit.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{visit.doctorName}</p>
                      <Badge variant="outline">{new Date(visit.date).toLocaleDateString()}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{visit.reason}</p>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => onViewChange('visits')}
                >
                  View All Visits
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No visits recorded yet</p>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={() => onViewChange('visits')}
                >
                  Add Visit
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {overdueCount > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertCircle className="w-5 h-5" />
              Medication Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              You have {overdueCount} medication(s) that may be overdue. 
              <Button 
                variant="link" 
                className="p-0 ml-1 text-warning"
                onClick={() => onViewChange('medications')}
              >
                Check now
              </Button>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;