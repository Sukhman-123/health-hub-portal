import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { BedDouble } from "lucide-react";

interface Patient {
  id: string;
  patient_id: string;
  full_name: string;
  status: string;
}

interface Bed {
  id: string;
  bed_number: string;
  ward: string;
  status: string;
}

interface AssignBedFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AssignBedForm = ({ open, onOpenChange, onSuccess }: AssignBedFormProps) => {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [formData, setFormData] = useState({
    patientId: "",
    bedId: "",
    notes: "",
  });

  const wards = ["ICU", "General Ward", "Pediatrics", "Maternity", "Emergency"];

  useEffect(() => {
    if (open) {
      fetchPatients();
      fetchBeds();
    }
  }, [open]);

  useEffect(() => {
    if (selectedWard) {
      fetchBeds();
    }
  }, [selectedWard]);

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('id, patient_id, full_name, status')
      .in('status', ['admitted', 'critical'])
      .order('full_name');
    
    if (!error && data) {
      setPatients(data);
    }
  };

  const fetchBeds = async () => {
    let query = supabase
      .from('beds')
      .select('id, bed_number, ward, status')
      .eq('status', 'available')
      .order('bed_number');
    
    if (selectedWard) {
      query = query.eq('ward', selectedWard);
    }
    
    const { data, error } = await query;
    
    if (!error && data) {
      setBeds(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientId || !formData.bedId) {
      toast({
        title: "Validation Error",
        description: "Please select a patient and a bed",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Update bed to occupied and assign patient
      const { error: bedError } = await supabase
        .from('beds')
        .update({
          status: 'occupied',
          patient_id: formData.patientId,
          assigned_at: new Date().toISOString(),
          notes: formData.notes?.trim() || null,
        })
        .eq('id', formData.bedId);

      if (bedError) throw bedError;

      // Update patient status to admitted if not already
      const { error: patientError } = await supabase
        .from('patients')
        .update({ status: 'admitted' })
        .eq('id', formData.patientId);

      if (patientError) throw patientError;

      const selectedBed = beds.find(b => b.id === formData.bedId);
      const selectedPatient = patients.find(p => p.id === formData.patientId);

      toast({
        title: "Bed Assigned",
        description: `${selectedPatient?.full_name} has been assigned to bed ${selectedBed?.bed_number} in ${selectedBed?.ward}`,
      });

      setFormData({ patientId: "", bedId: "", notes: "" });
      setSelectedWard("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign bed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-success" />
            Assign Bed to Patient
          </DialogTitle>
          <DialogDescription>
            Allocate an available bed to an admitted patient.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient *</Label>
            <Select
              value={formData.patientId}
              onValueChange={(value) => setFormData({ ...formData, patientId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.length === 0 ? (
                  <SelectItem value="none" disabled>No admitted patients</SelectItem>
                ) : (
                  patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.full_name} ({patient.patient_id}) - {patient.status}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ward">Filter by Ward</Label>
            <Select
              value={selectedWard}
              onValueChange={setSelectedWard}
            >
              <SelectTrigger>
                <SelectValue placeholder="All wards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Wards</SelectItem>
                {wards.map((ward) => (
                  <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bed">Available Bed *</Label>
            <Select
              value={formData.bedId}
              onValueChange={(value) => setFormData({ ...formData, bedId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bed" />
              </SelectTrigger>
              <SelectContent>
                {beds.length === 0 ? (
                  <SelectItem value="none" disabled>No available beds</SelectItem>
                ) : (
                  beds.map((bed) => (
                    <SelectItem key={bed.id} value={bed.id}>
                      {bed.bed_number} - {bed.ward}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {beds.length > 0 && (
              <p className="text-sm text-muted-foreground">{beds.length} bed(s) available</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special requirements or notes..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-success-foreground/30 border-t-success-foreground rounded-full animate-spin" />
                  Assigning...
                </span>
              ) : (
                "Assign Bed"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignBedForm;
