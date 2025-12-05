
import React, { useState } from 'react';
import { TestRunnerEngine, expect, TestResult } from '../utils/testFramework';
import { Play, CheckCircle2, XCircle, Terminal, AlertTriangle, Loader2, Download } from 'lucide-react';

const TestRunner: React.FC = () => {
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

        // ==========================================
        // 2. STUDENT WORKFLOWS
        // ==========================================
        engine.describe("2. [Student] Auth & Profile", (it) => {
            let user: any;
            it("should register a new Student", async () => {
                user = await registerUser('STUDENT', 'Student One');
                if(!user) throw new Error("Registration failed");
                expect(user.role).toBe('STUDENT');
            });
            it("should verify 6-digit ID format", async () => {
                if(!user) throw new Error("Setup failed");
                const id = parseInt(user.id);
                expect(id).toBeGreaterThan(99999);
                expect(id).toBeLessThan(1000000);
            });
            it("should update profile details", async () => {
                if(!user) throw new Error("Setup failed");
                await fetchApi('/api/manage_users.php', {
                    method: 'PUT',
                    body: JSON.stringify({ id: user.id, name: 'Updated Student Name', targetExam: 'BITSAT' })
                });
                const allUsers = await fetchApi('/api/get_users.php');
                const updated = allUsers.find((u: any) => u.id == user.id);
                expect(updated.name).toBe('Updated Student Name');
            });
        });

        engine.describe("3. [Student] Syllabus Sync", (it) => {
            let user: any;
            it("should setup Student session", async () => {
                user = await registerUser('STUDENT', 'Syllabus User');
                if(!user) throw new Error("Registration failed");
            });
            it("should save topic progress", async () => {
                if(!user) throw new Error("Setup failed");
                await fetchApi('/api/sync_progress.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: user.id, topic_id: 'p_kin_1', status: 'COMPLETED',
                        ex1Solved: 30, ex1Total: 30
                    })
                });
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const topic = data.progress.find((p: any) => p.topic_id === 'p_kin_1');
                expect(topic.status).toBe('COMPLETED');
            });
        });

        engine.describe("4. [Student] Task Management", (it) => {
            let user: any;
            it("should setup Student session", async () => {
                user = await registerUser('STUDENT', 'Task User');
                if(!user) throw new Error("Registration failed");
            });
            it("should create Backlog Item", async () => {
                const bid = `b_${timestamp}`;
                await fetchApi('/api/manage_backlogs.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: bid, user_id: user.id, title: 'Finish Rotational',
                        subjectId: 'phys', priority: 'HIGH', deadline: '2025-01-01', status: 'PENDING'
                    })
                });
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const item = data.backlogs.find((b: any) => b.id === bid);
                expect(item).toBeDefined();
            });
            it("should create Daily Goal", async () => {
                const gid = `g_${timestamp}`;
                await fetchApi('/api/manage_goals.php', {
                    method: 'POST',
                    body: JSON.stringify({ id: gid, user_id: user.id, text: 'Solve 50 Qs' })
                });
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                expect(data.goals.some((g: any) => g.id === gid)).toBe(true);
            });
        });

        engine.describe("5. [Student] Timetable Config", (it) => {
            let user: any;
            it("should setup Student session", async () => {
                user = await registerUser('STUDENT', 'Time User');
                if(!user) throw new Error("Registration failed");
            });
            it("should save and retrieve schedule", async () => {
                if(!user) throw new Error("Setup failed");
                await fetchApi('/api/save_timetable.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: user.id,
                        config: { wakeTime: '06:00' },
                        slots: [{ label: 'Study Physics', iconType: 'sun', time: '06:00 AM' }]
                    })
                });
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                expect(data.timetable.slots[0].iconType).toBe('sun');
            });
        });

        engine.describe("6. [Student] Exam Engine", (it) => {
            let user: any;
            it("should setup Student session", async () => {
                user = await registerUser('STUDENT', 'Exam User');
                if(!user) throw new Error("Registration failed");
            });
            it("should submit test attempt", async () => {
                await fetchApi('/api/save_attempt.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: user.id,
                        testId: 'test_jee_main_2024',
                        score: 120,
                        totalQuestions: 30,
                        correctCount: 30,
                        incorrectCount: 0,
                        accuracy_percent: 100,
                        detailedResults: [
                            { questionId: 'p_1', status: 'CORRECT', selectedOptionIndex: 3 }
                        ]
                    })
                });
            });
        });

        engine.describe("7. [Student] Analytics Data", (it) => {
            let user: any;
            it("should setup Student session", async () => {
                user = await registerUser('STUDENT', 'Analytics User');
                // Simulate test first
                await fetchApi('/api/save_attempt.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: user.id, testId: 't1', score: 100, totalQuestions: 10, correctCount: 10, incorrectCount: 0, accuracy_percent: 100,
                        detailedResults: [{ questionId: 'p_1', status: 'CORRECT', selectedOptionIndex: 3 }]
                    })
                });
            });
            it("should retrieve attempt with Topic Metadata", async () => {
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const attempt = data.attempts[0];
                expect(attempt).toBeDefined();
                // Critical: JOIN check
                if (attempt.detailedResults && attempt.detailedResults.length > 0) {
                    const detail = attempt.detailedResults[0];
                    expect(detail.subjectId).toBe('phys'); // Assumes p_1 is Physics
                } else {
                    throw new Error("Detailed results not saved or retrieved");
                }
            });
        });

        // ==========================================
        // 3. PARENT WORKFLOWS
        // ==========================================
        engine.describe("8. [Parent] Connection Flow", (it) => {
            let student: any, parent: any;
            it("should register pair", async () => {
                student = await registerUser('STUDENT', 'Kiddo');
                parent = await registerUser('PARENT', 'Guardian');
            });
            it("should search student", async () => {
                const res = await fetchApi('/api/send_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'search', query: 'Kiddo' })
                });
                expect(res.some((u: any) => u.id == student.id)).toBe(true);
            });
            it("should link accounts", async () => {
                await fetchApi('/api/send_request.php', { method: 'POST', body: JSON.stringify({ student_identifier: student.email, parent_id: parent.id, parent_name: parent.name }) });
                await fetchApi('/api/respond_request.php', { method: 'POST', body: JSON.stringify({ student_id: student.id, parent_id: parent.id, accept: true }) });
            });
        });

        engine.describe("9. [Parent] Monitoring", (it) => {
            let student: any;
            it("should setup Student data", async () => {
                student = await registerUser('STUDENT', 'Monitored Kid');
                await fetchApi('/api/sync_progress.php', {
                    method: 'POST',
                    body: JSON.stringify({ user_id: student.id, topic_id: 'p_kin_1', status: 'COMPLETED' })
                });
            });
            it("should verify Parent sees data", async () => {
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                const topic = data.progress.find((p: any) => p.topic_id === 'p_kin_1');
                expect(topic.status).toBe('COMPLETED');
            });
        });

        // ==========================================
        // 4. ADMIN WORKFLOWS
        // ==========================================
        engine.describe("10. [Admin] User Management", (it) => {
            let target: any;
            it("should setup Target", async () => {
                target = await registerUser('STUDENT', 'Target User');
            });
            it("should block user", async () => {
                await fetchApi('/api/manage_users.php', {
                    method: 'PUT',
                    body: JSON.stringify({ id: target.id, isVerified: false, name: target.name })
                });
                const users = await fetchApi('/api/get_users.php');
                const u = users.find((x: any) => x.id == target.id);
                expect(u.isVerified == 0).toBe(true);
            });
            it("should delete user", async () => {
                await fetchApi(`/api/manage_users.php?id=${target.id}`, { method: 'DELETE' });
                const users = await fetchApi('/api/get_users.php');
                expect(users.find((x: any) => x.id == target.id)).toBe(undefined);
            });
        });

        engine.describe("11. [Admin] Content Operations", (it) => {
            it("should create Notification", async () => {
                const nid = `n_${timestamp}`;
                await fetchApi('/api/manage_broadcasts.php', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'send_notification', id: nid, title: 'Test', message: 'Msg', type: 'INFO' })
                });
                const common = await fetchApi('/api/get_common.php');
                expect(common.notifications.some((n: any) => n.id === nid)).toBe(true);
            });
            it("should create Test", async () => {
                const tid = `t_${timestamp}`;
                await fetchApi('/api/manage_tests.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        action: 'create_test', id: tid, title: 'Admin Test',
                        durationMinutes: 60, difficulty: 'MAINS', examType: 'JEE', questions: []
                    })
                });
                const common = await fetchApi('/api/get_common.php');
                expect(common.tests.some((t: any) => t.id === tid)).toBe(true);
            });
        });

        engine.describe("12. [Admin] Inbox Flow", (it) => {
            it("should receive public message", async () => {
                const sub = `Subject_${timestamp}`;
                await fetchApi('/api/contact.php', {
                    method: 'POST',
                    body: JSON.stringify({ name: 'Public', email: 'p@test.com', subject: sub, message: 'Hello' })
                });
                const msgs = await fetchApi('/api/manage_contact.php?method=GET');
                expect(msgs.some((m: any) => m.subject === sub)).toBe(true);
            });
        });

        // ==========================================
        // 5. SYSTEM FEATURES
        // ==========================================
        engine.describe("13. [System] Study Tools", (it) => {
            it("should have seeded Flashcards", async () => {
                const data = await fetchApi('/api/get_common.php');
                expect(data.flashcards.length).toBeGreaterThan(0);
                expect(data.flashcards[0].front).toBeDefined();
            });
            it("should have seeded Memory Hacks", async () => {
                const data = await fetchApi('/api/get_common.php');
                expect(data.hacks.length).toBeGreaterThan(0);
            });
        });

        engine.describe("14. [System] Revision Logic", (it) => {
            let user: any;
            it("should setup user", async () => { user = await registerUser('STUDENT', 'Rev User'); });
            it("should save revision date", async () => {
                await fetchApi('/api/sync_progress.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: user.id, topic_id: 'p_kin_1', status: 'COMPLETED',
                        revisionCount: 1, nextRevisionDate: '2025-12-31'
                    })
                });
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const topic = data.progress.find((p: any) => p.topic_id === 'p_kin_1');
                expect(topic.next_revision_date).toBe('2025-12-31');
            });
        });

        engine.describe("15. [Security] Access Control", (it) => {
            let user: any;
            it("should setup & block user", async () => { 
                user = await registerUser('STUDENT', 'Bad User'); 
                await fetchApi('/api/manage_users.php', {
                    method: 'PUT',
                    body: JSON.stringify({ id: user.id, isVerified: false, name: user.name })
                });
            });
            it("should prevent login for blocked user", async () => {
                try {
                    await fetchApi('/api/login.php', {
                        method: 'POST',
                        body: JSON.stringify({ email: user.email, password: 'TestPass123' })
                    });
                    throw new Error("Login should have failed");
                } catch (e: any) {
                    expect(e.message).toContain("Invalid"); // Or whatever message API returns for blocked
                }
            });
        });

        engine.describe("16. [System] Database Schema I/O", (it) => {
            it("should verify all tables exist", async () => {
                const data = await fetchApi('/api/test_db.php');
                expect(data.tables.length).toBeGreaterThan(15);
            });
        });

        const finalResults = await engine.runAll();
        setResults(finalResults);
        setIsRunning(false);
        setProgress('');
    };

    const generateReport = () => {
        if (!results) return;
        const report = {
            metadata: { timestamp: new Date().toISOString(), url: window.location.href, appVersion: 'v3.9' },
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
            {Array.from({length: 16}, (_, i) => `Suite ${i+1}`).map(s => (
                <div key={s} className="bg-white p-3 rounded border border-slate-200 text-xs font-bold text-slate-400">
                    {s}: Pending...
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6 animate-in fade-in">
            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center mb-2">
                        <Terminal className="w-8 h-8 mr-3 text-green-400" />
                        System Diagnostics
                    </h1>
                    <p className="text-slate-400">Full 16-Suite Validation for Production (v3.9).</p>
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
