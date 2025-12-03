
import React, { useState } from 'react';
import { Calendar, Clock, Moon, BookOpen, Briefcase, ChevronRight, RefreshCw, Brain, PenTool, Layers, Coffee, Zap } from 'lucide-react';

const TimetableGenerator = () => {
  // State
  const [coachingDays, setCoachingDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [coachingStart, setCoachingStart] = useState('17:30'); // 05:30 PM
  const [coachingEnd, setCoachingEnd] = useState('20:30');   // 08:30 PM
  
  const [schoolEnabled, setSchoolEnabled] = useState(true);
  const [schoolStart, setSchoolStart] = useState('08:00');
  const [schoolEnd, setSchoolEnd] = useState('14:00'); // 02:00 PM
  
  const [wakeTime, setWakeTime] = useState('06:00');
  const [bedTime, setBedTime] = useState('23:00'); // 11:00 PM

  const [generatedSchedule, setGeneratedSchedule] = useState<any[] | null>(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    if (coachingDays.includes(day)) {
      setCoachingDays(coachingDays.filter(d => d !== day));
    } else {
      setCoachingDays([...coachingDays, day]);
    }
  };

  // Helper to add minutes to HH:MM string and return HH:MM
  const addMinutes = (time: string, mins: number) => {
     const [h, m] = time.split(':').map(Number);
     const date = new Date();
     date.setHours(h, m + mins);
     const nh = date.getHours().toString().padStart(2, '0');
     const nm = date.getMinutes().toString().padStart(2, '0');
     return `${nh}:${nm}`;
  };

  // Helper to get duration in minutes between two times
  const getDuration = (start: string, end: string) => {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      return (eh * 60 + em) - (sh * 60 + sm);
  };

  const handleGenerate = () => {
    const slots = [];
    
    // --- 1. WAKE UP & ROUTINE ---
    slots.push({ 
        time: wakeTime, 
        label: 'Wake Up & Hydrate', 
        type: 'routine',
        icon: <SunIcon className="w-4 h-4" /> 
    });

    let currentTime = addMinutes(wakeTime, 30); // 30 mins freshen up

    // --- 2. MORNING SLOT (High Focus) ---
    // Check gap before school or general morning
    const morningLimit = schoolEnabled ? schoolStart : '12:00';
    const morningDuration = getDuration(currentTime, morningLimit);

    if (morningDuration >= 60) {
        // Enough time for a solid session
        const sessionEnd = addMinutes(currentTime, Math.min(morningDuration, 120)); // Cap at 2 hours
        slots.push({ 
            time: currentTime, 
            endTime: sessionEnd, 
            label: 'Physics: Concepts & Theory', 
            subtext: 'Morning is best for heavy concepts. Read notes or watch lectures.',
            type: 'theory',
            subject: 'Physics'
        });
        currentTime = sessionEnd;
    } 
    
    // Fill remaining time before school with revision
    if (schoolEnabled && getDuration(currentTime, schoolStart) > 20) {
        slots.push({
            time: currentTime,
            endTime: schoolStart,
            label: 'Quick Revision: Formula Flashcards',
            type: 'revision'
        });
        currentTime = schoolStart;
    }

    // --- 3. SCHOOL BLOCK ---
    if (schoolEnabled) {
        slots.push({ 
            time: schoolStart, 
            endTime: schoolEnd, 
            label: 'School / College', 
            subtext: 'Try to solve easy MCQs during free periods.',
            type: 'school' 
        });
        currentTime = schoolEnd;
    }

    // --- 4. AFTERNOON (Lunch & Rest) ---
    const lunchEnd = addMinutes(currentTime, 45);
    slots.push({ 
        time: currentTime, 
        endTime: lunchEnd, 
        label: 'Lunch & Power Nap', 
        type: 'routine',
        icon: <Coffee className="w-4 h-4" />
    });
    currentTime = lunchEnd;

    // --- 5. MID-DAY SLOT (Practice) ---
    // Gap before Coaching or Evening
    const eveningLimit = coachingDays.length > 0 ? coachingStart : '18:00';
    let afternoonDuration = getDuration(currentTime, eveningLimit);

    if (afternoonDuration > 60) {
        // Math Practice (Active work prevents sleepiness)
        const sessionTime = Math.min(afternoonDuration, 180); // Max 3 hours
        const practiceEnd = addMinutes(currentTime, sessionTime);
        
        // Split if long session
        if (sessionTime > 120) {
             const part1End = addMinutes(currentTime, sessionTime / 2);
             slots.push({
                 time: currentTime,
                 endTime: part1End,
                 label: 'Maths: Problem Solving (Exercise 1)',
                 type: 'practice',
                 subject: 'Maths'
             });
             slots.push({
                time: part1End,
                endTime: practiceEnd,
                label: 'Maths: Deep Practice (Exercise 2)',
                type: 'practice',
                subject: 'Maths'
            });
        } else {
            slots.push({
                time: currentTime,
                endTime: practiceEnd,
                label: 'Maths: Problem Solving',
                type: 'practice',
                subject: 'Maths'
            });
        }
        currentTime = practiceEnd;
    }

    // --- 6. COACHING BLOCK ---
    if (coachingDays.length > 0 && getDuration(currentTime, coachingStart) >= 0) {
        // If there's a small gap, fill with revision
        if (getDuration(currentTime, coachingStart) > 30) {
             slots.push({
                time: currentTime,
                endTime: coachingStart,
                label: 'Pre-Class Revision',
                type: 'revision'
             });
        }

        slots.push({ 
            time: coachingStart, 
            endTime: coachingEnd, 
            label: 'Coaching Classes', 
            type: 'coaching' 
        });
        currentTime = coachingEnd;
    }

    // --- 7. EVENING ROUTINE ---
    const dinnerEnd = addMinutes(currentTime, 45);
    slots.push({ 
        time: currentTime, 
        endTime: dinnerEnd, 
        label: 'Dinner & Relax', 
        type: 'routine' 
    });
    currentTime = dinnerEnd;

    // --- 8. NIGHT SLOT (Chemistry/Backlog) ---
    // Time until bed
    const nightDuration = getDuration(currentTime, bedTime);
    
    if (nightDuration > 45) {
        slots.push({
            time: currentTime,
            endTime: bedTime,
            label: 'Chemistry: NCERT Reading & Memorization',
            subtext: 'Inorganic/Organic requires daily reading. End day with Backlog clearing.',
            type: 'theory',
            subject: 'Chemistry'
        });
    }

    // --- 9. SLEEP ---
    slots.push({ 
        time: bedTime, 
        label: 'Sleep & Recovery', 
        subtext: '7 hours of sleep is non-negotiable for memory retention.',
        type: 'sleep',
        icon: <Moon className="w-4 h-4" />
    });

    setGeneratedSchedule(slots);
  };

  const SunIcon = ({className}: {className?: string}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
  );

  return (
    <div className="max-w-2xl mx-auto pb-10">
        {!generatedSchedule ? (
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                    <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Smart Timetable Generator</h2>
                    </div>
                    <p className="text-orange-100 text-sm opacity-90">Auto-allocates Revision, Practice, and Subjects based on your day.</p>
                </div>

                {/* Form Container */}
                <div className="p-6 space-y-8">
                    
                    {/* Coaching Section */}
                    <section>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" /> Coaching Schedule
                        </h3>
                        
                        {/* Day Selectors */}
                        <div className="flex space-x-2 mb-6 overflow-x-auto no-scrollbar pb-1">
                            {days.map(day => {
                                const isSelected = coachingDays.includes(day);
                                return (
                                    <button
                                        key={day}
                                        onClick={() => toggleDay(day)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                            isSelected 
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Time Inputs */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium ml-1">Start Time</label>
                                <div className="relative">
                                    <input 
                                        type="time" 
                                        value={coachingStart}
                                        onChange={(e) => setCoachingStart(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                    <Clock className="absolute right-3 top-3 text-slate-300 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium ml-1">End Time</label>
                                <div className="relative">
                                    <input 
                                        type="time" 
                                        value={coachingEnd}
                                        onChange={(e) => setCoachingEnd(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                    <Clock className="absolute right-3 top-3 text-slate-300 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* School Section */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center">
                                <Briefcase className="w-4 h-4 mr-2" /> School / College
                            </h3>
                            <button 
                                onClick={() => setSchoolEnabled(!schoolEnabled)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${schoolEnabled ? 'bg-green-500' : 'bg-slate-200'}`}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${schoolEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                        
                        <div className={`grid grid-cols-2 gap-4 transition-opacity duration-200 ${schoolEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium ml-1">Starts</label>
                                <div className="relative">
                                    <input 
                                        type="time" 
                                        value={schoolStart}
                                        onChange={(e) => setSchoolStart(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                    <Clock className="absolute right-3 top-3 text-slate-300 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium ml-1">Ends</label>
                                <div className="relative">
                                    <input 
                                        type="time" 
                                        value={schoolEnd}
                                        onChange={(e) => setSchoolEnd(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                    <Clock className="absolute right-3 top-3 text-slate-300 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Sleep Section */}
                    <section>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center">
                            <Moon className="w-4 h-4 mr-2" /> Sleep Cycle
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium ml-1">Wake Up</label>
                                <div className="relative">
                                    <input 
                                        type="time" 
                                        value={wakeTime}
                                        onChange={(e) => setWakeTime(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                    <Clock className="absolute right-3 top-3 text-slate-300 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium ml-1">Bed Time</label>
                                <div className="relative">
                                    <input 
                                        type="time" 
                                        value={bedTime}
                                        onChange={(e) => setBedTime(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                    <Clock className="absolute right-3 top-3 text-slate-300 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Button */}
                    <button 
                        onClick={handleGenerate}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2"
                    >
                        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span>Generate Smart Timetable</span>
                    </button>
                </div>
            </div>
        ) : (
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <h3 className="font-bold text-slate-800 flex items-center text-lg">
                        <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3">
                            <Calendar className="w-5 h-5" />
                        </span>
                        Optimized Daily Schedule
                    </h3>
                    <button 
                        onClick={() => setGeneratedSchedule(null)}
                        className="flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate
                    </button>
                </div>
                
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
                    {generatedSchedule.map((slot: any, idx: number) => {
                         // Determine styles based on activity type
                         let bg = 'bg-slate-50';
                         let border = 'border-slate-100';
                         let text = 'text-slate-700';
                         let icon = slot.icon || <Clock className="w-4 h-4" />;
                         
                         if (slot.type === 'theory') {
                             bg = 'bg-purple-50'; border = 'border-purple-100'; text = 'text-purple-900';
                             icon = <Brain className="w-4 h-4" />;
                         } else if (slot.type === 'practice') {
                             bg = 'bg-blue-50'; border = 'border-blue-100'; text = 'text-blue-900';
                             icon = <PenTool className="w-4 h-4" />;
                         } else if (slot.type === 'revision') {
                             bg = 'bg-amber-50'; border = 'border-amber-100'; text = 'text-amber-900';
                             icon = <Layers className="w-4 h-4" />;
                         } else if (slot.type === 'school') {
                             bg = 'bg-green-50'; border = 'border-green-100'; text = 'text-green-900';
                             icon = <Briefcase className="w-4 h-4" />;
                         } else if (slot.type === 'coaching') {
                             bg = 'bg-orange-50'; border = 'border-orange-100'; text = 'text-orange-900';
                             icon = <BookOpen className="w-4 h-4" />;
                         }

                         return (
                            <div key={idx} className="relative pl-8">
                                {/* Dot */}
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${
                                    slot.type === 'sleep' ? 'bg-slate-800' :
                                    slot.type === 'theory' ? 'bg-purple-500' :
                                    slot.type === 'practice' ? 'bg-blue-500' :
                                    slot.type === 'revision' ? 'bg-amber-500' :
                                    slot.type === 'school' ? 'bg-green-500' :
                                    slot.type === 'coaching' ? 'bg-orange-500' :
                                    'bg-slate-400'
                                }`}></div>
                                
                                {/* Time */}
                                <div className="text-xs font-mono font-bold text-slate-400 mb-1 flex items-center">
                                    {slot.time} 
                                    {slot.endTime && <span className="text-slate-300 mx-1">-</span>} 
                                    {slot.endTime}
                                </div>
                                
                                {/* Content Card */}
                                <div className={`rounded-lg p-4 relative group transition-all hover:shadow-md border ${bg} ${border}`}>
                                    <div className={`font-bold flex items-start justify-between ${text}`}>
                                        <div className="flex items-center gap-2">
                                            {icon}
                                            <span>{slot.label}</span>
                                        </div>
                                    </div>
                                    {slot.subtext && (
                                        <div className={`text-xs mt-1 font-medium opacity-80 leading-relaxed ${text}`}>
                                            {slot.subtext}
                                        </div>
                                    )}
                                    {slot.subject && (
                                        <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/50 border border-white/20">
                                            {slot.subject}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">Schedule generated based on standard JEE toppers' routines.</p>
                </div>
            </div>
        )}
    </div>
  );
};

export default TimetableGenerator;
