

import React, { useState, useEffect } from 'react';
import { Test, Question, TestAttempt, QuestionResult, User } from '../types';
import { Clock, Check, AlertCircle, Star, Filter, Target, Zap, Globe, Layers, Eye, EyeOff, RotateCcw, BarChart2, ArrowRight } from 'lucide-react';

interface TestCenterProps {
  availableTests: Test[];
  attempts: TestAttempt[];
  onCompleteTest: (attempt: TestAttempt) => void;
  user?: User | null;
}

const TestCenter: React.FC<TestCenterProps> = ({ availableTests, attempts, onCompleteTest, user }) => {
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [activeTab, setActiveTab] = useState<'JEE' | 'BITSAT' | 'VITEEE' | 'OTHER' | 'ADMIN'>('JEE');
  const [showAllExams, setShowAllExams] = useState(false);
  
  // New State for Result Summary View
  const [lastAttempt, setLastAttempt] = useState<TestAttempt | null>(null);

  // Set default tab based on user's target exam
  useEffect(() => {
      if (user?.targetExam) {
          if (user.targetExam.includes('JEE')) setActiveTab('JEE');
          else if (user.targetExam.includes('BITSAT')) setActiveTab('BITSAT');
          else if (user.targetExam.includes('VITEEE')) setActiveTab('VITEEE');
      }
  }, [user]);

  // Determine if we should restrict visibility
  const isTargetJEE = user?.targetExam?.includes('JEE');
  
  // Filter tests based on active tab
  const displayTests = availableTests.filter(t => {
      if (activeTab === 'ADMIN') return t.category === 'ADMIN';
      if (t.category === 'ADMIN') return false; // Don't show admin tests in other tabs

      if (activeTab === 'JEE') return t.examType === 'JEE' || !t.examType; // Default to JEE if no type
      if (activeTab === 'BITSAT') return t.examType === 'BITSAT';
      if (activeTab === 'VITEEE') return t.examType === 'VITEEE';
      if (activeTab === 'OTHER') return ['MET', 'SRMJEEE', 'OTHER', 'AMUEEE'].includes(t.examType || '');
      return false;
  });

  const getBadgeStyle = (difficulty: string) => {
      switch(difficulty) {
          case 'MAINS': return 'bg-orange-100 text-orange-700 border-orange-200';
          case 'ADVANCED': return 'bg-purple-100 text-purple-700 border-purple-200';
          case 'CUSTOM': return 'bg-green-100 text-green-700 border-green-200';
          default: return 'bg-slate-100 text-slate-700 border-slate-200';
      }
  };

  const getExamColor = (type?: string) => {
      switch(type) {
          case 'BITSAT': return 'text-purple-600 bg-purple-50 border-purple-200';
          case 'VITEEE': return 'text-cyan-600 bg-cyan-50 border-cyan-200';
          case 'MET': return 'text-blue-600 bg-blue-50 border-blue-200';
          case 'SRMJEEE': return 'text-teal-600 bg-teal-50 border-teal-200';
          default: return 'text-slate-600 bg-slate-50 border-slate-200';
      }
  };

  const allTabs = [
      { id: 'JEE', label: 'JEE Main & Adv', icon: Target },
      { id: 'BITSAT', label: 'BITSAT', icon: Zap },
      { id: 'VITEEE', label: 'VITEEE', icon: Layers },
      { id: 'OTHER', label: 'Other Exams', icon: Globe },
      { id: 'ADMIN', label: 'Custom / Admin', icon: Star },
  ];

  // If user is strictly JEE and hasn't opted to show all, hide BITSAT/VITEEE etc.
  const visibleTabs = (!showAllExams && isTargetJEE) 
      ? allTabs.filter(t => t.id === 'JEE' || t.id === 'ADMIN')
      : allTabs;

  if (lastAttempt) {
      return (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 py-10">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-center">
                  <div className="bg-slate-900 p-8 text-white">
                      <div className="inline-flex p-4 bg-white/10 rounded-full mb-4">
                          <Target className="w-12 h-12 text-green-400" />
                      </div>
                      <h2 className="text-3xl font-bold mb-2">Test Completed!</h2>
                      <p className="text-slate-400">Your results have been saved.</p>
                  </div>
                  <div className="p-8">
                      <div className="grid grid-cols-3 gap-4 mb-8">
                          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                              <p className="text-xs font-bold text-blue-600 uppercase mb-1">Score</p>
                              <p className="text-3xl font-black text-slate-800">{lastAttempt.score}</p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                              <p className="text-xs font-bold text-green-600 uppercase mb-1">Accuracy</p>
                              <p className="text-3xl font-black text-slate-800">{lastAttempt.accuracy_percent}%</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Attempted</p>
                              <p className="text-3xl font-black text-slate-800">{lastAttempt.totalQuestions - lastAttempt.unattemptedCount}/{lastAttempt.totalQuestions}</p>
                          </div>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                          <button 
                              onClick={() => { setLastAttempt(null); }}
                              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center"
                          >
                              <RotateCcw className="w-4 h-4 mr-2" /> Take Another Test
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!activeTest ? (
        <>
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Exam Archive & Mock Center</h1>
                    <p className="text-blue-100 text-lg opacity-90 max-w-2xl">
                        {isTargetJEE && !showAllExams 
                            ? "Focused Mode: Showing relevant JEE Main & Advanced Papers." 
                            : "Attempt past year papers and mock tests for various engineering exams."}
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
                <div className="absolute bottom-0 right-20 w-32 h-32 rounded-full bg-white opacity-10"></div>
            </div>
           
           {/* Exam Tabs & Toggle */}
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
                   {visibleTabs.map(tab => (
                       <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                                flex items-center px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all
                                ${activeTab === tab.id 
                                    ? 'bg-slate-900 text-white shadow-md transform scale-[1.02]' 
                                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                                }
                            `}
                       >
                           <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-400'}`} />
                           {tab.label}
                       </button>
                   ))}
               </div>
               
               {isTargetJEE && (
                   <button 
                       onClick={() => setShowAllExams(!showAllExams)}
                       className="text-xs font-bold text-slate-500 flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
                   >
                       {showAllExams ? <EyeOff className="w-3 h-3 mr-1"/> : <Eye className="w-3 h-3 mr-1"/>}
                       {showAllExams ? "Focus on My Target" : "Show All Exams"}
                   </button>
               )}
           </div>

           {/* Test Grid */}
           <div className="min-h-[300px]">
               {displayTests.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayTests.map(test => (
                            <TestCard 
                                key={test.id} 
                                test={test} 
                                onStart={() => setActiveTest(test)} 
                                badgeStyle={getBadgeStyle(test.difficulty)}
                                examStyle={getExamColor(test.examType)}
                            />
                        ))}
                   </div>
               ) : (
                   <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-dashed border-slate-300">
                       <Filter className="w-10 h-10 text-slate-300 mb-2" />
                       <p className="text-slate-500 font-medium">No tests found for this category.</p>
                       <p className="text-xs text-slate-400 mt-1">Try switching tabs or check back later.</p>
                   </div>
               )}
           </div>
        </>
      ) : (
        <ActiveTestSession test={activeTest} onFinish={(results) => {
            onCompleteTest(results);
            setLastAttempt(results);
            setActiveTest(null);
        }} />
      )}
    </div>
  );
};

