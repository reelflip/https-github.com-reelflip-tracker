
import React, { useState } from 'react';
import { User } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  Timer, 
  CalendarClock,
  LogOut,
  BarChart2,
  Menu,
  Settings,
  Database,
  BookX,
  Flower
} from 'lucide-react';

interface LayoutProps {
  currentUser: User | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentUser, activeTab, onTabChange, onLogout, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentUser) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">{children}</div>;
  }

  // Define navigation items based on role
  const getNavItems = () => {
    const common = [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }];
    
    if (currentUser.role === 'STUDENT') {
      return [
        ...common,
        { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
        { id: 'tests', label: 'Test Center', icon: Target },
        { id: 'mistakes', label: 'Mistake Notebook', icon: BookX },
        { id: 'focus', label: 'Focus Zone', icon: Timer },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'wellness', label: 'Wellness', icon: Flower },
        { id: 'timetable', label: 'Timetable', icon: CalendarClock },
        { id: 'profile', label: 'Settings', icon: Settings },
      ];
    } else if (currentUser.role === 'ADMIN') {
      return [
        ...common,
        { id: 'users', label: 'Users', icon: Menu },
        { id: 'system', label: 'System Docs', icon: Database },
      ];
    } else {
      // Parent
      return [
        { id: 'parent_view', label: 'Child Progress', icon: BarChart2 },
        { id: 'profile', label: 'My Profile', icon: Settings },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 z-50 shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">JEE Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">v1.0 • {currentUser.role}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div 
            onClick={() => onTabChange('profile')}
            className="flex items-center space-x-3 mb-4 px-2 cursor-pointer hover:bg-slate-800 p-2 rounded transition-colors group"
          >
            <img src={currentUser.avatarUrl || "https://picsum.photos/40/40"} alt="Profile" className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 group-hover:border-blue-400" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate group-hover:text-blue-300 transition-colors">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 w-full bg-slate-900 text-white z-50 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-lg text-blue-400">JEE Tracker</span>
        </div>
        <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onTabChange('profile')}
        >
          <img src={currentUser.avatarUrl || "https://picsum.photos/40/40"} alt="Profile" className="w-8 h-8 rounded-full border border-slate-700" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0 min-h-screen transition-all">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 z-50 flex justify-around items-center px-2 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] safe-area-pb">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center w-full py-2 space-y-1 ${
              activeTab === item.id ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
        <button onClick={onLogout} className="flex flex-col items-center justify-center w-full py-2 space-y-1 text-red-400">
           <LogOut size={20} />
           <span className="text-[10px] font-medium">Exit</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
