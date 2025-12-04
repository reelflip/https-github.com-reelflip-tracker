
import React, { useState, useEffect } from 'react';
import { User, TopicProgress, TestAttempt, Test, Question, Notification, MistakeRecord, DailyGoal, Quote, Flashcard, BacklogItem, TopicStatus, Role } from './types';
import { MOCK_USERS, JEE_SYLLABUS, MOCK_TESTS, DEFAULT_QUOTES, INITIAL_FLASHCARDS } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SyllabusTracker from './components/SyllabusTracker';
import TestCenter from './components/TestCenter';
import FocusZone from './components/FocusZone';
import AdminPanel from './components/AdminPanel';
import SystemDocs from './components/SystemDocs';
import AuthScreen from './components/AuthScreen';
import TimetableGenerator from './components/TimetableGenerator';
import Analytics from './components/Analytics';
import ProfileSettings from './components/ProfileSettings';
import MistakeNotebook from './components/MistakeNotebook';
import WellnessCorner from './components/WellnessCorner';
import FlashcardDeck from './components/FlashcardDeck';
import BacklogManager from './components/BacklogManager';
import { API_BASE_URL } from './config'; // Ensure this exists or use relative path logic

// Initial global questions combined from constants
const INITIAL_QUESTIONS: Question[] = MOCK_TESTS.flatMap(t => t.questions).reduce((acc, current) => {
  const x = acc.find(item => item.id === current.id);
  if (!x) {
    return acc.concat([current]);
  } else {
    return acc;
  }
}, [] as Question[]);

