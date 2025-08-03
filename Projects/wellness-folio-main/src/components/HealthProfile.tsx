import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { createProfile, updateProfile, addAllergy, removeAllergy, addCondition, removeCondition, addVaccination, removeVaccination } from '@/store/slices/profileSlice';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Plus, X, Heart, Shield, Phone, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HealthProfile = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const profile = useSelector((state: RootState) => state.profile.profile);
  
  const [isEditing, setIsEditing] = useState(!profile);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    dateOfBirth: profile?.dateOfBirth || '',
    bloodGroup: profile?.bloodGroup || '',
    medicalNotes: profile?.medicalNotes || '',
    emergencyContact: {
      name: profile?.emergencyContact?.name || '',
      phone: profile?.emergencyContact?.phone || '',
      relationship: profile?.emergencyContact?.relationship || ''
    },
    insurance: {
      provider: profile?.insurance?.provider || '',
      policyNumber: profile?.insurance?.policyNumber || ''
    }
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newVaccination, setNewVaccination] = useState({
    name: '',
    date: '',
    provider: ''
  });
  const [showVaccinationDialog, setShowVaccinationDialog] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as object,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    if (!formData.name) {
      toast({
        title: "Missing Information",
        description: "Name is required.",
        variant: "destructive"
      });
      return;
    }

    if (profile) {
      dispatch(updateProfile(formData));
    } else {
      dispatch(createProfile({
        ...formData,
        allergies: [],
        chronicConditions: [],
        vaccinations: []
      }));
    }

    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your health profile has been saved successfully."
    });
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      dispatch(addAllergy(newAllergy.trim()));
      setNewAllergy('');
      toast({
        title: "Allergy Added",
        description: `${newAllergy} has been added to your allergies.`
      });
    }
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      dispatch(addCondition(newCondition.trim()));
      setNewCondition('');
      toast({
        title: "Condition Added",
        description: `${newCondition} has been added to your conditions.`
      });
    }
  };

  const handleAddVaccination = () => {
    if (newVaccination.name && newVaccination.date) {
      dispatch(addVaccination(newVaccination));
      setNewVaccination({ name: '', date: '', provider: '' });
      setShowVaccinationDialog(false);
      toast({
        title: "Vaccination Added",
        description: `${newVaccination.name} has been added to your vaccination records.`
      });
    }
  };

  const exportProfile = () => {
    if (!profile) return;
    
    const exportData = {
      profile,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-profile-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Profile Exported",
      description: "Your health profile has been downloaded as a JSON file."
    });
  };

  if (!profile && !isEditing) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Create Your Health Profile</h3>
            <p className="text-muted-foreground text-center mb-4">
              Set up your health profile to keep important medical information organized.
            </p>
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <User className="w-8 h-8 text-primary" />
            Health Profile
          </h1>
          <p className="text-muted-foreground mt-1">Manage your personal health information</p>
        </div>
        
        <div className="flex gap-2">
          {profile && (
            <Button variant="outline" onClick={exportProfile} className="gap-2">
              <Download className="w-4 h-4" />
              Export Profile
            </Button>
          )}
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="medical">Medical Info</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select 
                  value={formData.bloodGroup} 
                  onValueChange={(value) => handleInputChange('bloodGroup', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="medicalNotes">General Medical Notes</Label>
                <Textarea
                  id="medicalNotes"
                  value={formData.medicalNotes}
                  onChange={(e) => handleInputChange('medicalNotes', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Any general notes about your health..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medical" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-destructive" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile?.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="gap-1">
                      {allergy}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => dispatch(removeAllergy(allergy))}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new allergy"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                  />
                  <Button onClick={handleAddAllergy} size="sm">Add</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-warning" />
                  Chronic Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile?.chronicConditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {condition}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => dispatch(removeCondition(condition))}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new condition"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
                  />
                  <Button onClick={handleAddCondition} size="sm">Add</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success" />
                  Vaccination Records
                </CardTitle>
                <Dialog open={showVaccinationDialog} onOpenChange={setShowVaccinationDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Vaccination
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Vaccination Record</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="vaccineName">Vaccine Name</Label>
                        <Input
                          id="vaccineName"
                          placeholder="e.g., COVID-19, Flu Shot"
                          value={newVaccination.name}
                          onChange={(e) => setNewVaccination(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="vaccineDate">Date Received</Label>
                        <Input
                          id="vaccineDate"
                          type="date"
                          value={newVaccination.date}
                          onChange={(e) => setNewVaccination(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="vaccineProvider">Healthcare Provider (optional)</Label>
                        <Input
                          id="vaccineProvider"
                          placeholder="e.g., Dr. Smith, City Health Clinic"
                          value={newVaccination.provider}
                          onChange={(e) => setNewVaccination(prev => ({ ...prev, provider: e.target.value }))}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddVaccination} className="flex-1">Add Vaccination</Button>
                        <Button variant="outline" onClick={() => setShowVaccinationDialog(false)}>Cancel</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {profile?.vaccinations.length === 0 ? (
                <p className="text-muted-foreground">No vaccination records added yet.</p>
              ) : (
                <div className="space-y-3">
                  {profile?.vaccinations.map((vaccination, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{vaccination.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(vaccination.date).toLocaleDateString()}
                          {vaccination.provider && ` • ${vaccination.provider}`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dispatch(removeVaccination(index))}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-destructive" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Emergency contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Phone Number</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="emergencyRelationship">Relationship</Label>
                <Input
                  id="emergencyRelationship"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., Spouse, Parent, Sibling"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input
                  id="insuranceProvider"
                  value={formData.insurance.provider}
                  onChange={(e) => handleInputChange('insurance.provider', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., Blue Cross Blue Shield"
                />
              </div>
              <div>
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  value={formData.insurance.policyNumber}
                  onChange={(e) => handleInputChange('insurance.policyNumber', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Policy or member ID"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthProfile;