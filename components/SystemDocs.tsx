

import React from 'react';
import { generateSQLSchema, generatePHPAuth, generateFrontendGuide, generateHtaccess, getDeploymentPhases } from '../services/generatorService';
import { Download, Database, Code, Terminal, FileCode, BookOpen, CheckCircle } from 'lucide-react';

const SystemDocs: React.FC = () => {
    
    const downloadFile = (filename: string, content: string) => {
        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const phases = getDeploymentPhases();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">System Documentation</h2>
                        <p className="text-slate-400 text-lg max-w-xl">Everything you need to deploy to Hostinger Shared Hosting.</p>
                    </div>
                    <div className="hidden md:block bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                        <Terminal className="w-10 h-10 text-green-400" />
                    </div>
                </div>
                {/* Decor */}
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-green-600/20 rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-1/3 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                
                {/* DEPLOYMENT WALKTHROUGH (New Separated Blocks) */}
                <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center"><BookOpen className="mr-2 w-6 h-6 text-blue-600"/> Deployment Walkthrough</h3>
                        <button 
                            onClick={() => downloadFile('HOSTINGER_GUIDE.md', generateFrontendGuide())}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-colors text-sm font-bold"
                        >
                            <Download className="w-4 h-4 mr-2" /> Download Full Manual
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {phases.map((phase, idx) => (
                            <div key={idx} className={`rounded-xl border p-5 shadow-sm hover:shadow-md transition-all ${phase.bg} ${idx === 4 ? 'lg:col-span-1 md:col-span-2' : ''}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className={`font-bold text-lg ${phase.color}`}>{phase.title}</h4>
                                    <span className="text-[10px] uppercase font-bold bg-white/50 px-2 py-1 rounded text-slate-600">{phase.subtitle}</span>
                                </div>
                                <ul className="space-y-2">
                                    {phase.steps.map((step, sIdx) => (
                                        <li key={sIdx} className="flex items-start text-sm text-slate-700">
                                            <CheckCircle className={`w-4 h-4 mr-2 mt-0.5 shrink-0 ${phase.color}`} />
                                            <span className="leading-tight">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 1. SQL Schema */}
                <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl overflow-hidden shadow-lg font-mono text-xs border border-slate-800">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                        <h3 className="text-white font-bold flex items-center"><Database className="mr-2 w-4 h-4 text-green-400"/> 1. MySQL Schema</h3>
                        <button 
                            onClick={() => downloadFile('database.sql', generateSQLSchema())}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded flex items-center transition-colors border border-slate-600"
                        >
                            <Download className="w-3 h-3 mr-1" /> Download .sql
                        </button>
                    </div>
                    <div className="p-2 mb-2 text-slate-500 font-sans italic">Import this file into phpMyAdmin to create all tables and seed data.</div>
                    <pre className="overflow-x-auto h-32 text-green-400 no-scrollbar p-2 bg-black/20 rounded-lg">
                        {generateSQLSchema().substring(0, 500)}...
                    </pre>
                </div>

                {/* 2. PHP Backend */}
                <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl overflow-hidden shadow-lg font-mono text-xs border border-slate-800">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                        <h3 className="text-white font-bold flex items-center"><Code className="mr-2 w-4 h-4 text-purple-400"/> 2. PHP Backend API</h3>
                        <button 
                            onClick={() => downloadFile('api_scripts.txt', generatePHPAuth())}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded flex items-center transition-colors border border-slate-600"
                        >
                            <Download className="w-3 h-3 mr-1" /> Download Scripts
                        </button>
                    </div>
                    <div className="p-2 mb-2 text-slate-500 font-sans italic">Contains code for login.php, register.php, config.php, etc. Create 'api' folder and paste these.</div>
                    <pre className="overflow-x-auto h-32 text-purple-400 no-scrollbar p-2 bg-black/20 rounded-lg">
                        {generatePHPAuth().substring(0, 500)}...
                    </pre>
                </div>

                {/* 3. Server Config (.htaccess) */}
                <div className="md:col-span-2 bg-slate-800 text-slate-300 p-6 rounded-2xl overflow-hidden shadow-xl font-mono text-xs border border-slate-700">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                        <h3 className="text-white font-bold flex items-center"><FileCode className="mr-2 w-4 h-4 text-orange-400"/> 3. Server Config (.htaccess)</h3>
                        <button 
                            onClick={() => downloadFile('.htaccess', generateHtaccess())}
                            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-1.5 rounded flex items-center shadow-lg transition-colors"
                        >
                            <Download className="w-3 h-3 mr-1" /> Download File
                        </button>
                    </div>
                    <div className="p-3 bg-orange-900/20 rounded border border-orange-500/30 mb-4">
                        <p className="text-orange-300 font-sans text-sm">
                            <strong>Crucial:</strong> Upload this file to your <code>public_html</code> folder. It prevents "404 Not Found" errors when you refresh pages.
                        </p>
                    </div>
                    <pre className="overflow-x-auto h-24 text-slate-300 whitespace-pre-wrap no-scrollbar p-2 bg-black/40 rounded-lg border border-slate-700/50">
                        {generateHtaccess()}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default SystemDocs;