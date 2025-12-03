import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  status: "available" | "busy" | "off-duty";
  nextAvailable?: string;
  patientsToday: number;
  avatar: string;
}

const doctors: Doctor[] = [
  { id: "D001", name: "Dr. Sarah Wilson", specialty: "Cardiology", status: "busy", nextAvailable: "11:30 AM", patientsToday: 8, avatar: "SW" },
  { id: "D002", name: "Dr. Michael Chen", specialty: "Neurology", status: "available", patientsToday: 5, avatar: "MC" },
  { id: "D003", name: "Dr. Emily Johnson", specialty: "Pediatrics", status: "available", patientsToday: 12, avatar: "EJ" },
  { id: "D004", name: "Dr. Robert Martinez", specialty: "Orthopedics", status: "busy", nextAvailable: "2:00 PM", patientsToday: 6, avatar: "RM" },
  { id: "D005", name: "Dr. Lisa Williams", specialty: "Dermatology", status: "off-duty", patientsToday: 0, avatar: "LW" },
];

const statusConfig = {
  available: { variant: "success" as const, label: "Available", dot: "bg-success" },
  busy: { variant: "warning" as const, label: "Busy", dot: "bg-warning" },
  "off-duty": { variant: "muted" as const, label: "Off Duty", dot: "bg-muted-foreground" },
};

const DoctorAvailability = () => {
  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Doctor Availability</h2>
            <p className="text-sm text-muted-foreground">Real-time staff status</p>
          </div>
          <Button variant="outline" size="sm">
            View Schedule
          </Button>
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        {doctors.map((doctor, index) => (
          <div 
            key={doctor.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors group"
            style={{ animationDelay: `${500 + index * 50}ms` }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold shadow-md">
                {doctor.avatar}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card ${statusConfig[doctor.status].dot}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-card-foreground">{doctor.name}</p>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
            </div>
            
            <div className="text-right">
              <Badge variant={statusConfig[doctor.status].variant} className="mb-1">
                {statusConfig[doctor.status].label}
              </Badge>
              {doctor.status === "busy" && doctor.nextAvailable && (
                <p className="text-xs text-muted-foreground">Next: {doctor.nextAvailable}</p>
              )}
              {doctor.status === "available" && (
                <p className="text-xs text-success">{doctor.patientsToday} patients today</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAvailability;
