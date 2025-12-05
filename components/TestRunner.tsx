
import React, { useState } from 'react';
import { TestRunnerEngine, expect, TestResult } from '../utils/testFramework';
import { Play, CheckCircle2, XCircle, Terminal, AlertTriangle, Loader2, RefreshCw, Shield, Download, FileJson, Copy } from 'lucide-react';

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
            const email = `auto_${role}_${timestamp}_${Math.floor(Math.random()*1000)}@test.com`;
            const pass = 'TestPass123';
            const data = await fetchApi('/api/register.php', {
                method: 'POST',
                body: JSON.stringify({
                    name, email, password: pass, confirmPassword: pass, role,
                    institute: 'Test Inst', targetYear: 2025
                })
            });
            // The API now returns the user object directly.
            if (data.user) return data.user;
            // Fallback for older API versions
            const loginData = await fetchApi('/api/login.php', {
                method: 'POST', body: JSON.stringify({ email, password: pass })
            });
            return loginData.user;
        };

        // --- SUITE 1: CORE ---
        engine.describe("1. Core & API Health", (it) => {
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

        // --- SUITE 2: AUTH ---
        engine.describe("2. Auth & User IDs", (it) => {
            it("should register user with valid 6-digit ID", async () => {
                const user = await registerUser('STUDENT', 'ID Test Student');
                if(!user) throw new Error("Registration failed");
                const id = parseInt(user.id);
                expect(id).toBeGreaterThan(99999); // Min 100000
                expect(id).toBeLessThan(1000000);  // Max 999999
            });
            
            it("should search student by name (Parent Feature)", async () => {
                // Register a unique student to find
                const uniqueName = `FindMe_${timestamp}`;
                await registerUser('STUDENT', uniqueName);
                
                // Search for them
                const matches = await fetchApi('/api/send_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'search', query: uniqueName })
                });
                
                expect(Array.isArray(matches)).toBe(true);
                expect(matches.length).toBeGreaterThan(0);
                expect(matches[0].name).toBe(uniqueName);
            });
        });

        // --- SUITE 3: SYLLABUS ---
        engine.describe("3. Syllabus Data", (it) => {
            let user: any;
            const topicId = 'p_kin_1';

            it("should setup user", async () => {
                user = await registerUser('STUDENT', 'Syllabus Tester');
                if(!user) throw new Error("Setup failed");
            });

            it("should save topic progress", async () => {
                if(!user) throw new Error("Setup failed");
                await fetchApi('/api/sync_progress.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: user.id, topic_id: topicId, status: 'IN_PROGRESS',
                        ex1Solved: 15, ex1Total: 30
                    })
                });
            });

            it("should retrieve progress correctly", async () => {
                if(!user) throw new Error("Setup failed");
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const topic = data.progress.find((p: any) => p.topic_id === topicId);
                expect(topic).toBeDefined();
                expect(topic.status).toBe('IN_PROGRESS');
                expect(parseInt(topic.ex1_solved)).toBe(15);
            });
        });

        // --- SUITE 4: TASKS ---
        engine.describe("4. Task Management", (it) => {
            let user: any;
            let backlogId: string;

            it("should setup user", async () => {
                user = await registerUser('STUDENT', 'Task Tester');
                if(!user) throw new Error("Setup failed");
            });

            it("should create backlog item", async () => {
                if(!user) throw new Error("Setup failed");
                backlogId = `b_${Date.now()}`;
                await fetchApi('/api/manage_backlogs.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: backlogId, user_id: user.id, title: 'Test Backlog',
                        subjectId: 'phys', priority: 'HIGH', deadline: '2025-01-01', status: 'PENDING'
                    })
                });
            });

            it("should verify backlog persistence", async () => {
                if(!user) throw new Error("Setup failed");
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const item = data.backlogs.find((b: any) => b.id === backlogId);
                expect(item).toBeDefined();
                expect(item.title).toBe('Test Backlog');
            });
        });

        // --- SUITE 5: ANALYTICS ---
        engine.describe("5. Exam Engine & Analytics", (it) => {
            let user: any;
            it("should setup user", async () => {
                user = await registerUser('STUDENT', 'Exam Tester');
                if(!user) throw new Error("Setup failed");
            });

            it("should save test attempt with detailed results", async () => {
                if(!user) throw new Error("Setup failed");
                const attemptData = {
                    user_id: user.id,
                    testId: 'test_jee_main_2024',
                    score: 100,
                    totalQuestions: 25,
                    correctCount: 25,
                    incorrectCount: 0,
                    accuracy_percent: 100,
                    detailedResults: [
                        { questionId: 'p_1', status: 'CORRECT', selectedOptionIndex: 3 }, // Physics
                        { questionId: 'c_1', status: 'CORRECT', selectedOptionIndex: 0 }  // Chemistry
                    ]
                };
                await fetchApi('/api/save_attempt.php', {
                    method: 'POST',
                    body: JSON.stringify(attemptData)
                });
            });

            it("should retrieve analytics with subject metadata", async () => {
                if(!user) throw new Error("Setup failed");
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                
                if(!data.attempts || data.attempts.length === 0) {
                    throw new Error("No attempts found. Save API likely failed (Check SQL schema for 'selected_option' column).");
                }

                const attempt = data.attempts[0];
                expect(attempt).toBeDefined();
                expect(parseInt(attempt.score)).toBe(100);
                
                // Verify JOIN works (subjectId should be present)
                const detail = attempt.detailedResults.find((d: any) => d.questionId === 'p_1');
                expect(detail).toBeDefined();
                expect(detail.subjectId).toBe('phys'); // Must come from JOIN questions table
                expect(parseInt(detail.selectedOptionIndex)).toBe(3); // Verify option persistence
            });
        });

        // --- SUITE 6: TIMETABLE ---
        engine.describe("6. Timetable Generator", (it) => {
            let user: any;
            it("should setup user", async () => {
                user = await registerUser('STUDENT', 'Timetable Tester');
                if(!user) throw new Error("Setup failed");
            });

            it("should save full timetable object", async () => {
                if(!user) throw new Error("Setup failed");
                const payload = {
                    user_id: user.id,
                    config: { wakeTime: '06:00', coachingDays: ['Mon'] },
                    slots: [
                        { 
                            time: '06:00', 
                            endTime: '07:00', 
                            label: 'Physics Study', 
                            type: 'theory',
                            iconType: 'sun',
                            subject: 'Physics',
                            subtext: 'Focus on mechanics'
                        }
                    ]
                };
                await fetchApi('/api/save_timetable.php', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
            });

            it("should retrieve timetable with all fields", async () => {
                if(!user) throw new Error("Setup failed");
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                
                expect(data.timetable).toBeDefined();
                const slot = data.timetable.slots[0];
                
                expect(slot.label).toBe('Physics Study');
                expect(slot.iconType).toBe('sun');
                expect(slot.subject).toBe('Physics');
                expect(slot.subtext).toBe('Focus on mechanics');
                expect(slot.endTime).toBe('07:00');
            });
        });

        // --- SUITE 7: PARENT MONITORING ---
        engine.describe("7. Parent Monitoring", (it) => {
            let student: any;
            let parent: any;
            const topicToUpdate = 'p_kin_1';

            it("should register student & parent", async () => {
                student = await registerUser('STUDENT', 'Monitor Student');
                parent = await registerUser('PARENT', 'Monitor Parent');
                if(!student || !parent) throw new Error("Registration failed");
            });

            it("should link accounts", async () => {
                if(!student || !parent) throw new Error("Setup failed");
                await fetchApi('/api/send_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ student_identifier: student.email, parent_id: parent.id, parent_name: parent.name })
                });
                await fetchApi('/api/respond_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ student_id: student.id, parent_id: parent.id, accept: true })
                });
            });

            it("should update student progress", async () => {
                if(!student) throw new Error("Setup failed");
                await fetchApi('/api/sync_progress.php', {
                    method: 'POST',
                    body: JSON.stringify({ user_id: student.id, topic_id: topicToUpdate, status: 'COMPLETED', ex1Solved: 30 })
                });
            });

            it("should verify Parent sees update", async () => {
                if(!student) throw new Error("Setup failed");
                // Fetch dashboard USING STUDENT ID (simulate Parent View)
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                const topic = data.progress.find((p: any) => p.topic_id === topicToUpdate);
                expect(topic).toBeDefined();
                expect(topic.status).toBe('COMPLETED');
            });
        });

        // --- SUITE 8: ADMIN CAPABILITIES ---
        engine.describe("8. Admin Capabilities", (it) => {
            // 1. Content
            it("should create a broadcast notification", async () => {
                const notif = {
                    action: 'send_notification',
                    id: `n_test_${timestamp}`,
                    title: 'Test Alert',
                    message: 'System test running',
                    type: 'INFO',
                    date: '2025-01-01'
                };
                await fetchApi('/api/manage_broadcasts.php', {
                    method: 'POST', body: JSON.stringify(notif)
                });
                // Verify
                const data = await fetchApi('/api/get_common.php');
                const found = data.notifications.find((n: any) => n.id === notif.id);
                expect(found).toBeDefined();
            });

            it("should add motivational quote", async () => {
                const quote = {
                    action: 'add_quote',
                    id: `q_test_${timestamp}`,
                    text: 'Test Quote',
                    author: 'Admin'
                };
                await fetchApi('/api/manage_broadcasts.php', {
                    method: 'POST', body: JSON.stringify(quote)
                });
                const data = await fetchApi('/api/get_common.php');
                const found = data.quotes.find((q: any) => q.text === 'Test Quote');
                expect(found).toBeDefined();
            });

            it("should create blog post", async () => {
                const post = {
                    id: `blog_test_${timestamp}`,
                    title: 'Test Blog',
                    excerpt: 'Desc',
                    content: 'Body',
                    author: 'Admin',
                    category: 'Updates',
                    imageUrl: '',
                    date: '2025-01-01'
                };
                await fetchApi('/api/manage_blog.php', {
                    method: 'POST', body: JSON.stringify(post)
                });
                const common = await fetchApi('/api/get_common.php');
                const created = common.blogPosts.find((b: any) => b.id === post.id);
                expect(created).toBeDefined();
            });

            // 2. Test Builder
            it("should create mock test with questions", async () => {
                // Add Question
                const q = {
                    action: 'add_question',
                    id: `q_test_${timestamp}`,
                    subjectId: 'phys',
                    topicId: 'p_kin_1',
                    text: 'Test Question 1',
                    options: ['A', 'B', 'C', 'D'],
                    correctOptionIndex: 0
                };
                await fetchApi('/api/manage_tests.php', { method: 'POST', body: JSON.stringify(q) });

                // Create Test
                const t = {
                    action: 'create_test',
                    id: `t_test_${timestamp}`,
                    title: 'Admin Mock Test',
                    durationMinutes: 180,
                    difficulty: 'MAINS',
                    examType: 'JEE',
                    questions: [{ id: q.id }]
                };
                await fetchApi('/api/manage_tests.php', { method: 'POST', body: JSON.stringify(t) });

                // Verify Visibility
                const data = await fetchApi('/api/get_common.php');
                const test = data.tests.find((item: any) => item.id === t.id);
                expect(test).toBeDefined();
                expect(test.questions.length).toBe(1);
            });

            // 3. Inbox
            it("should receive contact message in inbox", async () => {
                const msg = {
                    name: 'Tester',
                    email: `tester_${timestamp}@mail.com`,
                    subject: `Inquiry ${timestamp}`,
                    message: 'Hello Admin'
                };
                // Public sends
                await fetchApi('/api/contact.php', { method: 'POST', body: JSON.stringify(msg) });
                
                // Admin reads
                const inbox = await fetchApi('/api/manage_contact.php', { method: 'GET' });
                const received = inbox.find((m: any) => m.subject === msg.subject);
                expect(received).toBeDefined();
            });

            // 4. User Management
            it("should block user access", async () => {
                const u = await registerUser('STUDENT', 'ToBlock');
                if(!u) throw new Error("Setup failed");
                // Block
                await fetchApi('/api/manage_users.php', {
                    method: 'PUT',
                    body: JSON.stringify({ id: u.id, isVerified: false })
                });
                // Verify
                const users = await fetchApi('/api/get_users.php');
                const blocked = users.find((user: any) => user.id == u.id);
                expect(Number(blocked.isVerified)).toBe(0);
            });

            it("should delete user", async () => {
                const u = await registerUser('STUDENT', 'ToDelete');
                if(!u) throw new Error("Setup failed");
                // Delete
                await fetchApi(`/api/manage_users.php?id=${u.id}`, { method: 'DELETE' });
                // Verify
                const users = await fetchApi('/api/get_users.php');
                const deleted = users.find((user: any) => user.id == u.id);
                if (deleted) throw new Error("User was not deleted");
            });
        });

        // --- SUITE 9: TOOLS ---
        engine.describe("9. Study Tools", (it) => {
            it("should fetch flashcards", async () => {
                const data = await fetchApi('/api/get_common.php');
                expect(data.flashcards.length).toBeGreaterThan(5);
                expect(data.flashcards[0]).toMatchObject({ difficulty: 'EASY' }); // Check enum
            });
        });

        // --- SUITE 10: USER PROFILE ---
        engine.describe("10. User Profile", (it) => {
            let user: any;
            it("should update profile details", async () => {
                user = await registerUser('STUDENT', 'Profile Tester');
                if(!user) throw new Error("Setup failed");
                
                await fetchApi('/api/manage_users.php', {
                    method: 'PUT',
                    body: JSON.stringify({ 
                        id: user.id, 
                        name: 'Updated Name',
                        targetExam: 'BITSAT',
                        institute: 'Self Study' 
                    })
                });

                // Verify
                const data = await fetchApi('/api/get_users.php');
                const updated = data.find((u: any) => u.id === user.id);
                expect(updated.name).toBe('Updated Name');
                expect(updated.targetExam).toBe('BITSAT');
            });
        });

        // --- SUITE 11: SMART FEATURES ---
        engine.describe("11. Smart Features", (it) => {
            let user: any;
            it("should update timestamps on progress", async () => {
                user = await registerUser('STUDENT', 'Timestamp Tester');
                if(!user) throw new Error("Setup failed");

                await fetchApi('/api/sync_progress.php', {
                    method: 'POST',
                    body: JSON.stringify({ user_id: user.id, topic_id: 'p_kin_1', status: 'IN_PROGRESS' })
                });

                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const topic = data.progress.find((p: any) => p.topic_id === 'p_kin_1');
                expect(topic.last_updated).toBeDefined(); // MySQL timestamp should exist
            });
        });

        // --- SUITE 12: REVISION ---
        engine.describe("12. Revision System", (it) => {
            let user: any;
            it("should save next revision date", async () => {
                user = await registerUser('STUDENT', 'Revision Tester');
                if(!user) throw new Error("Setup failed");

                await fetchApi('/api/sync_progress.php', {
                    method: 'POST',
                    body: JSON.stringify({ 
                        user_id: user.id, topic_id: 'm_set_1', 
                        status: 'COMPLETED', revisionCount: 1, nextRevisionDate: '2025-01-08' 
                    })
                });

                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const topic = data.progress.find((p: any) => p.topic_id === 'm_set_1');
                expect(parseInt(topic.revision_count)).toBe(1);
                expect(topic.next_revision_date).toBe('2025-01-08');
            });
        });

        // --- SUITE 13: DATABASE SCHEMA HEALTH ---
        engine.describe("13. Full Schema Integrity", (it) => {
            it("should verify all 20+ tables exist", async () => {
                const data = await fetchApi('/api/test_db.php');
                const tables = data.tables.map((t: any) => t.name);
                
                const expectedTables = [
                    'users', 'subjects', 'chapters', 'topics', 'topic_progress',
                    'questions', 'tests', 'test_questions', 'test_attempts', 'attempt_details',
                    'mistake_notebook', 'daily_goals', 'backlogs', 'timetable_settings',
                    'notifications', 'quotes', 'flashcards', 'memory_hacks',
                    'contact_messages', 'blog_posts'
                ];

                expectedTables.forEach(table => {
                    if (!tables.includes(table)) {
                        throw new Error(`Missing Table: ${table}. Import SQL schema v3.6 again.`);
                    }
                });
            });

            it("should write/read/delete from generic table", async () => {
                // Testing 'contact_messages' as a generic write test
                const msg = {
                    name: 'Test Bot',
                    email: 'bot@test.com',
                    subject: 'Schema Check',
                    message: 'IO Test'
                };
                
                // Write
                await fetchApi('/api/contact.php', {
                    method: 'POST', body: JSON.stringify(msg)
                });

                // Read (Admin endpoint)
                const messages = await fetchApi('/api/manage_contact.php', { method: 'GET' });
                const found = messages.find((m: any) => m.email === 'bot@test.com');
                expect(found).toBeDefined();

                // Delete
                if (found) {
                    await fetchApi(`/api/manage_contact.php?id=${found.id}`, { method: 'DELETE' });
                }
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
            metadata: { 
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                appVersion: 'v3.6'
            },
            summary: { passed: passedTests, failed: failedTests },
            fullResults: results
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

    const allTests = results ? (Object.values(results).flat() as TestResult[]) : [];
    const passedTests = allTests.filter(r => r.passed).length;
    const failedTests = allTests.length - passedTests;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6 animate-in fade-in">
            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center mb-2">
                        <Terminal className="w-8 h-8 mr-3 text-green-400" />
                        System Diagnostics
                    </h1>
                    <p className="text-slate-400">Run end-to-end tests on your live Hostinger deployment. All tests use REAL database transactions.</p>
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
                    <Activity className="w-5 h-5 mr-3 animate-bounce" />
                    {progress}
                </div>
            )}
            
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
                                {tests.map((t, i) => (
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

// Simple Icon for loader
const Activity = ({className}: {className?: string}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

export default TestRunner;
