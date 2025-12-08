
import React, { useState } from 'react';
import { User } from '../types';
import { LayoutDashboard, BookOpen, PenTool, Timer, BarChart2, Calendar, RotateCw, LogOut, Settings, Radio, Heart, Layers, CheckSquare, Lightbulb, Terminal, Database, FileText, Users, BookX, Menu, X } from 'lucide-react';

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

  const bottomNavItems = navItems.slice(0, 3);
  const moreNavItems = navItems.slice(3);

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter text-slate-900">
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col h-screen sticky top-0 overflow-hidden shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-400">IITGEEPrep</h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center">v7.0</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => onTabChange(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm truncate">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-900 z-10">
            <button onClick={onLogout} className="w-full p-3 bg-red-500/10 text-red-400 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-red-500 hover:text-white transition-all">
                <LogOut size={18} /><span className="text-sm">Sign Out</span>
            </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative">
        <header className="md:hidden bg-slate-900 text-white px-4 py-3 flex justify-between items-center sticky top-0 z-30 shadow-md">
             <div className="font-bold text-lg text-blue-400">IITGEEPrep <span className="text-[10px] text-slate-400 ml-1">v7.0</span></div>
             {currentUser?.avatarUrl && <img src={currentUser.avatarUrl} alt="Profile" className="w-8 h-8 rounded-full border border-slate-700" />}
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-0">
            <div className="max-w-7xl mx-auto">{children}</div>
        </div>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 z-50 flex justify-between items-center shadow-lg">
            {bottomNavItems.map((item) => (
                <button key={item.id} onClick={() => { onTabChange(item.id); setMobileMenuOpen(false); }} className={`flex flex-col items-center justify-center p-2 rounded-xl w-16 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}>
                    <item.icon className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold">{item.label}</span>
                </button>
            ))}
            {moreNavItems.length > 0 && (
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex flex-col items-center justify-center p-2 rounded-xl w-16 text-slate-400">
                    <div className={mobileMenuOpen ? 'rotate-90' : ''}>{mobileMenuOpen ? <X className="w-6 h-6 mb-1" /> : <Menu className="w-6 h-6 mb-1" />}</div>
                    <span className="text-[10px] font-bold">More</span>
                </button>
            )}
            <button onClick={onLogout} className="flex flex-col items-center justify-center p-2 rounded-xl w-16 text-slate-400 hover:text-red-500">
                <LogOut className="w-6 h-6 mb-1" /><span className="text-[10px] font-bold">Exit</span>
            </button>
        </div>

        {mobileMenuOpen && moreNavItems.length > 0 && (
            <div className="md:hidden fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-md pt-20 px-4 pb-28 overflow-y-auto">
                <div className="grid grid-cols-3 gap-3">
                    {moreNavItems.map((item) => (
                        <button key={item.id} onClick={() => { onTabChange(item.id); setMobileMenuOpen(false); }} className="flex flex-col items-center justify-center p-3 rounded-2xl border bg-slate-50 text-slate-600 border-slate-100">
                            <item.icon className="w-7 h-7 mb-2" />
                            <span className="font-bold text-[10px] uppercase text-center">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default Layout;
