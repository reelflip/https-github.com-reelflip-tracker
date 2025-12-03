
import React, { useEffect, useState } from 'react';
import { User, TopicProgress, Notification, DailyGoal, Quote } from '../types';
import { Calendar, CheckCircle2, Trophy, ArrowRight, Bell, Flame, Plus, Square, CheckSquare, Target } from 'lucide-react';
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
}

const Dashboard: React.FC<DashboardProps> = ({ user, progress, onChangeTab, notifications = [], quotes, goals, onToggleGoal, onAddGoal }) => {
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

  return (
    <div className="space-y-6">
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
            <span className="font-medium text-sm uppercase tracking-wide">Target: JEE 2025</span>
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
                <input 
                    type="text" 
                    placeholder="Add new goal..."
                    className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-200 outline-none"
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-2 text-blue-500 hover:text-blue-700">
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
