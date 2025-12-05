
import React, { useState } from 'react';
import { TestRunnerEngine, expect, TestResult } from '../utils/testFramework';
import { Play, CheckCircle2, XCircle, Terminal, AlertTriangle, Loader2, RefreshCw, Database, Users, BookOpen, Target, BarChart2, Calendar, ListTodo, Shield, Mail, Layers, UserCog } from 'lucide-react';

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
            // Check for empty response
            if (!text.trim()) {
                throw new Error(`Empty response from ${url}`);
            }
            const data = JSON.parse(text);
            if (!res.ok) {
                throw new Error(data.message || data.error || `Server Error (${res.status})`);
            }
            return data;
        } catch (jsonErr) {
            console.error("Raw Response:", text);
            // Show preview of raw text to help debug PHP errors (warnings/notices)
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
            
            // Verify ID is valid random 6-digit
            const id = parseInt(data.user.id);
            if (isNaN(id) || id < 100000 || id > 999999) {
                throw new Error(`Invalid User ID Generated: ${data.user.id}`);
            }
            
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
        engine.describe("2. Auth & Connections", (it) => {
            let student: any;
            let parent: any;

            it("should register a valid Student", async () => {
                setProgress("Creating Student...");
                student = await registerUser('STUDENT', 'Test Student');
                expect(student.role).toBe('STUDENT');
            });

            it("should register a valid Parent", async () => {
                setProgress("Creating Parent...");
                parent = await registerUser('PARENT', 'Test Parent');
                expect(parent.role).toBe('PARENT');
            });

            it("should send Connection Request", async () => {
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
        });

        // --- SUITE 3: SYLLABUS SYNC ---
        engine.describe("3. Syllabus Data", (it) => {
            let user: any;
            const topicId = 'p_kin_1';

            it("should create user", async () => {
                user = await registerUser('STUDENT', 'Syllabus User');
            });

            it("should save topic progress", async () => {
                setProgress("Syncing Syllabus...");
                const payload = {
                    user_id: user.id, topic_id: topicId, status: 'COMPLETED',
                    ex1Solved: 10, ex1Total: 30
                };
                const data = await fetchApi('/api/sync_progress.php', {
                    method: 'POST', body: JSON.stringify(payload)
                });
                expect(data.message).toContain("saved");
            });

            it("should retrieve progress correctly", async () => {
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const topic = data.progress.find((p: any) => p.topic_id === topicId);
                expect(topic.status).toBe('COMPLETED');
                expect(parseInt(topic.ex1_solved)).toBe(10);
            });
        });

        // --- SUITE 4: TASK MANAGEMENT ---
        engine.describe("4. Task Management", (it) => {
            let user: any;
            let goalId = `g_${timestamp}`;

            it("should create user", async () => {
                user = await registerUser('STUDENT', 'Task User');
            });

            it("should create & toggle Goal", async () => {
                setProgress("Testing Goals...");
                await fetchApi('/api/manage_goals.php', {
                    method: 'POST', body: JSON.stringify({ id: goalId, user_id: user.id, text: "Test Goal" })
                });
                await fetchApi('/api/manage_goals.php', {
                    method: 'PUT', body: JSON.stringify({ id: goalId })
                });
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const goal = data.goals.find((g: any) => g.id === goalId);
                expect(goal.is_completed == 1).toBe(true);
            });
        });

        // --- SUITE 5: ANALYTICS & EXAM ---
        engine.describe("5. Exam & Analytics", (it) => {
            let user: any;
            let attemptId = `att_${timestamp}`;

            it("should create user", async () => {
                user = await registerUser('STUDENT', 'Exam User');
            });

            it("should save detailed test attempt", async () => {
                setProgress("Submitting Exam...");
                const payload = {
                    id: attemptId, user_id: user.id, testId: 'test_jee_main_2024',
                    score: 4, totalQuestions: 1, correctCount: 1, incorrectCount: 0, accuracy_percent: 100,
                    detailedResults: [
                        { questionId: 'p_1', status: 'CORRECT', subjectId: 'phys', topicId: 'p_kin_1', selectedOptionIndex: 3 }
                    ]
                };
                const data = await fetchApi('/api/save_attempt.php', {
                    method: 'POST', body: JSON.stringify(payload)
                });
                expect(data.message).toContain("Attempt saved");
            });

            it("should retrieve attempt with Topic Metadata", async () => {
                setProgress("Verifying Analytics...");
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                const attempt = data.attempts.find((a: any) => a.id === attemptId);
                
                expect(attempt).toBeDefined();
                expect(attempt.detailedResults[0].subjectId).toBe('phys'); // Check JOIN worked
                expect(attempt.detailedResults[0].selectedOptionIndex).toBe(3); // Check Option saved
            });
        });

        // --- SUITE 6: TIMETABLE ---
        engine.describe("6. Timetable Engine", (it) => {
            let user: any;

            it("should create user", async () => {
                user = await registerUser('STUDENT', 'TT User');
            });

            it("should save complex timetable slots", async () => {
                setProgress("Saving Timetable...");
                const slots = [
                    { time: "06:00", label: "Wake Up", iconType: "sun" }
                ];
                await fetchApi('/api/save_timetable.php', {
                    method: 'POST',
                    body: JSON.stringify({ user_id: user.id, config: {}, slots })
                });
            });

            it("should retrieve valid slots", async () => {
                const data = await fetchApi(`/api/get_dashboard.php?user_id=${user.id}`);
                expect(data.timetable.slots[0].iconType).toBe("sun");
            });
        });

        // --- SUITE 8: ADMIN ---
        engine.describe("8. Admin Features", (it) => {
            let admin: any;
            const blogId = `b_${timestamp}`;

            it("should login as Admin", async () => {
                const data = await fetchApi('/api/login.php', {
                    method: 'POST', body: JSON.stringify({ email: 'admin', password: 'Ishika@123' })
                });
                admin = data.user;
                expect(admin.role).toBe('ADMIN');
            });

            it("should create Blog Post with ISO Date", async () => {
                setProgress("Testing Blog...");
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
                
                await fetchApi('/api/manage_blog.php', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: blogId, title: "Test Blog", content: "Content", 
                        author: "Admin", category: "Updates", 
                        imageUrl: "", date: today
                    })
                });
                
                const common = await fetchApi('/api/get_common.php');
                const post = common.blogPosts.find((b: any) => b.id === blogId);
                expect(post).toBeDefined();
                expect(post.date).toBe(today); // Verify format didn't break DB
                
                // Cleanup
                await fetchApi(`/api/manage_blog.php?id=${blogId}`, { method: 'DELETE' });
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
                                 suiteName.includes('Admin') ? <Shield className="w-5 h-5 text-red-600"/> :
                                 suiteName.includes('Study') ? <Layers className="w-5 h-5 text-yellow-500"/> :
                                 suiteName.includes('Syllabus') ? <Target className="w-5 h-5 text-indigo-500"/> :
                                 suiteName.includes('User') ? <UserCog className="w-5 h-5 text-cyan-600"/> :
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
