
import React, { useState, useEffect } from 'react';
import { Database, Users, Radio, FileText, Plus, Check, Shield, Trash2, X, AlertOctagon, Save, Inbox, CheckCircle2, PenTool } from 'lucide-react';
import { User, Question, Test, Notification, Quote, ContactMessage, BlogPost } from '../types';
import { JEE_SYLLABUS } from '../constants';

interface AdminPanelProps {
    section: 'users' | 'content' | 'tests';
    users: User[];
    questionBank: Question[];
    quotes: Quote[];
    activeTab: string; // From parent (sidebar state)
    onTabChange: (tab: string) => void;
    onAddQuestion: (q: Question) => void;
    onCreateTest: (t: Test) => void;
    onSendNotification: (n: Notification) => void;
    onAddQuote: (text: string, author: string) => void;
    onDeleteQuote: (id: string) => void;
    onUpdateUser?: (user: Partial<User>) => void;
    onDeleteUser?: (id: string) => void;
    contactMessages?: ContactMessage[];
    onDeleteContact?: (id: number) => void;
    blogPosts?: BlogPost[];
    onAddBlogPost?: (post: BlogPost) => void;
    onDeleteBlogPost?: (id: string) => void;
}

type TabView = 'BROADCAST' | 'QUESTION_BANK' | 'TEST_BUILDER' | 'USERS' | 'INBOX' | 'BLOG_EDITOR';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
    section,
    users, 
    questionBank, 
    quotes,
    activeTab,
    onTabChange,
    onAddQuestion, 
    onCreateTest, 
    onSendNotification,
    onAddQuote,
    onDeleteQuote,
    onUpdateUser,
    onDeleteUser,
    contactMessages = [],
    onDeleteContact,
    blogPosts = [],
    onAddBlogPost,
    onDeleteBlogPost
}) => {
    const [view, setView] = useState<TabView>('BROADCAST');
    
    // Reset view when section changes
    useEffect(() => {
        if (section === 'users') setView('USERS');
        if (section === 'content') setView('BROADCAST');
        if (section === 'tests') setView('QUESTION_BANK');
    }, [section]);

    // User Management State
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<User>>({});

    // Broadcast State
    const [notifTitle, setNotifTitle] = useState('');
    const [notifMsg, setNotifMsg] = useState('');
    const [quoteMsg, setQuoteMsg] = useState('');
    const [quoteAuthor, setQuoteAuthor] = useState('');

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
    const [testExamType, setTestExamType] = useState<'JEE' | 'BITSAT' | 'VITEEE' | 'MET' | 'SRMJEEE' | 'OTHER'>('JEE');
    const [testSuccessMsg, setTestSuccessMsg] = useState('');

    // Blog Editor State
    const [blogTitle, setBlogTitle] = useState('');
    const [blogExcerpt, setBlogExcerpt] = useState('');
    const [blogContent, setBlogContent] = useState('');
    const [blogAuthor, setBlogAuthor] = useState('');
    const [blogCategory, setBlogCategory] = useState<'Strategy' | 'Motivation' | 'Subject-wise' | 'Updates'>('Strategy');
    const [blogImage, setBlogImage] = useState('');

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
        onAddQuote(quoteMsg, quoteAuthor);
        setQuoteMsg('');
        setQuoteAuthor('');
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
        setQText('');
        setQOptions(['', '', '', '']);
        alert('Question Added to Bank!');
    };

    const submitTest = () => {
        // Validation
        if (!testTitle.trim()) {
            alert("Please enter a Title for the mock test.");
            return;
        }
        if (selectedQIds.length === 0) {
            alert("Please select at least one question from the bank below.");
            return;
        }

        const selectedQuestions = questionBank.filter(q => selectedQIds.includes(q.id));
        const newTest: Test = {
            id: `test_${Date.now()}`,
            title: testTitle,
            durationMinutes: testDuration,
            questions: selectedQuestions,
            category: 'ADMIN',
            difficulty: testDifficulty,
            examType: testExamType
        };
        
        onCreateTest(newTest);
        
        // Reset Form
        setTestTitle('');
        setSelectedQIds([]);
        
        // Success Message
        const msg = 'Mock Test Created Successfully! It is now visible to students in the Test Center.';
        setTestSuccessMsg(msg);
        alert(msg); // Pop-up message as requested
        
        setTimeout(() => setTestSuccessMsg(''), 5000);
    };

    const submitBlogPost = () => {
        if (!blogTitle || !blogContent || !blogAuthor) {
            alert("Please fill in all required fields.");
            return;
        }
        const newPost: BlogPost = {
            id: `blog_${Date.now()}`,
            title: blogTitle,
            excerpt: blogExcerpt,
            content: blogContent,
            author: blogAuthor,
            category: blogCategory,
            imageUrl: blogImage || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000',
            date: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD for MySQL
        };
        if (onAddBlogPost) onAddBlogPost(newPost);
        
        setBlogTitle('');
        setBlogExcerpt('');
        setBlogContent('');
        setBlogImage('');
        alert("Blog Post Published Successfully!");
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

    const handleManageUser = (u: User) => {
        setEditingUser(u);
        setEditFormData({
            name: u.name,
            email: u.email,
            role: u.role,
            isVerified: u.isVerified,
            targetExam: u.targetExam,
            institute: u.institute
        });
    };

    const saveUserChanges = () => {
        if (onUpdateUser && editingUser) {
            onUpdateUser({ ...editFormData, id: editingUser.id });
            setEditingUser(null);
        }
    };

    const blockUser = () => {
        if (onUpdateUser && editingUser) {
            onUpdateUser({ id: editingUser.id, isVerified: !editingUser.isVerified });
            setEditingUser(null);
        }
    };

    const deleteUser = () => {
        if (onDeleteUser && editingUser) {
            if (confirm("Are you sure you want to permanently delete this user?")) {
                onDeleteUser(editingUser.id);
                setEditingUser(null);
            }
        }
    };

    const availableTopics = JEE_SYLLABUS.find(s => s.id === qSubject)?.chapters.flatMap(c => c.topics) || [];

    // --- Tab Definitions ---
    const contentTabs = [
        { id: 'BROADCAST', label: 'Broadcasts', icon: Radio },
        { id: 'INBOX', label: 'Inbox', icon: Inbox },
        { id: 'BLOG_EDITOR', label: 'Blog Editor', icon: PenTool },
    ];

    const testTabs = [
        { id: 'QUESTION_BANK', label: 'Question Bank', icon: Database },
        { id: 'TEST_BUILDER', label: 'Test Builder', icon: FileText },
    ];

    const renderHeader = () => {
        if (section === 'users') {
            return {
                title: 'User Management',
                desc: 'Manage students, parents, and access controls.',
                icon: <Users className="w-10 h-10 text-white" />,
                gradient: 'from-cyan-700 to-blue-800'
            };
        } else if (section === 'tests') {
            return {
                title: 'Test Management',
                desc: 'Add questions to the bank and create new mock tests.',
                icon: <FileText className="w-10 h-10 text-white" />,
                gradient: 'from-violet-700 to-purple-800'
            };
        } else {
            return {
                title: 'Content & Broadcasts',
                desc: 'Manage announcements, motivational quotes, and blog posts.',
                icon: <Radio className="w-10 h-10 text-white" />,
                gradient: 'from-fuchsia-700 to-pink-800'
            };
        }
    };

    const header = renderHeader();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Header Banner */}
            <div className={`rounded-2xl p-8 text-white shadow-xl relative overflow-hidden bg-gradient-to-r ${header.gradient}`}>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{header.title}</h2>
                        <p className="text-white/80 text-lg max-w-xl">{header.desc}</p>
                    </div>
                    <div className="hidden md:block bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                        {header.icon}
                    </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            
            {/* Nav Tabs */}
            {section === 'content' && (
                <div className="flex p-1.5 space-x-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
                    {contentTabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setView(tab.id as TabView)}
                            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                                view === tab.id 
                                ? 'bg-fuchsia-600 text-white shadow-md' 
                                : 'text-slate-500 hover:bg-fuchsia-50 hover:text-fuchsia-700'
                            }`}
                        >
                            <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {section === 'tests' && (
                <div className="flex p-1.5 space-x-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
                    {testTabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setView(tab.id as TabView)}
                            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                                view === tab.id 
                                ? 'bg-violet-600 text-white shadow-md' 
                                : 'text-slate-500 hover:bg-violet-50 hover:text-violet-700'
                            }`}
                        >
                            <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* --- View Content --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[600px]">
                
                {/* 1. BROADCASTS */}
                {view === 'BROADCAST' && section === 'content' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
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

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="bg-purple-100 p-2 rounded-lg text-purple-600"><Shield className="w-5 h-5"/></span>
                                <h3 className="font-bold text-slate-800 text-lg">Manage Quotes</h3>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 h-full flex flex-col">
                                <div className="space-y-3 mb-4">
                                     <input 
                                        type="text" 
                                        placeholder="Quote text..." 
                                        className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-100 outline-none"
                                        value={quoteMsg}
                                        onChange={e => setQuoteMsg(e.target.value)}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Author (Optional)" 
                                        className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-100 outline-none"
                                        value={quoteAuthor}
                                        onChange={e => setQuoteAuthor(e.target.value)}
                                    />
                                    <button onClick={submitQuote} className="w-full bg-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 transition-transform active:scale-95">Add Quote</button>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto max-h-64 space-y-2 pr-2 custom-scrollbar">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase">Active Quotes ({quotes.length})</h4>
                                    {quotes.map(quote => (
                                        <div key={quote.id} className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-start group hover:border-purple-300">
                                            <div>
                                                <p className="text-sm text-slate-700 italic">"{quote.text}"</p>
                                                {quote.author && <p className="text-xs text-slate-500 mt-1">- {quote.author}</p>}
                                            </div>
                                            <button 
                                                onClick={() => onDeleteQuote(quote.id)}
                                                className="text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. QUESTION BANK */}
                {view === 'QUESTION_BANK' && section === 'tests' && (
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
                {view === 'TEST_BUILDER' && section === 'tests' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                             <h3 className="font-bold text-slate-800 mb-4 flex items-center"><FileText className="w-4 h-4 mr-2"/> Create New Mock Test</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Test Title</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                        placeholder="e.g., Weekly Physics Mock 3"
                                        value={testTitle}
                                        onChange={e => setTestTitle(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration (Mins)</label>
                                        <input 
                                            type="number" 
                                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                            value={testDuration}
                                            onChange={e => setTestDuration(parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Exam Type</label>
                                        <select 
                                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                            value={testExamType}
                                            onChange={e => setTestExamType(e.target.value as any)}
                                        >
                                            <option value="JEE">JEE Main/Adv</option>
                                            <option value="BITSAT">BITSAT</option>
                                            <option value="VITEEE">VITEEE</option>
                                            <option value="MET">MET (Manipal)</option>
                                            <option value="SRMJEEE">SRMJEEE</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
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

                        {testSuccessMsg && (
                            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center animate-in fade-in slide-in-from-top-2">
                                <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" />
                                <span className="font-bold text-sm">{testSuccessMsg}</span>
                            </div>
                        )}

                        <button onClick={submitTest} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-transform active:scale-[0.99] flex items-center justify-center">
                            <Shield className="w-5 h-5 mr-2" /> Publish Test to Students
                        </button>
                    </div>
                )}

                {/* 4. INBOX */}
                {view === 'INBOX' && section === 'content' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center"><Inbox className="w-5 h-5 mr-2 text-blue-500"/> Contact Messages</h3>
                            <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500">{contactMessages.length} Messages</span>
                        </div>
                        {contactMessages.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                                <p className="text-slate-400">No messages yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {contactMessages.map(msg => (
                                    <div key={msg.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-slate-800">{msg.subject}</h4>
                                                <p className="text-xs text-slate-500">From: {msg.name} ({msg.email})</p>
                                            </div>
                                            <button onClick={() => onDeleteContact && onDeleteContact(msg.id)} className="text-slate-300 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{msg.message}</p>
                                        <p className="text-[10px] text-slate-400 mt-2 text-right">{new Date(msg.created_at || '').toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 5. BLOG EDITOR */}
                {view === 'BLOG_EDITOR' && section === 'content' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                                <PenTool className="w-4 h-4 mr-2" /> Write New Article
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                            placeholder="e.g. 5 Revision Tips"
                                            value={blogTitle}
                                            onChange={e => setBlogTitle(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Author</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                            placeholder="e.g. Admin"
                                            value={blogAuthor}
                                            onChange={e => setBlogAuthor(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                                        <select 
                                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white"
                                            value={blogCategory}
                                            onChange={e => setBlogCategory(e.target.value as any)}
                                        >
                                            <option value="Strategy">Strategy</option>
                                            <option value="Motivation">Motivation</option>
                                            <option value="Subject-wise">Subject-wise</option>
                                            <option value="Updates">Updates</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Image URL</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                            placeholder="https://..."
                                            value={blogImage}
                                            onChange={e => setBlogImage(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Excerpt (Short Description)</label>
                                        <textarea 
                                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm h-24 resize-none focus:ring-2 focus:ring-blue-100 outline-none"
                                            placeholder="Summary..."
                                            value={blogExcerpt}
                                            onChange={e => setBlogExcerpt(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Content (HTML Supported)</label>
                                <textarea 
                                    className="w-full p-3 border border-slate-200 rounded-lg text-sm h-48 bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="Write article content here..."
                                    value={blogContent}
                                    onChange={e => setBlogContent(e.target.value)}
                                />
                            </div>
                            <button onClick={submitBlogPost} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-slate-800 flex items-center shadow-lg transition-transform active:scale-95">
                                <Plus className="w-4 h-4 mr-2" /> Publish Article
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between">
                                <span>Published Articles</span>
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{blogPosts.length} Total</span>
                            </h3>
                            <div className="space-y-3">
                                {blogPosts.map(post => (
                                    <div key={post.id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{post.title}</h4>
                                            <div className="flex items-center text-xs text-slate-500 mt-1 space-x-2">
                                                <span>{post.date}</span>
                                                <span>•</span>
                                                <span className="bg-slate-100 px-1.5 py-0.5 rounded uppercase font-bold text-[10px]">{post.category}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => onDeleteBlogPost && onDeleteBlogPost(post.id)}
                                            className="text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 7. USER MANAGEMENT (Only in Users Section) */}
                {view === 'USERS' && section === 'users' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User Profile</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {users.map(u => (
                                    <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${!u.isVerified ? 'bg-red-50/50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mr-3">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div className="text-sm font-bold text-slate-900">
                                                    {u.name}
                                                    {!u.isVerified && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">BLOCKED</span>}
                                                </div>
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
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            <div className="font-mono text-xs">{u.email}</div>
                                            {u.targetExam && <div className="text-[10px] text-slate-400">{u.targetExam}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm">
                                            <button 
                                                onClick={() => handleManageUser(u)}
                                                className="text-blue-600 hover:text-blue-800 font-bold px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                                            >
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit User Modal - Same as before */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-lg">Manage User</h3>
                            <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                                    value={editFormData.name || ''}
                                    onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                                    value={editFormData.email || ''}
                                    disabled
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Exam</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                                        value={editFormData.targetExam || ''}
                                        onChange={e => setEditFormData({...editFormData, targetExam: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Institute</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                                        value={editFormData.institute || ''}
                                        onChange={e => setEditFormData({...editFormData, institute: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                                <button 
                                    onClick={blockUser}
                                    className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center border transition-colors ${
                                        editingUser.isVerified 
                                        ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                        : 'border-green-200 text-green-600 hover:bg-green-50'
                                    }`}
                                >
                                    {editingUser.isVerified ? <AlertOctagon className="w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                    {editingUser.isVerified ? 'Block Access' : 'Unblock Access'}
                                </button>
                                
                                <div className="flex gap-3">
                                    <button 
                                        onClick={deleteUser}
                                        className="flex-1 py-2.5 bg-slate-100 text-slate-500 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete User
                                    </button>
                                    <button 
                                        onClick={saveUserChanges}
                                        className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md transition-colors flex items-center justify-center"
                                    >
                                        <Save className="w-4 h-4 mr-2" /> Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
