import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  FileText, 
  Pill, 
  Calendar, 
  User, 
  BarChart3 
} from "lucide-react";

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Navigation = ({ activeView, onViewChange }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'visits', label: 'Visits', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'timeline', label: 'Timeline', icon: BarChart3 },
  ];

  return (
    <nav className="bg-card border-r border-border h-full min-h-screen w-64 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Pill className="w-5 h-5 text-primary-foreground" />
          </div>
          HealthVault
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Your personal health manager</p>
      </div>
      
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                activeView === item.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;