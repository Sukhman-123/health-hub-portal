import { useState } from "react";
import { Users, Calendar, BedDouble, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/dashboard/Header";
import StatCard from "@/components/dashboard/StatCard";
import PatientList from "@/components/dashboard/PatientList";
import AppointmentsList from "@/components/dashboard/AppointmentsList";
import DoctorAvailability from "@/components/dashboard/DoctorAvailability";
import BedOccupancy from "@/components/dashboard/BedOccupancy";
import QuickActions from "@/components/dashboard/QuickActions";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { title: "Total Patients", value: "1,284", change: "+12.5% from last month", changeType: "positive" as const, icon: Users, iconColor: "primary" as const },
    { title: "Today's Appointments", value: "48", change: "8 pending confirmation", changeType: "neutral" as const, icon: Calendar, iconColor: "secondary" as const },
    { title: "Available Beds", value: "37", change: "73% occupancy rate", changeType: "neutral" as const, icon: BedDouble, iconColor: "success" as const },
    { title: "Critical Cases", value: "5", change: "2 require attention", changeType: "negative" as const, icon: AlertTriangle, iconColor: "destructive" as const },
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
            {stats.map((stat, index) => (
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
          <QuickActions />

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Patient List */}
            <div className="xl:col-span-2">
              <PatientList />
            </div>

            {/* Right Column - Doctor Availability */}
            <div className="space-y-6">
              <DoctorAvailability />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Appointments */}
            <div className="xl:col-span-2">
              <AppointmentsList />
            </div>

            {/* Bed Occupancy */}
            <div>
              <BedOccupancy />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
