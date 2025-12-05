
import React, { useState } from 'react';
import { TestRunnerEngine, expect, TestResult } from '../utils/testFramework';
import { Play, CheckCircle2, XCircle, Terminal, AlertTriangle, Loader2, Download } from 'lucide-react';

// Test Runner v3.9 - Role-Based Categorization
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
            it("should verify schema integrity", async () => {
                const data = await fetchApi('/api/test_db.php');
                const tables = data.tables.map((t: any) => t.name);
                const expected = ['users', 'topic_progress', 'test_attempts', 'attempt_details', 'questions', 'tests'];
                expected.forEach(t => {
                    if (!tables.includes(t)) throw new Error(`Missing Table: ${t}`);
                });
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
                    body: JSON.stringify({ id: user.id, name: 'Updated Student Name' })
                });
                // Verify via Admin view or re-login simulation
                const allUsers = await fetchApi('/api/get_users.php');
                const updated = allUsers.find((u: any) => u.id == user.id);
                expect(updated.name).toBe('Updated Student Name');
            });
        });

        engine.describe("3. [Student] Syllabus & Tasks", (it) => {
            let user: any;
            it("should setup Student session", async () => {
                user = await registerUser('STUDENT', 'Task Master');
                if(!user) throw new Error("Registration failed");
            });

            it("should save Syllabus Progress", async () => {
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

            it("should create & retrieve Backlog Item", async () => {
                if(!user) throw new Error("Setup failed");
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

            it("should save Timetable Config", async () => {
                if(!user) throw new Error("Setup failed");
                await fetchApi('/api/save_timetable.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: user.id,
                        config: { wakeTime: '06:00' },
                        slots: [{ label: 'Study Physics', iconType: 'sun' }]
                    })
                });
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                expect(data.timetable.slots[0].label).toBe('Study Physics');
            });
        });

        engine.describe("4. [Student] Exam & Analytics", (it) => {
            let user: any;
            it("should setup Student session", async () => {
                user = await registerUser('STUDENT', 'Exam Taker');
                if(!user) throw new Error("Registration failed");
            });

            it("should submit Test Attempt", async () => {
                if(!user) throw new Error("Setup failed");
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

            it("should generate Analytics (Subject Breakdown)", async () => {
                if(!user) throw new Error("Setup failed");
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const attempt = data.attempts[0];
                expect(attempt).toBeDefined();
                // Critical: Check if JOIN worked to get Subject ID
                const detail = attempt.detailedResults[0];
                expect(detail.subjectId).toBe('phys');
                expect(detail.topicId).toBeDefined();
            });
        });

        // ==========================================
        // 3. PARENT WORKFLOWS
        // ==========================================
        engine.describe("5. [Parent] Monitoring Flow", (it) => {
            let student: any;
            let parent: any;

            it("should register Student & Parent", async () => {
                student = await registerUser('STUDENT', 'Kiddo');
                parent = await registerUser('PARENT', 'Guardian');
                if(!student || !parent) throw new Error("Registration failed");
            });

            it("should search Student by Name", async () => {
                if(!student) throw new Error("Setup failed");
                const res = await fetchApi('/api/send_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'search', query: 'Kiddo' })
                });
                const match = res.find((u: any) => u.id == student.id);
                expect(match).toBeDefined();
            });

            it("should send & accept Connection Request", async () => {
                if(!student || !parent) throw new Error("Setup failed");
                // Send
                await fetchApi('/api/send_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ student_identifier: student.email, parent_id: parent.id, parent_name: parent.name })
                });
                // Accept
                await fetchApi('/api/respond_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ student_id: student.id, parent_id: parent.id, accept: true })
                });
            });

            it("should allow Parent to view Student Data", async () => {
                if(!student) throw new Error("Setup failed");
                // Parent calls get_dashboard with Student ID
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                // Verify we got the student's data (e.g. empty attempts initially)
                expect(Array.isArray(data.attempts)).toBe(true);
            });
        });

        // ==========================================
        // 4. ADMIN WORKFLOWS
        // ==========================================
        engine.describe("6. [Admin] User Management", (it) => {
            let targetUser: any;
            it("should setup Target User", async () => {
                targetUser = await registerUser('STUDENT', 'Target User');
                if(!targetUser) throw new Error("Registration failed");
            });

            it("should block User access", async () => {
                if(!targetUser) throw new Error("Setup failed");
                await fetchApi('/api/manage_users.php', {
                    method: 'PUT',
                    body: JSON.stringify({ id: targetUser.id, isVerified: false, name: targetUser.name })
                });
                const users = await fetchApi('/api/get_users.php');
                const u = users.find((x: any) => x.id == targetUser.id);
                expect(u.isVerified == 0).toBe(true);
            });

            it("should delete User", async () => {
                if(!targetUser) throw new Error("Setup failed");
                await fetchApi(`/api/manage_users.php?id=${targetUser.id}`, { method: 'DELETE' });
                const users = await fetchApi('/api/get_users.php');
                const u = users.find((x: any) => x.id == targetUser.id);
                expect(u).toBe(undefined);
            });
        });

        engine.describe("7. [Admin] Content Operations", (it) => {
            it("should create Broadcast Notification", async () => {
                const nid = `n_${timestamp}`;
                await fetchApi('/api/manage_broadcasts.php', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'send_notification', id: nid, title: 'Test', message: 'Test', type: 'INFO' })
                });
                const common = await fetchApi('/api/get_common.php');
                expect(common.notifications.some((n: any) => n.id === nid)).toBe(true);
            });

            it("should create Mock Test", async () => {
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

            it("should publish Blog Post", async () => {
                const bid = `blog_${timestamp}`;
                await fetchApi('/api/manage_blog.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: bid, title: 'Test Blog', content: 'Content',
                        author: 'Admin', category: 'Updates', date: '2025-01-01'
                    })
                });
                const common = await fetchApi('/api/get_common.php');
                expect(common.blogPosts.some((b: any) => b.id === bid)).toBe(true);
            });

            it("should receive Inbox Messages (Contact Form)", async () => {
                // Public sends message
                await fetchApi('/api/contact.php', {
                    method: 'POST',
                    body: JSON.stringify({ name: 'Public', email: 'p@test.com', subject: `Sub_${timestamp}`, message: 'Msg' })
                });
                // Admin checks inbox
                const msgs = await fetchApi('/api/manage_contact.php?method=GET');
                const found = msgs.find((m: any) => m.subject === `Sub_${timestamp}`);
                expect(found).toBeDefined();
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

    // Initial State: Render Pending List
    const renderPendingList = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-50">
            {[
                '1. [System] Core Health', 
                '2. [Student] Auth & Profile', 
                '3. [Student] Syllabus & Tasks', 
                '4. [Student] Exam & Analytics', 
                '5. [Parent] Monitoring Flow', 
                '6. [Admin] User Management', 
                '7. [Admin] Content Operations'
            ].map(suite => (
                <div key={suite} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <h3 className="font-bold text-slate-800 flex items-center">
                        <span className="w-3 h-3 rounded-full bg-slate-300 mr-2"></span> {suite}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 pl-5">Pending execution...</p>
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
                    <p className="text-slate-400">Role-based validation for Hostinger Deployment (v3.9).</p>
                </div>
                <div className="flex gap-3">
                    {results && (
                        <button 
                            onClick={generateReport} 
                            className="bg-slate-700 px-6 py-3 rounded-xl font-bold flex items-center hover:bg-slate-600 transition-colors"
                        >
                            <Download className="w-5 h-5 mr-2"/> Download Report
                        </button>
                    )}
                    <button 
                        onClick={runTests} 
                        disabled={isRunning} 
                        className="bg-green-600 hover:bg-green-500 px-8 py-3 rounded-xl font-bold flex items-center disabled:opacity-50 transition-all shadow-lg shadow-green-900/20"
                    >
                        {isRunning ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Play className="w-5 h-5 mr-2"/>} 
                        {isRunning ? 'Running Scan...' : 'Start Scan'}
                    </button>
                </div>
            </div>
            
            {isRunning && (
                <div className="bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-xl font-mono text-center font-bold animate-pulse flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    {progress || "Initializing..."}
                </div>
            )}
            
            {!results && !isRunning && renderPendingList()}
            
            {results && !isRunning && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(results).map(([suite, tests]: [string, TestResult[]]) => (
                        <div key={suite} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 flex items-center">
                                    {tests.every(t => t.passed) ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-500"/> : <AlertTriangle className="w-4 h-4 mr-2 text-red-500"/>}
                                    {suite}
                                </h3>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${tests.every(t => t.passed) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {tests.filter(t => t.passed).length}/{tests.length} Pass
                                </span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {(tests as TestResult[]).map((t, i) => (
                                    <div key={i} className="px-6 py-3 flex items-start justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start gap-3 w-full">
                                            <div className="mt-0.5 shrink-0">
                                                {t.passed ? <CheckCircle2 className="w-4 h-4 text-green-500"/> : <XCircle className="w-4 h-4 text-red-500"/>}
                                            </div>
                                            <div className="w-full">
                                                <div className="flex justify-between">
                                                    <p className="text-xs font-medium text-slate-700">{t.description}</p>
                                                    <span className="text-[10px] text-slate-400 font-mono">{Math.round(t.duration)}ms</span>
                                                </div>
                                                {!t.passed && (
                                                    <div className="mt-2 bg-red-50 p-2 rounded border border-red-100">
                                                        <p className="text-[10px] text-red-600 font-mono break-all">{t.error}</p>
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
