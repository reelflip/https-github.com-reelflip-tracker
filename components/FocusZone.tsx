
import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, Save, Lightbulb, Zap, Repeat, FileText, Brain } from 'lucide-react';

const FocusZone: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'POMODORO' | 'DEEP' | 'BREAK'>('POMODORO');
    const [showRecall, setShowRecall] = useState(false);
    const [recallText, setRecallText] = useState("");

    const modes = {
        'POMODORO': 25 * 60,
        'DEEP': 50 * 60,
        'BREAK': 5 * 60
    };

    const handleModeChange = (m: keyof typeof modes) => {
        setMode(m);
        setIsActive(false);
        setTimeLeft(modes[m]);
        setShowRecall(false);
    };

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            if (mode !== 'BREAK') {
                setShowRecall(true);
                // Play sound in real app
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const radius = 120;
    const stroke = 10;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (timeLeft / modes[mode]) * circumference;

    const studyTips = [
        {
            title: "Deep Work Protocol",
            icon: <Zap className="w-4 h-4 text-yellow-600" />,
            bg: "bg-yellow-50 border-yellow-100",
            text: "text-yellow-800",
            content: "Eliminate distractions. Work in 50-min blocks. If stuck, write it down and move on to maintain flow."
        },
        {
            title: "1/7/30 Revision Rule",
            icon: <Repeat className="w-4 h-4 text-blue-600" />,
            bg: "bg-blue-50 border-blue-100",
            text: "text-blue-800",
            content: "Revise new topics after 1 day, 7 days, and 30 days to beat the Forgetting Curve."
        },
        {
            title: "High-Yield Short Notes",
            icon: <FileText className="w-4 h-4 text-green-600" />,
            bg: "bg-green-50 border-green-100",
            text: "text-green-800",
            content: "Don't copy text. Use keywords, formulas, and diagrams. Limit 1 chapter to 1 sheet."
        },
        {
            title: "Active Recall",
            icon: <Brain className="w-4 h-4 text-purple-600" />,
            bg: "bg-purple-50 border-purple-100",
            text: "text-purple-800",
            content: "Close the book and write what you remember. Re-reading is passive; retrieval is active learning."
        }
    ];

    return (
        <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-slate-800">Focus Zone</h2>
            
            <div className="flex justify-center space-x-2 bg-slate-100 p-1 rounded-lg">
                {(Object.keys(modes) as Array<keyof typeof modes>).map(m => (
                    <button
                        key={m}
                        onClick={() => handleModeChange(m)}
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                            mode === m ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {m === 'DEEP' ? 'DEEP WORK' : m}
                    </button>
                ))}
            </div>

            <div className="relative flex items-center justify-center">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
                >
                    <circle
                        stroke="#e2e8f0"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        fill="transparent"
                    />
                    <circle
                        stroke="#2563eb"
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s linear" }}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        fill="transparent"
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-mono font-bold text-slate-800">
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="flex justify-center space-x-4">
                <button 
                    onClick={() => setIsActive(!isActive)}
                    className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 shadow-lg transition-transform hover:scale-105"
                >
                    {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                </button>
                <button 
                    onClick={() => handleModeChange(mode)}
                    className="w-16 h-16 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300"
                >
                    <RefreshCw size={24} />
                </button>
            </div>

            {/* Strategy Section */}
            <div className="pt-8 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" /> Pro Study Strategies
                </h3>
                <div className="grid grid-cols-1 gap-3 text-left">
                    {studyTips.map((tip, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border ${tip.bg} shadow-sm transition-transform hover:-translate-y-1`}>
                            <div className={`flex items-center font-bold mb-1 ${tip.text}`}>
                                <div className="p-1 rounded bg-white/50 mr-2">{tip.icon}</div>
                                <span className="text-sm">{tip.title}</span>
                            </div>
                            <p className={`text-xs ${tip.text} opacity-90 leading-relaxed`}>{tip.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            {showRecall && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95">
                        <h3 className="text-xl font-bold mb-2">Active Recall 🧠</h3>
                        <p className="text-slate-600 mb-4">Before you take a break, type down everything you just learned.</p>
                        <textarea 
                            className="w-full h-32 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="I learned about..."
                            value={recallText}
                            onChange={(e) => setRecallText(e.target.value)}
                        />
                        <button 
                            onClick={() => {
                                setShowRecall(false);
                                setRecallText("");
                                handleModeChange('BREAK');
                            }}
                            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium flex items-center justify-center"
                        >
                            <Save size={18} className="mr-2" /> Save & Start Break
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FocusZone;
