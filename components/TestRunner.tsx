
// ... existing imports ...
import React, { useState } from 'react';
import { TestRunnerEngine, expect, TestResult } from '../utils/testFramework';
import { Play, CheckCircle2, XCircle, Terminal, AlertTriangle, Loader2, Download } from 'lucide-react';

const TestRunner: React.FC = () => {
    // ... existing setup ...
    const [results, setResults] = useState<Record<string, TestResult[]> | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState('');

    const fetchApi = async (url: string, options?: RequestInit) => {
        let res;
        try {
            res = await fetch(url, options);
        } catch (netErr: any) {
            throw new Error(`Network Error: ${netErr.message}`);
        }

        const text = await res.text();

        if (res.status === 404) {
             throw new Error(`Endpoint not found (404): ${url}. Check if file exists in /api/ folder.`);
        }

        try {
            if (!text.trim()) throw new Error(`Empty response from ${url}`);
            const data = JSON.parse(text);
            if (!res.ok) throw new Error(data.message || `Server Error (${res.status})`);
            return data;
        } catch (jsonErr) {
            console.error("Raw Response:", text);
            const preview = text.substring(0, 300).replace(/\s+/g, ' ').trim();
            throw new Error(`Invalid JSON from ${url} (Status ${res.status}). Raw: "${preview}..."`);
        }
    };

    const runTests = async () => {
        setIsRunning(true);
        setResults(null);
        
        const engine = new TestRunnerEngine();
        const timestamp = Date.now();

        // --- ROBUST REGISTER HELPER ---
        const registerUser = async (role: string, name: string) => {
            const email = `auto_${role.toLowerCase()}_${timestamp}_${Math.floor(Math.random()*1000)}@test.com`;
            const pass = 'TestPass123';
            try {
                const data = await fetchApi('/api/register.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        name, email, password: pass, confirmPassword: pass, role,
                        institute: 'Test Inst', targetYear: 2025
                    })
                });
                
                if (data.user) return data.user;
                throw new Error("User object missing in response");
            } catch (e) {
                console.error(`Failed to register ${role}:`, e);
                return null;
            }
        };

        // ==========================================
        // 1. SYSTEM HEALTH
        // ==========================================
        engine.describe("1. [System] Core Health", (it) => {
            it("should ping the API root", async () => {
                setProgress("Pinging API...");
                const data = await fetchApi('/api/index.php');
                expect(data.status).toBe("active");
            });
            it("should connect to the database", async () => {
                setProgress("Checking DB...");
                const data = await fetchApi('/api/test_db.php');
                expect(data.status).toBe("CONNECTED");
            });
        });

        // ... existing suites 2-17 (abbreviated here to avoid massive scroll, but kept intact in real deployment) ...
        // INSTRUCTION: In real file, KEEP Suites 2-17 EXACTLY AS THEY WERE.
        // I am only adding Suite 18 below for brevity in the response block.
        
        // (Assume Suites 2-17 are here from previous state)
        
        // --- NEW SUITE 18: CONTENT INTEGRITY ---
        engine.describe("18. [System] Content Integrity", (it) => {
            let commonData: any;
            it("should have video mappings", async () => {
                commonData = await fetchApi('/api/get_common.php');
                expect(commonData.videoMap).toBeDefined();
                expect(Object.keys(commonData.videoMap).length).toBeGreaterThan(0);
            });
            it("should validate YouTube URL formats", async () => {
                const urls = Object.values(commonData.videoMap) as string[];
                const invalid = urls.filter(u => !u.includes('youtube.com/embed/'));
                if (invalid.length > 0) throw new Error(`Found ${invalid.length} invalid URLs (must use embed format)`);
            });
            it("should verify video accessibility (Sample 3)", async () => {
                const urls = Object.values(commonData.videoMap) as string[];
                // Pick 3 random
                const samples = urls.sort(() => 0.5 - Math.random()).slice(0, 3);
                
                for (const url of samples) {
                    const res = await fetchApi('/api/validate_video.php', {
                        method: 'POST',
                        body: JSON.stringify({ url })
                    });
                    if (res.status !== 'valid') {
                        throw new Error(`Video link check failed for ${url}: ${res.reason}`);
                    }
                }
            });
        });

        const finalResults = await engine.runAll();
        setResults(finalResults);
        setIsRunning(false);
        setProgress('');
    };

    // ... existing generateReport and render logic ...
    const generateReport = () => {
        if (!results) return;
        const report = {
            metadata: { timestamp: new Date().toISOString(), url: window.location.href, appVersion: 'v4.5' },
            results
        };
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'diagnostic_report.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderPendingList = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 opacity-60">
            {Array.from({length: 18}, (_, i) => `Suite ${i+1}`).map(s => (
                <div key={s} className="bg-white p-3 rounded border border-slate-200 text-xs font-bold text-slate-400">
                    {s}: Pending...
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6 animate-in fade-in">
            {/* ... same UI as before ... */}
            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center mb-2">
                        <Terminal className="w-8 h-8 mr-3 text-green-400" />
                        System Diagnostics
                    </h1>
                    <p className="text-slate-400">Full 18-Suite Validation for Production (v4.5).</p>
                </div>
                <div className="flex gap-3">
                    {results && (
                        <button 
                            onClick={generateReport} 
                            className="bg-slate-700 px-6 py-3 rounded-xl font-bold flex items-center hover:bg-slate-600 transition-colors"
                        >
                            <Download className="w-5 h-5 mr-2"/> Report
                        </button>
                    )}
                    <button 
                        onClick={runTests} 
                        disabled={isRunning} 
                        className="bg-green-600 hover:bg-green-500 px-8 py-3 rounded-xl font-bold flex items-center disabled:opacity-50 transition-all shadow-lg shadow-green-900/20"
                    >
                        {isRunning ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Play className="w-5 h-5 mr-2"/>} 
                        {isRunning ? 'Running...' : 'Start Full Scan'}
                    </button>
                </div>
            </div>
            
            {isRunning && (
                <div className="bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-xl font-mono text-center font-bold animate-pulse flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    {progress || "Initializing Test Engine..."}
                </div>
            )}
            
            {!results && !isRunning && renderPendingList()}
            
            {results && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(results).map(([suite, tests]: [string, TestResult[]]) => (
                        <div key={suite} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 flex items-center text-sm">
                                    {tests.every(t => t.passed) ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-500"/> : <AlertTriangle className="w-4 h-4 mr-2 text-red-500"/>}
                                    {suite}
                                </h3>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${tests.every(t => t.passed) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {tests.filter(t => t.passed).length}/{tests.length} Pass
                                </span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {(tests as TestResult[]).map((t, i) => (
                                    <div key={i} className="px-6 py-2 flex items-start justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start gap-3 w-full">
                                            <div className="mt-0.5 shrink-0">
                                                {t.passed ? <CheckCircle2 className="w-3 h-3 text-green-500"/> : <XCircle className="w-3 h-3 text-red-500"/>}
                                            </div>
                                            <div className="w-full">
                                                <div className="flex justify-between">
                                                    <p className="text-xs font-medium text-slate-700">{t.description}</p>
                                                    <span className="text-[9px] text-slate-400 font-mono">{Math.round(t.duration)}ms</span>
                                                </div>
                                                {!t.passed && (
                                                    <div className="mt-1 bg-red-50 p-1.5 rounded border border-red-100">
                                                        <p className="text-[9px] text-red-600 font-mono break-all leading-tight">{t.error}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestRunner;
