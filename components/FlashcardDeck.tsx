
import React, { useState } from 'react';
import { Flashcard } from '../types';
import { Layers, RotateCw, Check, X, Filter } from 'lucide-react';

interface FlashcardDeckProps {
    cards: Flashcard[];
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards }) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [filter, setFilter] = useState<'ALL' | 'phys' | 'chem' | 'math'>('ALL');

    const filteredCards = cards.filter(c => filter === 'ALL' || c.subjectId === filter);
    const currentCard = filteredCards[currentCardIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
        }, 200);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
        }, 200);
    };

    if (filteredCards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <Layers className="w-12 h-12 mb-2" />
                <p>No flashcards found for this subject.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center space-x-3 mb-2">
                    <Layers className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Formula Flashcards</h2>
                </div>
                <p className="text-indigo-100">Master formulas and reactions through active recall.</p>
            </div>

            {/* Filters */}
            <div className="flex justify-center space-x-2">
                {['ALL', 'phys', 'chem', 'math'].map((sub) => (
                    <button
                        key={sub}
                        onClick={() => { setFilter(sub as any); setCurrentCardIndex(0); setIsFlipped(false); }}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${
                            filter === sub
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        {sub === 'ALL' ? 'All' : sub === 'phys' ? 'Physics' : sub === 'chem' ? 'Chemistry' : 'Maths'}
                    </button>
                ))}
            </div>

            {/* Card Area */}
            <div className="perspective-1000 h-80 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                    
                    {/* Front */}
                    <div className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center justify-center p-8 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                        <span className={`absolute top-4 left-4 text-[10px] font-bold px-2 py-1 rounded uppercase ${
                            currentCard.subjectId === 'phys' ? 'bg-purple-100 text-purple-700' :
                            currentCard.subjectId === 'chem' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                            {currentCard.subjectId === 'phys' ? 'Physics' : currentCard.subjectId === 'chem' ? 'Chemistry' : 'Maths'}
                        </span>
                        <h3 className="text-2xl font-bold text-slate-800 text-center">{currentCard.front}</h3>
                        <p className="text-slate-400 text-sm mt-4 font-medium animate-pulse">Click to flip</p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 flex flex-col items-center justify-center p-8 backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                         <h3 className="text-3xl font-mono font-bold text-green-400 text-center">{currentCard.back}</h3>
                         <div className="absolute bottom-4 flex space-x-4">
                             <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase bg-slate-700 text-slate-300`}>
                                Difficulty: {currentCard.difficulty}
                             </span>
                         </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center px-4">
                <button 
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="px-6 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                    Previous
                </button>
                <span className="text-slate-400 font-mono text-sm">{currentCardIndex + 1} / {filteredCards.length}</span>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="px-6 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg"
                >
                    Next Card
                </button>
            </div>
        </div>
    );
};

export default FlashcardDeck;
