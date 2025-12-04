import React, { useState, useMemo } from 'react';
import { MemoryHack } from '../types';
import { Lightbulb, Search, Copy, CheckCircle2, Zap, Brain, Hash, Layers } from 'lucide-react';

interface MemoryHacksProps {
    hacks: MemoryHack[];
}

const MemoryHacks: React.FC<MemoryHacksProps> = ({ hacks }) => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'phys' | 'chem' | 'math'>('ALL');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filteredHacks = hacks.filter(h => {
        const matchesSubject = filter === 'ALL' || h.subjectId === filter;
        const matchesSearch = h.title.toLowerCase().includes(search.toLowerCase()) || 
                              (h.tags && h.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
        return matchesSubject && matchesSearch;
    });

    // Group by Category
    const groupedHacks = useMemo(() => {
        const groups: Record<string, MemoryHack[]> = {};
        filteredHacks.forEach(hack => {
            if (!groups[hack.category]) {
                groups[hack.category] = [];
            }
            groups[hack.category].push(hack);
        });
        return groups;
    }, [filteredHacks]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getSubjectColor = (sid: string) => {
        switch(sid) {
            case 'phys': return 'border-purple-200 bg-purple-50 text-purple-700';
            case 'chem': return 'border-amber-200 bg-amber-50 text-amber-700';
            case 'math': return 'border-blue-200 bg-blue-50 text-blue-700';
            default: return 'border-slate-200 bg-slate-50 text-slate-700';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center space-x-3 mb-2">
                    <Lightbulb className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Memory Hacks & Mnemonics</h2>
                </div>
                <p className="text-yellow-50 text-sm opacity-90">Shortcuts, tricks, and visual aids to boost your retention.</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search mnemonics..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-yellow-200 outline-none placeholder:text-slate-400"
                    />
                </div>
                <div className="flex space-x-1 overflow-x-auto w-full md:w-auto no-scrollbar pb-1">
                    {['ALL', 'phys', 'chem', 'math'].map((sub) => (
                        <button
                            key={sub}
                            onClick={() => setFilter(sub as any)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap ${
                                filter === sub
                                    ? 'bg-slate-800 text-white shadow-md'
                                    : 'bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            {sub === 'ALL' ? 'All' : sub}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            {Object.keys(groupedHacks).length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-xl border border-slate-100 border-dashed">
                    <Brain className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No tricks found.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedHacks).map(([category, categoryHacks]) => (
                        <div key={category} className="space-y-4">
                            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                                <Layers className="w-4 h-4 text-slate-400" />
                                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide">{category}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categoryHacks.map((hack: MemoryHack) => (
                                    <div key={hack.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col group">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${getSubjectColor(hack.subjectId)}`}>
                                                {hack.subjectId === 'phys' ? 'Physics' : hack.subjectId === 'chem' ? 'Chemistry' : 'Maths'}
                                            </span>
                                            <button 
                                                onClick={() => handleCopy(hack.trick, hack.id)}
                                                className="text-slate-400 hover:text-blue-600 transition-colors"
                                                title="Copy Trick"
                                            >
                                                {copiedId === hack.id ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        
                                        <h3 className="font-bold text-slate-800 mb-2 flex items-center">
                                            {hack.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 mb-4">{hack.description}</p>
                                        
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-sm text-slate-700 whitespace-pre-line leading-relaxed relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-1 opacity-10">
                                                <Zap className="w-12 h-12 text-yellow-500" />
                                            </div>
                                            {hack.trick}
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                                            {(hack.tags || []).map((tag, idx) => (
                                                <span key={idx} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded flex items-center">
                                                    <Hash className="w-2.5 h-2.5 mr-0.5 opacity-50" /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MemoryHacks;