import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addVisit, deleteVisit } from '@/store/slices/visitsSlice';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Trash2, User, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VisitLogs = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const visits = useSelector((state: RootState) => state.visits.visits);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    doctorName: '',
    specialty: '',
    reason: '',
    summary: '',
    nextSteps: '',
    followUpDate: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.doctorName || !formData.reason || !formData.summary) {
      toast({
        title: "Missing Information",
        description: "Please fill in date, doctor name, reason, and summary.",
        variant: "destructive"
      });
      return;
    }

    dispatch(addVisit(formData));

    setFormData({
      date: '',
      doctorName: '',
      specialty: '',
      reason: '',
      summary: '',
      nextSteps: '',
      followUpDate: '',
      notes: ''
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Visit Added",
      description: "Your doctor visit has been recorded successfully."
    });
  };

  const handleDelete = (id: string) => {
    dispatch(deleteVisit(id));
    toast({
      title: "Visit Deleted",
      description: "The visit record has been removed."
    });
  };

  // Sort visits by date (most recent first)
  const sortedVisits = [...visits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-8 h-8 text-primary" />
            Visit Logs
          </h1>
          <p className="text-muted-foreground mt-1">Keep track of your doctor visits and appointments</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Visit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Visit</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Visit Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="doctorName">Doctor Name</Label>
                  <Input
                    id="doctorName"
                    placeholder="Dr. Smith"
                    value={formData.doctorName}
                    onChange={(e) => handleInputChange('doctorName', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialty">Specialty (optional)</Label>
                  <Input
                    id="specialty"
                    placeholder="e.g., Cardiology, General Practice"
                    value={formData.specialty}
                    onChange={(e) => handleInputChange('specialty', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input
                    id="reason"
                    placeholder="e.g., Annual checkup, Follow-up"
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="summary">Visit Summary</Label>
                <Textarea
                  id="summary"
                  placeholder="What happened during the visit? Diagnosis, discussions, tests ordered..."
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="nextSteps">Next Steps (optional)</Label>
                <Textarea
                  id="nextSteps"
                  placeholder="Follow-up instructions, tests to schedule, lifestyle changes..."
                  value={formData.nextSteps}
                  onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="followUpDate">Follow-up Date (optional)</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                  />
                </div>
                <div></div>
              </div>
              
              <div>
                <Label htmlFor="notes">Additional Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any other relevant information..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Save Visit</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {visits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No visits recorded</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start keeping track of your doctor visits and medical appointments.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Visit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedVisits.map((visit) => (
            <Card key={visit.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {visit.doctorName}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(visit.date).toLocaleDateString()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(visit.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {visit.specialty && <Badge variant="secondary">{visit.specialty}</Badge>}
                  <Badge variant="outline">{visit.reason}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Visit Summary:
                  </h4>
                  <p className="text-muted-foreground">{visit.summary}</p>
                </div>
                
                {visit.nextSteps && (
                  <div>
                    <h4 className="font-medium mb-2">Next Steps:</h4>
                    <p className="text-muted-foreground">{visit.nextSteps}</p>
                  </div>
                )}
                
                {visit.followUpDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Follow-up scheduled: {new Date(visit.followUpDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {visit.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Additional Notes:</h4>
                    <p className="text-sm text-muted-foreground">{visit.notes}</p>
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

export default VisitLogs;