
import React, { useEffect, useState } from 'react';
import { User, TopicProgress, Notification, DailyGoal, Quote, ContactMessage } from '../types';
import { Calendar, CheckCircle2, Trophy, ArrowRight, Bell, Flame, Plus, Square, CheckSquare, Target, UserPlus, Link as LinkIcon, Users, Inbox, Database, PenTool, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  user: User;
  progress: Record<string, TopicProgress>;
  onChangeTab: (tab: string) => void;
  notifications?: Notification[];
  quotes: Quote[];
  goals: DailyGoal[];
  onToggleGoal: (id: string) => void;
  onAddGoal: (text: string) => void;
  // Admin specific props
  totalUsers?: number;
  contactMessages?: ContactMessage[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
    user, 
    progress, 
    onChangeTab, 
    notifications = [], 
    quotes, 
    goals, 
    onToggleGoal, 
    onAddGoal,
    totalUsers = 0,
    contactMessages = []
}) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [newGoalText, setNewGoalText] = useState('');

  useEffect(() => {
    // Cycle quotes every 10 seconds
    const timer = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % (quotes.length || 1));
    }, 10000);
    
    // Calculate days to exam (Mock date: June 15, 2025)
    const target = new Date('2025-06-15');
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    setDaysLeft(Math.ceil(diff / (1000 * 3600 * 24)));

    return () => clearInterval(timer);
  }, [quotes.length]);

  const currentQuote = quotes.length > 0 ? quotes[currentQuoteIndex] : { text: "Loading motivation...", author: "" };

  const totalTopics = Object.keys(progress).length || 1; // Avoid divide by zero
  const completedTopics = Object.values(progress).filter((p: TopicProgress) => p.status === 'COMPLETED').length;
  const completionRate = Math.round((completedTopics / totalTopics) * 100);

  const chartData = [
    { name: 'Completed', value: completedTopics },
    { name: 'Remaining', value: totalTopics - completedTopics },
  ];
  const COLORS = ['#2563eb', '#e2e8f0'];

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newGoalText.trim()) {
        onAddGoal(newGoalText);
        setNewGoalText('');
    }
  };

  const completedGoals = goals.filter(g => g.completed).length;

  // --- ADMIN OVERVIEW ---
  if (user.role === 'ADMIN') {
      return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                      <h2 className="text-3xl font-bold mb-2">Admin Command Center</h2>
                      <p className="text-slate-400">Welcome back, Administrator. System is operational.</p>
                  </div>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
                      <Activity className="w-32 h-32" />
                  </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* User Stats */}
                  <div 
                    onClick={() => onChangeTab('users')}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                      <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <Users className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
                      </div>
                      <div className="text-3xl font-bold text-slate-800 mb-1">{totalUsers}</div>
                      <p className="text-xs text-slate-500">Registered Students & Parents</p>
                  </div>

                  {/* Inbox Stats */}
                  <div 
                    onClick={() => onChangeTab('content')} 
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                      <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                              <Inbox className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Messages</span>
                      </div>
                      <div className="text-3xl font-bold text-slate-800 mb-1">{contactMessages.length}</div>
                      <p className="text-xs text-slate-500">Contact Form Inquiries</p>
                      {contactMessages.length > 0 && (
                          <div className="mt-3 text-xs font-bold text-purple-600 flex items-center">
                              View Inbox <ArrowRight className="w-3 h-3 ml-1" />
                          </div>
                      )}
                  </div>

                  {/* Content Stats */}
                  <div 
                    onClick={() => onChangeTab('content')}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                      <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                              <PenTool className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Content</span>
                      </div>
                      <div className="text-3xl font-bold text-slate-800 mb-1">Manage</div>
                      <p className="text-xs text-slate-500">Tests, Quotes & Broadcasts</p>
                  </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                          <Database className="w-5 h-5 mr-2 text-slate-500" /> System Docs
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                          Access SQL schemas, PHP API files, and deployment guides for Hostinger.
                      </p>
                      <button 
                        onClick={() => onChangeTab('system')}
                        className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center"
                      >
                          Open Documentation <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // --- PARENT ONBOARDING VIEW (If not connected) ---
  if (user.role === 'PARENT' && !user.studentId) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-blue-50 p-6 rounded-full">
                  <UserPlus className="w-16 h-16 text-blue-600" />
              </div>
              <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome, Parent! 👋</h2>
                  <p className="text-slate-500 max-w-md mx-auto">
                      To start tracking progress, you need to connect to your child's account using their Student ID.
                  </p>
              </div>
              <button 
                  onClick={() => onChangeTab('profile')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center"
              >
                  <LinkIcon className="w-5 h-5 mr-2" />
                  Connect to Child
              </button>
          </div>
      );
  }

  // --- STUDENT DASHBOARD (Default) ---
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Welcome & Motivation */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden transition-all duration-500">
        <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Hello, {user.name.split(' ')[0]}! 👋</h2>
            <div className="min-h-[80px] flex flex-col justify-center">
                 <p className="text-blue-100 italic text-lg leading-relaxed opacity-90 animate-in fade-in slide-in-from-right-4 duration-700 key={currentQuoteIndex}">
                    "{currentQuote.text}"
                 </p>
                 {currentQuote.author && (
                    <span className="text-xs text-blue-200 mt-2 block font-medium uppercase tracking-wide animate-in fade-in delay-200">
                        - {currentQuote.author}
                    </span>
                 )}
            </div>
            {/* Pagination Dots */}
            <div className="flex space-x-1.5 mt-4">
                {quotes.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1 rounded-full transition-all duration-300 ${idx === currentQuoteIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} 
                    />
                ))}
            </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/10 p-2 rounded-lg backdrop-blur-sm flex items-center space-x-1.5 border border-white/20">
             <Flame className="w-5 h-5 text-orange-400 fill-orange-400 animate-pulse" />
             <span className="font-bold text-white">12 Day Streak</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Countdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 text-slate-500 mb-4">
            <Calendar className="w-5 h-5" />
            <span className="font-medium text-sm uppercase tracking-wide">Target: {user.targetExam?.split(' ')[0] || 'JEE'} {user.targetYear || 2025}</span>
          </div>
          <div>
            <span className="text-5xl font-bold text-slate-800">{daysLeft}</span>
            <span className="text-slate-500 ml-2">Days Remaining</span>
          </div>
          <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full w-2/3" />
          </div>
        </div>

        {/* Syllabus Progress */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 text-slate-500 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium text-sm uppercase tracking-wide">Syllabus</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{completionRate}%</p>
              <p className="text-xs text-slate-400 mt-1">Overall Completion</p>
              <button onClick={() => onChangeTab('syllabus')} className="mt-4 text-blue-600 text-sm font-medium flex items-center hover:underline">
                View Tracker <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="w-24 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={40}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* Daily Micro Goals */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between text-slate-500 mb-4">
             <div className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span className="font-medium text-sm uppercase tracking-wide">Today's Goals</span>
             </div>
             <span className="text-xs font-bold text-slate-400">{completedGoals}/{goals.length}</span>
           </div>
           
           <div className="space-y-2 mb-3 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
              {goals.map(goal => (
                  <div 
                    key={goal.id} 
                    onClick={() => onToggleGoal(goal.id)}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                      {goal.completed ? (
                          <CheckSquare className="w-4 h-4 text-green-500" />
                      ) : (
                          <Square className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                      )}
                      <span className={`text-sm ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {goal.text}
                      </span>
                  </div>
              ))}
              {goals.length === 0 && <p className="text-xs text-slate-400 italic">No goals set for today.</p>}
           </div>

           <form onSubmit={handleAddGoalSubmit} className="relative">
                <label htmlFor="newGoal" className="sr-only">Add new goal</label>
                <input 
                    id="newGoal"
                    type="text" 
                    placeholder="Add new goal..."
                    className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-200 outline-none"
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-2 text-blue-500 hover:text-blue-700" aria-label="Add Goal">
                    <Plus className="w-4 h-4" />
                </button>
           </form>
        </div>
      </div>

      {/* Notice Board */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
        <h3 className="font-bold text-amber-800 mb-4 flex items-center">
            <Bell className="w-4 h-4 mr-2" /> Student Notice Board
        </h3>
        {notifications.length > 0 ? (
            <div className="space-y-3">
                {notifications.map(note => (
                    <div key={note.id} className="bg-white p-3 rounded-lg border border-amber-100 shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-bold text-slate-800">{note.title}</h4>
                            <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{note.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{note.message}</p>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-sm text-amber-700 italic">No new notices.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
