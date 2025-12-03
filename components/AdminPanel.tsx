
import React, { useState } from 'react';
import { generateSQLSchema, generatePHPAuth, generateFrontendGuide } from '../services/generatorService';
import { Download, Database, Code, Users, Radio, MessageSquare, FileText, Plus, Check, Terminal, Shield, Lock, Activity } from 'lucide-react';
import { User, Question, Test, Notification } from '../types';
import { JEE_SYLLABUS } from '../constants';

interface AdminPanelProps {
    users: User[];
    questionBank: Question[];
    onAddQuestion: (q: Question) => void;
    onCreateTest: (t: Test) => void;
    onSendNotification: (n: Notification) => void;
    onSetQuote: (q: string) => void;
}

type TabView = 'BROADCAST' | 'QUESTION_BANK' | 'TEST_BUILDER' | 'SYSTEM' | 'USERS';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
    users, 
    questionBank, 
    onAddQuestion, 
    onCreateTest, 
    onSendNotification,
    onSetQuote 
}) => {
    const [view, setView] = useState<TabView>('BROADCAST');
    
    // Broadcast State
    const [notifTitle, setNotifTitle] = useState('');
    const [notifMsg, setNotifMsg] = useState('');
    const [quoteMsg, setQuoteMsg] = useState('');

    // Question Bank State
    const [qSubject, setQSubject] = useState('phys');
    const [qTopic, setQTopic] = useState('');
    const [qText, setQText] = useState('');
    const [qOptions, setQOptions] = useState(['', '', '', '']);
    const [qCorrect, setQCorrect] = useState(0);

    // Test Builder State
    const [testTitle, setTestTitle] = useState('');
    const [testDuration, setTestDuration] = useState(180);
    const [selectedQIds, setSelectedQIds] = useState<string[]>([]);
    const [testDifficulty, setTestDifficulty] = useState<'MAINS' | 'ADVANCED' | 'CUSTOM'>('CUSTOM');

    // --- Actions ---

    const submitNotification = () => {
        if (!notifTitle || !notifMsg) return;
        const newNotif: Notification = {
            id: `n_${Date.now()}`,
            title: notifTitle,
            message: notifMsg,
            date: new Date().toISOString().split('T')[0],
            type: 'INFO'
        };
        onSendNotification(newNotif);
        setNotifTitle('');
        setNotifMsg('');
        alert('Notification Sent!');
    };

    const submitQuote = () => {
        if (!quoteMsg) return;
        onSetQuote(quoteMsg);
        setQuoteMsg('');
        alert('Motivation Quote Updated!');
    };

    const submitQuestion = () => {
        if (!qText || !qTopic || qOptions.some(o => !o)) return;
        const newQ: Question = {
            id: `q_${Date.now()}`,
            subjectId: qSubject,
            topicId: qTopic,
            text: qText,
            options: [...qOptions],
            correctOptionIndex: qCorrect
        };
        onAddQuestion(newQ);
        // Reset
        setQText('');
        setQOptions(['', '', '', '']);
        alert('Question Added to Bank!');
    };

    const submitTest = () => {
        if (!testTitle || selectedQIds.length === 0) return;
        const selectedQuestions = questionBank.filter(q => selectedQIds.includes(q.id));
        const newTest: Test = {
            id: `test_${Date.now()}`,
            title: testTitle,
            durationMinutes: testDuration,
            questions: selectedQuestions,
            category: 'ADMIN',
            difficulty: testDifficulty
        };
        onCreateTest(newTest);
        // Reset
        setTestTitle('');
        setSelectedQIds([]);
        alert('Mock Test Published!');
    };

    const handleOptionChange = (idx: number, val: string) => {
        const newOpts = [...qOptions];
        newOpts[idx] = val;
        setQOptions(newOpts);
    };

    const toggleQuestionSelection = (id: string) => {
        if (selectedQIds.includes(id)) {
            setSelectedQIds(selectedQIds.filter(i => i !== id));
        } else {
            setSelectedQIds([...selectedQIds, id]);
        }
    };

    const downloadFile = (filename: string, content: string) => {
        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    // Helper to get topics for dropdown
    const availableTopics = JEE_SYLLABUS.find(s => s.id === qSubject)?.chapters.flatMap(c => c.topics) || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Admin Command Center</h2>
                        <p className="text-slate-400 text-lg max-w-xl">Manage content, users, and system configurations from a single control panel.</p>
                    </div>
                    <div className="hidden md:block bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                        <Shield className="w-10 h-10 text-blue-400" />
                    </div>
                </div>
                {/* Decor */}
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-1/3 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
            </div>
            
            {/* Nav Tabs */}
            <div className="flex p-1.5 space-x-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
                {[
                    { id: 'BROADCAST', label: 'Broadcasts', icon: Radio },
                    { id: 'QUESTION_BANK', label: 'Question Bank', icon: Database },
                    { id: 'TEST_BUILDER', label: 'Test Builder', icon: FileText },
                    { id: 'SYSTEM', label: 'System Docs', icon: Code },
                    { id: 'USERS', label: 'Users', icon: Users },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setView(tab.id as TabView)}
                        className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                            view === tab.id 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                    >
                        <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* --- View Content --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[600px]">
                
                {/* 1. BROADCASTS */}
                {view === 'BROADCAST' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
                        {/* Notifications */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="bg-blue-100 p-2 rounded-lg text-blue-600"><Radio className="w-5 h-5"/></span>
                                <h3 className="font-bold text-slate-800 text-lg">Send Notification</h3>
                            </div>
                            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-100">
                                <input 
                                    type="text" 
                                    placeholder="Title (e.g., Holiday Alert)" 
                                    className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={notifTitle}
                                    onChange={e => setNotifTitle(e.target.value)}
                                />
                                <textarea 
                                    placeholder="Message body..." 
                                    className="w-full p-3 border border-slate-200 rounded-lg text-sm h-32 resize-none focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={notifMsg}
                                    onChange={e => setNotifMsg(e.target.value)}
                                />
                                <button onClick={submitNotification} className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-transform active:scale-95">Send Broadcast</button>
                            </div>
                        </div>

                        {/* Motivation */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="bg-purple-100 p-2 rounded-lg text-purple-600"><Activity className="w-5 h-5"/></span>
                                <h3 className="font-bold text-slate-800 text-lg">Set Daily Quote</h3>
                            </div>
                            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-100 h-full">
                                <textarea 
                                    placeholder="Enter a motivational quote to appear on student dashboards..." 
                                    className="w-full p-3 border border-slate-200 rounded-lg text-sm h-32 resize-none focus:ring-2 focus:ring-purple-100 outline-none"
                                    value={quoteMsg}
                                    onChange={e => setQuoteMsg(e.target.value)}
                                />
                                <button onClick={submitQuote} className="w-full bg-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 transition-transform active:scale-95">Update Dashboard</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. QUESTION BANK */}
                {view === 'QUESTION_BANK' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Database className="w-4 h-4 mr-2"/> Add New Question</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                                    <select 
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white"
                                        value={qSubject}
                                        onChange={e => { setQSubject(e.target.value); setQTopic(''); }}
                                    >
                                        <option value="phys">Physics</option>
                                        <option value="chem">Chemistry</option>
                                        <option value="math">Mathematics</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Topic</label>
                                    <select 
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white"
                                        value={qTopic}
                                        onChange={e => setQTopic(e.target.value)}
                                    >
                                        <option value="">Select Topic</option>
                                        {availableTopics.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question Text</label>
                                <textarea 
                                    className="w-full p-3 border border-slate-200 rounded-lg text-sm h-24 bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="Type the question here..."
                                    value={qText}
                                    onChange={e => setQText(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {[0, 1, 2, 3].map(idx => (
                                    <div key={idx} className="flex items-center space-x-2">
                                        <div className="flex items-center justify-center">
                                            <input 
                                                type="radio" 
                                                name="correctOpt" 
                                                checked={qCorrect === idx} 
                                                onChange={() => setQCorrect(idx)}
                                                className="w-5 h-5 text-green-600 focus:ring-green-500 cursor-pointer"
                                            />
                                        </div>
                                        <input 
                                            type="text" 
                                            className={`w-full p-2.5 border rounded-lg text-sm transition-colors ${qCorrect === idx ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-white'}`}
                                            placeholder={`Option ${idx + 1}`}
                                            value={qOptions[idx]}
                                            onChange={e => handleOptionChange(idx, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button onClick={submitQuestion} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-slate-800 flex items-center shadow-lg transition-transform active:scale-95">
                                <Plus className="w-4 h-4 mr-2" /> Add to Bank
                            </button>
                        </div>

                        <div className="mt-8 border-t border-slate-100 pt-6">
                            <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between">
                                <span>Existing Questions</span>
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{questionBank.length} Total</span>
                            </h3>
                            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {questionBank.slice().reverse().map(q => (
                                    <div key={q.id} className="p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors shadow-sm group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                                q.subjectId === 'phys' ? 'bg-purple-100 text-purple-700' :
                                                q.subjectId === 'chem' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {q.subjectId === 'phys' ? 'Physics' : q.subjectId === 'chem' ? 'Chemistry' : 'Maths'}
                                            </span>
                                        </div>
                                        <span className="font-medium text-slate-800 block text-sm">{q.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. TEST BUILDER */}
                {view === 'TEST_BUILDER' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                             <h3 className="font-bold text-slate-800 mb-4 flex items-center"><FileText className="w-4 h-4 mr-2"/> Create New Mock Test</h3>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Test Title</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                        placeholder="e.g., Weekly Physics Mock 3"
                                        value={testTitle}
                                        onChange={e => setTestTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration (Mins)</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                        value={testDuration}
                                        onChange={e => setTestDuration(parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Difficulty Badge</label>
                                 <select 
                                    className="w-full md:w-1/3 p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={testDifficulty}
                                    onChange={e => setTestDifficulty(e.target.value as any)}
                                >
                                    <option value="CUSTOM">Custom / Standard</option>
                                    <option value="MAINS">JEE Mains Level</option>
                                    <option value="ADVANCED">JEE Advanced Level</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col h-[500px]">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase">Select Questions ({selectedQIds.length})</label>
                                <span className="text-xs text-slate-400">Total Available: {questionBank.length}</span>
                            </div>
                            <div className="flex-1 border border-slate-200 rounded-xl overflow-y-auto p-4 space-y-2 bg-slate-50 custom-scrollbar">
                                {questionBank.map(q => (
                                    <div 
                                        key={q.id} 
                                        onClick={() => toggleQuestionSelection(q.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 hover:shadow-sm ${
                                            selectedQIds.includes(q.id) 
                                            ? 'bg-blue-50 border-blue-400 shadow-inner' 
                                            : 'bg-white border-slate-200 hover:border-blue-200'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                            selectedQIds.includes(q.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'
                                        }`}>
                                            {selectedQIds.includes(q.id) && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${selectedQIds.includes(q.id) ? 'text-blue-900' : 'text-slate-700'}`}>{q.text}</p>
                                            <div className="mt-2 flex space-x-2">
                                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold">{q.subjectId}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button onClick={submitTest} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-transform active:scale-[0.99] flex items-center justify-center">
                            <Shield className="w-5 h-5 mr-2" /> Publish Test to Students
                        </button>
                    </div>
                )}

                {/* 4. SYSTEM DOCS */}
                {view === 'SYSTEM' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                        {/* SQL Schema */}
                        <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl overflow-hidden shadow-lg font-mono text-xs border border-slate-800">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                                <h3 className="text-white font-bold flex items-center"><Database className="mr-2 w-4 h-4 text-green-400"/> MySQL Schema</h3>
                                <button 
                                    onClick={() => downloadFile('database.sql', generateSQLSchema())}
                                    className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded flex items-center transition-colors border border-slate-600"
                                >
                                    <Download className="w-3 h-3 mr-1" /> Download
                                </button>
                            </div>
                            <pre className="overflow-x-auto h-48 text-green-400 no-scrollbar p-2 bg-black/20 rounded-lg">
                                {generateSQLSchema()}
                            </pre>
                        </div>

                        {/* PHP Backend */}
                        <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl overflow-hidden shadow-lg font-mono text-xs border border-slate-800">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                                <h3 className="text-white font-bold flex items-center"><Code className="mr-2 w-4 h-4 text-purple-400"/> PHP Backend API</h3>
                                <button 
                                    onClick={() => downloadFile('api_scripts.php', generatePHPAuth())}
                                    className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded flex items-center transition-colors border border-slate-600"
                                >
                                    <Download className="w-3 h-3 mr-1" /> Download
                                </button>
                            </div>
                            <pre className="overflow-x-auto h-48 text-purple-400 no-scrollbar p-2 bg-black/20 rounded-lg">
                                {generatePHPAuth()}
                            </pre>
                        </div>
                        
                        {/* Integration Guide */}
                        <div className="md:col-span-2 bg-slate-800 text-slate-300 p-6 rounded-2xl overflow-hidden shadow-xl font-mono text-xs border border-slate-700">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                                <h3 className="text-white font-bold flex items-center"><Terminal className="mr-2 w-4 h-4 text-blue-400"/> Developer Integration Guide</h3>
                                <button 
                                    onClick={() => downloadFile('INTEGRATION_GUIDE.md', generateFrontendGuide())}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded flex items-center shadow-lg transition-colors"
                                >
                                    <Download className="w-3 h-3 mr-1" /> Download Guide
                                </button>
                            </div>
                            <div className="p-3 bg-blue-900/20 rounded border border-blue-500/30 mb-4">
                                <p className="text-blue-300 font-sans text-sm">Follow these steps to connect this React App to the PHP/MySQL backend after deployment.</p>
                            </div>
                            <pre className="overflow-x-auto h-80 text-slate-300 whitespace-pre-wrap no-scrollbar p-4 bg-black/40 rounded-xl border border-slate-700/50">
                                {generateFrontendGuide()}
                            </pre>
                        </div>
                    </div>
                )}

                {/* 5. USER MANAGEMENT */}
                {view === 'USERS' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User Profile</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mr-3">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div className="text-sm font-bold text-slate-900">{u.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                u.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-red-100' :
                                                u.role === 'STUDENT' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-green-50 text-green-700 border-green-100'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">{u.email}</td>
                                        <td className="px-6 py-4 text-right text-sm text-blue-600 hover:text-blue-800 font-bold cursor-pointer">Manage</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
