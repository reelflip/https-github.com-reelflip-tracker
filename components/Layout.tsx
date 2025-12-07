
import React, { useState } from 'react';
import { User } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  PenTool, 
  Timer, 
  BarChart2, 
  Calendar, 
  RotateCw, 
  LogOut, 
  Settings, 
  Radio, 
  Heart, 
  Layers, 
  CheckSquare, 
  Lightbulb, 
  Terminal, 
  Database,
  FileText,
  Users,
  BookX,
  Menu,
  X,
  Bot
} from 'lucide-react';

interface LayoutProps {
  currentUser: User | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentUser, activeTab, onTabChange, onLogout, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const studentNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
    { id: 'tests', label: 'Tests', icon: PenTool },
    { id: 'ai_tutor', label: 'AI Tutor', icon: Bot },
    { id: 'focus', label: 'Focus', icon: Timer },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'revision', label: 'Revision', icon: RotateCw },
    { id: 'mistakes', label: 'Mistakes', icon: BookX },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'backlogs', label: 'Backlogs', icon: CheckSquare },
    { id: 'hacks', label: 'Hacks', icon: Lightbulb },
    { id: 'wellness', label: 'Wellness', icon: Heart },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  const parentNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'profile', label: 'Settings', icon: Settings },
  ];

  const adminNav = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'tests_admin', label: 'Tests', icon: FileText },
    { id: 'video_admin', label: 'Videos', icon: Layers }, 
    { id: 'content_admin', label: 'Content', icon: Radio },
    { id: 'admin_analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'diagnostics', label: 'Diagnostics', icon: Terminal },
    { id: 'system', label: 'System', icon: Database },
  ];

  let navItems = studentNav;
  if (currentUser?.role === 'ADMIN') navItems = adminNav;
  if (currentUser?.role === 'PARENT') navItems = parentNav;

  // Bottom Nav Items (Core)
  const bottomNavItems = navItems.slice(0, 3); // First 3 items
  const moreNavItems = navItems.slice(3);      // The rest

  // Helper for mobile menu styling
  const getMobileMenuStyles = (id: string) => {
      switch(id) {
          case 'focus': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
          case 'analytics': return 'bg-blue-50 text-blue-600 border-blue-100';
          case 'wellness': return 'bg-teal-50 text-teal-600 border-teal-100';
          case 'mistakes': return 'bg-red-50 text-red-600 border-red-100';
          case 'diagnostics': return 'bg-lime-50 text-lime-600 border-lime-100';
          case 'ai_tutor': return 'bg-violet-50 text-violet-600 border-violet-100';
          default: return 'bg-slate-50 text-slate-600 border-slate-100';
      }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter text-slate-900">
      {/* Sidebar (Desktop Only) */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col h-screen sticky top-0 overflow-hidden shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-400">IITGEEPrep</h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center">
                {currentUser?.role}
                {currentUser?.role === 'ADMIN' && <span className="ml-1 opacity-75">• v5.3</span>}
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              <span className="font-medium text-sm truncate">{item.label}</span>
              {/* Notification Dot Logic Example */}
              {item.id === 'profile' && currentUser?.pendingRequest && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900 z-10">
            <button 
                onClick={onLogout}
                className="w-full p-3 bg-red-500/10 text-red-400 rounded-xl font-bold flex items-center justify-center space-x-2 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
            >
                <LogOut size={18} />
                <span className="text-sm">Sign Out</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative">
        
        {/* Mobile Header (Simplified) */}
        <header className="md:hidden bg-slate-900 text-white px-4 py-3 flex justify-between items-center sticky top-0 z-30 shadow-md">
             <div className="font-bold text-lg text-blue-400 tracking-tight">IITGEEPrep</div>
             <div className="flex items-center space-x-3">
                 {currentUser?.role === 'ADMIN' && <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">v5.3</span>}
                 {/* User Avatar Tiny */}
                 {currentUser?.avatarUrl && (
                     <img src={currentUser.avatarUrl} alt="Profile" className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800" />
                 )}
             </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-24 md:pb-0 scroll-smooth">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </div>

        {/* Mobile Bottom Navigation Bar (Fixed) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 z-50 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] safe-area-bottom">
            {bottomNavItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => { onTabChange(item.id); setMobileMenuOpen(false); }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 w-16 ${
                        activeTab === item.id 
                        ? 'text-blue-600 -translate-y-1' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <item.icon className={`w-6 h-6 mb-1 ${activeTab === item.id ? 'fill-blue-50' : ''}`} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                    <span className="text-[10px] font-bold truncate w-full text-center">{item.label}</span>
                </button>
            ))}
            
            {moreNavItems.length > 0 && (
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 w-16 ${
                        mobileMenuOpen 
                        ? 'text-blue-600' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <div className={`transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
                        {mobileMenuOpen ? <X className="w-6 h-6 mb-1" /> : <Menu className="w-6 h-6 mb-1" />}
                    </div>
                    <span className="text-[10px] font-bold">More</span>
                </button>
            )}

            <button
                onClick={onLogout}
                className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 w-16 text-slate-400 hover:text-red-500"
            >
                <LogOut className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">Exit</span>
            </button>
        </div>

        {/* Mobile "More" Menu Overlay (Full Screen / Drawer) */}
        {mobileMenuOpen && moreNavItems.length > 0 && (
            <div className="md:hidden fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-md pt-20 px-4 pb-28 overflow-y-auto animate-in fade-in slide-in-from-bottom-10 duration-200">
                <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-6 text-center">All Apps</h3>
                <div className="grid grid-cols-3 gap-3">
                    {moreNavItems.map((item, idx) => (
                        <button
                            key={item.id}
                            onClick={() => { onTabChange(item.id); setMobileMenuOpen(false); }}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border shadow-sm active:scale-95 transition-all aspect-square ${getMobileMenuStyles(item.id)}`}
                            style={{ animationDelay: `${idx * 30}ms` }}
                        >
                            <item.icon className="w-7 h-7 mb-2 opacity-90" strokeWidth={1.5} />
                            <span className="font-bold text-[10px] uppercase tracking-wide text-center leading-tight">{item.label}</span>
                            {item.id === 'profile' && currentUser?.pendingRequest && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            )}
                        </button>
                    ))}
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-white/20 text-[10px]">IITGEEPrep Mobile v5.3</p>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default Layout;
