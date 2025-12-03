import { Progress } from "@/components/ui/progress";

interface Ward {
  name: string;
  occupied: number;
  total: number;
  color: string;
}

const wards: Ward[] = [
  { name: "ICU", occupied: 8, total: 10, color: "bg-destructive" },
  { name: "General Ward", occupied: 45, total: 60, color: "bg-primary" },
  { name: "Pediatrics", occupied: 12, total: 20, color: "bg-secondary" },
  { name: "Maternity", occupied: 15, total: 25, color: "bg-success" },
  { name: "Emergency", occupied: 18, total: 20, color: "bg-warning" },
];

const BedOccupancy = () => {
  const totalOccupied = wards.reduce((acc, ward) => acc + ward.occupied, 0);
  const totalBeds = wards.reduce((acc, ward) => acc + ward.total, 0);
  const overallOccupancy = Math.round((totalOccupied / totalBeds) * 100);

  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden animate-slide-up" style={{ animationDelay: "500ms" }}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Bed Occupancy</h2>
            <p className="text-sm text-muted-foreground">Current capacity overview</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-card-foreground">{overallOccupancy}%</p>
            <p className="text-sm text-muted-foreground">{totalOccupied}/{totalBeds} beds</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-5">
        {wards.map((ward, index) => {
          const percentage = Math.round((ward.occupied / ward.total) * 100);
          return (
            <div key={ward.name} style={{ animationDelay: `${600 + index * 50}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-card-foreground">{ward.name}</span>
                <span className="text-sm text-muted-foreground">
                  {ward.occupied}/{ward.total} ({percentage}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${ward.color} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BedOccupancy;
