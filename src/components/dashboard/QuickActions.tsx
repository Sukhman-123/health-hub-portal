import { 
  UserPlus, 
  Calendar, 
  FileText, 
  Pill, 
  Ambulance, 
  ClipboardList,
  BedDouble,
  TestTube
} from "lucide-react";

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  enabled?: boolean;
}

interface QuickActionsProps {
  onAction?: (action: string) => void;
}

const QuickActions = ({ onAction }: QuickActionsProps) => {
  const quickActions: QuickAction[] = [
    { icon: <UserPlus className="w-5 h-5" />, label: "New Patient", description: "Register admission", color: "bg-primary/10 text-primary hover:bg-primary/20", enabled: true },
    { icon: <Calendar className="w-5 h-5" />, label: "Schedule", description: "Book appointment", color: "bg-secondary/10 text-secondary hover:bg-secondary/20", enabled: true },
    { icon: <FileText className="w-5 h-5" />, label: "Medical Record", description: "Create new record", color: "bg-success/10 text-success hover:bg-success/20" },
    { icon: <Pill className="w-5 h-5" />, label: "Prescription", description: "Issue prescription", color: "bg-warning/10 text-warning hover:bg-warning/20" },
    { icon: <TestTube className="w-5 h-5" />, label: "Lab Request", description: "Order tests", color: "bg-destructive/10 text-destructive hover:bg-destructive/20" },
    { icon: <BedDouble className="w-5 h-5" />, label: "Assign Bed", description: "Bed allocation", color: "bg-primary/10 text-primary hover:bg-primary/20", enabled: true },
    { icon: <Ambulance className="w-5 h-5" />, label: "Emergency", description: "Emergency admit", color: "bg-destructive/10 text-destructive hover:bg-destructive/20" },
    { icon: <ClipboardList className="w-5 h-5" />, label: "Reports", description: "Generate report", color: "bg-muted text-muted-foreground hover:bg-muted/80" },
  ];

  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden animate-slide-up" style={{ animationDelay: "100ms" }}>
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground">Quick Actions</h2>
        <p className="text-sm text-muted-foreground">Frequently used operations</p>
      </div>
      
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action, index) => (
          <button
            key={action.label}
            onClick={() => action.enabled && onAction?.(action.label)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 ${action.color} ${action.enabled ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
            style={{ animationDelay: `${150 + index * 30}ms` }}
            disabled={!action.enabled}
          >
            <div className="p-2 rounded-lg bg-card/50">
              {action.icon}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{action.label}</p>
              <p className="text-xs opacity-70">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
