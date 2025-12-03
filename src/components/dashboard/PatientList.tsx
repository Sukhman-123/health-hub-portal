import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, FileText, Clock } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: "admitted" | "outpatient" | "discharged" | "critical";
  doctor: string;
  room?: string;
  admitDate: string;
}

const patients: Patient[] = [
  { id: "P001", name: "John Anderson", age: 45, condition: "Cardiac Monitoring", status: "admitted", doctor: "Dr. Wilson", room: "ICU-102", admitDate: "2024-01-15" },
  { id: "P002", name: "Emily Chen", age: 32, condition: "Post-Surgery Recovery", status: "admitted", doctor: "Dr. Martinez", room: "3A-205", admitDate: "2024-01-18" },
  { id: "P003", name: "Michael Brown", age: 58, condition: "Diabetes Management", status: "outpatient", doctor: "Dr. Johnson", admitDate: "2024-01-20" },
  { id: "P004", name: "Sarah Davis", age: 28, condition: "Prenatal Care", status: "outpatient", doctor: "Dr. Williams", admitDate: "2024-01-19" },
  { id: "P005", name: "Robert Wilson", age: 67, condition: "Pneumonia Treatment", status: "critical", doctor: "Dr. Wilson", room: "ICU-104", admitDate: "2024-01-17" },
  { id: "P006", name: "Lisa Thompson", age: 41, condition: "Physical Therapy", status: "discharged", doctor: "Dr. Garcia", admitDate: "2024-01-10" },
];

const statusConfig = {
  admitted: { variant: "info" as const, label: "Admitted" },
  outpatient: { variant: "secondary" as const, label: "Outpatient" },
  discharged: { variant: "success" as const, label: "Discharged" },
  critical: { variant: "destructive" as const, label: "Critical" },
};

const PatientList = () => {
  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Recent Patients</h2>
            <p className="text-sm text-muted-foreground">Overview of patient admissions and status</p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Patient</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Condition</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Status</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Doctor</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Room</th>
              <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {patients.map((patient, index) => (
              <tr 
                key={patient.id} 
                className="hover:bg-muted/30 transition-colors"
                style={{ animationDelay: `${300 + index * 50}ms` }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.id} • Age {patient.age}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-card-foreground">{patient.condition}</p>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={statusConfig[patient.status].variant}>
                    {statusConfig[patient.status].label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-card-foreground">{patient.doctor}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">{patient.room || "—"}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
