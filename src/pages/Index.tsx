import { useState, useEffect } from "react";
import { Users, Calendar, BedDouble, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/dashboard/Header";
import StatCard from "@/components/dashboard/StatCard";
import PatientList from "@/components/dashboard/PatientList";
import AppointmentsList from "@/components/dashboard/AppointmentsList";
import DoctorAvailability from "@/components/dashboard/DoctorAvailability";
import BedOccupancy from "@/components/dashboard/BedOccupancy";
import QuickActions from "@/components/dashboard/QuickActions";
import NewPatientForm from "@/components/forms/NewPatientForm";
import ScheduleAppointmentForm from "@/components/forms/ScheduleAppointmentForm";
import AssignBedForm from "@/components/forms/AssignBedForm";

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  availableBeds: number;
  criticalCases: number;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    availableBeds: 0,
    criticalCases: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  // Form dialogs
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showScheduleAppointment, setShowScheduleAppointment] = useState(false);
  const [showAssignBed, setShowAssignBed] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    // Fetch total patients
    const { count: patientsCount } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    // Fetch today's appointments
    const today = new Date().toISOString().split('T')[0];
    const { count: appointmentsCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('appointment_date', today);

    // Fetch available beds
    const { count: bedsCount } = await supabase
      .from('beds')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available');

    // Fetch critical cases
    const { count: criticalCount } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'critical');

    setStats({
      totalPatients: patientsCount || 0,
      todayAppointments: appointmentsCount || 0,
      availableBeds: bedsCount || 0,
      criticalCases: criticalCount || 0,
    });
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "New Patient":
        setShowNewPatient(true);
        break;
      case "Schedule":
        setShowScheduleAppointment(true);
        break;
      case "Assign Bed":
        setShowAssignBed(true);
        break;
      default:
        break;
    }
  };

  const statCards = [
    { 
      title: "Total Patients", 
      value: stats.totalPatients.toLocaleString(), 
      change: "Registered patients", 
      changeType: "neutral" as const, 
      icon: Users, 
      iconColor: "primary" as const 
    },
    { 
      title: "Today's Appointments", 
      value: stats.todayAppointments.toString(), 
      change: "Scheduled for today", 
      changeType: "neutral" as const, 
      icon: Calendar, 
      iconColor: "secondary" as const 
    },
    { 
      title: "Available Beds", 
      value: stats.availableBeds.toString(), 
      change: "Ready for admission", 
      changeType: "neutral" as const, 
      icon: BedDouble, 
      iconColor: "success" as const 
    },
    { 
      title: "Critical Cases", 
      value: stats.criticalCases.toString(), 
      change: stats.criticalCases > 0 ? "Require attention" : "All stable", 
      changeType: stats.criticalCases > 0 ? "negative" as const : "positive" as const, 
      icon: AlertTriangle, 
      iconColor: "destructive" as const 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-foreground/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
        <Sidebar activeSection={activeSection} onSectionChange={(section) => {
          setActiveSection(section);
          setSidebarOpen(false);
        }} />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                changeType={stat.changeType}
                icon={stat.icon}
                iconColor={stat.iconColor}
                delay={index * 50}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <QuickActions onAction={handleQuickAction} />

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Patient List */}
            <div className="xl:col-span-2">
              <PatientList refreshKey={refreshKey} />
            </div>

            {/* Right Column - Doctor Availability */}
            <div className="space-y-6">
              <DoctorAvailability refreshKey={refreshKey} />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Appointments */}
            <div className="xl:col-span-2">
              <AppointmentsList refreshKey={refreshKey} />
            </div>

            {/* Bed Occupancy */}
            <div>
              <BedOccupancy refreshKey={refreshKey} />
            </div>
          </div>
        </div>
      </main>

      {/* Forms */}
      <NewPatientForm 
        open={showNewPatient} 
        onOpenChange={setShowNewPatient}
        onSuccess={handleRefresh}
      />
      <ScheduleAppointmentForm 
        open={showScheduleAppointment} 
        onOpenChange={setShowScheduleAppointment}
        onSuccess={handleRefresh}
      />
      <AssignBedForm 
        open={showAssignBed} 
        onOpenChange={setShowAssignBed}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default Index;
