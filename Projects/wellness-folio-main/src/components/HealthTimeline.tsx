import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar, FileText, Pill, User } from "lucide-react";

interface TimelineEvent {
  id: string;
  date: string;
  type: 'prescription' | 'visit' | 'medication';
  title: string;
  description: string;
  details?: any;
}

const HealthTimeline = () => {
  const prescriptions = useSelector((state: RootState) => state.prescriptions.prescriptions);
  const visits = useSelector((state: RootState) => state.visits.visits);
  const medications = useSelector((state: RootState) => state.medications.medications);

  // Combine all events into a timeline
  const events: TimelineEvent[] = [
    ...prescriptions.map(p => ({
      id: `prescription-${p.id}`,
      date: p.date,
      type: 'prescription' as const,
      title: `Prescription from ${p.doctor}`,
      description: `${p.medications.length} medication(s) prescribed`,
      details: p
    })),
    ...visits.map(v => ({
      id: `visit-${v.id}`,
      date: v.date,
      type: 'visit' as const,
      title: `Visit with ${v.doctorName}`,
      description: v.reason,
      details: v
    })),
    ...medications.map(m => ({
      id: `medication-${m.id}`,
      date: m.startDate,
      type: 'medication' as const,
      title: `Started ${m.name}`,
      description: `${m.dosage} • ${m.frequency}`,
      details: m
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'prescription':
        return <FileText className="w-5 h-5" />;
      case 'visit':
        return <User className="w-5 h-5" />;
      case 'medication':
        return <Pill className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'prescription':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'visit':
        return 'text-success bg-success/10 border-success/20';
      case 'medication':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil((diffDays - 1) / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.ceil((diffDays - 1) / 30)} months ago`;
    return date.toLocaleDateString();
  };

  // Group events by month for better organization
  const groupedEvents = events.reduce((groups, event) => {
    const date = new Date(event.date);
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(event);
    return groups;
  }, {} as Record<string, TimelineEvent[]>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            Health Timeline
          </h1>
          <p className="text-muted-foreground mt-1">Your complete health history at a glance</p>
        </div>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No health events yet</h3>
            <p className="text-muted-foreground text-center">
              Your health timeline will appear here as you add prescriptions, visits, and medications.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
                <div className="text-2xl font-bold text-primary">{events.length}</div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Recent Activity</CardTitle>
                <div className="text-2xl font-bold text-success">
                  {events.filter(e => {
                    const eventDate = new Date(e.date);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return eventDate >= thirtyDaysAgo;
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Medications</CardTitle>
                <div className="text-2xl font-bold text-warning">
                  {medications.filter(m => m.status === 'ongoing').length}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
              <div key={monthYear} className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground sticky top-0 bg-background/80 backdrop-blur-sm py-2">
                  {monthYear}
                </h2>
                <div className="space-y-4 ml-4">
                  {monthEvents.map((event, index) => (
                    <div key={event.id} className="relative">
                      {/* Timeline line */}
                      {index < monthEvents.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
                      )}
                      
                      {/* Event card */}
                      <div className="flex gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getEventColor(event.type)}`}>
                          {getEventIcon(event.type)}
                        </div>
                        
                        <Card className="flex-1 hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{event.title}</CardTitle>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {event.type}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(event.date)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </CardHeader>
                          
                          {/* Event-specific details */}
                          <CardContent className="pt-0">
                            {event.type === 'prescription' && event.details.medications && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Medications:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {event.details.medications.map((med: string, idx: number) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {med}
                                    </Badge>
                                  ))}
                                </div>
                                {event.details.notes && (
                                  <p className="text-sm text-muted-foreground mt-2">{event.details.notes}</p>
                                )}
                              </div>
                            )}
                            
                            {event.type === 'visit' && (
                              <div className="space-y-2">
                                {event.details.specialty && (
                                  <Badge variant="outline" className="text-xs">{event.details.specialty}</Badge>
                                )}
                                <p className="text-sm text-muted-foreground">{event.details.summary}</p>
                                {event.details.nextSteps && (
                                  <div className="mt-2">
                                    <h4 className="font-medium text-sm">Next Steps:</h4>
                                    <p className="text-sm text-muted-foreground">{event.details.nextSteps}</p>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {event.type === 'medication' && (
                              <div className="space-y-2">
                                <div className="flex gap-2">
                                  <Badge variant="outline">{event.details.status}</Badge>
                                  {event.details.category && (
                                    <Badge variant="secondary">{event.details.category}</Badge>
                                  )}
                                </div>
                                {event.details.timing && event.details.timing.length > 0 && (
                                  <div>
                                    <h4 className="font-medium text-sm">Timing:</h4>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {event.details.timing.map((time: string, idx: number) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {time}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTimeline;