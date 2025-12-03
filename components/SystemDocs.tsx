
import React from 'react';
import { generateSQLSchema, generatePHPAuth, generateFrontendGuide, generateGitHubAction } from '../services/generatorService';
import { Download, Database, Code, Rocket, Terminal, Shield } from 'lucide-react';

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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">System Documentation</h2>
                        <p className="text-slate-400 text-lg max-w-xl">Deployment guides, database schemas, and backend API scripts.</p>
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
                {/* SQL Schema */}
                <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl overflow-hidden shadow-lg font-mono text-xs border border-slate-800">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                        <h3 className="text-white font-bold flex items-center"><Database className="mr-2 w-4 h-4 text-green-400"/> MySQL Schema</h3>
                        <button 
                            onClick={() => downloadFile('database.sql', generateSQLSchema())}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded flex items-center transition-colors border border-slate-600"
                        >
                            <Download className="w-3 h-3 mr-1" /> Download
                        </button>
                    </div>
                    <pre className="overflow-x-auto h-48 text-green-400 no-scrollbar p-2 bg-black/20 rounded-lg">
                        {generateSQLSchema()}
                    </pre>
                </div>

                {/* PHP Backend */}
                <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl overflow-hidden shadow-lg font-mono text-xs border border-slate-800">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                        <h3 className="text-white font-bold flex items-center"><Code className="mr-2 w-4 h-4 text-purple-400"/> PHP Backend API</h3>
                        <button 
                            onClick={() => downloadFile('api_scripts.php', generatePHPAuth())}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded flex items-center transition-colors border border-slate-600"
                        >
                            <Download className="w-3 h-3 mr-1" /> Download
                        </button>
                    </div>
                    <pre className="overflow-x-auto h-48 text-purple-400 no-scrollbar p-2 bg-black/20 rounded-lg">
                        {generatePHPAuth()}
                    </pre>
                </div>

                {/* Automated Deploy (GitHub Action) */}
                <div className="bg-slate-800 text-slate-300 p-6 rounded-2xl overflow-hidden shadow-xl font-mono text-xs border border-slate-700">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                        <h3 className="text-white font-bold flex items-center"><Rocket className="mr-2 w-4 h-4 text-orange-400"/> Automated Deployment</h3>
                        <button 
                            onClick={() => downloadFile('deploy.yml', generateGitHubAction())}
                            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-1.5 rounded flex items-center shadow-lg transition-colors"
                        >
                            <Download className="w-3 h-3 mr-1" /> Download .yml
                        </button>
                    </div>
                        <div className="p-3 bg-orange-900/20 rounded border border-orange-500/30 mb-4">
                        <p className="text-orange-300 font-sans text-sm">
                            Use this if you cannot run 'npm build' locally. GitHub will build and upload your site for you.
                        </p>
                    </div>
                    <pre className="overflow-x-auto h-24 text-slate-300 whitespace-pre-wrap no-scrollbar p-2 bg-black/40 rounded-lg border border-slate-700/50">
                        {generateGitHubAction()}
                    </pre>
                </div>
                
                {/* Integration Guide */}
                <div className="md:col-span-2 bg-slate-800 text-slate-300 p-6 rounded-2xl overflow-hidden shadow-xl font-mono text-xs border border-slate-700">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                        <h3 className="text-white font-bold flex items-center"><Terminal className="mr-2 w-4 h-4 text-blue-400"/> Developer Integration Guide</h3>
                        <button 
                            onClick={() => downloadFile('INTEGRATION_GUIDE.md', generateFrontendGuide())}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded flex items-center shadow-lg transition-colors"
                        >
                            <Download className="w-3 h-3 mr-1" /> Download Guide
                        </button>
                    </div>
                    <div className="p-3 bg-blue-900/20 rounded border border-blue-500/30 mb-4">
                        <p className="text-blue-300 font-sans text-sm">Follow these steps to connect this React App to the PHP/MySQL backend after deployment.</p>
                    </div>
                    <pre className="overflow-x-auto h-80 text-slate-300 whitespace-pre-wrap no-scrollbar p-4 bg-black/40 rounded-xl border border-slate-700/50">
                        {generateFrontendGuide()}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default SystemDocs;
