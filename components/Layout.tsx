
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
  Flower,
  Layers,
  ListTodo,
  X,
  Lightbulb,
  Globe,
  ShieldCheck,
  Mail,
  FileText,
  Award,
  Users as UsersIcon,
  PenTool,
  Radio,
  Terminal,
  RotateCw
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
        { id: 'tests', label: 'Tests', icon: Target },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'revision', label: 'Smart Revision', icon: RotateCw }, 
        { id: 'backlogs', label: 'Backlogs', icon: ListTodo },
        { id: 'mistakes', label: 'Mistakes', icon: BookX },
        { id: 'flashcards', label: 'Flashcards', icon: Layers },
        { id: 'hacks', label: 'Memory Hacks', icon: Lightbulb },
        { id: 'focus', label: 'Focus Zone', icon: Timer },
        { id: 'wellness', label: 'Wellness', icon: Flower },
        { id: 'timetable', label: 'Timetable', icon: CalendarClock },
        { id: 'profile', label: 'Settings', icon: Settings },
      ];
    } else if (currentUser.role === 'ADMIN') {
      return [
        ...common,
        { id: 'users', label: 'User Management', icon: UsersIcon },
        { id: 'tests_admin', label: 'Test Management', icon: PenTool },
        { id: 'content_admin', label: 'Content Management', icon: Radio },
        { id: 'test_runner', label: 'System Tests', icon: Terminal },
        { id: 'system', label: 'System Docs', icon: Database },
      ];
    } else {
      // Parent
      return [
        ...common, // Dashboard for overview
        { id: 'parent_view', label: 'Child Progress', icon: BarChart2 },
        { id: 'profile', label: 'My Profile', icon: Settings },
      ];
    }
  };

  const navItems = getNavItems();

  // Check for pending requests to show badge
  const hasNotification = (id: string) => {
      if (id === 'profile' && currentUser.role === 'STUDENT' && currentUser.pendingRequest) return true;
      return false;
  };

  // Helper to get vibrant styles for mobile menu items
  const getMobileMenuStyles = (id: string, isActive: boolean) => {
      const baseStyle = "border transition-all duration-200 shadow-sm relative overflow-hidden group";
      
      switch(id) {
          case 'dashboard': 
              return isActive 
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-600 shadow-blue-200" 
                  : "bg-white text-blue-600 border-blue-100 hover:border-blue-300";
          case 'syllabus':
              return isActive
                  ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-indigo-600 shadow-indigo-200"
                  : "bg-white text-indigo-600 border-indigo-100 hover:border-indigo-300";
          case 'tests':
          case 'tests_admin':
              return isActive
                  ? "bg-gradient-to-br from-violet-500 to-violet-600 text-white border-violet-600 shadow-violet-200"
                  : "bg-white text-violet-600 border-violet-100 hover:border-violet-300";
          case 'analytics':
              return isActive
                  ? "bg-gradient-to-br from-rose-500 to-rose-600 text-white border-rose-600 shadow-rose-200"
                  : "bg-white text-rose-600 border-rose-100 hover:border-rose-300";
          case 'revision':
              return isActive
                  ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-emerald-200"
                  : "bg-white text-emerald-700 border-emerald-100 hover:border-emerald-300";
          case 'focus':
              return isActive
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-600 shadow-emerald-200"
                  : "bg-white text-emerald-600 border-emerald-100 hover:border-emerald-300";
          case 'wellness':
              return isActive
                  ? "bg-gradient-to-br from-teal-400 to-teal-500 text-white border-teal-500 shadow-teal-200"
                  : "bg-white text-teal-600 border-teal-100 hover:border-teal-300";
          case 'backlogs':
              return isActive
                  ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white border-orange-500 shadow-orange-200"
                  : "bg-white text-orange-600 border-orange-100 hover:border-orange-300";
          case 'mistakes':
              return isActive
                  ? "bg-gradient-to-br from-red-500 to-red-600 text-white border-red-600 shadow-red-200"
                  : "bg-white text-red-600 border-red-100 hover:border-red-300";
          case 'flashcards':
              return isActive
                  ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white border-pink-600 shadow-pink-200"
                  : "bg-white text-pink-600 border-pink-100 hover:border-pink-300";
          case 'hacks':
              return isActive
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white border-yellow-500 shadow-yellow-200"
                  : "bg-white text-yellow-600 border-yellow-100 hover:border-yellow-300";
          case 'users':
              return isActive 
                  ? "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-cyan-600 shadow-cyan-200"
                  : "bg-white text-cyan-600 border-cyan-100 hover:border-cyan-300";
          case 'content_admin':
              return isActive 
                  ? "bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 text-white border-fuchsia-600 shadow-fuchsia-200"
                  : "bg-white text-fuchsia-600 border-fuchsia-100 hover:border-fuchsia-300";
          case 'test_runner':
              return isActive 
                  ? "bg-gradient-to-br from-lime-500 to-lime-600 text-white border-lime-600 shadow-lime-200"
                  : "bg-white text-lime-600 border-lime-100 hover:border-lime-300";
          default:
              return isActive
                  ? "bg-slate-800 text-white border-slate-900 shadow-slate-300"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400";
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 z-50 shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">IITGEEPrep</h1>
          <p className="text-xs text-slate-400 mt-1">
            {currentUser.role}
            {currentUser.role === 'ADMIN' && <span className="ml-1 opacity-75">• v3.6</span>}
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all relative ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                  <item.icon size={20} />
                  <span className="font-medium text-sm">{item.label}</span>
              </div>
              {hasNotification(item.id) && (
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 border border-slate-900 animate-pulse"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div 
            onClick={() => onTabChange('profile')}
            className="flex items-center space-x-3 mb-4 px-2 cursor-pointer hover:bg-slate-800 p-2 rounded transition-colors group relative"
          >
            <img src={currentUser.avatarUrl || "https://picsum.photos/40/40"} alt="Profile" className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 group-hover:border-blue-400" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate group-hover:text-blue-300 transition-colors">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
            </div>
            {hasNotification('profile') && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
            )}
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
          <span className="font-bold text-lg text-blue-400">IITGEEPrep</span>
        </div>
        <div 
            className="flex items-center space-x-3 cursor-pointer relative"
            onClick={() => onTabChange('profile')}
        >
          <img src={currentUser.avatarUrl || "https://picsum.photos/40/40"} alt="Profile" className="w-8 h-8 rounded-full border border-slate-700" />
          {hasNotification('profile') && (
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border border-slate-900"></span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0 min-h-screen transition-all flex flex-col">
        <div className="p-4 md:p-8 max-w-7xl mx-auto flex-1 w-full">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 px-4 md:px-8 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                <div className="mb-4 md:mb-0">
                    &copy; 2025 IITGEEPrep. All rights reserved. 
                    {currentUser.role === 'ADMIN' && <span className="ml-2 px-1.5 py-0.5 bg-slate-100 rounded text-slate-400">v3.6</span>}
                </div>
                <div className="flex space-x-6 flex-wrap justify-center gap-y-2">
                    <button onClick={() => onTabChange('about')} className="hover:text-blue-600 transition-colors flex items-center">
                        <Globe className="w-3 h-3 mr-1" /> About Us
                    </button>
                    <button onClick={() => onTabChange('blog')} className="hover:text-blue-600 transition-colors flex items-center">
                        <FileText className="w-3 h-3 mr-1" /> Blog
                    </button>
                    <button onClick={() => onTabChange('exams')} className="hover:text-blue-600 transition-colors flex items-center">
                        <Award className="w-3 h-3 mr-1" /> Exams Guide
                    </button>
                    <button onClick={() => onTabChange('privacy')} className="hover:text-blue-600 transition-colors flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Privacy Policy
                    </button>
                    <button onClick={() => onTabChange('contact')} className="hover:text-blue-600 transition-colors flex items-center">
                        <Mail className="w-3 h-3 mr-1" /> Contact Us
                    </button>
                </div>
            </div>
        </footer>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 z-50 flex justify-around items-center px-2 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] safe-area-pb">
        {navItems.slice(0, 3).map((item) => (
          <button
            key={item.id}
            onClick={() => {
                onTabChange(item.id);
                setIsMobileMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center w-full py-2 space-y-1 relative ${
              activeTab === item.id ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <div className="relative">
                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                {hasNotification(item.id) && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                )}
            </div>
            <span className="text-[10px] font-medium truncate max-w-[64px]">{item.label}</span>
          </button>
        ))}
        
        {navItems.length > 3 && (
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`flex flex-col items-center justify-center w-full py-2 space-y-1 ${isMobileMenuOpen ? 'text-blue-600' : 'text-slate-400'}`}
            >
            <div className="relative">
                <Menu size={20} />
                {navItems.slice(3).some(i => hasNotification(i.id)) && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                )}
            </div>
            <span className="text-[10px] font-medium">More</span>
            </button>
        )}

        <button
            onClick={onLogout}
            className="flex flex-col items-center justify-center w-full py-2 space-y-1 text-red-400 hover:text-red-500"
        >
           <LogOut size={20} />
           <span className="text-[10px] font-medium">Exit</span>
        </button>
      </nav>

      {/* Mobile Full Screen Menu Overlay */}
      {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[60] bg-slate-50/95 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-10 flex flex-col">
             <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-white/50">
                <h2 className="text-xl font-bold text-slate-800">App Menu</h2>
                <button 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="p-2 bg-white rounded-full shadow-sm text-slate-500 hover:text-slate-800 border border-slate-200 active:scale-90 transition-transform"
                >
                   <X size={24} />
                </button>
             </div>
             
             <div className="px-5 py-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4 pb-10">
                   {navItems.map((item, idx) => {
                      const isActive = activeTab === item.id;
                      const style = getMobileMenuStyles(item.id, isActive);
                      
                      return (
                        <button
                            key={item.id}
                            onClick={() => {
                                onTabChange(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`
                                p-4 rounded-2xl flex flex-col items-center justify-center space-y-3 
                                active:scale-95 transition-all duration-200 shadow-sm relative overflow-hidden group
                                ${style}
                                animate-in zoom-in-50 fill-mode-backwards
                            `}
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className={`p-3 rounded-full relative ${isActive ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-slate-100'} transition-colors`}>
                                <item.icon size={28} strokeWidth={1.5} />
                                {hasNotification(item.id) && (
                                    <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
                                )}
                            </div>
                            <span className="font-bold text-xs tracking-wide text-center">{item.label}</span>
                            
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            )}
                        </button>
                      );
                   })}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <button 
                        onClick={onLogout}
                        className="w-full p-4 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center space-x-2 border border-red-100 shadow-sm active:scale-95 transition-all hover:bg-red-100"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                    {currentUser.role === 'ADMIN' && (
                        <p className="text-center text-[10px] text-slate-300 mt-4">App Version v3.6</p>
                    )}
                </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default Layout;
