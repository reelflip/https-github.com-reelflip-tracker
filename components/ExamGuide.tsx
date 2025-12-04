
import React from 'react';
import { Flame, Target, BookOpen, Zap, Award, BarChart3, Building, Calendar, ArrowRight, Layers, Globe, GraduationCap } from 'lucide-react';
import SEO from './SEO';
import { EXAM_COMPARISON_DATA } from '../constants';

const ExamGuide: React.FC = () => {
  const exams = EXAM_COMPARISON_DATA;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-10">
      <SEO title="Exam Guide" description="Compare difficulty, colleges, and dates for JEE, BITSAT, VITEEE and other exams." />
      
      {/* Header */}
      <div className="text-center space-y-4 py-8">
         <h1 className="text-4xl font-bold text-slate-900">Know Your Battlefield</h1>
         <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A comprehensive guide to difficulty levels, target colleges, and exam schedules for 2025.
         </p>
      </div>

      {/* The 3 Tiers of Exams */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1 */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Award className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                  <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
                      <Globe className="w-6 h-6 text-blue-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">The National Giants</h3>
                  <p className="text-sm text-slate-300 mb-4">
                      JEE Main & Advanced. These are the gold standard. They open doors to IITs and NITs, the most prestigious institutes in India.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1">
                      <li className="flex items-center"><Target className="w-3 h-3 mr-2 text-green-400"/> Highest Competition</li>
                      <li className="flex items-center"><Target className="w-3 h-3 mr-2 text-green-400"/> Lowest Acceptance Rate</li>
                  </ul>
              </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                  <Building className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Premium Private</h3>
              <p className="text-sm text-slate-500 mb-4">
                  BITSAT, VITEEE, MET. These universities offer world-class infrastructure and placements, often rivaling top NITs.
              </p>
              <ul className="text-xs text-slate-400 space-y-1">
                  <li className="flex items-center"><Zap className="w-3 h-3 mr-2 text-purple-500"/> Speed-based Exams</li>
                  <li className="flex items-center"><Zap className="w-3 h-3 mr-2 text-purple-500"/> No Reservation (mostly)</li>
              </ul>
          </div>

          {/* Tier 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-green-600">
                  <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">State & Central</h3>
              <p className="text-sm text-slate-500 mb-4">
                  MHT-CET, WBJEE, CUET. Excellent for securing seats in top state government colleges with lower fees.
              </p>
              <ul className="text-xs text-slate-400 space-y-1">
                  <li className="flex items-center"><Layers className="w-3 h-3 mr-2 text-green-500"/> Regional Focus</li>
                  <li className="flex items-center"><Layers className="w-3 h-3 mr-2 text-green-500"/> Moderate Difficulty</li>
              </ul>
          </div>
      </div>

      {/* Main Comparison Table Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
         <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
             <div className="flex items-center space-x-3">
                 <BarChart3 className="w-6 h-6 text-yellow-400" />
                 <h2 className="text-xl font-bold">Exam Comparison Matrix</h2>
             </div>
             <div className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                 Updated for 2025 Cycle
             </div>
         </div>
         
         <div className="divide-y divide-slate-100">
             {exams.map((exam, idx) => (
                 <div 
                    key={idx} 
                    className={`
                        p-6 transition-all duration-300 group border-l-[6px] 
                        ${exam.borderColor} ${exam.hoverBg} hover:shadow-md hover:scale-[1.005] cursor-default
                    `}
                 >
                     <div className="flex flex-col lg:flex-row gap-6">
                         
                         {/* LEFT: Exam Name & Difficulty (25%) */}
                         <div className="w-full lg:w-1/4 shrink-0">
                             <div className="flex items-center justify-between lg:block">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center group-hover:text-slate-900 transition-colors">
                                        {exam.name}
                                        {idx === 0 && <Award className="w-4 h-4 ml-2 text-yellow-500 fill-yellow-500" />}
                                    </h3>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border inline-block ${exam.color}`}>
                                        {idx < 2 ? 'National Tier 1' : 'University Level'}
                                    </span>
                                </div>
                                
                                <div className="lg:mt-4 text-right lg:text-left">
                                    <div className="flex items-center space-x-1 mb-1.5 lg:justify-start justify-end">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Difficulty</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Flame 
                                                    key={i} 
                                                    className={`w-3.5 h-3.5 ${i < exam.difficulty ? 'text-orange-500 fill-orange-500' : 'text-slate-200'}`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-32 lg:w-full bg-slate-100 rounded-full overflow-hidden ml-auto lg:ml-0">
                                        <div 
                                            className={`h-full ${exam.barColor} rounded-full`} 
                                            style={{ width: `${(exam.difficulty / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                             </div>
                         </div>

                         {/* MIDDLE: Strategy (35%) */}
                         <div className="w-full lg:w-1/3 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                             <div className="flex items-start space-x-2 mb-2">
                                 <Zap className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                 <p className="text-sm font-bold text-slate-800">{exam.focus}</p>
                             </div>
                             <p className="text-sm text-slate-500 leading-relaxed pl-6">
                                 {exam.desc}
                             </p>
                         </div>

                         {/* RIGHT: Logistics (40%) */}
                         <div className="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 space-y-3">
                             <div className="flex items-start">
                                <Building className="w-4 h-4 text-slate-400 mt-0.5 mr-2 shrink-0 group-hover:text-slate-600 transition-colors" />
                                <div>
                                    <span className="text-xs font-bold text-slate-500 uppercase block">Target Colleges</span>
                                    <p className="text-sm text-slate-700 font-medium">{exam.colleges}</p>
                                </div>
                             </div>
                             <div className="flex items-start">
                                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 mr-2 shrink-0 group-hover:text-slate-600 transition-colors" />
                                <div>
                                    <span className="text-xs font-bold text-slate-500 uppercase block">Exam Months</span>
                                    <p className="text-sm text-slate-700">{exam.dates}</p>
                                </div>
                             </div>
                         </div>

                     </div>
                 </div>
             ))}
         </div>
      </div>

      {/* Key Takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-red-800 mb-2 flex items-center">
                  <Target className="w-5 h-5 mr-2" /> For JEE Advanced
              </h3>
              <p className="text-sm text-red-700/80">
                  Focus on <strong>Depth</strong>. Do not solve 100 easy questions. Solve 10 hard questions that combine multiple concepts (e.g. Rotation + Electrostatics).
              </p>
          </div>
          
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-orange-800 mb-2 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" /> For JEE Main / BITSAT
              </h3>
              <p className="text-sm text-orange-700/80">
                  Focus on <strong>Coverage & Speed</strong>. You cannot afford to leave any chapter. Memorize standard formulas and NCERT facts (especially Chemistry).
              </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                  <Zap className="w-5 h-5 mr-2" /> For VIT / SRM / MET
              </h3>
              <p className="text-sm text-blue-700/80">
                  Focus on <strong>Accuracy</strong>. Questions are direct formula application. The challenge is to not make silly calculation mistakes under time pressure.
              </p>
          </div>
      </div>
    </div>
  );
};

export default ExamGuide;
