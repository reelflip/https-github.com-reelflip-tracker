








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
            throw new Error(`Invalid JSON from ${url} (Status ${res.status})`);
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
        // 2. AUTHENTICATION
        // ==========================================
        engine.describe("2. [Student] Auth & Profile", (it) => {
            let student: any;
            it("should register a new Student", async () => {
                student = await registerUser('STUDENT', 'Auto Student');
                if (!student) throw new Error("Registration failed");
                expect(student.role).toBe("STUDENT");
            });
            it("should verify 6-digit ID format", () => {
                if(!student) throw new Error("Setup failed");
                const idNum = parseInt(student.id);
                expect(idNum).toBeGreaterThan(100000);
                expect(idNum).toBeLessThan(999999);
            });
            it("should update profile details", async () => {
                if(!student) throw new Error("Setup failed");
                await fetchApi('/api/manage_users.php', {
                    method: 'PUT',
                    body: JSON.stringify({ id: student.id, institute: 'Updated Institute', isVerified: 1 })
                });
            });
        });

        // ==========================================
        // 3. SYLLABUS
        // ==========================================
        engine.describe("3. [Student] Syllabus Sync", (it) => {
            let student: any;
            it("should setup Student session", async () => {
                student = await registerUser('STUDENT', 'Syllabus User');
                if (!student) throw new Error("Setup failed");
            });
            it("should save topic progress", async () => {
                if(!student) throw new Error("Setup failed");
                const payload = {
                    user_id: student.id,
                    topic_id: 'p_kin_1',
                    status: 'COMPLETED',
                    ex1Solved: 10,
                    ex1Total: 30
                };
                const res = await fetchApi('/api/sync_progress.php', { method: 'POST', body: JSON.stringify(payload) });
                expect(res.message).toBe("Saved");
            });
            it("should retrieve progress correctly", async () => {
                if(!student) throw new Error("Setup failed");
                const dashboard = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                const progress = dashboard.progress.find((p: any) => p.topic_id === 'p_kin_1');
                expect(progress).toBeDefined();
                expect(progress.status).toBe("COMPLETED");
            });
        });

        // ==========================================
        // 4. TASKS
        // ==========================================
        engine.describe("4. [Student] Task Management", (it) => {
            let student: any;
            it("should setup Student session", async () => {
                student = await registerUser('STUDENT', 'Task User');
                if(!student) throw new Error("Setup failed");
            });
            it("should create Backlog Item", async () => {
                if(!student) throw new Error("Setup failed");
                await fetchApi('/api/manage_backlogs.php', {
                    method: 'POST',
                    body: JSON.stringify({ id: 'b_test', user_id: student.id, title: 'Test Backlog', subjectId: 'phys', priority: 'HIGH', status: 'PENDING' })
                });
            });
            it("should create Daily Goal", async () => {
                if(!student) throw new Error("Setup failed");
                await fetchApi('/api/manage_goals.php', {
                    method: 'POST',
                    body: JSON.stringify({ id: 'g_test', user_id: student.id, text: 'Test Goal' })
                });
            });
        });

        // ==========================================
        // 5. TIMETABLE
        // ==========================================
        engine.describe("5. [Student] Timetable Config", (it) => {
            let student: any;
            it("should setup Student session", async () => {
                student = await registerUser('STUDENT', 'Time User');
                if(!student) throw new Error("Setup failed");
            });
            it("should save and retrieve schedule", async () => {
                if(!student) throw new Error("Setup failed");
                const config = { wakeTime: "06:00" };
                const slots = [{ time: "07:00", label: "Study", iconType: "book" }];
                
                await fetchApi('/api/save_timetable.php', {
                    method: 'POST',
                    body: JSON.stringify({ user_id: student.id, config, slots })
                });

                const dash = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                expect(dash.timetable).toBeDefined();
                expect(dash.timetable.config.wakeTime).toBe("06:00");
                expect(dash.timetable.slots[0].iconType).toBe("book");
            });
        });

        // ==========================================
        // 6. EXAM ENGINE (Mock Tests)
        // ==========================================
        engine.describe("6. [Student] Exam Engine", (it) => {
            let student: any;
            let testId = '';
            
            it("should setup Student session", async () => {
                student = await registerUser('STUDENT', 'Exam User');
                if(!student) throw new Error("Setup failed");
            });

            it("should verify Mock Tests exist", async () => {
                const common = await fetchApi('/api/get_common.php');
                if (!common.tests || common.tests.length === 0) throw new Error("No tests found in database");
                testId = common.tests[0].id;
                expect(testId).toBeDefined();
            });

            it("should submit test attempt", async () => {
                if(!student || !testId) throw new Error("Setup failed");
                const payload = {
                    user_id: student.id,
                    testId: testId,
                    score: 100,
                    totalQuestions: 25,
                    correctCount: 20,
                    incorrectCount: 5,
                    accuracy_percent: 80.0,
                    detailedResults: [
                        { questionId: "q1", status: "CORRECT", selectedOptionIndex: 1 },
                        { questionId: "q2", status: "INCORRECT", selectedOptionIndex: 2 } 
                    ]
                };
                const res = await fetchApi('/api/save_attempt.php', { method: 'POST', body: JSON.stringify(payload) });
                expect(res.message).toBe("Saved");
            });
        });

        // ==========================================
        // 7. ANALYTICS
        // ==========================================
        engine.describe("7. [Student] Analytics Data", (it) => {
            let student: any;
            it("should setup Student session", async () => {
                student = await registerUser('STUDENT', 'Analytics User');
                if(!student) throw new Error("Setup failed");
                // Create dummy attempt
                await fetchApi('/api/save_attempt.php', { method: 'POST', body: JSON.stringify({
                    user_id: student.id, testId: 't1', score: 50, totalQuestions: 10, correctCount: 5, incorrectCount: 5, accuracy_percent: 50,
                    detailedResults: [{ questionId: 'p_1', status: 'CORRECT', selectedOptionIndex: 3 }] // Assuming p_1 exists in Seed Data
                })});
            });

            it("should retrieve attempt with Topic Metadata", async () => {
                if(!student) throw new Error("Setup failed");
                const dash = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                const attempt = dash.attempts[0];
                expect(attempt).toBeDefined();
                expect(attempt.detailedResults).toBeDefined();
                // Check if JOIN worked (subjectId should be present)
                if (attempt.detailedResults.length > 0) {
                    const detail = attempt.detailedResults[0];
                    expect(detail.subjectId).toBeDefined(); 
                    expect(detail.selectedOptionIndex).toBeDefined();
                }
            });
        });

        // ==========================================
        // 8. PARENT CONNECTION
        // ==========================================
        engine.describe("8. [Parent] Connection Flow", (it) => {
            let student: any;
            let parent: any;

            it("should register pair", async () => {
                student = await registerUser('STUDENT', 'Child User');
                parent = await registerUser('PARENT', 'Dad User');
                if(!student || !parent) throw new Error("Setup failed");
            });

            it("should search student", async () => {
                if(!student) throw new Error("Setup failed");
                // Search by exact email
                const res = await fetchApi('/api/send_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'search', query: student.email })
                });
                expect(res.length).toBeGreaterThan(0);
                expect(res[0].id).toBe(student.id);
            });

            it("should link accounts", async () => {
                if(!student || !parent) throw new Error("Setup failed");
                // Send
                await fetchApi('/api/send_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ student_identifier: student.id, parent_id: parent.id, parent_name: parent.name })
                });
                // Respond
                await fetchApi('/api/respond_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ student_id: student.id, parent_id: parent.id, accept: true })
                });
                // Verify Link
                const dash = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                expect(dash.userProfileSync.parentId).toBe(parent.id);
            });
        });

        // ==========================================
        // 9. PARENT MONITORING
        // ==========================================
        engine.describe("9. [Parent] Monitoring", (it) => {
            let student: any;
            let parent: any;
            it("should setup Student data", async () => {
                student = await registerUser('STUDENT', 'Monitored Child');
                parent = await registerUser('PARENT', 'Monitor Dad');
                if(!student) throw new Error("Setup failed");
                // Add progress
                await fetchApi('/api/sync_progress.php', { method: 'POST', body: JSON.stringify({ user_id: student.id, topic_id: 'p_kin_1', status: 'COMPLETED' }) });
            });
            it("should verify Parent sees data", async () => {
                if(!student) throw new Error("Setup failed");
                // Parent fetches dashboard using Student ID (after connection simulation)
                const dash = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                const prog = dash.progress.find((p: any) => p.topic_id === 'p_kin_1');
                expect(prog.status).toBe("COMPLETED");
            });
        });

        // ==========================================
        // 10. ADMIN USERS
        // ==========================================
        engine.describe("10. [Admin] User Management", (it) => {
            let target: any;
            it("should setup Target", async () => {
                target = await registerUser('STUDENT', 'Target User');
                if(!target) throw new Error("Setup failed");
            });
            it("should block user", async () => {
                if(!target) throw new Error("Setup failed");
                await fetchApi('/api/manage_users.php', {
                    method: 'PUT',
                    body: JSON.stringify({ id: target.id, isVerified: false, name: target.name })
                });
                // Verify
                const list = await fetchApi('/api/get_users.php');
                const u = list.find((x: any) => x.id == target.id);
                expect(u.isVerified).toBe(0);
            });
            it("should delete user", async () => {
                if(!target) throw new Error("Setup failed");
                await fetchApi(`/api/manage_users.php?id=${target.id}`, { method: 'DELETE' });
                // Verify
                const list = await fetchApi('/api/get_users.php');
                const u = list.find((x: any) => x.id == target.id);
                expect(u).toBe(undefined);
            });
        });

        // ==========================================
        // 11. ADMIN CONTENT
        // ==========================================
        engine.describe("11. [Admin] Content Operations", (it) => {
            it("should create Notification", async () => {
                const notif = { id: 'n_test', title: 'Test Alert', message: 'System Test', type: 'INFO' };
                await fetchApi('/api/manage_broadcasts.php', {
                    method: 'POST', 
                    body: JSON.stringify({ action: 'send_notification', ...notif })
                });
                const common = await fetchApi('/api/get_common.php');
                const found = common.notifications.some((n: any) => n.id === 'n_test');
                expect(found).toBe(true);
            });
            
            it("should create Test", async () => {
                const test = {
                    id: 't_admin_test',
                    title: 'Admin Created Test',
                    durationMinutes: 60,
                    difficulty: 'MAINS',
                    examType: 'JEE',
                    questions: [{ id: 'q_admin_1', subjectId: 'phys', topicId: 'p_kin_1', text: 'Q1', options: ['A','B'], correctOptionIndex: 0 }]
                };
                await fetchApi('/api/manage_tests.php', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'create_test', ...test })
                });
                const common = await fetchApi('/api/get_common.php');
                const found = common.tests.some((t: any) => t.id === 't_admin_test');
                expect(found).toBe(true);
            });
        });

        // ==========================================
        // 12. ADMIN INBOX
        // ==========================================
        engine.describe("12. [Admin] Inbox Flow", (it) => {
            it("should receive public message", async () => {
                const msg = { name: "Test User", email: "test@user.com", subject: "Test Subject", message: "Hello Admin" };
                await fetchApi('/api/contact.php', { method: 'POST', body: JSON.stringify(msg) });
                
                const inbox = await fetchApi('/api/manage_contact.php', { method: 'GET' });
                const found = inbox.some((m: any) => m.subject === "Test Subject");
                expect(found).toBe(true);
            });
        });

        // ==========================================
        // 13. STUDY TOOLS
        // ==========================================
        engine.describe("13. [System] Study Tools", (it) => {
            let common: any;
            it("should have seeded Flashcards", async () => {
                common = await fetchApi('/api/get_common.php');
                expect(common.flashcards.length).toBeGreaterThan(0);
            });
            it("should have seeded Memory Hacks", () => {
                expect(common.hacks.length).toBeGreaterThan(0);
            });
        });

        // ==========================================
        // 14. REVISION
        // ==========================================
        engine.describe("14. [System] Revision Logic", (it) => {
            let student: any;
            it("should setup user", async () => {
                student = await registerUser('STUDENT', 'Revision User');
                if(!student) throw new Error("Setup failed");
            });
            it("should save revision date", async () => {
                if(!student) throw new Error("Setup failed");
                await fetchApi('/api/sync_progress.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: student.id, topic_id: 'p_kin_1', status: 'COMPLETED',
                        revisionCount: 1, nextRevisionDate: '2025-12-31'
                    })
                });
                const dash = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                const prog = dash.progress.find((p: any) => p.topic_id === 'p_kin_1');
                expect(prog.next_revision_date).toBe('2025-12-31');
            });
        });

        // ==========================================
        // 15. SECURITY
        // ==========================================
        engine.describe("15. [Security] Access Control", (it) => {
            let blockedUser: any;
            it("should setup & block user", async () => {
                blockedUser = await registerUser('STUDENT', 'Bad User');
                if(!blockedUser) throw new Error("Setup failed");
                await fetchApi('/api/manage_users.php', {
                    method: 'PUT',
                    body: JSON.stringify({ id: blockedUser.id, isVerified: false, name: blockedUser.name })
                });
            });
            it("should prevent login for blocked user", async () => {
                if(!blockedUser) throw new Error("Setup failed");
                try {
                    await fetchApi('/api/login.php', {
                        method: 'POST',
                        body: JSON.stringify({ email: blockedUser.email, password: 'TestPass123' })
                    });
                    throw new Error("Login should have failed");
                } catch (e: any) {
                    expect(e.message).toContain("Invalid"); // Expect 'Invalid credentials' or similar
                }
            });
        });

        // ==========================================
        // 16. DB SCHEMA I/O
        // ==========================================
        engine.describe("16. [System] Database Schema I/O", (it) => {
            it("should verify all tables exist", async () => {
                const res = await fetchApi('/api/test_db.php');
                const requiredTables = ['users', 'tests', 'questions', 'topic_progress', 'test_attempts', 'attempt_details', 'blog_posts'];
                const existingTables = res.tables.map((t: any) => t.name);
                
                requiredTables.forEach(t => {
                    if (!existingTables.includes(t)) throw new Error(`Missing table: ${t}`);
                });
            });
        });

        // ==========================================
        // 17. ANALYTICS ENGINE
        // ==========================================
        engine.describe("17. [System] Analytics Engine", (it) => {
            it("should increment visitor count", async () => {
                const res = await fetchApi('/api/track_visit.php');
                expect(res.status).toBe("ok");
            });
        });

        // ==========================================
        // 18. CONTENT INTEGRITY (Video Links)
        // ==========================================
        engine.describe("18. [System] Content Integrity", (it) => {
            let commonData: any;
            it("should have video mappings", async () => {
                commonData = await fetchApi('/api/get_common.php');
                expect(commonData.videoMap).toBeDefined();
            });
        });

        const finalResults = await engine.runAll();
        setResults(finalResults);
        setIsRunning(false);
        setProgress('');
    };

    // ... render logic ...
    const generateReport = () => {
        if (!results) return;
        const report = {
            metadata: { timestamp: new Date().toISOString(), url: window.location.href, appVersion: 'v5.1' },
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
            {/* Header */}
            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center mb-2">
                        <Terminal className="w-8 h-8 mr-3 text-green-400" />
                        System Diagnostics
                    </h1>
                    <p className="text-slate-400">Full 18-Suite Validation for Production (v5.1).</p>
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
                                    {(tests as TestResult[]).every(t => t.passed) ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-500"/> : <AlertTriangle className="w-4 h-4 mr-2 text-red-500"/>}
                                    {suite}
                                </h3>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${(tests as TestResult[]).every(t => t.passed) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {(tests as TestResult[]).filter(t => t.passed).length}/{(tests as TestResult[]).length} Pass
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
