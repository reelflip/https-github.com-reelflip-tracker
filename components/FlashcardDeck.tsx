
import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { Layers, RotateCw, Check, X, Filter, Trophy, Star } from 'lucide-react';

interface FlashcardDeckProps {
    cards: Flashcard[];
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards }) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [filter, setFilter] = useState<'ALL' | 'phys' | 'chem' | 'math'>('ALL');
    const [masteredIds, setMasteredIds] = useState<string[]>([]);
    const [showCelebration, setShowCelebration] = useState(false);

    // Filter cards (exclude mastered ones from the active deck?) 
    // Strategy: Keep them in deck but show visuals, or filter them out? 
    // Let's filter by subject first.
    const subjectCards = cards.filter(c => filter === 'ALL' || c.subjectId === filter);
    
    // Calculate progress
    const masteredCount = subjectCards.filter(c => masteredIds.includes(c.id)).length;
    const progressPercent = Math.round((masteredCount / (subjectCards.length || 1)) * 100);

    const currentCard = subjectCards[currentCardIndex];

    const playFlipSound = () => {
        // Implement real sound via AudioContext
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.value = 400;
            osc.type = 'sine';
            
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch(e) {
            console.error("Audio failed", e);
        }
    };

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev + 1) % subjectCards.length);
        }, 300);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev - 1 + subjectCards.length) % subjectCards.length);
        }, 300);
    };

    const toggleMastery = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (masteredIds.includes(currentCard.id)) {
            setMasteredIds(prev => prev.filter(id => id !== currentCard.id));
        } else {
            setMasteredIds(prev => [...prev, currentCard.id]);
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 2000); // Hide celebration
            
            // Auto advance if not last
            setTimeout(() => handleNext(), 1000);
        }
    };

    if (subjectCards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
                <Layers className="w-12 h-12 mb-2 opacity-50" />
                <p>No flashcards found for this subject.</p>
            </div>
        );
    }

    const isMastered = masteredIds.includes(currentCard.id);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 max-w-2xl mx-auto pb-10">
            {/* Header Stats */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Layers className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Formula Deck</h2>
                        <p className="text-xs text-slate-500">{masteredCount}/{subjectCards.length} Mastered</p>
                    </div>
                </div>
                <div className="flex space-x-1">
                    {['ALL', 'phys', 'chem', 'math'].map((sub) => (
                        <button
                            key={sub}
                            onClick={() => { setFilter(sub as any); setCurrentCardIndex(0); setIsFlipped(false); }}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                filter === sub
                                    ? 'bg-slate-800 text-white shadow-md'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-green-500 transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Card Area */}
            <div 
                className="perspective-1000 h-96 cursor-pointer group relative" 
                onClick={() => { setIsFlipped(!isFlipped); playFlipSound(); }}
            >
                <div 
                    className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`} 
                    style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >
                    
                    {/* Front Face */}
                    <div 
                        className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center justify-center p-8 backface-hidden z-20"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        {/* Corner Badges */}
                        <span className={`absolute top-6 left-6 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                            currentCard.subjectId === 'phys' ? 'bg-purple-100 text-purple-700' :
                            currentCard.subjectId === 'chem' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                            {currentCard.subjectId === 'phys' ? 'Physics' : currentCard.subjectId === 'chem' ? 'Chemistry' : 'Maths'}
                        </span>
                        
                        {isMastered && (
                            <span className="absolute top-6 right-6 text-green-500 animate-in zoom-in spin-in-12">
                                <Check className="w-6 h-6" strokeWidth={3} />
                            </span>
                        )}

                        <div className="flex-1 flex items-center justify-center w-full">
                            <h3 className="text-3xl md:text-4xl font-black text-slate-800 text-center leading-tight">
                                {currentCard.front}
                            </h3>
                        </div>
                        
                        <div className="mt-auto text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center">
                            <RotateCw className="w-3 h-3 mr-2" /> Tap to Reveal
                        </div>
                    </div>

                    {/* Back Face */}
                    <div 
                        className="absolute inset-0 bg-slate-900 rounded-3xl shadow-xl border border-slate-800 flex flex-col items-center justify-center p-8 backface-hidden z-10" 
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                         <div className="flex-1 flex items-center justify-center w-full">
                            <h3 className="text-2xl md:text-3xl font-mono font-bold text-green-400 text-center leading-relaxed">
                                {currentCard.back}
                            </h3>
                         </div>
                         
                         <div className="mt-auto flex flex-col items-center space-y-4 w-full">
                             <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase bg-white/10 text-slate-300 border border-white/10`}>
                                Difficulty: {currentCard.difficulty}
                             </span>
                             
                             <button
                                onClick={toggleMastery}
                                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
                                    isMastered 
                                    ? 'bg-green-500 text-white shadow-lg shadow-green-900/50' 
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                             >
                                {isMastered ? (
                                    <>
                                        <Trophy className="w-4 h-4" /> <span>Mastered!</span>
                                    </>
                                ) : (
                                    <>
                                        <Star className="w-4 h-4" /> <span>Mark as Mastered</span>
                                    </>
                                )}
                             </button>
                         </div>
                    </div>
                </div>

                {/* Celebration Overlay */}
                {showCelebration && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                        <div className="text-6xl animate-in zoom-in fade-in slide-in-from-bottom-10 duration-500">
                            🎉
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center px-2">
                <button 
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                    Prev
                </button>
                <span className="text-slate-400 font-mono text-xs font-bold tracking-widest">
                    {currentCardIndex + 1} / {subjectCards.length}
                </span>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default FlashcardDeck;