function App() {
  // --- User State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // --- Data State ---
  const [progress, setProgress] = useState<Record<string, TopicProgress>>({});
  const [tests, setTests] = useState<Test[]>(MOCK_TESTS);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>(DEFAULT_QUOTES);
  const [adminQuote, setAdminQuote] = useState<Quote | null>(null);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [backlogs, setBacklogs] = useState<BacklogItem[]>([]);

  // --- API: Fetch Data on Login ---
  useEffect(() => {
    if (currentUser) {
        fetchDashboardData();
        fetchCommonData();
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
      if (!currentUser) return;
      
      // If Parent, fetch Student's data instead
      const targetUserId = currentUser.role === 'PARENT' && currentUser.studentId 
          ? currentUser.studentId 
          : currentUser.id;

      try {
          const res = await fetch(`/api/get_dashboard.php?user_id=${targetUserId}`);
          if (!res.ok) return; // Silent fail in demo
          const data = await res.json();
          
          if (data.progress) {
              // Convert array to record object
              const progObj: Record<string, TopicProgress> = {};
              data.progress.forEach((p: any) => {
                  progObj[p.topic_id] = {
                      topicId: p.topic_id,
                      status: p.status,
                      ex1Solved: parseInt(p.ex1_solved || 0),
                      ex1Total: parseInt(p.ex1_total || 30),
                      ex2Solved: parseInt(p.ex2_solved || 0),
                      ex2Total: parseInt(p.ex2_total || 20),
                      ex3Solved: parseInt(p.ex3_solved || 0),
                      ex3Total: parseInt(p.ex3_total || 15),
                      ex4Solved: parseInt(p.ex4_solved || 0),
                      ex4Total: parseInt(p.ex4_total || 10),
                  };
              });
              setProgress(progObj);
          }
          if (data.goals) {
              setGoals(data.goals.map((g: any) => ({
                  id: g.id,
                  text: g.goal_text,
                  completed: g.is_completed == 1
              })));
          }
          if (data.mistakes) {
              setMistakes(data.mistakes.map((m: any) => ({
                  id: m.id,
                  questionText: m.question_text,
                  subjectId: m.subject_id,
                  topicId: m.topic_id,
                  testName: m.test_name,
                  date: m.created_at,
                  userNotes: m.user_notes,
                  tags: m.tags_json ? JSON.parse(m.tags_json) : []
              })));
          }
          if (data.backlogs) {
              setBacklogs(data.backlogs.map((b: any) => ({
                  id: b.id,
                  title: b.title,
                  subjectId: b.subject_id,
                  priority: b.priority,
                  deadline: b.deadline,
                  status: b.status
              })));
          }
      } catch (err) {
          console.error("Failed to fetch dashboard", err);
      }
  };

  const fetchCommonData = async () => {
      try {
          const res = await fetch(`/api/get_common.php`);
          if (!res.ok) return;
          const data = await res.json();

          if (data.quotes && data.quotes.length > 0) setQuotes(data.quotes);
          if (data.flashcards && data.flashcards.length > 0) {
              setFlashcards(data.flashcards.map((f: any) => ({
                  id: f.id,
                  subjectId: f.subject_id,
                  front: f.front,
                  back: f.back,
                  difficulty: f.difficulty
              })));
          }
          if (data.notifications) setNotifications(data.notifications);
          // Tests are complex to map back from flat DB structure, keeping mock/static for now or need sophisticated mapper
      } catch (err) {
          console.error("Failed to fetch common data", err);
      }
  };

  // --- Handlers ---

  const handleUpdateProgress = async (topicId: string, updates: Partial<TopicProgress>) => {
    // 1. Optimistic Update
    setProgress(prev => {
      const current = prev[topicId] || {
        topicId, status: 'NOT_STARTED',
        ex1Solved: 0, ex1Total: 30, ex2Solved: 0, ex2Total: 20,
        ex3Solved: 0, ex3Total: 15, ex4Solved: 0, ex4Total: 10
      };
      return { ...prev, [topicId]: { ...current, ...updates } };
    });

    // 2. API Sync
    if (currentUser) {
        try {
            const current = progress[topicId] || {
                topicId, status: 'NOT_STARTED',
                ex1Solved: 0, ex1Total: 30, ex2Solved: 0, ex2Total: 20,
                ex3Solved: 0, ex3Total: 15, ex4Solved: 0, ex4Total: 10
            };
            const payload = { 
                user_id: currentUser.id, 
                topic_id: topicId, 
                ...current, 
                ...updates 
            };
            await fetch('/api/sync_progress.php', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        } catch(e) { console.error("Sync failed", e); }
    }
  };

  const handleCompleteTest = (attempt: TestAttempt) => {
    setAttempts([attempt, ...attempts]);
    
    // Auto-capture mistakes
    if (attempt.detailedResults) {
        const newMistakes: MistakeRecord[] = attempt.detailedResults
            .filter(r => r.status === 'INCORRECT')
            .map(r => {
                // Find Question Text
                const q = questions.find(q => q.id === r.questionId);
                const t = tests.find(t => t.id === attempt.testId);
                return {
                    id: `m_${Date.now()}_${r.questionId}`,
                    questionText: q?.text || "Question Text Unavailable",
                    subjectId: r.subjectId,
                    topicId: r.topicId,
                    testName: t?.title || "Unknown Test",
                    date: new Date().toISOString(),
                    tags: ['Conceptual Error'] // Default tag
                };
            });
        
        // Optimistic update
        setMistakes(prev => [...newMistakes, ...prev]);

        // Sync mistakes to DB
        if(currentUser) {
            newMistakes.forEach(m => {
                fetch('/api/manage_mistakes.php', {
                    method: 'POST',
                    body: JSON.stringify({ ...m, user_id: currentUser.id })
                });
            });
        }
    }
  };

  const handleUpdateUser = (updates: Partial<User>) => {
      if (currentUser) {
          setCurrentUser({ ...currentUser, ...updates });
          // In a real app, send to update_profile.php
      }
  };

  // --- Admin Handlers ---
  const handleAddQuestion = (q: Question) => setQuestions([...questions, q]);
  const handleCreateTest = (t: Test) => setTests([...tests, t]);
  const handleSendNotification = (n: Notification) => setNotifications([n, ...notifications]);
  const handleAddQuote = (text: string, author: string) => {
      const newQ = { id: `q_${Date.now()}`, text, author };
      setQuotes([...quotes, newQ]);
      setAdminQuote(newQ);
  };
  const handleDeleteQuote = (id: string) => setQuotes(quotes.filter(q => q.id !== id));

  // --- Goals & Backlogs ---
  const handleToggleGoal = (id: string) => {
      setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
      if(currentUser) {
          fetch('/api/manage_goals.php', { method: 'PUT', body: JSON.stringify({ id }) });
      }
  };
  const handleAddGoal = (text: string) => {
      const newGoal = { id: `g_${Date.now()}`, text, completed: false };
      setGoals([...goals, newGoal]);
      if(currentUser) {
          fetch('/api/manage_goals.php', { method: 'POST', body: JSON.stringify({ ...newGoal, user_id: currentUser.id }) });
      }
  };

  const handleAddBacklog = (item: BacklogItem) => {
      setBacklogs([...backlogs, item]);
      if(currentUser) {
          fetch('/api/manage_backlogs.php', { method: 'POST', body: JSON.stringify({ ...item, user_id: currentUser.id }) });
      }
  };
  const handleToggleBacklog = (id: string) => {
      setBacklogs(backlogs.map(b => b.id === id ? { ...b, status: b.status === 'PENDING' ? 'CLEARED' : 'PENDING' } : b));
      if(currentUser) {
          fetch('/api/manage_backlogs.php', { method: 'PUT', body: JSON.stringify({ id }) });
      }
  };
  const handleDeleteBacklog = (id: string) => {
      setBacklogs(backlogs.filter(b => b.id !== id));
      if(currentUser) {
          fetch(`/api/manage_backlogs.php?id=${id}`, { method: 'DELETE' });
      }
  };

  const handleMistakeUpdate = (id: string, updates: Partial<MistakeRecord>) => {
      setMistakes(mistakes.map(m => m.id === id ? { ...m, ...updates } : m));
      // Sync update (specifically for notes/tags)
      if(currentUser) {
          const mistake = mistakes.find(m => m.id === id);
          if(mistake) {
             fetch('/api/manage_mistakes.php', { 
                 method: 'PUT', 
                 body: JSON.stringify({ id, ...mistake, ...updates }) 
             });
          }
      }
  };
  const handleMistakeDelete = (id: string) => {
      setMistakes(mistakes.filter(m => m.id !== id));
      if(currentUser) {
          fetch(`/api/manage_mistakes.php?id=${id}`, { method: 'DELETE' });
      }
  };

  // --- Render Logic ---

  if (!currentUser) {
    return <AuthScreen onLogin={setCurrentUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            user={currentUser} 
            progress={progress} 
            onChangeTab={setActiveTab}
            notifications={notifications}
            quotes={quotes}
            goals={goals}
            onToggleGoal={handleToggleGoal}
            onAddGoal={handleAddGoal}
          />
        );
      case 'syllabus':
        return (
          <SyllabusTracker 
            user={currentUser}
            subjects={JEE_SYLLABUS} 
            progress={progress} 
            onUpdateProgress={handleUpdateProgress} 
          />
        );
      case 'tests':
        return (
          <TestCenter 
            availableTests={tests} 
            attempts={attempts} 
            onCompleteTest={handleCompleteTest} 
          />
        );
      case 'focus':
        return <FocusZone />;
      case 'analytics':
        return <Analytics attempts={attempts} tests={tests} syllabus={JEE_SYLLABUS} />;
      case 'timetable':
        return <TimetableGenerator />;
      case 'users':
        return (
            <AdminPanel 
                users={MOCK_USERS} 
                questionBank={questions} 
                quotes={quotes}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onAddQuestion={handleAddQuestion}
                onCreateTest={handleCreateTest}
                onSendNotification={handleSendNotification}
                onAddQuote={handleAddQuote}
                onDeleteQuote={handleDeleteQuote}
            />
        );
      case 'system':
        return <SystemDocs />;
      case 'profile':
        return <ProfileSettings user={currentUser} onUpdateUser={handleUpdateUser} />;
      case 'mistakes':
        return <MistakeNotebook mistakes={mistakes} onUpdateMistake={handleMistakeUpdate} onDeleteMistake={handleMistakeDelete} />;
      case 'wellness':
        return <WellnessCorner />;
      case 'flashcards':
        return <FlashcardDeck cards={flashcards} />;
      case 'backlogs':
        return <BacklogManager backlogs={backlogs} onAddBacklog={handleAddBacklog} onToggleStatus={handleToggleBacklog} onDeleteBacklog={handleDeleteBacklog} />;
      case 'parent_view':
        // Reuse Dashboard for Parent but read-only conceptually (handled by fetching logic)
        return (
            <Dashboard 
                user={currentUser} 
                progress={progress} 
                onChangeTab={() => {}} // Parent cannot nav
                notifications={notifications}
                quotes={quotes}
                goals={goals} // Viewing student's goals
                onToggleGoal={() => {}} // Read only
                onAddGoal={() => {}}
            />
        );
      default:
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                <p>Welcome to JEE Tracker. Select a tab to begin.</p>
            </div>
        );
    }
  };

  return (
    <Layout 
      currentUser={currentUser} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onLogout={() => {
          setCurrentUser(null);
          setProgress({});
          setGoals([]);
          setMistakes([]);
      }}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
