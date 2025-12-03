
import React, { useState } from 'react';
import { BacklogItem } from '../types';
import { AlertOctagon, CheckCircle, Clock, Plus, Trash2, Calendar, ListTodo } from 'lucide-react';

interface BacklogManagerProps {
    backlogs: BacklogItem[];
    onAddBacklog: (item: BacklogItem) => void;
    onToggleStatus: (id: string) => void;
    onDeleteBacklog: (id: string) => void;
}

const BacklogManager: React.FC<BacklogManagerProps> = ({ backlogs, onAddBacklog, onToggleStatus, onDeleteBacklog }) => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState<'phys' | 'chem' | 'math'>('phys');
    const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!title || !deadline) return;

        const newItem: BacklogItem = {
            id: `b_${Date.now()}`,
            title,
            subjectId: subject,
            priority,
            deadline,
            status: 'PENDING'
        };

        onAddBacklog(newItem);
        setTitle('');
        setDeadline('');
    };

    const pendingCount = backlogs.filter(b => b.status === 'PENDING').length;
    const clearedCount = backlogs.filter(b => b.status === 'CLEARED').length;

    const getPriorityColor = (p: string) => {
        switch(p) {
            case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
            case 'MEDIUM': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-slate-600 bg-slate-50';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <ListTodo className="w-8 h-8 text-orange-400" />
                        <h2 className="text-2xl font-bold">Backlog Crusher</h2>
                    </div>
                    <p className="text-slate-300">Prioritize and clear your pending topics. Don't let debt pile up.</p>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-3xl font-bold text-orange-400">{pendingCount}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Pending Tasks</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                            <Plus className="w-4 h-4 mr-2" /> Add New Backlog
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Topic / Chapter Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Rotational Motion Ex-2"
                                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                                    <select 
                                        className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm bg-white"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value as any)}
                                    >
                                        <option value="phys">Physics</option>
                                        <option value="chem">Chemistry</option>
                                        <option value="math">Maths</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Priority</label>
                                    <select 
                                        className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm bg-white"
                                        value={priority}
                                        onChange={e => setPriority(e.target.value as any)}
                                    >
                                        <option value="HIGH">High 🔥</option>
                                        <option value="MEDIUM">Medium ⚠️</option>
                                        <option value="LOW">Low 🧊</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Target Deadline</label>
                                <input 
                                    type="date" 
                                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm bg-white"
                                    value={deadline}
                                    onChange={e => setDeadline(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center">
                                Add to List
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {backlogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <CheckCircle className="w-10 h-10 text-slate-300 mb-2" />
                            <p className="text-slate-500 font-medium">No backlogs! Great job.</p>
                        </div>
                    ) : (
                        backlogs.sort((a,b) => (a.status === b.status ? 0 : a.status === 'PENDING' ? -1 : 1)).map(item => (
                            <div 
                                key={item.id} 
                                className={`group bg-white p-4 rounded-xl border transition-all hover:shadow-md flex items-center justify-between ${
                                    item.status === 'CLEARED' ? 'opacity-60 border-slate-100 bg-slate-50' : 'border-slate-200'
                                }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <button 
                                        onClick={() => onToggleStatus(item.id)}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                            item.status === 'CLEARED' 
                                            ? 'bg-green-500 border-green-500 text-white' 
                                            : 'border-slate-300 hover:border-blue-400'
                                        }`}
                                    >
                                        {item.status === 'CLEARED' && <CheckCircle className="w-4 h-4" />}
                                    </button>
                                    
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h4 className={`font-bold text-sm ${item.status === 'CLEARED' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                                {item.title}
                                            </h4>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold ${getPriorityColor(item.priority)}`}>
                                                {item.priority}
                                            </span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                                                item.subjectId === 'phys' ? 'text-purple-600 bg-purple-50' :
                                                item.subjectId === 'chem' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'
                                            }`}>
                                                {item.subjectId === 'phys' ? 'PHY' : item.subjectId === 'chem' ? 'CHEM' : 'MATH'}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-xs text-slate-500">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            Target: {new Date(item.deadline).toLocaleDateString()}
                                            {item.status === 'PENDING' && new Date(item.deadline) < new Date() && (
                                                <span className="ml-2 text-red-500 font-bold flex items-center">
                                                    <AlertOctagon className="w-3 h-3 mr-1" /> Overdue
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => onDeleteBacklog(item.id)}
                                    className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}

                    {clearedCount > 0 && (
                        <div className="text-center mt-6">
                            <span className="inline-flex items-center px-4 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                <CheckCircle className="w-3 h-3 mr-1" /> {clearedCount} Backlogs Crushed!
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BacklogManager;
