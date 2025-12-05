
import React from 'react';
import { TopicProgress, Subject } from '../types';
import { RotateCw, CheckCircle2, Clock, Calendar, BookOpen } from 'lucide-react';

interface RevisionManagerProps {
    subjects: Subject[];
    progress: Record<string, TopicProgress>;
    onUpdateProgress: (topicId: string, updates: Partial<TopicProgress>) => void;
}

const RevisionManager: React.FC<RevisionManagerProps> = ({ subjects, progress, onUpdateProgress }) => {
    
    // Logic to categorize topics based on Spaced Repetition (1, 7, 30 days)
    const getBuckets = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const buckets = {
            overdue: [] as any[],
            dueToday: [] as any[],
            upcoming: [] as any[]
        };

        subjects.forEach(subject => {
            subject.chapters.forEach(chapter => {
                chapter.topics.forEach(topic => {
                    const prog = progress[topic.id];
                    // Only track completed topics
                    if (prog && prog.status === 'COMPLETED') {
                        const topicData = { ...topic, subjectId: subject.id, prog };
                        
                        // Default revision date if not present (1 day after last update)
                        let nextDate = new Date();
                        if (prog.nextRevisionDate) {
                            nextDate = new Date(prog.nextRevisionDate);
                        } else if (prog.lastUpdated) {
                            nextDate = new Date(prog.lastUpdated);
                            nextDate.setDate(nextDate.getDate() + 1);
                        }
                        nextDate.setHours(0, 0, 0, 0);

                        if (nextDate < today) {
                            buckets.overdue.push(topicData);
                        } else if (nextDate.getTime() === today.getTime()) {
                            buckets.dueToday.push(topicData);
                        } else {
                            buckets.upcoming.push({ ...topicData, date: nextDate });
                        }
                    }
                });
            });
        });

        return buckets;
    };

    const { overdue, dueToday, upcoming } = getBuckets();

    const handleCheckIn = (topic: any) => {
        // Calculate next interval (1 -> 7 -> 30 -> 60)
        const currentCount = topic.prog.revisionCount || 0;
        let daysToAdd = 1;
        if (currentCount === 1) daysToAdd = 7;
        else if (currentCount >= 2) daysToAdd = 30;

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + daysToAdd);
        
        const dateStr = nextDate.toISOString().split('T')[0];

        onUpdateProgress(topic.id, {
            revisionCount: currentCount + 1,
            nextRevisionDate: dateStr,
            status: 'COMPLETED' // Ensure it stays completed
        });
    };

    const renderCard = (topic: any, type: 'OVERDUE' | 'TODAY' | 'UPCOMING') => (
        <div key={topic.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center group hover:border-blue-300 transition-all">
            <div>
                <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        topic.subjectId === 'phys' ? 'bg-purple-100 text-purple-700' :
                        topic.subjectId === 'chem' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {topic.subjectId}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Lvl {topic.prog.revisionCount || 0}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-800">{topic.name}</h4>
                {type === 'UPCOMING' && (
                    <p className="text-xs text-slate-400 mt-1 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> Due: {new Date(topic.date).toLocaleDateString()}
                    </p>
                )}
            </div>
            {type !== 'UPCOMING' && (
                <button 
                    onClick={() => handleCheckIn(topic)}
                    className="p-2 bg-slate-100 text-slate-400 rounded-full hover:bg-green-500 hover:text-white transition-colors"
                    title="Mark Reviewed"
                >
                    <CheckCircle2 className="w-5 h-5" />
                </button>
            )}
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center space-x-3 mb-2">
                    <RotateCw className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Smart Revision</h2>
                </div>
                <p className="text-emerald-50 text-sm opacity-90">Spaced Repetition Algorithm (1-7-30 Days) to beat the forgetting curve.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Overdue */}
                <div className="space-y-4">
                    <h3 className="font-bold text-red-600 flex items-center">
                        <Clock className="w-4 h-4 mr-2" /> Overdue ({overdue.length})
                    </h3>
                    <div className="space-y-3">
                        {overdue.length === 0 ? <p className="text-sm text-slate-400 italic">No overdue topics.</p> : overdue.map(t => renderCard(t, 'OVERDUE'))}
                    </div>
                </div>

                {/* Due Today */}
                <div className="space-y-4">
                    <h3 className="font-bold text-blue-600 flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" /> Due Today ({dueToday.length})
                    </h3>
                    <div className="space-y-3">
                        {dueToday.length === 0 ? <p className="text-sm text-slate-400 italic">No revisions for today.</p> : dueToday.map(t => renderCard(t, 'TODAY'))}
                    </div>
                </div>

                {/* Upcoming */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" /> Upcoming
                    </h3>
                    <div className="space-y-3 opacity-70">
                        {upcoming.length === 0 ? <p className="text-sm text-slate-400 italic">Complete more topics to populate schedule.</p> : upcoming.slice(0, 5).map(t => renderCard(t, 'UPCOMING'))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevisionManager;
