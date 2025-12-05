
import React from 'react';
import { BookOpen, Target, Lightbulb, Heart, Shield, CalendarClock, BookX, Users, Globe, Award, Zap, Brain, CheckCircle2, TrendingUp, BarChart } from 'lucide-react';
import SEO from './SEO';

const AboutUs: React.FC = () => {
  // Structured Data for SEO
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "IITGEEPrep",
      "alternateName": "IIT JEE Preparation Tracker",
      "url": "https://iitgeeprep.com",
      "logo": "https://iitgeeprep.com/assets/logo.png",
      "description": "Comprehensive IIT JEE preparation platform featuring syllabus tracking, mock tests, and intelligent study planners for engineering entrance exams.",
      "foundingDate": "2024",
      "offers": {
        "@type": "Offer",
        "category": "Education",
        "description": "Free tools for JEE Main, Advanced, BITSAT, and VITEEE aspirants."
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 pb-10">
      <SEO 
        title="About IITGEEPrep - Ultimate IIT JEE Preparation & Study Planner" 
        description="IITGEEPrep is your all-in-one companion for engineering entrance exams. Features include a detailed syllabus tracker, realistic mock tests, analytics, and a custom study planner for JEE Main, Advanced, and BITSAT."
        schema={aboutSchema}
      />
      
      {/* Hero Section */}
      <div className="text-center py-12 md:py-16 space-y-6 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">IIT JEE Preparation</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            <strong>IITGEEPrep</strong> provides the digital infrastructure for serious engineering aspirants. We combine an advanced <strong>syllabus tracker</strong>, high-yield <strong>mock tests</strong>, and data-driven insights to help you crack India's toughest entrance exams.
        </p>
      </div>

      {/* Brand Identity / Philosophy */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm mb-16 relative overflow-hidden mx-4 md:mx-0">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <TrendingUp className="w-64 h-64 text-blue-600" />
        </div>
        
        <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">The IITGEEPrep Philosophy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 transition-transform hover:-translate-y-1 duration-300">
                    <span className="text-4xl font-black text-blue-600 block mb-2">IIT</span>
                    <h3 className="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-3">Targeting Excellence</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        Focused on the rigor required for the <strong>Indian Institutes of Technology</strong>. We provide the depth needed for JEE Advanced.
                    </p>
                </div>
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 transition-transform hover:-translate-y-1 duration-300">
                    <span className="text-4xl font-black text-orange-500 block mb-2">GEE</span>
                    <h3 className="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-3">General Engineering Education</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        Beyond IITs, we cover all major <strong>engineering entrance exams</strong> like BITSAT, VITEEE, and MET to ensure you have options.
                    </p>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 transition-transform hover:-translate-y-1 duration-300">
                    <span className="text-4xl font-black text-green-600 block mb-2">Prep</span>
                    <h3 className="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-3">Strategic Preparation</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        Moving beyond rote learning. We use <strong>analytics and study planners</strong> to optimize your routine for maximum output.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Feature Breakdown for SEO Keywords */}
      <div className="space-y-12 mb-16 px-4 md:px-0">
        <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tools for Engineering Success</h2>
            <p className="text-slate-600">Our platform is built around the core pillars of effective exam preparation.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard 
                icon={<BookOpen className="w-6 h-6 text-blue-600" />}
                bg="bg-blue-50"
                title="Syllabus Tracker & Progress"
                desc="A granular syllabus tracker for Physics, Chemistry, and Maths. Mark topics as complete, track exercises (Ex-1, Ex-2), and visualize your coverage percentage instantly."
            />
            <FeatureCard 
                icon={<Target className="w-6 h-6 text-orange-600" />}
                bg="bg-orange-50"
                title="Mock Tests & Question Bank"
                desc="Practice with realistic mock tests based on previous year patterns. Access a question bank of 100+ high-yield problems to test your concepts under time pressure."
            />
            <FeatureCard 
                icon={<CalendarClock className="w-6 h-6 text-purple-600" />}
                bg="bg-purple-50"
                title="Intelligent Study Planner"
                desc="Struggling with time management? Our study planner generates a personalized timetable based on your school hours and sleep cycle to maximize productivity."
            />
            <FeatureCard 
                icon={<BarChart className="w-6 h-6 text-indigo-600" />}
                bg="bg-indigo-50"
                title="Performance Analytics"
                desc="Identify your weak areas before the exam. Our analytics engine breaks down your test performance by topic and subject to enable targeted revision."
            />
            <FeatureCard 
                icon={<BookX className="w-6 h-6 text-red-600" />}
                bg="bg-red-50"
                title="Mistake Notebook"
                desc="The secret weapon of toppers. Log every incorrect answer, tag the error type (Conceptual, Silly, Calculation), and review them to prevent repetition."
            />
            <FeatureCard 
                icon={<Heart className="w-6 h-6 text-pink-600" />}
                bg="bg-pink-50"
                title="Wellness & Focus Tools"
                desc="Exam stress management is crucial. Use our Focus Zone (Pomodoro) and guided breathing exercises to stay calm and maintain peak mental health."
            />
        </div>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 px-4 md:px-0">
          <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Why IITGEEPrep?</h2>
              <p className="text-slate-600 leading-relaxed">
                  The journey to an IIT or NIT is a marathon, not a sprint. Most students fail not due to a lack of effort, but due to a lack of <strong>structured planning</strong>.
              </p>
              <p className="text-slate-600 leading-relaxed">
                  We empower students with data. By tracking every hour spent and every question solved, we turn the chaotic JEE preparation process into a measurable, manageable science.
              </p>
              <ul className="space-y-3 pt-2">
                  {[
                      "Designed by Engineers for Aspirants",
                      "Supports JEE Main, Advanced, BITSAT & More",
                      "Free Access to Premium Tracking Tools"
                  ].map((item, i) => (
                      <li key={i} className="flex items-center text-slate-800 font-medium">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" /> {item}
                      </li>
                  ))}
              </ul>
          </div>
          <div className="bg-slate-100 rounded-3xl p-8 h-full flex flex-col justify-center items-center text-center border border-slate-200 shadow-inner">
              <Brain className="w-16 h-16 text-purple-500 mb-6" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Focus on Concepts</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                  "Don't just memorize formulas. Understand the derivation. Track your depth, not just your speed."
              </p>
          </div>
      </div>

      {/* Supported Exams Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white mb-16 shadow-xl mx-4 md:mx-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                  <Award className="w-10 h-10 text-yellow-400" />
                  <div>
                      <h3 className="text-xl font-bold">Supported Entrance Exams</h3>
                      <p className="text-slate-400 text-sm">We provide guidance for all major national engineering tests.</p>
                  </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-end max-w-lg">
                  {['JEE Advanced', 'JEE Main', 'BITSAT', 'VITEEE', 'SRMJEEE', 'MET', 'WBJEE', 'MHT-CET', 'CUET', 'AMUEEE'].map((exam) => (
                      <span key={exam} className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold hover:bg-white/20 transition-colors cursor-default border border-white/10">
                          {exam}
                      </span>
                  ))}
              </div>
          </div>
      </div>

      {/* Parent Feature Highlight */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-8 text-white shadow-lg mt-8 mx-4 md:mx-0">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="bg-white/20 p-6 rounded-full">
                    <Users className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-3">Empowering Parents</h3>
                    <p className="text-teal-50 leading-relaxed mb-4">
                        Preparation is a family effort. IITGEEPrep allows parents to securely connect to their child's account to view <strong>real-time progress reports</strong>, syllabus coverage, and mock test scores—without needing to nag. Support your child with data, not pressure.
                    </p>
                </div>
            </div>
        </div>

      {/* Official Domain Disclaimer */}
      <div className="mt-16 text-center border-t border-slate-200 pt-10 px-4">
         <div className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 px-6 py-3 rounded-full">
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">
                Official Website: <strong>iitgeeprep.com</strong>
            </span>
         </div>
         <p className="text-xs text-slate-400 mt-4 max-w-lg mx-auto">
            IITGEEPrep is an independent educational platform and is not affiliated with the official IIT Joint Entrance Examination board, NTA, or any specific coaching institute.
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
