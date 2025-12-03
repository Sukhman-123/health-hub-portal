import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Stethoscope, 
  FileText, 
  BedDouble, 
  Settings,
  Bell,
  Search,
  LogOut,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

const NavItem = ({ icon, label, active, onClick, badge }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
      active 
        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
    )}
  >
    {icon}
    <span className="flex-1 text-left">{label}</span>
    {badge && badge > 0 && (
      <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const navItems = [
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { id: "patients", icon: <Users size={20} />, label: "Patients", badge: 12 },
    { id: "appointments", icon: <Calendar size={20} />, label: "Appointments", badge: 5 },
    { id: "doctors", icon: <Stethoscope size={20} />, label: "Doctors" },
    { id: "beds", icon: <BedDouble size={20} />, label: "Bed Management" },
    { id: "records", icon: <FileText size={20} />, label: "Medical Records" },
    { id: "treatments", icon: <Activity size={20} />, label: "Treatments" },
  ];

  return (
    <aside className="w-64 h-screen bg-sidebar flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center shadow-glow">
            <Activity className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">MediCare</h1>
            <p className="text-xs text-sidebar-foreground/60">Healthcare Portal</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-foreground/50" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-sidebar-accent/50 text-sidebar-foreground placeholder:text-sidebar-foreground/50 pl-10 pr-4 py-2.5 rounded-lg text-sm border border-sidebar-border focus:outline-none focus:ring-2 focus:ring-sidebar-ring transition-all"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-4 mb-3">
          Main Menu
        </p>
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
            badge={item.badge}
          />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        <NavItem
          icon={<Bell size={20} />}
          label="Notifications"
          badge={3}
        />
        <NavItem
          icon={<Settings size={20} />}
          label="Settings"
        />
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/30">
          <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold">
            DR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Dr. Sarah Wilson</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">Chief Medical Officer</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
