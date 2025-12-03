import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Video, MapPin, Phone } from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: "in-person" | "video" | "phone";
  reason: string;
  status: "upcoming" | "in-progress" | "completed";
}

const appointments: Appointment[] = [
  { id: "A001", patientName: "Maria Garcia", time: "09:00 AM", type: "in-person", reason: "Annual Checkup", status: "completed" },
  { id: "A002", patientName: "James Miller", time: "10:30 AM", type: "video", reason: "Follow-up Consultation", status: "in-progress" },
  { id: "A003", patientName: "Anna Lee", time: "11:15 AM", type: "in-person", reason: "Lab Results Review", status: "upcoming" },
  { id: "A004", patientName: "David Kim", time: "02:00 PM", type: "phone", reason: "Medication Adjustment", status: "upcoming" },
  { id: "A005", patientName: "Rachel Green", time: "03:30 PM", type: "in-person", reason: "Physical Therapy", status: "upcoming" },
];

const typeConfig = {
  "in-person": { icon: MapPin, label: "In-Person", color: "text-primary" },
  "video": { icon: Video, label: "Video Call", color: "text-secondary" },
  "phone": { icon: Phone, label: "Phone Call", color: "text-warning" },
};

const statusConfig = {
  upcoming: { variant: "muted" as const, label: "Upcoming" },
  "in-progress": { variant: "warning" as const, label: "In Progress" },
  completed: { variant: "success" as const, label: "Completed" },
};

const AppointmentsList = () => {
  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Today's Appointments</h2>
            <p className="text-sm text-muted-foreground">5 appointments scheduled</p>
          </div>
          <Button variant="secondary" size="sm">
            + New Appointment
          </Button>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {appointments.map((appointment, index) => {
          const TypeIcon = typeConfig[appointment.type].icon;
          return (
            <div 
              key={appointment.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 group"
              style={{ animationDelay: `${400 + index * 50}ms` }}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-card-foreground">{appointment.patientName}</p>
                  <Badge variant={statusConfig[appointment.status].variant} className="text-xs">
                    {statusConfig[appointment.status].label}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium">{appointment.time}</span>
                  <span>•</span>
                  <span>{appointment.reason}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 text-sm ${typeConfig[appointment.type].color}`}>
                  <TypeIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">{typeConfig[appointment.type].label}</span>
                </div>
                <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  View
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentsList;
