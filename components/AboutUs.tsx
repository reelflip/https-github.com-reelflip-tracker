
import React from 'react';
import { BookOpen, Target, Lightbulb, Heart, Shield, CalendarClock, BookX, Users } from 'lucide-react';
import SEO from './SEO';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-10">
      <SEO title="About Us" description="IIT JEE Prep - A balanced approach to IIT JEE preparation with syllabus tracking, analytics, and wellness tools." />
      
      {/* Hero Section */}
      <div className="text-center space-y-4 py-10">
        <h1 className="text-4xl font-bold text-slate-900">Your Balanced Path to <span className="text-blue-600">IIT JEE Success</span></h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          We believe preparation shouldn't be about burnout. IIT JEE Prep combines academic rigor with smart strategies and mental well-being to help you perform your best.
        </p>
      </div>

      {/* Features Grid (Replaces Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
           <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-600">
             <BookOpen className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">Detailed Syllabus Tracking</h3>
           <p className="text-sm text-slate-500 leading-relaxed">
             Track your progress across Physics, Chemistry, and Maths down to the topic level. Know exactly what's pending and what's mastered.
           </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-orange-200 transition-colors">
           <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-orange-600">
             <Target className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">Mock Tests & Analytics</h3>
           <p className="text-sm text-slate-500 leading-relaxed">
             Simulate real exam conditions with past papers. Our analytics engine identifies your weak areas so you can improve efficiently.
           </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-purple-200 transition-colors">
           <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-purple-600">
             <CalendarClock className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">Smart Timetable Generator</h3>
           <p className="text-sm text-slate-500 leading-relaxed">
             Confused about when to study what? Input your school and coaching hours, and let our algorithm generate an optimized daily schedule for you.
           </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-red-200 transition-colors">
           <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-red-600">
             <BookX className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">Mistake Analysis</h3>
           <p className="text-sm text-slate-500 leading-relaxed">
             Don't just practice, learn. Our Mistake Notebook helps you log incorrect answers, tag error types (silly vs conceptual), and ensure you never repeat them.
           </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-yellow-200 transition-colors">
           <div className="bg-yellow-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-yellow-600">
             <Lightbulb className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">Smart Memory Hacks</h3>
           <p className="text-sm text-slate-500 leading-relaxed">
             Struggling to remember formulas? Access our curated library of mnemonics, shortcuts, and flashcards designed for quick recall.
           </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-pink-200 transition-colors">
           <div className="bg-pink-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-pink-600">
             <Heart className="w-6 h-6" />
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">Wellness & Focus</h3>
           <p className="text-sm text-slate-500 leading-relaxed">
             Mental health matters. Use our Focus Zone for distraction-free study sessions and Wellness Corner for stress-relief exercises.
           </p>
        </div>

        {/* Parent Monitoring Feature */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-teal-200 transition-colors md:col-span-2">
           <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
               <div className="bg-teal-50 w-16 h-16 rounded-xl flex items-center justify-center text-teal-600 shrink-0">
                 <Users className="w-8 h-8" />
               </div>
               <div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Parent Connect & Monitoring</h3>
                   <p className="text-sm text-slate-500 leading-relaxed">
                     We understand that JEE preparation is a family effort. Our platform allows parents to secure connect to their child's account. View detailed performance analytics, track syllabus completion, and stay informed about progress without needing to ask constantly. Support your ward with data-driven insights.
                   </p>
               </div>
           </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
         <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-slate-600" /> Our Philosophy
         </h2>
         <p className="text-slate-600 leading-relaxed mb-4">
            The journey to IIT is often portrayed as a struggle of endless hours and sleepless nights. We want to change that narrative. 
         </p>
         <p className="text-slate-600 leading-relaxed">
            By providing tools that organize your study life, automate your revision schedules, and actually care about your mental state, we aim to make your preparation journey structured, sustainable, and successful.
         </p>
         <p className="text-slate-500 text-sm mt-6 italic">
            — The IIT JEE Prep Team
         </p>
      </div>
    </div>
  );
};

export default AboutUs;
