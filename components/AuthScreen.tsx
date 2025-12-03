

import React, { useState } from 'react';
import { User, Role } from '../types';
import { COACHING_INSTITUTES, TARGET_YEARS } from '../constants';
import { 
  TrendingUp,
  User as UserIcon, 
  Building, 
  Calendar, 
  Mail, 
  ArrowRight,
  Shield,
  Lock,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Send,
  RefreshCw
} from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false); // Default to login
  const [role, setRole] = useState<Role>('STUDENT');
  const [error, setError] = useState('');
  
  // Registration Flow State
  const [verificationSent, setVerificationSent] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institute: '',
    targetYear: '2025',
    securityQuestion: 'What is the name of your first pet?',
    securityAnswer: ''
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // --- ADMIN LOGIN SHORTCUT ---
    if (!isRegistering) {
        if (formData.email === 'admin' && formData.password === 'Ishika@123') {
             onLogin({
                 id: 'admin_001',
                 name: 'System Administrator',
                 email: 'admin',
                 role: 'ADMIN',
                 isVerified: true,
                 avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
             });
             return;
        }
    }
    
    // --- STANDARD VALIDATION ---
    if (isRegistering) {
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        // Simulate sending email
        setVerificationSent(true);
        return;
    } 
    else {
        // --- LOGIN LOGIC (Simulated) ---
        // In a real app, this would hit the PHP API. 
        // Here we simulate checking the 'allUsers' state handled by App.tsx by passing a user object.
        // Since App.tsx handles the actual user checking for the demo, we construct the attempt here.
        
        // Note: For this demo, we can't "Check" the App's state directly inside this child component 
        // without lifting more state. 
        // Instead, we will simulate the check here assuming success if valid format, 
        // but App.tsx will handle the actual "New vs Existing" logic.
        
        // HOWEVER, to support the "Verification" requirement, we need to enforce it.
        // Since we can't see the App's user list here, we rely on the user to have gone through the verification flow below if they just registered.
        // If they are logging in as a student, we will assume they are verified for the sake of the demo UNLESS they just registered.
        
        const mockUser: User = {
            id: `u_${formData.email}`,
            name: 'Student User', // App.tsx will replace this with existing name if found
            email: formData.email,
            role: 'STUDENT', // Default to student for login attempt, App.tsx resolves actual role
            isVerified: true // Assumption for login, but blocked if they just registered without verifying
        };
        onLogin(mockUser);
    }
  };

  const handleSimulateVerification = () => {
      // Create the verified user
      const newUser: User = {
        id: `new_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: role,
        targetYear: role === 'STUDENT' ? parseInt(formData.targetYear) : undefined,
        institute: formData.institute,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
        studentId: role === 'PARENT' ? 'u1' : undefined,
        isVerified: true
      };
      
      onLogin(newUser);
  };

  // --- Verification View ---
  if (verificationSent) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-inter">
              <div className="bg-white w-full max-w-[480px] rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Send className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <div>
                      <h2 className="text-2xl font-bold text-slate-800">Verify your email</h2>
                      <p className="text-slate-500 mt-2 text-sm">
                          We've sent a verification link to <span className="font-bold text-slate-700">{formData.email}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                          Sent from <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">innfriend1@gmail.com</span>
                      </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800 text-left">
                      <strong>Instructions:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Open your Gmail inbox.</li>
                          <li>Look for an email from "JEE Tracker Team".</li>
                          <li>Click the "Verify Account" button inside.</li>
                      </ul>
                  </div>

                  <div className="pt-4 space-y-3">
                      <button 
                          onClick={handleSimulateVerification}
                          className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 transition-all flex items-center justify-center"
                      >
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Simulate Clicking Link
                      </button>
                      <button 
                          onClick={() => setVerificationSent(false)}
                          className="text-slate-400 text-xs hover:text-slate-600 underline"
                      >
                          Back to Registration
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-inter">
      <div className="bg-white w-full max-w-[480px] rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 flex flex-col">
        
        {/* Header Section (Logo) */}
        <div className="pt-10 pb-4 text-center">
            <h1 className="text-4xl font-sans font-bold tracking-tight mb-4">
                <span className="text-slate-900">IIT</span> <span className="text-orange-500">JEE</span>
            </h1>
            
            <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center ring-4 ring-slate-50 shadow-lg relative">
                     <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 rounded-full"></div>
                     <TrendingUp className="w-10 h-10 text-blue-400 relative z-10" strokeWidth={2.5} />
                     <div className="absolute top-4 right-5 text-[8px] text-yellow-400 opacity-80">{'α'}</div>
                     <div className="absolute bottom-4 left-5 text-[8px] text-cyan-400 opacity-80">{'∑'}</div>
                </div>
            </div>
            
            <h2 className="text-3xl font-bold text-blue-600 tracking-wide mb-3">TRACKER</h2>
            
            <div className="flex items-center justify-center gap-4 px-12">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-[0.2em] whitespace-nowrap">Your Journey. Your Data.</span>
                <div className="h-px bg-slate-200 flex-1"></div>
            </div>
        </div>

        {/* Content Section */}
        <div className="px-8 pb-10 flex-1">
            {/* View Toggle Header */}
            <div className="flex justify-between items-baseline mb-6 mt-4">
                <h3 className="text-xl font-bold text-slate-800">
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h3>
                <button 
                    type="button"
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError('');
                        setFormData(prev => ({ ...prev, password: '' })); // Clear pass
                    }}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                    {isRegistering ? 'Back to Login' : 'Create Account'}
                </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
                
                {/* Role Selector (Register Only) */}
                {isRegistering && (
                    <div className="flex p-1 bg-slate-50 rounded-lg border border-slate-200 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('STUDENT')}
                            className={`flex-1 py-2.5 text-xs font-bold rounded-md transition-all duration-200 ${
                                role === 'STUDENT' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            I am a Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('PARENT')}
                            className={`flex-1 py-2.5 text-xs font-bold rounded-md transition-all duration-200 ${
                                role === 'PARENT' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            I am a Parent
                        </button>
                    </div>
                )}

                {/* --- Fields --- */}

                {/* Full Name (Register Only) */}
                {isRegistering && (
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Full Name</label>
                        <div className="relative group">
                            <UserIcon className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Student Name"
                                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                )}

                {/* Institute & Year (Register & Student Only) */}
                {isRegistering && role === 'STUDENT' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Institute</label>
                            <div className="relative">
                                <Building className="absolute left-4 top-3.5 text-slate-400 w-4 h-4 z-10" />
                                <select 
                                    className="w-full pl-10 pr-8 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none bg-white transition-all"
                                    value={formData.institute}
                                    onChange={(e) => setFormData({...formData, institute: e.target.value})}
                                >
                                    <option value="" disabled>Select Institute</option>
                                    {COACHING_INSTITUTES.map((inst) => (
                                        <option key={inst} value={inst}>{inst}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Target Year</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-3.5 text-slate-400 w-4 h-4 z-10" />
                                <select 
                                    className="w-full pl-10 pr-8 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none bg-white transition-all"
                                    value={formData.targetYear}
                                    onChange={(e) => setFormData({...formData, targetYear: e.target.value})}
                                >
                                    {TARGET_YEARS.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Email Address */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">
                        {isRegistering ? 'Email Address' : 'Email or Username'}
                    </label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder={isRegistering ? "student@example.com" : "Email or 'admin'"}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="password" 
                            placeholder={isRegistering ? "Create password" : "Enter password"}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>
                </div>

                {/* Account Recovery Setup (Register Only) */}
                {isRegistering && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mt-2">
                        <div className="flex items-center space-x-2 mb-3">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <h4 className="text-xs font-bold text-blue-800 uppercase">Account Recovery Setup</h4>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Security Question</label>
                                <div className="relative">
                                    <HelpCircle className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                                    <select 
                                        className="w-full pl-9 pr-2 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-400 bg-white"
                                        value={formData.securityQuestion}
                                        onChange={(e) => setFormData({...formData, securityQuestion: e.target.value})}
                                    >
                                        <option>What is the name of your first pet?</option>
                                        <option>What is your mother's maiden name?</option>
                                        <option>What was your childhood nickname?</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Answer</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Fluffy"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-400 bg-white"
                                    value={formData.securityAnswer}
                                    onChange={(e) => setFormData({...formData, securityAnswer: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="flex items-center text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center space-x-2 group mt-4"
                >
                    <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;