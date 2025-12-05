
import React, { useState } from 'react';
import { TestRunnerEngine, expect, TestResult } from '../utils/testFramework';
import { Play, CheckCircle2, XCircle, Terminal, AlertTriangle, Loader2, RefreshCw, Shield } from 'lucide-react';

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

        if (res.status === 404) throw new Error(`Endpoint not found (404): ${url}`);

        const text = await res.text();
        try {
            if (!text.trim()) throw new Error(`Empty response from ${url}`);
            const data = JSON.parse(text);
            if (!res.ok) throw new Error(data.message || `Server Error (${res.status})`);
            return data;
        } catch (jsonErr) {
            console.error("Raw Response:", text);
            throw new Error(`Invalid JSON from ${url}. Raw: "${text.substring(0, 100)}..."`);
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
            
            // 1. Register
            const data = await fetchApi('/api/register.php', {
                method: 'POST',
                body: JSON.stringify({
                    name, email, password: pass, confirmPassword: pass, role,
                    institute: 'Test Inst', targetYear: 2025
                })
            });
            
            // 2. Return User (V3.4+ API returns it directly)
            if (data.user) return data.user;

            // Fallback for older APIs: Login immediately
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

        // --- SUITE 2: AUTH & CONNECTION ---
        engine.describe("2. Auth & Connections", (it) => {
            let student: any;
            let parent: any;

            it("should register a valid Student", async () => {
                setProgress("Creating Student...");
                student = await registerUser('STUDENT', 'Test Student');
                if (!student || !student.id) throw new Error("Student registration returned invalid object");
                expect(student.role).toBe('STUDENT');
            });

            it("should register a valid Parent", async () => {
                setProgress("Creating Parent...");
                parent = await registerUser('PARENT', 'Test Parent');
                if (!parent || !parent.id) throw new Error("Parent registration returned invalid object");
                expect(parent.role).toBe('PARENT');
            });

            it("should send Connection Request", async () => {
                if (!student?.id || !parent?.id) throw new Error("Skipping: Previous registration failed");
                setProgress("Linking...");
                const data = await fetchApi('/api/send_request.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        student_identifier: student.email,
                        parent_id: parent.id,
                        parent_name: parent.name
                    })
                });
                expect(data.message).toContain("Success");
            });

            it("should accept Connection Request", async () => {
                if (!student?.id || !parent?.id) throw new Error("Skipping: Previous setup failed");
                const data = await fetchApi('/api/respond_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ student_id: student.id, parent_id: parent.id, accept: true })
                });
                expect(data.message).toContain("Processed");
            });
            
            it("should allow Parent to view Student Data", async () => {
                if (!student?.id) throw new Error("Skipping: Student missing");
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                expect(data.progress).toBeDefined();
            });
        });

        // --- SUITE 3: SYLLABUS ---
        engine.describe("3. Syllabus Data", (it) => {
            let user: any;
            const topicId = 'p_kin_1';

            it("should create user", async () => {
                user = await registerUser('STUDENT', 'Syllabus User');
                if (!user) throw new Error("User setup failed");
            });

            it("should save topic progress", async () => {
                if (!user?.id) throw new Error("User setup failed");
                setProgress("Syncing Syllabus...");
                const payload = { user_id: user.id, topic_id: topicId, status: 'COMPLETED', ex1Solved: 10, ex1Total: 30 };
                const data = await fetchApi('/api/sync_progress.php', { method: 'POST', body: JSON.stringify(payload) });
                expect(data.message).toContain("Saved");
            });

            it("should retrieve progress correctly", async () => {
                if (!user?.id) throw new Error("User setup failed");
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const topic = data.progress.find((p: any) => p.topic_id === topicId);
                if (!topic) throw new Error("Topic progress not found in dashboard");
                expect(topic.status).toBe('COMPLETED');
                expect(parseInt(topic.ex1_solved)).toBe(10);
            });
        });

        // --- SUITE 4: TASKS ---
        engine.describe("4. Task Management", (it) => {
            let user: any;
            const goalId = `g_${timestamp}`;

            it("should create user", async () => {
                user = await registerUser('STUDENT', 'Task User');
                if (!user) throw new Error("User setup failed");
            });

            it("should create & toggle Goal", async () => {
                if (!user?.id) throw new Error("User setup failed");
                await fetchApi('/api/manage_goals.php', { method: 'POST', body: JSON.stringify({ id: goalId, user_id: user.id, text: "Test Goal" }) });
                await fetchApi('/api/manage_goals.php', { method: 'PUT', body: JSON.stringify({ id: goalId }) });
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const goal = data.goals.find((g: any) => g.id === goalId);
                expect(goal.is_completed == 1).toBe(true);
            });
        });

        // --- SUITE 5: ANALYTICS ---
        engine.describe("5. Exam & Analytics", (it) => {
            let user: any;
            const attemptId = `att_${timestamp}`;

            it("should create user", async () => {
                user = await registerUser('STUDENT', 'Exam User');
                if (!user) throw new Error("User setup failed");
            });

            it("should save detailed test attempt", async () => {
                if (!user?.id) throw new Error("User setup failed");
                setProgress("Submitting Exam...");
                const payload = {
                    user_id: user.id, testId: 'test_jee_main_2024',
                    score: 4, totalQuestions: 1, correctCount: 1, incorrectCount: 0, accuracy_percent: 100,
                    detailedResults: [
                        { questionId: 'p_1', status: 'CORRECT', subjectId: 'phys', topicId: 'p_kin_1', selectedOptionIndex: 3 }
                    ]
                };
                const data = await fetchApi('/api/save_attempt.php', { method: 'POST', body: JSON.stringify(payload) });
                expect(data.message).toContain("Saved");
            });

            it("should retrieve attempt with Metadata", async () => {
                if (!user?.id) throw new Error("User setup failed");
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const attempt = data.attempts.find((a: any) => a.id.startsWith("att_"));
                expect(attempt).toBeDefined();
                if (attempt.detailedResults && attempt.detailedResults.length > 0) {
                    expect(attempt.detailedResults[0].subjectId).toBe('phys');
                    // Verify option tracking
                    expect(parseInt(attempt.detailedResults[0].selectedOptionIndex)).toBe(3);
                } else {
                    throw new Error("Detailed results missing in attempt");
                }
            });
        });

        // --- SUITE 6: TIMETABLE ---
        engine.describe("6. Timetable Gen", (it) => {
            let user: any;
            it("should save timetable config", async () => {
                user = await registerUser('STUDENT', 'Time User');
                if(!user) throw new Error("User failed");
                const payload = {
                    user_id: user.id,
                    config: { wakeTime: "06:00" },
                    slots: [{ time: "07:00", label: "Study", iconType: "book" }] // Use sanitized iconType
                };
                await fetchApi('/api/save_timetable.php', { method: 'POST', body: JSON.stringify(payload) });
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                expect(data.timetable).toBeDefined();
                expect(data.timetable.slots[0].iconType).toBe("book");
            });
        });

        // --- SUITE 12: REVISION SYSTEM ---
        engine.describe("12. Smart Revision", (it) => {
            let user: any;
            const topicId = 'c_bas_1';

            it("should create user", async () => {
                user = await registerUser('STUDENT', 'Rev User');
                if (!user) throw new Error("User setup failed");
            });

            it("should track revision check-ins", async () => {
                if (!user?.id) throw new Error("Skipping: User failed");
                
                // 1. Initial Complete
                await fetchApi('/api/sync_progress.php', { 
                    method: 'POST', 
                    body: JSON.stringify({ user_id: user.id, topic_id: topicId, status: 'COMPLETED' }) 
                });

                // 2. Perform Revision (Level 1)
                const nextDate = "2025-12-31";
                await fetchApi('/api/sync_progress.php', { 
                    method: 'POST', 
                    body: JSON.stringify({ 
                        user_id: user.id, topic_id: topicId, 
                        status: 'COMPLETED', revisionCount: 1, nextRevisionDate: nextDate 
                    }) 
                });

                // 3. Verify
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const topic = data.progress.find((p: any) => p.topic_id === topicId);
                
                expect(parseInt(topic.revision_count)).toBe(1);
                expect(topic.next_revision_date).toBe(nextDate);
            });
        });

        const finalResults = await engine.runAll();
        setResults(finalResults);
        setIsRunning(false);
        setProgress('');
    };

    const allTests = results ? (Object.values(results).flat() as TestResult[]) : [];
    const passedTests = allTests.filter(r => r.passed).length;
    const failedTests = allTests.length - passedTests;

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 animate-in fade-in">
            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center mb-2">
                        <Terminal className="w-8 h-8 mr-3 text-green-400" />
                        System Diagnostics
                    </h1>
                    <p className="text-slate-400">Run end-to-end functional tests on your live API.</p>
                </div>
                <div className="text-right">
                    <button 
                        onClick={runTests} 
                        disabled={isRunning}
                        className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg flex items-center transition-all disabled:opacity-50"
                    >
                        {isRunning ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : <Play className="w-6 h-6 mr-2" />}
                        {isRunning ? 'Running...' : 'Start Scan'}
                    </button>
                </div>
            </div>

            {isRunning && (
                <div className="bg-blue-50 text-blue-700 p-6 rounded-xl flex items-center border border-blue-200 shadow-sm animate-pulse">
                    <RefreshCw className="w-6 h-6 mr-4 animate-spin" />
                    <span className="font-mono font-bold text-lg">{progress}</span>
                </div>
            )}

            {results && !isRunning && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-2">Total</div>
                        <div className="text-4xl font-black text-slate-800">{allTests.length}</div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-sm text-center">
                        <div className="text-xs text-green-600 font-bold uppercase mb-2">Passed</div>
                        <div className="text-4xl font-black text-green-700">{passedTests}</div>
                    </div>
                    <div className={`p-6 rounded-xl border shadow-sm text-center ${failedTests > 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50'}`}>
                        <div className={`text-xs font-bold uppercase mb-2 ${failedTests > 0 ? 'text-red-600' : 'text-slate-500'}`}>Failed</div>
                        <div className={`text-4xl font-black ${failedTests > 0 ? 'text-red-700' : 'text-slate-400'}`}>{failedTests}</div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {results && Object.entries(results).map(([suiteName, data]: [string, TestResult[]]) => {
                    const suitePassed = data.every(t => t.passed);
                    return (
                    <div key={suiteName} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className={`px-6 py-4 border-b border-slate-100 flex justify-between items-center ${suitePassed ? 'bg-slate-50' : 'bg-red-50'}`}>
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-slate-500"/>
                                <h3 className="font-bold text-slate-800">{suiteName}</h3>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${suitePassed ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                {data.filter(t => t.passed).length}/{data.length}
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100 flex-1">
                            {data.map((test, idx) => (
                                <div key={idx} className="px-6 py-4 flex items-start justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start space-x-3">
                                        <div className="mt-0.5 shrink-0">
                                            {test.passed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">{test.description}</p>
                                            {!test.passed && (
                                                <div className="mt-2 bg-red-50 text-red-700 text-xs p-3 rounded-lg font-mono border border-red-100 flex items-start break-all">
                                                    <AlertTriangle className="w-3 h-3 mr-2 mt-0.5 shrink-0" />
                                                    {test.error}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap ml-4">
                                        {test.duration.toFixed(0)}ms
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
};

export default TestRunner;
