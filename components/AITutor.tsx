
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { AI_KNOWLEDGE_BASE } from '../constants';
import { ChatMessage } from '../types';

const AITutor: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'AI', text: "Hello! I'm your Offline AI Tutor. I know Physics, Chemistry, and Maths concepts from NCERT. Ask me about definitions, formulas, or laws (e.g., 'What is Torque?', 'Cannizzaro Reaction').", timestamp: new Date() }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'USER',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate "Thinking" time
        setTimeout(() => {
            const response = generateResponse(userMsg.text);
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'AI',
                text: response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 800);
    };

    // --- SYMBOLIC INFERENCE ENGINE (The "Brain") ---
    const generateResponse = (query: string): string => {
        const q = query.toLowerCase();
        
        // 1. Keyword Matching
        const keywords = Object.keys(AI_KNOWLEDGE_BASE);
        const matches = keywords.filter(k => q.includes(k));

        // 2. Exact/Best Match Logic
        if (matches.length > 0) {
            // Pick the longest matching keyword (more specific)
            const bestMatch = matches.reduce((a, b) => a.length > b.length ? a : b);
            return AI_KNOWLEDGE_BASE[bestMatch];
        }

        // 3. Fallbacks
        if (q.includes("hello") || q.includes("hi")) return "Hi there! Ready to study? Ask me a concept.";
        if (q.includes("thank")) return "You're welcome! Keep practicing.";
        if (q.includes("help")) return "I can explain concepts. Try asking 'What is entropy?' or 'Explain projectile motion'.";

        return "I'm not sure about that one yet. Try asking for a specific definition, formula, or law (like 'Ohm's Law' or 'Integration'). I work best with keywords!";
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-2xl p-4 text-white flex justify-between items-center shadow-md">
                <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">AI Tutor (Offline Mode)</h2>
                        <div className="flex items-center text-xs text-violet-200">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                            Active • Zero Data Cost
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setMessages([{ id: '1', role: 'AI', text: "Chat cleared. What's next?", timestamp: new Date() }])}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    title="Clear Chat"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* Chat Area */}
            <div 
                className="flex-1 bg-slate-50 border-x border-slate-200 overflow-y-auto p-4 space-y-4 custom-scrollbar"
                ref={scrollRef}
            >
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[80%] md:max-w-[70%] ${msg.role === 'USER' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                msg.role === 'USER' ? 'bg-blue-600 ml-3' : 'bg-violet-600 mr-3'
                            }`}>
                                {msg.role === 'USER' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                            </div>

                            {/* Bubble */}
                            <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                                msg.role === 'USER' 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                            }`}>
                                {msg.text}
                                <div className={`text-[10px] mt-2 opacity-50 text-right ${msg.role === 'USER' ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex flex-row">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-violet-600 mr-3 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center space-x-1">
                                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border border-t-0 border-slate-200 rounded-b-2xl shadow-sm">
                <form onSubmit={handleSend} className="flex gap-3">
                    <input 
                        type="text" 
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-200 focus:border-violet-400 outline-none transition-all placeholder:text-slate-400"
                        placeholder="Ask a doubt (e.g., 'What is VSEPR theory?')"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isTyping}
                        className="bg-violet-600 text-white p-3 rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-violet-200"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
                <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center">
                    <Zap className="w-3 h-3 mr-1 text-yellow-500" /> 
                    Powered by IITGEEPrep Knowledge Base (No Internet Required)
                </p>
            </div>
        </div>
    );
};

export default AITutor;
