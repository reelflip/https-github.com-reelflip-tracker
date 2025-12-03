
import React, { useState, useEffect, useRef } from 'react';
import { Wind, Coffee, Music, Sun, Play, Pause, Volume2 } from 'lucide-react';

const SOUND_URLS = {
    RAIN: 'https://assets.mixkit.co/active_storage/sfx/2436/2436-preview.mp3',
    FOREST: 'https://assets.mixkit.co/active_storage/sfx/2434/2434-preview.mp3',
    WAVES: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3',
    LOFI: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
    WHITE: 'https://cdn.pixabay.com/audio/2021/08/09/audio_88447e769f.mp3',
    NIGHT: 'https://cdn.pixabay.com/audio/2021/08/04/audio_3109a9695b.mp3'
};

const getSoundLabel = (key: string) => {
    switch(key) {
        case 'RAIN': return 'Rain';
        case 'FOREST': return 'Forest';
        case 'WAVES': return 'Ocean';
        case 'LOFI': return 'Lo-Fi';
        case 'WHITE': return 'White Noise';
        case 'NIGHT': return 'Night';
        default: return key;
    }
};

const WellnessCorner = () => {
    // Breathing State
    const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
    const [isBreathingActive, setIsBreathingActive] = useState(false);
    const [scale, setScale] = useState(1);

    // Audio State
    const [activeSound, setActiveSound] = useState<keyof typeof SOUND_URLS | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Breathing Animation Logic
    useEffect(() => {
        let interval: any;
        if (isBreathingActive) {
            const cycle = async () => {
                // Inhale (4s)
                setBreathingPhase('Inhale');
                setScale(1.5);
                await new Promise(r => setTimeout(r, 4000));
                
                // Hold (4s)
                setBreathingPhase('Hold');
                await new Promise(r => setTimeout(r, 4000));
                
                // Exhale (4s)
                setBreathingPhase('Exhale');
                setScale(1);
                await new Promise(r => setTimeout(r, 4000));
            };

            const runCycle = async () => {
                // eslint-disable-next-line no-constant-condition
                while(isBreathingActive) { 
                   await cycle();
                   if (!isBreathingActive) break; // Safety check
                }
            };
            runCycle();
        } else {
            setScale(1);
            setBreathingPhase('Inhale');
        }
        return () => clearTimeout(interval);
    }, [isBreathingActive]);

    const toggleSound = (type: keyof typeof SOUND_URLS) => {
        // If clicking the currently playing sound, stop it
        if (activeSound === type) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            setActiveSound(null);
            return;
        }

        // Stop previous sound if any
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Play new sound
        const audio = new Audio(SOUND_URLS[type]);
        audio.loop = true;
        audio.volume = 0.5; // Start at 50% volume
        audio.play().catch(err => console.error("Audio playback failed:", err));
        
        audioRef.current = audio;
        setActiveSound(type);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-gradient-to-r from-teal-400 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center space-x-3 mb-2">
                    <Coffee className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Wellness Corner</h2>
                </div>
                <p className="text-teal-50">Take a deep breath. Your mental health is just as important as your physics formulas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Breathing Exercise */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                    <h3 className="font-bold text-slate-700 mb-6 flex items-center">
                        <Wind className="w-5 h-5 mr-2 text-blue-400" /> Box Breathing
                    </h3>
                    
                    <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                        {/* Outer Circles */}
                        <div 
                            className={`absolute inset-0 bg-blue-100 rounded-full opacity-50 transition-all duration-[4000ms] ease-in-out`}
                            style={{ transform: isBreathingActive ? `scale(${scale})` : 'scale(1)' }}
                        ></div>
                        <div 
                            className={`absolute inset-4 bg-blue-200 rounded-full opacity-50 transition-all duration-[4000ms] ease-in-out`}
                            style={{ transform: isBreathingActive ? `scale(${scale})` : 'scale(1)' }}
                        ></div>
                        
                        {/* Core */}
                        <div className="relative z-10 text-slate-700 font-bold text-xl">
                            {isBreathingActive ? breathingPhase : 'Start'}
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsBreathingActive(!isBreathingActive)}
                        className={`px-8 py-3 rounded-full font-bold transition-all ${
                            isBreathingActive 
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                        }`}
                    >
                        {isBreathingActive ? 'Stop Exercise' : 'Start Breathing'}
                    </button>
                </div>

                {/* Tips & Audio */}
                <div className="space-y-4">
                    <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                        <h4 className="font-bold text-orange-800 mb-2 flex items-center"><Sun className="w-4 h-4 mr-2"/> 5-Minute Desk Yoga</h4>
                        <ul className="text-sm text-orange-800/80 space-y-2 list-disc list-inside">
                            <li>Neck Rolls: Slowly roll your head in circles.</li>
                            <li>Shoulder Shrugs: Lift shoulders to ears, drop.</li>
                            <li>Seated Twist: Twist torso to the left, hold, then right.</li>
                        </ul>
                    </div>

                    <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                        <h4 className="font-bold text-purple-800 mb-2 flex items-center justify-between">
                            <span className="flex items-center"><Music className="w-4 h-4 mr-2"/> Ambient Focus Sounds</span>
                            {activeSound && <Volume2 className="w-4 h-4 animate-pulse" />}
                        </h4>
                        <p className="text-sm text-purple-800/80 mb-3">Listening to binaural beats or white noise can reduce anxiety.</p>
                        <div className="grid grid-cols-3 gap-3">
                             {(Object.keys(SOUND_URLS) as Array<keyof typeof SOUND_URLS>).map((sound) => (
                                 <button 
                                    key={sound}
                                    onClick={() => toggleSound(sound)}
                                    className={`py-3 px-2 rounded-lg text-xs font-bold shadow-sm transition-all flex flex-col items-center justify-center space-y-2 ${
                                        activeSound === sound 
                                        ? 'bg-purple-600 text-white shadow-md transform scale-105' 
                                        : 'bg-white text-purple-700 hover:bg-purple-100'
                                    }`}
                                 >
                                     {activeSound === sound ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                     <span>{getSoundLabel(sound)}</span>
                                 </button>
                             ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WellnessCorner;
