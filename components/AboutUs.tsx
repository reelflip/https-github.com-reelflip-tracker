
import React from 'react';
import { BookOpen, Target, Lightbulb, Heart, Shield, CalendarClock, BookX, Users, Globe, Award, Zap, Brain, CheckCircle2, TrendingUp } from 'lucide-react';
import SEO from './SEO';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 pb-10">
      <SEO 
        title="About IITGEEPrep - Your Complete Engineering Entrance Guide" 
        description="Learn about IITGEEPrep, the ultimate platform for IIT JEE, BITSAT, and VITEEE preparation. We combine syllabus tracking, analytics, and wellness to help you crack engineering exams." 
      />
      
      {/* Hero Section */}
      <div className="text-center py-12 md:py-16 space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Engineering Preparation</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            <strong>IITGEEPrep</strong> is not just a tracker; it's your intelligent companion for cracking India's toughest engineering entrance exams through data, discipline, and strategy.
        </p>
      </div>

      {/* Brand Identity / Philosophy */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <TrendingUp className="w-64 h-64 text-blue-600" />
        </div>
        
        <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">The Philosophy Behind The Name</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 transition-transform hover:-translate-y-1 duration-300">
                    <span className="text-4xl font-black text-blue-600 block mb-2">IIT</span>
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-3">The Gold Standard</span>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        Representing the <strong>Indian Institutes of Technology</strong>, the pinnacle of engineering education. We aim for the rigor and excellence required to reach these institutions.
                    </p>
                </div>
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 transition-transform hover:-translate-y-1 duration-300">
                    <span className="text-4xl font-black text-orange-500 block mb-2">GEE</span>
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-3">General Engineering Education</span>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        Acknowledging that success isn't limited to one exam. We cover the entire spectrum: <strong>BITSAT, VITEEE, MET, and State CETs</strong>.
                    </p>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 transition-transform hover:-translate-y-1 duration-300">
                    <span className="text-4xl font-black text-green-600 block mb-2">Prep</span>
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-3">Structured Preparation</span>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        Moving beyond random study. We focus on <strong>systematic tracking, analytics, and mental wellness</strong> to ensure consistent performance.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 px-4 md:px-0">
          <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed">
                  Every year, millions of students appear for JEE. Most fail not because they lack intelligence, but because they lack <strong>strategy</strong>.
              </p>
              <p className="text-slate-600 leading-relaxed">
                  At <strong>IITGEEPrep</strong>, our mission is to democratize high-quality preparation tools. We believe that with the right roadmap, identifying weak areas early, and managing exam stress, any dedicated student can achieve their dream college.
              </p>
              <ul className="space-y-3 pt-2">
                  {[
                      "Data-Driven Insights over Guesswork",
                      "Holistic Growth (Academics + Mental Health)",
                      "Transparency for Parents & Guardians"
                  ].map((item, i) => (
                      <li key={i} className="flex items-center text-slate-800 font-medium">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" /> {item}
                      </li>
                  ))}
              </ul>
          </div>
          <div className="bg-slate-100 rounded-3xl p-8 h-full flex flex-col justify-center items-center text-center border border-slate-200">
              <Brain className="w-16 h-16 text-purple-500 mb-6" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Built for Aspirants, By Engineers</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                  We understand the late nights, the backlog anxiety, and the pressure. This platform is built to solve the exact problems we faced during our preparation.
              </p>
          </div>
      </div>

      {/* Supported Exams Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white mb-16 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                  <Award className="w-10 h-10 text-yellow-400" />
                  <div>
                      <h3 className="text-xl font-bold">One Platform, All Exams</h3>
                      <p className="text-slate-400 text-sm">We support tracking for all major national-level entrances.</p>
                  </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-end max-w-lg">
                  {['JEE Advanced', 'JEE Main', 'BITSAT', 'VITEEE', 'SRMJEEE', 'MET', 'WBJEE', 'MHT-CET', 'CUET', 'AMUEEE'].map((exam) => (
                      <span key={exam} className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold hover:bg-white/20 transition-colors cursor-default">
                          {exam}
                      </span>
                  ))}
              </div>
          </div>
      </div>

      {/* Comprehensive Feature Breakdown */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose IITGEEPrep?</h2>
            <p className="text-slate-600">Features designed to optimize every hour of your study time.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard 
                icon={<BookOpen className="w-6 h-6 text-blue-600" />}
                bg="bg-blue-50"
                title="Micro-Topic Syllabus Tracking"
                desc="Don't just mark chapters as done. Track progress down to specific topics and exercises (Ex-1, Ex-2). Know your coverage percentage instantly."
            />
            <FeatureCard 
                icon={<Target className="w-6 h-6 text-orange-600" />}
                bg="bg-orange-50"
                title="Mock Tests & Gap Analysis"
                desc="Attempt past papers in a real exam environment. Our analytics engine pinpoints your weak chapters so you stop losing marks on the same topics."
            />
            <FeatureCard 
                icon={<CalendarClock className="w-6 h-6 text-purple-600" />}
                bg="bg-purple-50"
                title="Smart Timetable Generator"
                desc="Confused about your schedule? Input your school hours and sleep cycle, and let our algorithm build the perfect revision routine for you."
            />
            <FeatureCard 
                icon={<BookX className="w-6 h-6 text-red-600" />}
                bg="bg-red-50"
                title="Digital Mistake Notebook"
                desc="The difference between a ranker and a repeater is how they handle mistakes. Log, tag, and review your errors to ensure 100% concept retention."
            />
            <FeatureCard 
                icon={<Zap className="w-6 h-6 text-yellow-600" />}
                bg="bg-yellow-50"
                title="Memory Hacks & Flashcards"
                desc="Forget forgetting. Access our library of high-yield mnemonics, shortcuts, and formula flashcards designed for rapid revision."
            />
            <FeatureCard 
                icon={<Heart className="w-6 h-6 text-pink-600" />}
                bg="bg-pink-50"
                title="Wellness & Focus Zone"
                desc="Exam stress is real. Use our Pomodoro timers and guided breathing exercises to stay calm, focused, and burnout-free."
            />
        </div>

        {/* Parent Feature Highlight */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-8 text-white shadow-lg mt-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="bg-white/20 p-6 rounded-full">
                    <Users className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-3">Empowering Parents</h3>
                    <p className="text-teal-50 leading-relaxed mb-4">
                        Preparation is a family effort. IITGEEPrep allows parents to securely connect to their child's account to view <strong>real-time progress reports</strong>, syllabus coverage, and test scores—without needing to nag. Support your child with data, not pressure.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Official Domain Disclaimer */}
      <div className="mt-16 text-center border-t border-slate-200 pt-10">
         <div className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 px-6 py-3 rounded-full">
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">
                Official Website: <strong>iitgeeprep.com</strong>
            </span>
         </div>
         <p className="text-xs text-slate-400 mt-4">
            IITGEEPrep is an independent educational platform and is not affiliated with the official IIT Joint Entrance Examination board or NTA.
         </p>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, bg: string, title: string, desc: string}> = ({ icon, bg, title, desc }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all hover:shadow-md group">
        <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
            {desc}
        </p>
    </div>
);

export default AboutUs;
