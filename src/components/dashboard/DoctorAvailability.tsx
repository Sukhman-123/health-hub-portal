import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Doctor {
  id: string;
  full_name: string;
  specialty: string;
  status: string;
}

interface DoctorAvailabilityProps {
  refreshKey?: number;
}

const statusConfig: Record<string, { variant: "success" | "warning" | "muted"; label: string; dot: string }> = {
  available: { variant: "success", label: "Available", dot: "bg-success" },
  busy: { variant: "warning", label: "Busy", dot: "bg-warning" },
  "off-duty": { variant: "muted", label: "Off Duty", dot: "bg-muted-foreground" },
};

const DoctorAvailability = ({ refreshKey }: DoctorAvailabilityProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, [refreshKey]);

  const fetchDoctors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('doctors')
      .select('id, full_name, specialty, status')
      .order('full_name')
      .limit(5);

    if (!error && data) {
      setDoctors(data);
    }
    setLoading(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

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
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No doctors registered in the system yet.
          </div>
        ) : (
          doctors.map((doctor, index) => (
            <div 
              key={doctor.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors group"
              style={{ animationDelay: `${500 + index * 50}ms` }}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold shadow-md">
                  {getInitials(doctor.full_name)}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card ${statusConfig[doctor.status]?.dot || 'bg-muted-foreground'}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-card-foreground">{doctor.full_name}</p>
                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              </div>
              
              <div className="text-right">
                <Badge variant={statusConfig[doctor.status]?.variant || "muted"} className="mb-1">
                  {statusConfig[doctor.status]?.label || doctor.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorAvailability;
