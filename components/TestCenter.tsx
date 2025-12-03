
import React, { useState, useEffect } from 'react';
import { Test, Question, TestAttempt, QuestionResult } from '../types';
import { Clock, Check, AlertCircle, Star } from 'lucide-react';

interface TestCenterProps {
  availableTests: Test[];
  attempts: TestAttempt[];
  onCompleteTest: (attempt: TestAttempt) => void;
}

const TestCenter: React.FC<TestCenterProps> = ({ availableTests, attempts, onCompleteTest }) => {
  const [activeTest, setActiveTest] = useState<Test | null>(null);

  const adminTests = availableTests.filter(t => t.category === 'ADMIN');
  const pastPapers = availableTests.filter(t => t.category === 'PAST_PAPER');

  const getBadgeStyle = (difficulty: string) => {
      switch(difficulty) {
          case 'MAINS': return 'bg-orange-100 text-orange-700';
          case 'ADVANCED': return 'bg-purple-100 text-purple-700';
          case 'CUSTOM': return 'bg-green-100 text-green-700';
          default: return 'bg-slate-100 text-slate-700';
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!activeTest ? (
        <>
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Previous Year Papers Archive</h1>
                    <p className="text-blue-100 text-lg opacity-90 max-w-2xl">Attempt actual JEE papers in a simulated NTA-style environment.</p>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
                <div className="absolute bottom-0 right-20 w-32 h-32 rounded-full bg-white opacity-10"></div>
            </div>
           
           {/* Admin Test Series */}
           {adminTests.length > 0 && (
               <section>
                   <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                       <Star className="w-5 h-5 text-yellow-500 mr-2 fill-yellow-500" /> Admin Test Series
                   </h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {adminTests.map(test => (
                            <TestCard key={test.id} test={test} onStart={() => setActiveTest(test)} badgeStyle={getBadgeStyle(test.difficulty)} />
                        ))}
                   </div>
               </section>
           )}

           {/* Official Past Papers */}
           <section>
               <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                   Official Past Papers
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pastPapers.map(test => (
                        <TestCard key={test.id} test={test} onStart={() => setActiveTest(test)} badgeStyle={getBadgeStyle(test.difficulty)} />
                    ))}
               </div>
           </section>
        </>
      ) : (
        <ActiveTestSession test={activeTest} onFinish={(results) => {
            onCompleteTest(results);
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
}

const TestCard: React.FC<TestCardProps> = ({ test, onStart, badgeStyle }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between h-full group">
        <div>
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">{test.title}</h3>
            </div>
            <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">
                    <Clock className="w-3.5 h-3.5 mr-1" /> {test.durationMinutes} Mins
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${badgeStyle}`}>
                    {test.difficulty}
                </span>
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
                status
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
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col min-h-[500px] animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                <div>
                    <h3 className="font-bold text-slate-800">Question {currentQ + 1} of {test.questions.length}</h3>
                    <span className="text-xs uppercase font-bold text-slate-400">{question.subjectId}</span>
                </div>
                <div className={`flex items-center px-3 py-1 rounded bg-slate-800 text-white font-mono ${timeLeft < 60 ? 'animate-pulse bg-red-600' : ''}`}>
                    <Clock size={16} className="mr-2" />
                    {formatTime(timeLeft)}
                </div>
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
            <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50 rounded-b-xl">
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
