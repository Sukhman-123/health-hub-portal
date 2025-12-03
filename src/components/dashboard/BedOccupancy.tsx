import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface WardStats {
  name: string;
  occupied: number;
  total: number;
  color: string;
}

interface BedOccupancyProps {
  refreshKey?: number;
}

const wardColors: Record<string, string> = {
  "ICU": "bg-destructive",
  "General Ward": "bg-primary",
  "Pediatrics": "bg-secondary",
  "Maternity": "bg-success",
  "Emergency": "bg-warning",
};

const BedOccupancy = ({ refreshKey }: BedOccupancyProps) => {
  const [wards, setWards] = useState<WardStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBedStats();
  }, [refreshKey]);

  const fetchBedStats = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('beds')
      .select('ward, status');

    if (!error && data) {
      const wardMap = new Map<string, { total: number; occupied: number }>();
      
      data.forEach(bed => {
        const existing = wardMap.get(bed.ward) || { total: 0, occupied: 0 };
        existing.total++;
        if (bed.status === 'occupied') {
          existing.occupied++;
        }
        wardMap.set(bed.ward, existing);
      });

      const wardStats: WardStats[] = Array.from(wardMap.entries()).map(([name, stats]) => ({
        name,
        occupied: stats.occupied,
        total: stats.total,
        color: wardColors[name] || "bg-primary",
      }));

      setWards(wardStats);
    }
    setLoading(false);
  };

  const totalOccupied = wards.reduce((acc, ward) => acc + ward.occupied, 0);
  const totalBeds = wards.reduce((acc, ward) => acc + ward.total, 0);
  const overallOccupancy = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0;

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
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
            Loading bed stats...
          </div>
        ) : wards.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No beds configured in the system.
          </div>
        ) : (
          wards.map((ward, index) => {
            const percentage = ward.total > 0 ? Math.round((ward.occupied / ward.total) * 100) : 0;
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
          })
        )}
      </div>
    </div>
  );
};

export default BedOccupancy;