interface TestCardProps {
    test: Test;
    onStart: () => void;
    badgeStyle: string;
    examStyle: string;
}

const TestCard: React.FC<TestCardProps> = ({ test, onStart, badgeStyle, examStyle }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between h-full group">
        <div>
            <div className="flex justify-between items-start mb-3">
                <div className="space-y-2">
                    {test.examType && test.examType !== 'JEE' && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${examStyle}`}>
                            {test.examType}
                        </span>
                    )}
                    <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                        {test.title}
                    </h3>
                </div>
            </div>
            <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">
                    <Clock className="w-3.5 h-3.5 mr-1" /> {test.durationMinutes} Mins
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border ${badgeStyle}`}>
                    {test.difficulty}
                </span>
                <span className="text-[10px] text-slate-400">{test.questions?.length || 0} Questions</span>
            </div>
        </div>
        <button 
            onClick={onStart}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 active:transform active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
        >
            Start
        </button>
    </div>
);

const ActiveTestSession = ({ test, onFinish }: { test: Test, onFinish: (r: TestAttempt) => void }) => {
    const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [currentQ, setCurrentQ] = useState(0);

    // Calculate progress
    const totalQuestions = test.questions.length;
    const answeredCount = Object.keys(answers).length;
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    submitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAnswer = (optionIdx: number) => {
        setAnswers(prev => ({ ...prev, [test.questions[currentQ].id]: optionIdx }));
    };

    const submitTest = () => {
        let score = 0;
        let correct = 0;
        let incorrect = 0;
        let unattempted = 0;
        
        // Track granular results for analytics
        const detailedResults: QuestionResult[] = [];

        test.questions.forEach(q => {
            const ans = answers[q.id];
            let status: QuestionResult['status'] = 'UNATTEMPTED';

            if (ans === undefined) {
                unattempted++;
                status = 'UNATTEMPTED';
            } else if (ans === q.correctOptionIndex) {
                score += 4;
                correct++;
                status = 'CORRECT';
            } else {
                score -= 1;
                incorrect++;
                status = 'INCORRECT';
            }

            detailedResults.push({
                questionId: q.id,
                subjectId: q.subjectId,
                topicId: q.topicId,
                status,
                selectedOptionIndex: ans // Save what they clicked (undefined if unattempted)
            });
        });

        const attempt: TestAttempt = {
            id: Date.now().toString(),
            testId: test.id,
            studentId: 'current',
            date: new Date().toISOString(),
            score,
            totalQuestions: test.questions.length,
            correctCount: correct,
            incorrectCount: incorrect,
            unattemptedCount: unattempted,
            accuracy_percent: correct + incorrect > 0 ? Number(((correct / (correct + incorrect)) * 100).toFixed(2)) : 0,
            detailedResults
        };
        onFinish(attempt);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const question = test.questions[currentQ];

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col min-h-[500px] animate-in zoom-in-95 duration-300 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div>
                    <h3 className="font-bold text-slate-800">Question {currentQ + 1} of {test.questions.length}</h3>
                    <span className="text-xs uppercase font-bold text-slate-400">{question.subjectId}</span>
                </div>
                <div className={`flex items-center px-3 py-1 rounded bg-slate-800 text-white font-mono ${timeLeft < 60 ? 'animate-pulse bg-red-600' : ''}`}>
                    <Clock size={16} className="mr-2" />
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5" title={`${answeredCount} answered out of ${totalQuestions}`}>
                <div 
                    className="bg-blue-600 h-1.5 transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercent}%` }} 
                />
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
                <p className="text-lg font-medium text-slate-800 mb-6 leading-relaxed">{question.text}</p>
                
                <div className="space-y-3">
                    {question.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center ${
                                answers[question.id] === idx 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                    : 'border-slate-100 hover:border-slate-300'
                            }`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                                answers[question.id] === idx ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300'
                            }`}>
                                {answers[question.id] === idx && <Check size={14} />}
                            </div>
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
                <button 
                    disabled={currentQ === 0}
                    onClick={() => setCurrentQ(prev => prev - 1)}
                    className="px-4 py-2 rounded text-slate-600 hover:bg-slate-200 disabled:opacity-50 font-medium"
                >
                    Previous
                </button>
                
                {currentQ < test.questions.length - 1 ? (
                    <button 
                        onClick={() => setCurrentQ(prev => prev + 1)}
                        className="px-6 py-2 bg-slate-800 text-white rounded font-medium hover:bg-slate-700"
                    >
                        Next
                    </button>
                ) : (
                    <button 
                        onClick={submitTest}
                        className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 flex items-center shadow-lg shadow-green-200"
                    >
                        Submit Test <AlertCircle size={16} className="ml-2" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default TestCenter;