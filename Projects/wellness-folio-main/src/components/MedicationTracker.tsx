import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addMedication, markMedicationTaken, updateMedication, deleteMedication } from '@/store/slices/medicationsSlice';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, Plus, Check, Clock, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MedicationTracker = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const medications = useSelector((state: RootState) => state.medications.medications);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    timing: [] as string[],
    startDate: '',
    endDate: '',
    status: 'ongoing' as 'ongoing' | 'completed',
    category: '',
    notes: ''
  });

  const activeMedications = medications.filter(med => med.status === 'ongoing');
  const completedMedications = medications.filter(med => med.status === 'completed');

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTimingChange = (timing: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      timing: checked 
        ? [...prev.timing, timing]
        : prev.timing.filter(t => t !== timing)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage || !formData.frequency || !formData.startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in name, dosage, frequency, and start date.",
        variant: "destructive"
      });
      return;
    }

    dispatch(addMedication(formData));

    setFormData({
      name: '',
      dosage: '',
      frequency: '',
      timing: [],
      startDate: '',
      endDate: '',
      status: 'ongoing',
      category: '',
      notes: ''
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Medication Added",
      description: "Your medication has been added to the tracker."
    });
  };

  const handleMarkTaken = (medicationId: string, dosage: string) => {
    dispatch(markMedicationTaken({ medicationId, dosage }));
    toast({
      title: "Medication Taken",
      description: "Marked as taken successfully.",
      variant: "default"
    });
  };

  const handleDelete = (id: string) => {
    dispatch(deleteMedication(id));
    toast({
      title: "Medication Deleted",
      description: "The medication has been removed."
    });
  };

  const getTimeElapsed = (lastTaken?: string) => {
    if (!lastTaken) return 'Never taken';
    
    const now = new Date();
    const takenTime = new Date(lastTaken);
    const diffHours = Math.floor((now.getTime() - takenTime.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just taken';
    if (diffHours < 24) return `${diffHours}h ago`;
    const days = Math.floor(diffHours / 24);
    return `${days}d ago`;
  };

  const isOverdue = (medication: any) => {
    if (!medication.lastTaken) return true;
    const lastTaken = new Date(medication.lastTaken);
    const now = new Date();
    const hoursSince = (now.getTime() - lastTaken.getTime()) / (1000 * 60 * 60);
    
    return medication.frequency.includes('daily') && hoursSince > 24;
  };

  const timingOptions = ['Morning', 'Afternoon', 'Evening', 'Night', 'With meals', 'Before meals', 'After meals'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Pill className="w-8 h-8 text-primary" />
            Medication Tracker
          </h1>
          <p className="text-muted-foreground mt-1">Track your medications and dosages</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Medication Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Aspirin"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 100mg"
                    value={formData.dosage}
                    onChange={(e) => handleInputChange('dosage', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Once daily">Once daily</SelectItem>
                      <SelectItem value="Twice daily">Twice daily</SelectItem>
                      <SelectItem value="Three times daily">Three times daily</SelectItem>
                      <SelectItem value="Four times daily">Four times daily</SelectItem>
                      <SelectItem value="As needed">As needed</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category (optional)</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Pain relief, Vitamins"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Timing</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {timingOptions.map((timing) => (
                    <div key={timing} className="flex items-center space-x-2">
                      <Checkbox
                        id={timing}
                        checked={formData.timing.includes(timing)}
                        onCheckedChange={(checked) => handleTimingChange(timing, checked as boolean)}
                      />
                      <Label htmlFor={timing} className="text-sm">{timing}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date (optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Add Medication</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Medications ({activeMedications.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedMedications.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {activeMedications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Pill className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active medications</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Add your first medication to start tracking.
                </p>
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Medication
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeMedications.map((medication) => (
                <Card key={medication.id} className={`hover:shadow-md transition-shadow ${isOverdue(medication) ? 'border-warning bg-warning/5' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {medication.name}
                        {isOverdue(medication) && <AlertCircle className="w-5 h-5 text-warning" />}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkTaken(medication.id, medication.dosage)}
                          className="gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Mark Taken
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(medication.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{medication.dosage}</Badge>
                      <Badge variant="outline">{medication.frequency}</Badge>
                      {medication.category && <Badge variant="secondary">{medication.category}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {medication.timing.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-1">Timing:</h4>
                        <div className="flex flex-wrap gap-1">
                          {medication.timing.map((time, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Last taken: {getTimeElapsed(medication.lastTaken)}</span>
                      </div>
                      <span className="text-muted-foreground">
                        Started: {new Date(medication.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedMedications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Check className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No completed medications</h3>
                <p className="text-muted-foreground text-center">
                  Completed medications will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedMedications.map((medication) => (
                <Card key={medication.id} className="opacity-75">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{medication.name}</CardTitle>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{medication.dosage}</Badge>
                      <Badge variant="outline">{medication.frequency}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {new Date(medication.startDate).toLocaleDateString()} - {medication.endDate ? new Date(medication.endDate).toLocaleDateString() : 'Ongoing'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationTracker;