import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addPrescription, deletePrescription } from '@/store/slices/prescriptionsSlice';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Camera, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PrescriptionVault = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const prescriptions = useSelector((state: RootState) => state.prescriptions.prescriptions);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    doctor: '',
    medications: '',
    notes: '',
    photo: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.doctor || !formData.medications) {
      toast({
        title: "Missing Information",
        description: "Please fill in date, doctor, and medications.",
        variant: "destructive"
      });
      return;
    }

    dispatch(addPrescription({
      date: formData.date,
      doctor: formData.doctor,
      medications: formData.medications.split(',').map(med => med.trim()),
      notes: formData.notes,
      photo: formData.photo
    }));

    setFormData({
      date: '',
      doctor: '',
      medications: '',
      notes: '',
      photo: ''
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Prescription Added",
      description: "Your prescription has been saved successfully."
    });
  };

  const handleDelete = (id: string) => {
    dispatch(deletePrescription(id));
    toast({
      title: "Prescription Deleted",
      description: "The prescription has been removed."
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            Prescription Vault
          </h1>
          <p className="text-muted-foreground mt-1">Securely store your prescription records</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Prescription</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="doctor">Doctor Name</Label>
                  <Input
                    id="doctor"
                    placeholder="Dr. Smith"
                    value={formData.doctor}
                    onChange={(e) => handleInputChange('doctor', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="medications">Medications (comma-separated)</Label>
                <Input
                  id="medications"
                  placeholder="Medication 1, Medication 2, Medication 3"
                  value={formData.medications}
                  onChange={(e) => handleInputChange('medications', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about the prescription..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="photo">Photo Upload (optional)</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="cursor-pointer"
                />
                {formData.photo && (
                  <div className="mt-2">
                    <img 
                      src={formData.photo} 
                      alt="Prescription preview" 
                      className="max-w-xs max-h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Save Prescription</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No prescriptions yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start building your prescription history by adding your first prescription.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Prescription
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{prescription.doctor}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(prescription.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {new Date(prescription.date).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Medications:</h4>
                  <div className="flex flex-wrap gap-1">
                    {prescription.medications.map((med, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {med}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {prescription.notes && (
                  <div>
                    <h4 className="font-medium mb-1">Notes:</h4>
                    <p className="text-sm text-muted-foreground">{prescription.notes}</p>
                  </div>
                )}
                
                {prescription.photo && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Photo:
                    </h4>
                    <img 
                      src={prescription.photo} 
                      alt="Prescription photo" 
                      className="w-full h-32 object-cover rounded border cursor-pointer"
                      onClick={() => window.open(prescription.photo, '_blank')}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrescriptionVault;