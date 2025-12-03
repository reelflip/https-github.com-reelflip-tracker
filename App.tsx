

import React, { useState, useEffect } from 'react';
import { User, TopicProgress, TestAttempt, Test, Question, Notification, MistakeRecord, DailyGoal, Quote, Flashcard, BacklogItem } from './types';
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

// Initial global questions combined from constants and potential future additions
const INITIAL_QUESTIONS: Question[] = MOCK_TESTS.flatMap(t => t.questions).reduce((acc, current) => {
  const x = acc.find(item => item.id === current.id);
  if (!x) {
    return acc.concat([current]);
  } else {
    return acc;
  }
}, [] as Question[]);

function App() {
  // State for Users (to simulate DB updates for connections)
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // --- Global App State ---
  const [progress, setProgress] = useState<Record<string, TopicProgress>>({});
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [goals, setGoals] = useState<DailyGoal[]>([
      { id: 'g1', text: 'Solve 30 Physics MCQs', completed: false },
      { id: 'g2', text: 'Revise Calculus Formulas', completed: true }
  ]);
  const [backlogs, setBacklogs] = useState<BacklogItem[]>([
      { id: 'b1', title: 'Rotational Motion HC Verma', subjectId: 'phys', priority: 'HIGH', deadline: '2025-05-10', status: 'PENDING' }
  ]);
  
  // Dynamic Data (Admin can modify these)
  const [allTests, setAllTests] = useState<Test[]>(MOCK_TESTS);
  const [questionBank, setQuestionBank] = useState<Question[]>(INITIAL_QUESTIONS);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n1', title: 'Welcome', message: 'Welcome to the new academic session!', date: new Date().toISOString().split('T')[0], type: 'INFO' }
  ]);
  const [quotes, setQuotes] = useState<Quote[]>(DEFAULT_QUOTES);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);

  // Initialize some mock progress on load
  useEffect(() => {
    const initialProgress: Record<string, TopicProgress> = {};
    JEE_SYLLABUS.forEach(sub => {
      sub.chapters.forEach(ch => {
        ch.topics.forEach(t => {
          initialProgress[t.id] = {
            topicId: t.id,
            status: Math.random() > 0.7 ? 'COMPLETED' : 'NOT_STARTED',
            ex1Solved: 0, ex1Total: 25, ex2Solved: 0, ex2Total: 15,
            ex3Solved: 0, ex3Total: 10, ex4Solved: 0, ex4Total: 10
          };
        });
      });
    });
    setProgress(initialProgress);
  }, []);

  const handleUpdateProgress = (topicId: string, updates: Partial<TopicProgress>) => {
    setProgress(prev => ({
      ...prev,
      [topicId]: { ...prev[topicId], ...updates }
    }));
  };

  const handleCompleteTest = (attempt: TestAttempt) => {
    setTestAttempts(prev => [attempt, ...prev]);

    // Auto-capture mistakes
    if (attempt.detailedResults) {
        const newMistakes: MistakeRecord[] = attempt.detailedResults
            .filter(r => r.status === 'INCORRECT')
            .map(r => {
                const test = allTests.find(t => t.id === attempt.testId);
                const question = test?.questions.find(q => q.id === r.questionId);
                return {
                    id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    questionText: question?.text || 'Question text not found',
                    subjectId: r.subjectId,
                    topicId: r.topicId,
                    testName: test?.title || 'Unknown Test',
                    date: new Date().toISOString(),
                    tags: []
                };
            });
        
        if (newMistakes.length > 0) {
            setMistakes(prev => [...newMistakes, ...prev]);
            // Optional: Alert user
            // alert(`${newMistakes.length} mistakes added to your notebook.`);
        }
    }
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    // Update current user
    const updatedUser = currentUser ? { ...currentUser, ...updates } : null;
    setCurrentUser(updatedUser);
    
    // Also update in allUsers array to persist locally
    if (updatedUser) {
        setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
  };

  // --- Mistake Notebook Actions ---
  const handleUpdateMistake = (id: string, updates: Partial<MistakeRecord>) => {
      setMistakes(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };
  
  const handleDeleteMistake = (id: string) => {
      setMistakes(prev => prev.filter(m => m.id !== id));
  };

  // --- Daily Goal Actions ---
  const handleToggleGoal = (id: string) => {
      setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleAddGoal = (text: string) => {
      setGoals(prev => [...prev, { id: `g_${Date.now()}`, text, completed: false }]);
  };

  // --- Backlog Actions ---
  const handleAddBacklog = (item: BacklogItem) => {
      setBacklogs(prev => [...prev, item]);
  };
  
  const handleToggleBacklogStatus = (id: string) => {
      setBacklogs(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'PENDING' ? 'CLEARED' : 'PENDING' } : b));
  };

  const handleDeleteBacklog = (id: string) => {
      setBacklogs(prev => prev.filter(b => b.id !== id));
  };


  // --- Connection Logic (Parent <-> Student) ---

  const handleSendConnectionRequest = (targetStudentId: string) => {
    if (!currentUser || currentUser.role !== 'PARENT') return;

    // 1. Find the student
    const student = allUsers.find(u => u.id === targetStudentId && u.role === 'STUDENT');
    
    if (!student) {
        alert('Student ID not found. Please check and try again.');
        return;
    }

    if (student.parentId) {
        alert('This student is already connected to a parent.');
        return;
    }

    // 2. Update the student with a pending request
    const updatedStudent: User = {
        ...student,
        pendingRequest: {
            fromId: currentUser.id,
            fromName: currentUser.name,
            type: 'PARENT_LINK'
        }
    };

    setAllUsers(prev => prev.map(u => u.id === student.id ? updatedStudent : u));
    alert(`Request sent to ${student.name}. They must accept it from their profile.`);
  };

  const handleRespondToRequest = (accept: boolean) => {
    if (!currentUser || !currentUser.pendingRequest) return;

    const parentId = currentUser.pendingRequest.fromId;

    if (accept) {
        // Link both users
        const updatedStudent = { ...currentUser, parentId: parentId, pendingRequest: undefined };
        
        // Find parent and update their studentId
        setAllUsers(prev => prev.map(u => {
            if (u.id === currentUser.id) return updatedStudent;
            if (u.id === parentId) return { ...u, studentId: currentUser.id };
            return u;
        }));
        
        setCurrentUser(updatedStudent);
        alert('Connection successful! Your parent can now view your progress.');
    } else {
        // Just clear the request
        const updatedStudent = { ...currentUser, pendingRequest: undefined };
        setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedStudent : u));
        setCurrentUser(updatedStudent);
    }
  };


  // --- Admin Actions ---
  const handleAddQuestion = (q: Question) => {
    setQuestionBank(prev => [...prev, q]);
  };

  const handleCreateTest = (t: Test) => {
    setAllTests(prev => [t, ...prev]);
  };

  const handleSendNotification = (n: Notification) => {
    setNotifications(prev => [n, ...prev]);
  };

  const handleAddQuote = (text: string, author?: string) => {
    const newQuote: Quote = { id: `q_${Date.now()}`, text, author };
    setQuotes(prev => [...prev, newQuote]);
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  // Login Screen
  if (!currentUser) {
    return <AuthScreen onLogin={(user) => {
        // Check if user exists in our local "DB" (allUsers)
        const existing = allUsers.find(u => u.email === user.email);
        if (existing) {
            setCurrentUser(existing);
        } else {
            // Register new
            setAllUsers(prev => [...prev, user]);
            setCurrentUser(user);
        }
    }} />;
  }

  const renderContent = () => {
    if (activeTab === 'profile') {
        return <ProfileSettings 
            user={currentUser} 
            onUpdateUser={handleUpdateUser}
            onSendRequest={handleSendConnectionRequest}
            onRespondRequest={handleRespondToRequest}
        />;
    }

    if (currentUser.role === 'ADMIN') {
        if (activeTab === 'system') {
            return <SystemDocs />;
        }
        return <AdminPanel 
          users={allUsers} 
          questionBank={questionBank}
          quotes={quotes}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddQuestion={handleAddQuestion}
          onCreateTest={handleCreateTest}
          onSendNotification={handleSendNotification}
          onAddQuote={handleAddQuote}
          onDeleteQuote={handleDeleteQuote}
        />;
    }

    if (currentUser.role === 'STUDENT') {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard 
                  user={currentUser} 
                  progress={progress} 
                  onChangeTab={setActiveTab} 
                  notifications={notifications}
                  quotes={quotes}
                  goals={goals}
                  onToggleGoal={handleToggleGoal}
                  onAddGoal={handleAddGoal}
                />;
            case 'syllabus':
                return <SyllabusTracker user={currentUser} subjects={JEE_SYLLABUS} progress={progress} onUpdateProgress={handleUpdateProgress} />;
            case 'backlogs':
                return <BacklogManager backlogs={backlogs} onAddBacklog={handleAddBacklog} onToggleStatus={handleToggleBacklogStatus} onDeleteBacklog={handleDeleteBacklog} />;
            case 'tests':
                return <TestCenter availableTests={allTests} attempts={testAttempts} onCompleteTest={handleCompleteTest} />;
            case 'flashcards':
                return <FlashcardDeck cards={flashcards} />;
            case 'mistakes':
                return <MistakeNotebook mistakes={mistakes} onUpdateMistake={handleUpdateMistake} onDeleteMistake={handleDeleteMistake} />;
            case 'focus':
                return <FocusZone />;
            case 'wellness':
                return <WellnessCorner />;
            case 'timetable':
                return <TimetableGenerator />;
            case 'analytics':
                return <Analytics attempts={testAttempts} tests={allTests} syllabus={JEE_SYLLABUS} />;
            default:
                return <div className="flex items-center justify-center h-64 text-slate-400">Work in Progress</div>;
        }
    }

    if (currentUser.role === 'PARENT') {
        // Find connected student
        const connectedStudent = allUsers.find(u => u.id === currentUser.studentId);
        
        if (!connectedStudent) {
            return (
                <div className="flex flex-col items-center justify-center h-96 space-y-4">
                    <h2 className="text-2xl font-bold text-slate-800">No Child Connected</h2>
                    <p className="text-slate-500 max-w-md text-center">
                        Please go to the <strong className="cursor-pointer text-blue-600" onClick={() => setActiveTab('profile')}>Settings</strong> tab 
                        and enter your child's Student ID to view their progress.
                    </p>
                </div>
            );
        }

        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Child Progress View</h2>
            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100 flex items-center justify-between">
               <span>Viewing data for linked student: <strong>{connectedStudent.name}</strong></span>
               <span className="text-xs bg-white px-2 py-1 rounded border border-blue-200">ID: {connectedStudent.id}</span>
            </div>
            {/* Reuse dashboard components for Read-Only view */}
            <Dashboard 
              user={connectedStudent} 
              progress={progress} 
              onChangeTab={() => {}} 
              notifications={notifications}
              quotes={quotes}
              goals={goals} // Parent views goals
              onToggleGoal={() => {}} // Parent cannot toggle
              onAddGoal={() => {}} // Parent cannot add
            />
          </div>
        );
    }
  };

  return (
    <Layout 
      currentUser={currentUser} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onLogout={() => setCurrentUser(null)}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;