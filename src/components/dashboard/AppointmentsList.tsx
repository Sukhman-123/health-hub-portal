import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Video, MapPin, Phone } from "lucide-react";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  type: string;
  reason: string;
  status: string;
  patients: {
    full_name: string;
  } | null;
  doctors: {
    full_name: string;
  } | null;
}

interface AppointmentsListProps {
  refreshKey?: number;
}

const typeConfig: Record<string, { icon: React.ComponentType<any>; label: string; color: string }> = {
  "in-person": { icon: MapPin, label: "In-Person", color: "text-primary" },
  "video": { icon: Video, label: "Video Call", color: "text-secondary" },
  "phone": { icon: Phone, label: "Phone Call", color: "text-warning" },
};

const statusConfig: Record<string, { variant: "muted" | "warning" | "success"; label: string }> = {
  scheduled: { variant: "muted", label: "Scheduled" },
  "in-progress": { variant: "warning", label: "In Progress" },
  completed: { variant: "success", label: "Completed" },
  cancelled: { variant: "muted", label: "Cancelled" },
};

const AppointmentsList = ({ refreshKey }: AppointmentsListProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [refreshKey]);

  const fetchAppointments = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        appointment_time,
        type,
        reason,
        status,
        patients (full_name),
        doctors (full_name)
      `)
      .gte('appointment_date', today)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })
      .limit(5);

    if (!error && data) {
      setAppointments(data as Appointment[]);
    }
    setLoading(false);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Upcoming Appointments</h2>
            <p className="text-sm text-muted-foreground">{appointments.length} appointment(s) scheduled</p>
          </div>
          <Button variant="secondary" size="sm">
            + New Appointment
          </Button>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">
            <div className="w-6 h-6 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin mx-auto mb-2" />
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No upcoming appointments. Schedule one using Quick Actions.
          </div>
        ) : (
          appointments.map((appointment, index) => {
            const TypeIcon = typeConfig[appointment.type]?.icon || MapPin;
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
                    <p className="font-medium text-card-foreground">{appointment.patients?.full_name || 'Unknown'}</p>
                    <Badge variant={statusConfig[appointment.status]?.variant || "muted"} className="text-xs">
                      {statusConfig[appointment.status]?.label || appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-medium">{formatTime(appointment.appointment_time)}</span>
                    <span>•</span>
                    <span>{appointment.reason}</span>
                    {appointment.doctors?.full_name && (
                      <>
                        <span>•</span>
                        <span>{appointment.doctors.full_name}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 text-sm ${typeConfig[appointment.type]?.color || "text-primary"}`}>
                    <TypeIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">{typeConfig[appointment.type]?.label || appointment.type}</span>
                  </div>
                  <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;
