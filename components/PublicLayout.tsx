
import React from 'react';
import { TrendingUp, LogIn, Globe, Shield, Mail, FileText } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-inter flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
             <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                 <TrendingUp className="w-5 h-5 text-blue-400" />
             </div>
             <span className="font-bold text-lg text-slate-800">IIT JEE Prep</span>
          </div>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <LogIn className="w-4 h-4 mr-1.5" /> Login
          </button>
        </div>
      </header>

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
             <div className="col-span-1 md:col-span-2">
                 <div className="flex items-center space-x-2 mb-4 text-white">
                     <TrendingUp className="w-6 h-6 text-blue-500" />
                     <span className="font-bold text-xl">IIT JEE Prep</span>
                 </div>
                 <p className="text-sm leading-relaxed max-w-xs">
                     The ultimate companion for IIT JEE aspirants. Track syllabus, analyze performance, and optimize your preparation journey.
                 </p>
             </div>
             <div>
                 <h4 className="text-white font-bold mb-4">Company</h4>
                 <ul className="space-y-2 text-sm">
                     <li><button onClick={() => onNavigate('about')} className="hover:text-blue-400 transition-colors">About Us</button></li>
                     <li><button onClick={() => onNavigate('blog')} className="hover:text-blue-400 transition-colors">Blog</button></li>
                     <li><button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition-colors">Contact</button></li>
                     <li><button onClick={() => onNavigate('privacy')} className="hover:text-blue-400 transition-colors">Privacy Policy</button></li>
                 </ul>
             </div>
             <div>
                 <h4 className="text-white font-bold mb-4">Connect</h4>
                 <ul className="space-y-2 text-sm">
                     <li>Twitter</li>
                     <li>LinkedIn</li>
                     <li>Instagram</li>
                 </ul>
             </div>
         </div>
         <div className="text-center text-xs border-t border-slate-800 pt-8">
             &copy; 2025 IIT JEE Prep. All rights reserved.
         </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
