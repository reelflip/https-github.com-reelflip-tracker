
import React, { useState } from 'react';
import { MistakeRecord } from '../types';
import { BookX, Filter, Tag, Edit3, Trash2 } from 'lucide-react';

interface MistakeNotebookProps {
  mistakes: MistakeRecord[];
  onUpdateMistake: (id: string, updates: Partial<MistakeRecord>) => void;
  onDeleteMistake: (id: string) => void;
}

const MistakeNotebook: React.FC<MistakeNotebookProps> = ({ mistakes, onUpdateMistake, onDeleteMistake }) => {
  const [filterSubject, setFilterSubject] = useState('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');

  const filteredMistakes = mistakes.filter(m => filterSubject === 'ALL' || m.subjectId === filterSubject);

  const tags = ['Silly Mistake', 'Conceptual Error', 'Calculation Error', 'Time Management', 'Forgot Formula'];

  const toggleTag = (mistake: MistakeRecord, tag: any) => {
    const currentTags = mistake.tags || [];
    const newTags = currentTags.includes(tag) 
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    onUpdateMistake(mistake.id, { tags: newTags as any });
  };

  const startEdit = (m: MistakeRecord) => {
    setEditingId(m.id);
    setEditNote(m.userNotes || '');
  };

  const saveEdit = (id: string) => {
    onUpdateMistake(id, { userNotes: editNote });
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
       <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center space-x-3 mb-2">
             <BookX className="w-8 h-8" />
             <h2 className="text-2xl font-bold">Mistake Notebook</h2>
          </div>
          <p className="text-red-100">"Success does not consist in never making mistakes but in never making the same one a second time."</p>
       </div>

       {/* Controls */}
       <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {['ALL', 'phys', 'chem', 'math'].map(sub => (
             <button
                key={sub}
                onClick={() => setFilterSubject(sub)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${
                   filterSubject === sub 
                   ? 'bg-slate-800 text-white' 
                   : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
             >
                {sub === 'ALL' ? 'All Subjects' : sub === 'phys' ? 'Physics' : sub === 'chem' ? 'Chemistry' : 'Maths'}
             </button>
          ))}
       </div>

       {/* List */}
       <div className="space-y-4">
          {filteredMistakes.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-xl border border-slate-100 border-dashed">
                 <div className="inline-block p-4 bg-slate-50 rounded-full mb-3">
                    <BookX className="w-8 h-8 text-slate-300" />
                 </div>
                 <p className="text-slate-500 font-medium">No mistakes recorded yet.</p>
                 <p className="text-slate-400 text-xs mt-1">Mistakes from your mock tests will appear here automatically.</p>
             </div>
          ) : (
             filteredMistakes.map(m => (
                <div key={m.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group hover:border-blue-300 transition-colors">
                   <div className="flex justify-between items-start mb-3">
                      <div>
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                             m.subjectId === 'phys' ? 'bg-purple-100 text-purple-700' :
                             m.subjectId === 'chem' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                         }`}>
                             {m.subjectId === 'phys' ? 'Physics' : m.subjectId === 'chem' ? 'Chemistry' : 'Maths'}
                         </span>
                         <span className="text-[10px] text-slate-400 ml-2">{new Date(m.date).toLocaleDateString()} • {m.testName}</span>
                      </div>
                      <button onClick={() => onDeleteMistake(m.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                   
                   <p className="text-slate-800 font-medium mb-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {m.questionText}
                   </p>

                   {/* Tags */}
                   <div className="flex flex-wrap gap-2 mb-4">
                      {tags.map(tag => {
                         const isActive = m.tags.includes(tag as any);
                         return (
                            <button
                               key={tag}
                               onClick={() => toggleTag(m, tag)}
                               className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                                  isActive 
                                  ? 'bg-red-50 border-red-200 text-red-600' 
                                  : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                               }`}
                            >
                               {tag}
                            </button>
                         );
                      })}
                   </div>

                   {/* Notes */}
                   <div className="relative">
                      {editingId === m.id ? (
                         <div className="space-y-2">
                             <textarea 
                                value={editNote}
                                onChange={(e) => setEditNote(e.target.value)}
                                className="w-full p-3 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                placeholder="Why did I get this wrong? What is the concept?"
                                autoFocus
                             />
                             <div className="flex justify-end space-x-2">
                                <button onClick={() => setEditingId(null)} className="text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                                <button onClick={() => saveEdit(m.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">Save Note</button>
                             </div>
                         </div>
                      ) : (
                         <div 
                            onClick={() => startEdit(m)}
                            className={`p-3 rounded-lg text-sm cursor-pointer border border-transparent hover:border-slate-200 transition-colors flex items-start ${m.userNotes ? 'bg-yellow-50 text-slate-700' : 'bg-slate-50 text-slate-400 italic'}`}
                         >
                            <Edit3 className="w-3 h-3 mr-2 mt-0.5 opacity-50" />
                            {m.userNotes || "Click to add reflection notes..."}
                         </div>
                      )}
                   </div>
                </div>
             ))
          )}
       </div>
    </div>
  );
};

export default MistakeNotebook;
