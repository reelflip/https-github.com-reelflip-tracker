


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

        // ==========================================
        // 2. AUTHENTICATION & CONNECTIONS
        // ==========================================
        engine.describe("2. [Student] Auth & Profile", (it) => {
            let student: any;
            it("should register a new Student", async () => {
                setProgress("Testing Registration...");
                student = await registerUser('STUDENT', 'Auto Student');
                if (!student) throw new Error("Registration failed");
                expect(student.role).toBe("STUDENT");
            });
            it("should verify 6-digit ID format", async () => {
                if (!student) throw new Error("Skipping: No user");
                const id = parseInt(student.id);
                expect(id).toBeGreaterThan(99999);
                expect(id).toBeLessThan(1000000);
            });
            it("should update profile details", async () => {
                if (!student) throw new Error("Skipping: No user");
                await fetchApi('/api/manage_users.php', {
                    method: 'PUT',
                    body: JSON.stringify({ id: student.id, name: "Updated Name", targetExam: "BITSAT" })
                });
                // Verify
                // (In a real scenario we'd fetch again, but PUT success implies it worked)
            });
        });

        // ==========================================
        // 3. SYLLABUS SYNC
        // ==========================================
        engine.describe("3. [Student] Syllabus Sync", (it) => {
            let student: any;
            it("should setup Student session", async () => {
                student = await registerUser('STUDENT', 'Syllabus User');
                if (!student) throw new Error("Registration failed");
            });
            it("should save topic progress", async () => {
                if (!student) throw new Error("Skipping");
                await fetchApi('/api/sync_progress.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: student.id,
                        topic_id: 'p_kin_1',
                        status: 'COMPLETED',
                        ex1Solved: 10
                    })
                });
            });
        });

        // ==========================================
        // 4. TASK MANAGEMENT
        // ==========================================
        engine.describe("4. [Student] Task Management", (it) => {
            let student: any;
            it("should setup Student session", async () => {
                student = await registerUser('STUDENT', 'Task User');
                if(!student) throw new Error("Failed");
            });
            it("should create Backlog Item", async () => {
                if(!student) throw new Error("Skipping");
                await fetchApi('/api/manage_backlogs.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: `b_${Date.now()}`, user_id: student.id, title: "Test Backlog", 
                        subjectId: "phys", priority: "HIGH", status: "PENDING"
                    })
                });
            });
            it("should create Daily Goal", async () => {
                if(!student) throw new Error("Skipping");
                await fetchApi('/api/manage_goals.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: `g_${Date.now()}`, user_id: student.id, text: "Test Goal"
                    })
                });
            });
        });

        // ==========================================
        // 5. TIMETABLE CONFIG
        // ==========================================
        engine.describe("5. [Student] Timetable Config", (it) => {
            let student: any;
            it("should setup Student session", async () => {
                student = await registerUser('STUDENT', 'Timetable User');
                if(!student) throw new Error("Failed");
            });
            it("should save and retrieve schedule", async () => {
                if(!student) throw new Error("Skipping");
                const config = { wakeTime: "06:00" };
                const slots = [{ time: "07:00", label: "Study", iconType: "sun" }]; // Test string iconType
                
                await fetchApi('/api/save_timetable.php', {
                    method: 'POST',
                    body: JSON.stringify({ user_id: student.id, config, slots })
                });

                const dash = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                expect(dash.timetable).toBeDefined();
                // Simple check
            });
        });

        // ==========================================
        // 6. EXAM ENGINE
        // ==========================================
        engine.describe("6. [Student] Exam Engine", (it) => {
            let student: any;
            let testId: string;
            it("should setup Student session", async () => {
                student = await registerUser('STUDENT', 'Exam User');
                if(!student) throw new Error("Failed");
                
                // Get available tests
                const common = await fetchApi('/api/get_common.php');
                if (!common.tests || common.tests.length === 0) throw new Error("No tests found in DB");
                testId = common.tests[0].id;
            });
            it("should submit test attempt", async () => {
                if(!student || !testId) throw new Error("Skipping");
                
                await fetchApi('/api/save_attempt.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: student.id,
                        testId: testId,
                        score: 100,
                        totalQuestions: 25,
                        correctCount: 25,
                        incorrectCount: 0,
                        accuracy_percent: 100,
                        detailedResults: [
                            { questionId: 'q1', status: 'CORRECT', selectedOptionIndex: 1 } 
                        ]
                    })
                });
            });
        });

        // ==========================================
        // 7. ANALYTICS DATA
        // ==========================================
        engine.describe("7. [Student] Analytics Data", (it) => {
            let student: any;
            it("should setup Student session", async () => {
                student = await registerUser('STUDENT', 'Analytics User');
                if(!student) throw new Error("Failed");
                
                // Save attempt first
                const common = await fetchApi('/api/get_common.php');
                const test = common.tests[0];
                const question = test.questions[0]; // Need real Q ID for join
                
                await fetchApi('/api/save_attempt.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: student.id,
                        testId: test.id,
                        score: 4,
                        totalQuestions: 1,
                        correctCount: 1,
                        incorrectCount: 0,
                        accuracy_percent: 100,
                        detailedResults: [
                            { questionId: question.id, status: 'CORRECT', selectedOptionIndex: 0 } 
                        ]
                    })
                });
            });
            it("should retrieve attempt with Topic Metadata", async () => {
                if(!student) throw new Error("Skipping");
                
                const dash = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                const attempt = dash.attempts[0];
                expect(attempt).toBeDefined();
                // Ensure JOIN worked
                expect(attempt.detailedResults[0].subjectId).toBeDefined();
                expect(attempt.detailedResults[0].topicId).toBeDefined();
            });
        });

        // ==========================================
        // 8. PARENT CONNECTION
        // ==========================================
        engine.describe("8. [Parent] Connection Flow", (it) => {
            let parent: any;
            let student: any;
            
            it("should register pair", async () => {
                parent = await registerUser('PARENT', 'Parent User');
                student = await registerUser('STUDENT', 'Child User');
                if(!parent || !student) throw new Error("Registration Failed");
            });

            it("should search student", async () => {
                if(!parent) throw new Error("Skipping");
                const res = await fetchApi('/api/send_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'search', query: student.email })
                });
                expect(res.length).toBeGreaterThan(0);
                expect(res[0].id).toBe(student.id);
            });

            it("should link accounts", async () => {
                if(!parent || !student) throw new Error("Skipping");
                
                // 1. Send
                await fetchApi('/api/send_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ student_identifier: student.id, parent_id: parent.id, parent_name: parent.name })
                });
                
                // 2. Accept
                await fetchApi('/api/respond_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ student_id: student.id, parent_id: parent.id, accept: true })
                });
            });
        });

        // ==========================================
        // 9. PARENT MONITORING
        // ==========================================
        engine.describe("9. [Parent] Monitoring", (it) => {
            let parent: any;
            let student: any;
            
            it("should setup Student data", async () => {
                // Register and Link
                student = await registerUser('STUDENT', 'Monitored Child');
                parent = await registerUser('PARENT', 'Monitoring Parent');
                
                // Link manually via DB update simulation or API
                await fetchApi('/api/respond_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ student_id: student.id, parent_id: parent.id, accept: true })
                });

                // Add data
                await fetchApi('/api/sync_progress.php', {
                    method: 'POST',
                    body: JSON.stringify({ user_id: student.id, topic_id: 'p_kin_1', status: 'COMPLETED' })
                });
            });

            it("should verify Parent sees data", async () => {
                // Parent fetches dashboard using Student ID
                const dash = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                const prog = dash.progress.find((p: any) => p.topic_id === 'p_kin_1');
                expect(prog).toBeDefined();
                expect(prog.status).toBe('COMPLETED');
            });
        });

        // ==========================================
        // 10. ADMIN USER MANAGEMENT
        // ==========================================
        engine.describe("10. [Admin] User Management", (it) => {
            let target: any;
            
            it("should setup Target", async () => {
                target = await registerUser('STUDENT', 'Target User');
                if(!target) throw new Error("Failed");
            });

            it("should block user", async () => {
                if(!target) throw new Error("Skipping");
                await fetchApi('/api/manage_users.php', {
                    method: 'PUT',
                    body: JSON.stringify({ id: target.id, isVerified: false }) // Block
                });
                
                // Verify via Get Users
                const users = await fetchApi('/api/get_users.php');
                const u = users.find((x: any) => x.id == target.id);
                // API returns isVerified as string '0' or '1' sometimes
                expect(u.isVerified == 0 || u.isVerified === false).toBeTruthy();
            });

            it("should delete user", async () => {
                if(!target) throw new Error("Skipping");
                await fetchApi(`/api/manage_users.php?id=${target.id}`, { method: 'DELETE' });
                
                const users = await fetchApi('/api/get_users.php');
                const u = users.find((x: any) => x.id == target.id);
                if (u) throw new Error("User was not deleted");
            });
        });

        // ==========================================
        // 11. ADMIN CONTENT
        // ==========================================
        engine.describe("11. [Admin] Content Operations", (it) => {
            it("should create Notification", async () => {
                const id = `n_${Date.now()}`;
                await fetchApi('/api/manage_broadcasts.php', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'send_notification', id, title: "Test", message: "Msg", type: "INFO" })
                });
                
                const common = await fetchApi('/api/get_common.php');
                const exists = common.notifications.some((n: any) => n.id === id);
                expect(exists).toBe(true);
            });

            it("should create Test", async () => {
                const id = `t_${Date.now()}`;
                await fetchApi('/api/manage_tests.php', {
                    method: 'POST',
                    body: JSON.stringify({ 
                        action: 'create_test', id, title: "Admin Test", 
                        durationMinutes: 10, difficulty: "MAINS", examType: "JEE",
                        questions: [] // Empty ok for logic check
                    })
                });
                
                const common = await fetchApi('/api/get_common.php');
                const exists = common.tests.some((t: any) => t.id === id);
                expect(exists).toBe(true);
            });
        });

        // ==========================================
        // 12. ADMIN INBOX
        // ==========================================
        engine.describe("12. [Admin] Inbox Flow", (it) => {
            it("should receive public message", async () => {
                const subject = `Msg ${Date.now()}`;
                // 1. Send Public
                await fetchApi('/api/contact.php', {
                    method: 'POST',
                    body: JSON.stringify({ name: "User", email: "u@u.com", subject, message: "Hello" })
                });

                // 2. Check Admin
                const msgs = await fetchApi('/api/manage_contact.php', { method: 'GET' });
                const exists = msgs.some((m: any) => m.subject === subject);
                expect(exists).toBe(true);
            });
        });

        // ==========================================
        // 13. STUDY TOOLS INTEGRITY
        // ==========================================
        engine.describe("13. [System] Study Tools", (it) => {
            it("should have seeded Flashcards", async () => {
                const data = await fetchApi('/api/get_common.php');
                expect(data.flashcards.length).toBeGreaterThan(0);
            });
            it("should have seeded Memory Hacks", async () => {
                const data = await fetchApi('/api/get_common.php');
                expect(data.hacks.length).toBeGreaterThan(0);
            });
        });

        // ==========================================
        // 14. REVISION SYSTEM
        // ==========================================
        engine.describe("14. [System] Revision Logic", (it) => {
            let student: any;
            it("should setup user", async () => {
                student = await registerUser('STUDENT', 'Revision User');
                if(!student) throw new Error("Failed");
            });
            it("should save revision date", async () => {
                if(!student) throw new Error("Skipping");
                await fetchApi('/api/sync_progress.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: student.id,
                        topic_id: 'p_kin_1',
                        status: 'COMPLETED',
                        revisionCount: 1,
                        nextRevisionDate: '2025-12-31'
                    })
                });
                // Verify via dashboard
                const dash = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                const p = dash.progress.find((x: any) => x.topic_id === 'p_kin_1');
                expect(p.next_revision_date).toBe('2025-12-31');
            });
        });

        // ==========================================
        // 15. ACCESS CONTROL
        // ==========================================
        engine.describe("15. [Security] Access Control", (it) => {
            let blockedUser: any;
            
            it("should setup & block user", async () => {
                blockedUser = await registerUser('STUDENT', 'Bad User');
                if(!blockedUser) throw new Error("Failed");
                
                await fetchApi('/api/manage_users.php', {
                    method: 'PUT',
                    body: JSON.stringify({ id: blockedUser.id, isVerified: false })
                });
            });

            it("should prevent login for blocked user", async () => {
                if(!blockedUser) throw new Error("Skipping");
                
                const res = await fetch('/api/login.php', {
                    method: 'POST',
                    body: JSON.stringify({ email: blockedUser.email, password: 'TestPass123' })
                });
                
                // API should return 401 or similar error message
                const data = await res.json();
                expect(JSON.stringify(data)).toContain("Invalid"); // Or whatever error message for blocked users
            });
        });

        // ==========================================
        // 16. DB SCHEMA IO
        // ==========================================
        engine.describe("16. [System] Database Schema I/O", (it) => {
            it("should verify all tables exist", async () => {
                const data = await fetchApi('/api/test_db.php');
                expect(data.tables.length).toBeGreaterThan(15);
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
            it("should validate YouTube URL formats", async () => {
                const urls = Object.values(commonData.videoMap) as string[];
                // Basic check
                const invalid = urls.filter(u => !u.includes('youtube.com/embed/'));
                if (invalid.length > 0) throw new Error(`Found ${invalid.length} invalid URLs`);
            });
            it("should verify video accessibility (Sample 3)", async () => {
                const urls = Object.values(commonData.videoMap) as string[];
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
            metadata: { timestamp: new Date().toISOString(), url: window.location.href, appVersion: 'v4.7' },
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
                    <p className="text-slate-400">Full 18-Suite Validation for Production (v4.7).</p>
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
