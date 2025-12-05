
import React, { useState } from 'react';
import { TestRunnerEngine, expect, TestResult } from '../utils/testFramework';
import { Play, CheckCircle2, XCircle, Terminal, AlertTriangle, Loader2, RefreshCw, Database, Users, BookOpen, Target, BarChart2, Calendar, ListTodo } from 'lucide-react';

const TestRunner: React.FC = () => {
    const [results, setResults] = useState<Record<string, TestResult[]> | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState('');

    // --- UTILITY: Robust API Fetch ---
    const fetchApi = async (url: string, options?: RequestInit) => {
        let res;
        try {
            res = await fetch(url, options);
        } catch (netErr: any) {
            throw new Error(`Network Error: ${netErr.message}. Check URL or Internet.`);
        }

        if (res.status === 404) {
            throw new Error(`Endpoint not found (404): ${url}`);
        }

        const text = await res.text();
        try {
            const data = JSON.parse(text);
            if (!res.ok) {
                throw new Error(data.message || data.error || `Server Error (${res.status})`);
            }
            return data;
        } catch (jsonErr) {
            console.error("Raw Response:", text);
            // Show preview of raw text to help debug PHP errors
            throw new Error(`Invalid JSON response from ${url}. Raw Output: "${text.substring(0, 100)}..."`);
        }
    };

    const runTests = async () => {
        setIsRunning(true);
        setResults(null);
        
        const engine = new TestRunnerEngine();
        const timestamp = Date.now();

        // --- HELPER: REGISTER USER ---
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
            return data.user;
        };

        // --- SUITE 1: UTILITIES ---
        engine.describe("1. Core & API Health", (it) => {
            it("should ping the API root", async () => {
                setProgress("Pinging API...");
                const data = await fetchApi('/api/index.php');
                expect(data.status).toBe("active");
            });

            it("should connect to the database", async () => {
                setProgress("Checking DB...");
                const data = await fetchApi('/api/test_db.php');
                if (data.status === 'ERROR') throw new Error(data.message);
                expect(data.status).toBe("CONNECTED");
            });
        });

        // --- SUITE 2: AUTH & CONNECTION FLOW ---
        engine.describe("2. Parent-Student Connection", (it) => {
            let student: any;
            let parent: any;

            it("should register a fresh Student", async () => {
                setProgress("Creating Student...");
                student = await registerUser('STUDENT', 'Test Student');
                expect(student.role).toBe('STUDENT');
            });

            it("should register a fresh Parent", async () => {
                setProgress("Creating Parent...");
                parent = await registerUser('PARENT', 'Test Parent');
                expect(parent.role).toBe('PARENT');
            });

            it("should allow Parent to send connection request", async () => {
                setProgress("Sending Request...");
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

            it("should show request in Student profile (DB Check)", async () => {
                setProgress("Verifying Request...");
                // Re-login student to fetch fresh profile
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                
                const request = data.userProfileSync.pendingRequest;
                expect(request).toBeDefined();
                expect(request.fromId).toBe(parent.id);
            });

            it("should allow Student to accept request", async () => {
                setProgress("Accepting Request...");
                const data = await fetchApi('/api/respond_request.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        student_id: student.id,
                        parent_id: parent.id,
                        accept: true
                    })
                });
                expect(data.message).toContain("Accepted");
            });

            it("should link accounts in Database", async () => {
                setProgress("Checking Linkage...");
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                // Student should point to Parent
                expect(data.userProfileSync.parentId).toBe(parent.id);
            });
        });

        // --- SUITE 3: SYLLABUS TRACKING ---
        engine.describe("3. Syllabus Sync", (it) => {
            let user: any;
            const topicId = 'p_kin_1'; // Motion in Straight Line

            it("should create a user for tracking", async () => {
                setProgress("Creating Syllabus User...");
                user = await registerUser('STUDENT', 'Syllabus Tester');
            });

            it("should save topic progress (COMPLETED)", async () => {
                setProgress("Updating Topic...");
                const payload = {
                    user_id: user.id,
                    topic_id: topicId,
                    status: 'COMPLETED',
                    ex1Solved: 10,
                    ex1Total: 30
                };
                const data = await fetchApi('/api/sync_progress.php', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                expect(data.message).toContain("saved");
            });

            it("should retrieve saved progress from DB", async () => {
                setProgress("Fetching Dashboard...");
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                
                // Find the topic in the progress array
                const topic = data.progress.find((p: any) => p.topic_id === topicId);
                expect(topic).toBeDefined();
                expect(topic.status).toBe('COMPLETED');
                expect(parseInt(topic.ex1_solved)).toBe(10);
            });
        });

        // --- SUITE 4: TASK MANAGEMENT (BACKLOGS & GOALS) ---
        engine.describe("4. Backlogs & Goals (Full CRUD)", (it) => {
            let user: any;
            let goalId = `g_${timestamp}`;
            let backlogId = `b_${timestamp}`;

            it("should setup test user", async () => {
                user = await registerUser('STUDENT', 'Task Tester');
            });

            // 1. GOALS
            it("should CREATE a Daily Goal", async () => {
                setProgress("Testing Goals...");
                const data = await fetchApi('/api/manage_goals.php', {
                    method: 'POST',
                    body: JSON.stringify({ id: goalId, user_id: user.id, text: "Test DB Integrity" })
                });
                expect(data.message).toBe("Goal added");
            });

            it("should UPDATE (Toggle) the Goal", async () => {
                await fetchApi('/api/manage_goals.php', {
                    method: 'PUT',
                    body: JSON.stringify({ id: goalId })
                });
                // Verify
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const goal = data.goals.find((g: any) => g.id === goalId);
                expect(goal.is_completed == 1).toBe(true);
            });

            // 2. BACKLOGS
            it("should CREATE a Backlog item", async () => {
                setProgress("Testing Backlogs...");
                const data = await fetchApi('/api/manage_backlogs.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: backlogId, user_id: user.id, 
                        title: "Rotational Motion", subjectId: 'phys', 
                        priority: 'HIGH', deadline: '2025-12-31'
                    })
                });
                expect(data.message).toBe("Backlog added");
            });

            it("should UPDATE Backlog Status (Clear)", async () => {
                const data = await fetchApi('/api/manage_backlogs.php', {
                    method: 'PUT',
                    body: JSON.stringify({ id: backlogId })
                });
                expect(data.message).toBe("Status updated");
                
                // Verify DB
                const dash = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const backlog = dash.backlogs.find((b: any) => b.id === backlogId);
                expect(backlog.status).toBe('CLEARED');
            });

            it("should DELETE a Backlog item", async () => {
                const data = await fetchApi(`/api/manage_backlogs.php?id=${backlogId}`, { method: 'DELETE' });
                expect(data.message).toBe("Deleted");
                
                // Verify gone
                const dashData = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const backlog = dashData.backlogs.find((b: any) => b.id === backlogId);
                if (backlog) throw new Error("Backlog should have been deleted");
            });
        });

        // --- SUITE 5: EXAM ENGINE & ANALYTICS ---
        engine.describe("5. Exam Engine & Analytics", (it) => {
            let user: any;
            let attemptId = `att_${timestamp}`;
            let testId = 'test_jee_main_2024';

            it("should setup test user", async () => {
                user = await registerUser('STUDENT', 'Exam Tester');
            });

            it("should SAVE a Test Attempt with Results", async () => {
                setProgress("Submitting Test...");
                const payload = {
                    id: attemptId,
                    user_id: user.id,
                    testId: testId,
                    score: 100,
                    totalQuestions: 25,
                    correctCount: 25,
                    incorrectCount: 0,
                    accuracy_percent: 100.0,
                    detailedResults: [
                        { questionId: 'p_1', status: 'CORRECT' }, // Mock correct
                        { questionId: 'p_2', status: 'INCORRECT' } // Mock incorrect to test analytics
                    ]
                };
                
                const data = await fetchApi('/api/save_attempt.php', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                expect(data.message).toContain("Attempt saved");
            });

            it("should REFLECT attempt in Dashboard Analytics", async () => {
                setProgress("Checking Analytics...");
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                
                const attempt = data.attempts.find((a: any) => a.id === attemptId);
                expect(attempt).toBeDefined();
                expect(parseInt(attempt.score)).toBe(100);
            });

            it("should retrieve Granular Details (Correct/Incorrect)", async () => {
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const attempt = data.attempts.find((a: any) => a.id === attemptId);
                
                // detailedResults are fetched by get_dashboard.php
                expect(attempt.detailedResults).toBeDefined();
                expect(attempt.detailedResults.length).toBeGreaterThan(0);
                
                // Verify incorrect answer persistence
                const incorrect = attempt.detailedResults.find((r: any) => r.status === 'INCORRECT');
                expect(incorrect).toBeDefined();
                expect(incorrect.questionId).toBe('p_2');
            });
        });

        // --- SUITE 6: TIMETABLE GENERATOR ---
        engine.describe("6. Timetable Generator", (it) => {
            let user: any;
            
            it("should setup user", async () => {
                user = await registerUser('STUDENT', 'Timetable User');
            });

            it("should SAVE generated timetable slots", async () => {
                setProgress("Saving Schedule...");
                const config = { wakeTime: "06:00", bedTime: "22:00", schoolEnabled: true };
                const slots = [
                    { time: "06:00", label: "Wake Up", type: "routine", iconType: "sun" },
                    { time: "07:00", label: "Physics Theory", type: "theory", iconType: "book" }
                ];
                
                const data = await fetchApi('/api/save_timetable.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        user_id: user.id,
                        config,
                        slots
                    })
                });
                expect(data.message).toBe("Timetable saved");
            });

            it("should RETRIEVE timetable settings & slots", async () => {
                setProgress("Loading Schedule...");
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                
                expect(data.timetable).toBeDefined();
                expect(data.timetable.config.wakeTime).toBe("06:00");
                expect(data.timetable.slots.length).toBe(2);
                expect(data.timetable.slots[1].label).toBe("Physics Theory");
            });
        });

        // --- SUITE 7: PARENT MONITORING VIEW ---
        engine.describe("7. Parent Monitoring Access", (it) => {
            let student: any;
            let parent: any;
            const attemptId = `att_p_${timestamp}`;

            it("should setup linked Student & Parent", async () => {
                setProgress("Linking Accounts...");
                student = await registerUser('STUDENT', 'Child User');
                parent = await registerUser('PARENT', 'Parent User');
                
                // Fast-track linking via API
                await fetchApi('/api/send_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ student_identifier: student.email, parent_id: parent.id, parent_name: parent.name })
                });
                await fetchApi('/api/respond_request.php', {
                    method: 'POST',
                    body: JSON.stringify({ student_id: student.id, parent_id: parent.id, accept: true })
                });
            });

            it("should record student activity (Exam & Syllabus)", async () => {
                setProgress("Simulating Student Activity...");
                // 1. Take Exam
                await fetchApi('/api/save_attempt.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: attemptId, user_id: student.id, testId: 'test_jee_adv_2023',
                        score: 150, totalQuestions: 50, correctCount: 30, incorrectCount: 5, accuracy_percent: 85.7,
                        detailedResults: []
                    })
                });
                // 2. Mark Syllabus
                await fetchApi('/api/sync_progress.php', {
                    method: 'POST',
                    body: JSON.stringify({ user_id: student.id, topic_id: 'm_cpx_1', status: 'COMPLETED' })
                });
            });

            it("should allow PARENT to view Student Analytics", async () => {
                setProgress("Fetching as Parent...");
                // In the app, Parent uses student_id to fetch dashboard
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${student.id}`);
                
                // Verify Test Result visibility
                const attempt = data.attempts.find((a: any) => a.id === attemptId);
                expect(attempt).toBeDefined();
                expect(parseInt(attempt.score)).toBe(150);
                
                // Verify Syllabus visibility
                const topic = data.progress.find((p: any) => p.topic_id === 'm_cpx_1');
                expect(topic).toBeDefined();
                expect(topic.status).toBe('COMPLETED');
            });
        });

        const finalResults = await engine.runAll();
        setResults(finalResults);
        setIsRunning(false);
        setProgress('');
    };

    const allTests = results ? (Object.values(results).flat() as TestResult[]) : [];
    const totalTests = allTests.length;
    const passedTests = allTests.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 animate-in fade-in">
            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center mb-2">
                        <Terminal className="w-8 h-8 mr-3 text-green-400" />
                        System Diagnostics & Tests
                    </h1>
                    <p className="text-slate-400">Run end-to-end functional tests on your live Hostinger deployment.</p>
                </div>
                <div className="text-right">
                    <button 
                        onClick={runTests} 
                        disabled={isRunning}
                        className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg flex items-center transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
                    >
                        {isRunning ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : <Play className="w-6 h-6 mr-2" />}
                        {isRunning ? 'Running Simulation...' : 'Start Full System Scan'}
                    </button>
                </div>
            </div>

            {/* Progress Indicator */}
            {isRunning && (
                <div className="bg-blue-50 text-blue-700 p-6 rounded-xl flex items-center border border-blue-200 shadow-sm animate-pulse">
                    <RefreshCw className="w-6 h-6 mr-4 animate-spin" />
                    <span className="font-mono font-bold text-lg">{progress}</span>
                </div>
            )}

            {/* Results Summary */}
            {results && !isRunning && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Total Scenarios</div>
                        <div className="text-4xl font-black text-slate-800">{totalTests}</div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-sm text-center">
                        <div className="text-xs text-green-600 font-bold uppercase tracking-wider mb-2">Passed</div>
                        <div className="text-4xl font-black text-green-700">{passedTests}</div>
                    </div>
                    <div className={`p-6 rounded-xl border shadow-sm text-center ${failedTests > 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${failedTests > 0 ? 'text-red-600' : 'text-slate-500'}`}>Failed</div>
                        <div className={`text-4xl font-black ${failedTests > 0 ? 'text-red-700' : 'text-slate-400'}`}>{failedTests}</div>
                    </div>
                </div>
            )}

            {/* Detailed Report */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {results && Object.entries(results).map(([suiteName, data]) => {
                    const suiteTests = data as TestResult[];
                    const suitePassed = suiteTests.every(t => t.passed);
                    
                    return (
                    <div key={suiteName} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className={`px-6 py-4 border-b border-slate-100 flex justify-between items-center ${suitePassed ? 'bg-slate-50' : 'bg-red-50'}`}>
                            <div className="flex items-center gap-3">
                                {suiteName.includes('Auth') ? <Users className="w-5 h-5 text-blue-500"/> : 
                                 suiteName.includes('DB') ? <Database className="w-5 h-5 text-purple-500"/> :
                                 suiteName.includes('Analytics') ? <BarChart2 className="w-5 h-5 text-pink-500"/> :
                                 suiteName.includes('Timetable') ? <Calendar className="w-5 h-5 text-teal-500"/> :
                                 suiteName.includes('Task') ? <ListTodo className="w-5 h-5 text-orange-500"/> :
                                 suiteName.includes('Syllabus') ? <Target className="w-5 h-5 text-indigo-500"/> :
                                 <BookOpen className="w-5 h-5 text-slate-500"/>}
                                <h3 className="font-bold text-slate-800">{suiteName}</h3>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${suitePassed ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                {suiteTests.filter(t => t.passed).length}/{suiteTests.length}
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100 flex-1">
                            {suiteTests.map((test, idx) => (
                                <div key={idx} className="px-6 py-4 flex items-start justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start space-x-3">
                                        <div className="mt-0.5 shrink-0">
                                            {test.passed ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">{test.description}</p>
                                            {!test.passed && (
                                                <div className="mt-2 bg-red-50 text-red-700 text-xs p-3 rounded-lg font-mono border border-red-100 flex items-start">
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
