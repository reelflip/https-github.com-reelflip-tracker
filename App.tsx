
import React, { useState, useEffect } from 'react';
import { User, TopicProgress, TestAttempt, Test, Question, Notification, MistakeRecord, DailyGoal, Quote, Flashcard, BacklogItem, TopicStatus, Role, MemoryHack, ContactMessage, BlogPost } from './types';
import { MOCK_USERS, JEE_SYLLABUS, MOCK_TESTS, DEFAULT_QUOTES, INITIAL_FLASHCARDS, INITIAL_MEMORY_HACKS, BLOG_POSTS } from './constants';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
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
import MemoryHacks from './components/MemoryHacks';
import AboutUs from './components/AboutUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import ContactUs from './components/ContactUs';
import Blog from './components/Blog';
import ExamGuide from './components/ExamGuide';
import { API_BASE_URL } from './config'; 

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
  const [hacks, setHacks] = useState<MemoryHack[]>(INITIAL_MEMORY_HACKS);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS); // Initialized with Mock Users for local dev
  const [timetableData, setTimetableData] = useState<{config: any, slots: any[]} | null>(null);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);

  // --- API: Fetch Data on Login ---
  useEffect(() => {
    if (currentUser) {
        fetchDashboardData();
        fetchCommonData();
        if (currentUser.role === 'ADMIN') {
            fetchAdminData();
        }
    }
  }, [currentUser?.id, currentUser?.role]);

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
          
          // --- PROFILE SYNC (Critical for Connection Requests) ---
          if (data.userProfileSync && currentUser.id === targetUserId) {
              const synced = data.userProfileSync;
              // Check if any connection data changed
              if (
                  JSON.stringify(synced.pendingRequest) !== JSON.stringify(currentUser.pendingRequest) ||
                  synced.parentId !== currentUser.parentId ||
                  synced.studentId !== currentUser.studentId
              ) {
                  console.log("Syncing Profile Data from Server...");
                  setCurrentUser(prev => prev ? ({ 
                      ...prev, 
                      pendingRequest: synced.pendingRequest,
                      parentId: synced.parentId,
                      studentId: synced.studentId
                  }) : null);
              }
          }

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
          if (data.timetable) {
              setTimetableData(data.timetable);
          }
          if (data.attempts) {
              // Map DB attempts to Frontend structure
              setAttempts(data.attempts.map((a: any) => ({
                  id: a.id,
                  testId: a.test_id,
                  studentId: a.user_id,
                  date: a.attempt_date,
                  score: parseInt(a.score || 0),
                  totalQuestions: parseInt(a.total_questions || 0),
                  correctCount: parseInt(a.correct_count || 0),
                  incorrectCount: parseInt(a.incorrect_count || 0),
                  unattemptedCount: parseInt(a.total_questions || 0) - (parseInt(a.correct_count || 0) + parseInt(a.incorrect_count || 0)),
                  accuracy_percent: parseFloat(a.accuracy_percent || 0),
                  detailedResults: a.detailedResults || []
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
          if (data.hacks && data.hacks.length > 0) {
              setHacks(data.hacks.map((h: any) => ({
                  id: h.id,
                  subjectId: h.subject_id,
                  category: h.category,
                  title: h.title,
                  description: h.description,
                  trick: h.trick,
                  tags: h.tags_json ? JSON.parse(h.tags_json) : []
              })));
          }
          if (data.notifications) setNotifications(data.notifications);
          
          if (data.blogPosts && data.blogPosts.length > 0) {
              setBlogPosts(data.blogPosts.map((b: any) => ({
                  id: b.id,
                  title: b.title,
                  excerpt: b.excerpt,
                  content: b.content,
                  author: b.author,
                  category: b.category,
                  imageUrl: b.imageUrl,
                  date: b.date
              })));
          }

          // Load tests from DB (combining with mock if needed, but DB priority)
          if (data.tests && data.tests.length > 0) {
              const dbTests: Test[] = data.tests.map((t: any) => ({
                  id: t.id,
                  title: t.title,
                  durationMinutes: parseInt(t.duration_minutes),
                  category: t.category,
                  difficulty: t.difficulty,
                  examType: t.exam_type,
                  questions: t.questions ? t.questions.map((q: any) => ({
                      id: q.id,
                      subjectId: q.subject_id,
                      topicId: q.topic_id,
                      text: q.question_text,
                      options: q.options || [], 
                      correctOptionIndex: parseInt(q.correct_option_index)
                  })) : []
              }));
              // Use DB tests as source of truth (includes seeded mock + new admin tests)
              setTests(dbTests);
          }
      } catch (err) {
          console.error("Failed to fetch common data", err);
      }
  };

  const fetchAdminData = async () => {
      try {
          const res = await fetch(`/api/get_users.php`);
          if (!res.ok) return;
          const data = await res.json();
          if (Array.isArray(data)) {
              setAllUsers(data);
          }
      } catch (err) {
          console.error("Failed to fetch users", err);
      }
      try {
          const res = await fetch(`/api/manage_contact.php`);
          if (!res.ok) return;
          const data = await res.json();
          if (Array.isArray(data)) {
              setContactMessages(data);
          }
      } catch (err) { console.error("Failed to fetch contacts", err); }
  }

  // --- Handlers ---

  const handleLogin = (user: User) => {
      // SMART LOGIN: Prioritize state from 'allUsers' (Mock DB) if available
      // This ensures that when testing locally with Quick Login, we don't overwrite
      // pending requests with a fresh user object.
      const existingUser = allUsers.find(u => u.id === user.id);
      
      if (existingUser && window.IITJEE_CONFIG?.enableDevTools) {
          // Merge to keep existing state (like pendingRequest) but allow new props
          setCurrentUser({ ...existingUser, ...user });
      } else {
          setCurrentUser(user);
      }
  };

  const handleTimetableUpdate = (config: any, slots: any[]) => {
      setTimetableData({ config, slots });
  };

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
        
        // Save full attempt history
        if(currentUser) {
            fetch('/api/save_attempt.php', {
                method: 'POST',
                body: JSON.stringify({ ...attempt, user_id: currentUser.id })
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

  // --- Admin Handlers (With DB Persistence) ---
  const handleAddQuestion = async (q: Question) => {
      setQuestions([...questions, q]);
      try {
          await fetch('/api/manage_tests.php', {
              method: 'POST',
              body: JSON.stringify({ action: 'add_question', ...q })
          });
      } catch (e) { console.error(e); }
  };

  const handleCreateTest = async (t: Test) => {
      setTests([...tests, t]);
      try {
          await fetch('/api/manage_tests.php', {
              method: 'POST',
              body: JSON.stringify({ action: 'create_test', ...t })
          });
      } catch (e) { console.error(e); }
  };

  const handleSendNotification = async (n: Notification) => {
      setNotifications([n, ...notifications]);
      try {
          await fetch('/api/manage_broadcasts.php', {
              method: 'POST',
              body: JSON.stringify({ action: 'send_notification', ...n })
          });
      } catch (e) { console.error(e); }
  };

  const handleAddQuote = async (text: string, author: string) => {
      const newQ = { id: `q_${Date.now()}`, text, author };
      setQuotes([...quotes, newQ]);
      setAdminQuote(newQ);
      try {
          await fetch('/api/manage_broadcasts.php', {
              method: 'POST',
              body: JSON.stringify({ action: 'add_quote', ...newQ })
          });
      } catch (e) { console.error(e); }
  };

  const handleDeleteQuote = async (id: string) => {
      setQuotes(quotes.filter(q => q.id !== id));
      try {
          await fetch(`/api/manage_broadcasts.php?action=delete_quote&id=${id}`, { method: 'GET' }); // Or POST/DELETE
      } catch (e) { console.error(e); }
  };

  const handleAdminUpdateUser = async (user: Partial<User>) => {
      try {
          await fetch('/api/manage_users.php', {
              method: 'PUT',
              body: JSON.stringify(user)
          });
          // Refresh list
          fetchAdminData();
      } catch (err) {
          console.error("Failed to update user", err);
      }
  };

  const handleAdminDeleteUser = async (id: string) => {
      try {
          await fetch(`/api/manage_users.php?id=${id}`, {
              method: 'DELETE'
          });
          // Refresh list
          fetchAdminData();
      } catch (err) {
          console.error("Failed to delete user", err);
      }
  };

  const handleDeleteContact = async (id: number) => {
      try {
          await fetch(`/api/manage_contact.php?id=${id}`, {
              method: 'DELETE'
          });
          fetchAdminData();
      } catch (err) { console.error("Failed to delete message", err); }
  };

  const handleAddBlogPost = async (post: BlogPost) => {
      setBlogPosts([post, ...blogPosts]);
      try {
          await fetch('/api/manage_blog.php', {
              method: 'POST',
              body: JSON.stringify(post)
          });
      } catch (e) { console.error("Failed to add blog post", e); }
  };

  const handleDeleteBlogPost = async (id: string) => {
      setBlogPosts(blogPosts.filter(b => b.id !== id));
      try {
          await fetch(`/api/manage_blog.php?id=${id}`, {
              method: 'DELETE'
          });
      } catch (e) { console.error("Failed to delete blog post", e); }
  };

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

  // --- Connection Handlers ---
  const handleSendConnectionRequest = (studentIdentifier: string) => {
      // 2. Call API (for production)
      if (currentUser) {
          fetch('/api/send_request.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  student_identifier: studentIdentifier,
                  parent_id: currentUser.id,
                  parent_name: currentUser.name
              })
          })
          .then(res => res.json())
          .then(data => {
              if (data.message === "Request Sent Successfully") {
                  // Success
              } else {
                  console.error(data.message);
              }
          })
          .catch(err => console.error("Failed to send request", err));
      }
  };

  const handleRespondConnectionRequest = (accept: boolean) => {
      if (currentUser && currentUser.pendingRequest) {
          const parentId = currentUser.pendingRequest.fromId;
          
          // 1. Optimistic Update
          const updatedStudent = { ...currentUser, pendingRequest: undefined };
          if (accept) {
              updatedStudent.parentId = parentId;
          }
          setCurrentUser(updatedStudent);

          // 2. Call API (for production)
          fetch('/api/respond_request.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  student_id: currentUser.id,
                  parent_id: parentId, // Passed for redundancy check
                  accept: accept
              })
          }).catch(err => console.error("Failed to respond to request", err));
      }
  };

  // --- Render Logic ---

  if (!currentUser) {
    // If not logged in, check if user wants to see public pages
    switch (activeTab) {
      case 'about':
        return <PublicLayout onNavigate={setActiveTab}><AboutUs /></PublicLayout>;
      case 'privacy':
        return <PublicLayout onNavigate={setActiveTab}><PrivacyPolicy /></PublicLayout>;
      case 'contact':
        return <PublicLayout onNavigate={setActiveTab}><ContactUs /></PublicLayout>;
      case 'blog':
        return <PublicLayout onNavigate={setActiveTab}><Blog posts={blogPosts} /></PublicLayout>;
      case 'exams':
        return <PublicLayout onNavigate={setActiveTab}><ExamGuide /></PublicLayout>;
      default:
        // Default to AuthScreen (Login/Register)
        return <AuthScreen onLogin={handleLogin} onNavigate={setActiveTab} />;
    }
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
            totalUsers={allUsers.length}
            contactMessages={contactMessages}
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
            user={currentUser}
          />
        );
      case 'focus':
        return <FocusZone />;
      case 'analytics':
        return <Analytics attempts={attempts} tests={tests} syllabus={JEE_SYLLABUS} />;
      case 'timetable':
        return <TimetableGenerator user={currentUser} savedData={timetableData} onUpdate={handleTimetableUpdate} />;
      case 'users':
        return (
            <AdminPanel 
                section="users"
                users={allUsers.length > 0 ? allUsers : MOCK_USERS} 
                questionBank={questions} 
                quotes={quotes}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onAddQuestion={handleAddQuestion}
                onCreateTest={handleCreateTest}
                onSendNotification={handleSendNotification}
                onAddQuote={handleAddQuote}
                onDeleteQuote={handleDeleteQuote}
                onUpdateUser={handleAdminUpdateUser}
                onDeleteUser={handleAdminDeleteUser}
                contactMessages={contactMessages}
                onDeleteContact={handleDeleteContact}
                blogPosts={blogPosts}
                onAddBlogPost={handleAddBlogPost}
                onDeleteBlogPost={handleDeleteBlogPost}
            />
        );
      case 'content':
        return (
            <AdminPanel 
                section="content"
                users={allUsers.length > 0 ? allUsers : MOCK_USERS} 
                questionBank={questions} 
                quotes={quotes}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onAddQuestion={handleAddQuestion}
                onCreateTest={handleCreateTest}
                onSendNotification={handleSendNotification}
                onAddQuote={handleAddQuote}
                onDeleteQuote={handleDeleteQuote}
                onUpdateUser={handleAdminUpdateUser}
                onDeleteUser={handleAdminDeleteUser}
                contactMessages={contactMessages}
                onDeleteContact={handleDeleteContact}
                blogPosts={blogPosts}
                onAddBlogPost={handleAddBlogPost}
                onDeleteBlogPost={handleDeleteBlogPost}
            />
        );
      case 'system':
        return <SystemDocs />;
      case 'profile':
        return (
            <ProfileSettings 
                user={currentUser} 
                onUpdateUser={handleUpdateUser} 
                onSendRequest={handleSendConnectionRequest}
                onRespondRequest={handleRespondConnectionRequest}
            />
        );
      case 'mistakes':
        return <MistakeNotebook mistakes={mistakes} onUpdateMistake={handleMistakeUpdate} onDeleteMistake={handleMistakeDelete} />;
      case 'wellness':
        return <WellnessCorner />;
      case 'flashcards':
        return <FlashcardDeck cards={flashcards} />;
      case 'backlogs':
        return <BacklogManager backlogs={backlogs} onAddBacklog={handleAddBacklog} onToggleStatus={handleToggleBacklog} onDeleteBacklog={handleDeleteBacklog} />;
      case 'hacks':
        return <MemoryHacks hacks={hacks} />;
      // Also render public pages inside logged-in layout if desired
      case 'about':
        return <AboutUs />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'contact':
        return <ContactUs />;
      case 'blog':
        return <Blog posts={blogPosts} />;
      case 'exams':
        return <ExamGuide />;
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
        // Default Fallback to avoid blank screen
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-10 text-center">
                <p className="text-lg font-bold mb-2">Page Not Found</p>
                <p className="text-sm">The requested tab "{activeTab}" does not exist or you do not have permission to view it.</p>
                <button onClick={() => setActiveTab('dashboard')} className="mt-4 text-blue-600 hover:underline">Return to Dashboard</button>
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
          setActiveTab('dashboard'); // Reset to login screen
          setProgress({});
          setGoals([]);
          setMistakes([]);
          setTimetableData(null);
          // DO NOT reset allUsers, to preserve local dev state
      }}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
