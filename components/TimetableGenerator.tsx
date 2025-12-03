import React, { useState } from 'react';
import { Calendar, Clock, Moon, BookOpen, Briefcase, ChevronRight, RefreshCw } from 'lucide-react';

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

  const handleGenerate = () => {
    // Logic to generate a schedule for a typical day
    // This is a simplified logic for the demo to create a timeline visualization
    
    const slots = [];
    
    // Wake Up
    slots.push({ time: wakeTime, label: 'Wake Up & Morning Routine', type: 'routine' });

    let currentTime = addMinutes(wakeTime, 45); // 45 mins routine

    // Morning Study (if gap exists before school)
    if (schoolEnabled) {
        // If school starts > 1.5 hours after wake up
        const [sh, sm] = schoolStart.split(':').map(Number);
        const schoolMin = sh * 60 + sm;
        const [ch, cm] = currentTime.split(':').map(Number);
        const currentMin = ch * 60 + cm;
        
        if (schoolMin - currentMin > 60) {
            slots.push({ time: currentTime, endTime: schoolStart, label: 'Morning Revision / Formulae', type: 'study' });
        }
        
        slots.push({ time: schoolStart, endTime: schoolEnd, label: 'School / College', type: 'school' });
        currentTime = schoolEnd;
    } else {
        // Dummy school / Holiday - Morning Deep Work
        const deepWorkEnd = addMinutes(currentTime, 180); // 3 hours
        slots.push({ time: currentTime, endTime: deepWorkEnd, label: 'Deep Work: Physics/Maths', type: 'study' });
        currentTime = deepWorkEnd;
    }

    // Lunch
    const lunchEnd = addMinutes(currentTime, 45);
    slots.push({ time: currentTime, endTime: lunchEnd, label: 'Lunch & Power Nap', type: 'routine' });
    currentTime = lunchEnd;

    // Afternoon Gap -> Coaching
    if (coachingDays.length > 0) { // Assuming typical coaching day
        const [cStartH, cStartM] = coachingStart.split(':').map(Number);
        const coachingStartMin = cStartH * 60 + cStartM;
        const [currH, currM] = currentTime.split(':').map(Number);
        const currentMin = currH * 60 + currM;

        if (coachingStartMin > currentMin) {
            slots.push({ time: currentTime, endTime: coachingStart, label: 'Self Study: Problem Solving', type: 'study' });
        }
        
        slots.push({ time: coachingStart, endTime: coachingEnd, label: 'Coaching Classes', type: 'coaching' });
        currentTime = coachingEnd;
    } else {
        // No coaching - Afternoon Session
        const sessionEnd = addMinutes(currentTime, 180);
        slots.push({ time: currentTime, endTime: sessionEnd, label: 'Self Study: Chemistry/Physics', type: 'study' });
        currentTime = sessionEnd;
    }

    // Dinner
    const dinnerEnd = addMinutes(currentTime, 45);
    slots.push({ time: currentTime, endTime: dinnerEnd, label: 'Dinner & Break', type: 'routine' });
    currentTime = dinnerEnd;

    // Night Study
    if (bedTime > currentTime || (bedTime.startsWith('00') || bedTime.startsWith('01') || bedTime.startsWith('02'))) {
         slots.push({ time: currentTime, endTime: bedTime, label: 'Night Session: Analysis & Notes', type: 'study' });
    }
    
    slots.push({ time: bedTime, label: 'Sleep', type: 'marker' });

    setGeneratedSchedule(slots);
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
        {!generatedSchedule ? (
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                    <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Timetable Generator</h2>
                    </div>
                    <p className="text-orange-100 text-sm opacity-90">Define your fixed commitments to find your study slots.</p>
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
                        <Clock className="w-5 h-5" />
                        <span>Generate Timetable</span>
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
                        Your Optimized Schedule
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
                    {generatedSchedule.map((slot: any, idx: number) => (
                        <div key={idx} className="relative pl-8">
                             {/* Dot */}
                             <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                                 slot.type === 'study' ? 'bg-blue-500' :
                                 slot.type === 'school' ? 'bg-green-500' :
                                 slot.type === 'coaching' ? 'bg-orange-500' :
                                 slot.type === 'routine' ? 'bg-slate-400' :
                                 'bg-slate-800'
                             }`}></div>
                             
                             {/* Time */}
                             <div className="text-xs font-mono font-bold text-slate-400 mb-1">{slot.time} {slot.endTime && <span className="text-slate-300">- {slot.endTime}</span>}</div>
                             
                             {/* Content */}
                             <div className={`rounded-lg p-3 text-sm relative group transition-all hover:shadow-md ${
                                 slot.type === 'study' ? 'bg-blue-50 text-blue-800 border border-blue-100' :
                                 slot.type === 'school' ? 'bg-green-50 text-green-800 border border-green-100' :
                                 slot.type === 'coaching' ? 'bg-orange-50 text-orange-800 border border-orange-100' :
                                 'bg-slate-50 text-slate-600 border border-slate-100'
                             }`}>
                                 <div className="font-bold flex justify-between">
                                    {slot.label}
                                    {slot.endTime && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />}
                                 </div>
                                 {slot.type === 'study' && <div className="text-xs opacity-75 mt-1 font-medium">Recommended: Focus on Weak Topics</div>}
                             </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">This schedule is generated based on your inputs.</p>
                </div>
            </div>
        )}
    </div>
  );
};

export default TimetableGenerator;