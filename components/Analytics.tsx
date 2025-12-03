
import React, { useMemo } from 'react';
import { TestAttempt, Test, Subject } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { Trophy, Target, Activity, AlertTriangle, TrendingDown } from 'lucide-react';

interface AnalyticsProps {
  attempts: TestAttempt[];
  tests: Test[];
  syllabus: Subject[];
}

const Analytics: React.FC<AnalyticsProps> = ({ attempts, tests, syllabus }) => {
  const getTestTitle = (id: string) => tests.find(t => t.id === id)?.title || 'Unknown Test';

  const chartData = attempts.map(att => ({
    name: getTestTitle(att.testId).substring(0, 15) + '...',
    score: att.score,
    date: new Date(att.date).toLocaleDateString()
  })).reverse();

  // --- Calculate Weak Areas & Subject Stats ---
  const { weakTopics, subjectStats } = useMemo(() => {
    const topicAgg: Record<string, { correct: number; incorrect: number; unattempted: number; subjectId: string }> = {};
    const subjectAgg: Record<string, { correct: number; total: number }> = {
      'phys': { correct: 0, total: 0 },
      'chem': { correct: 0, total: 0 },
      'math': { correct: 0, total: 0 }
    };

    attempts.forEach(att => {
        if (!att.detailedResults) return;
        att.detailedResults.forEach(res => {
            // Topic Stats
            if (!topicAgg[res.topicId]) {
                topicAgg[res.topicId] = { correct: 0, incorrect: 0, unattempted: 0, subjectId: res.subjectId };
            }
            if (res.status === 'CORRECT') {
                topicAgg[res.topicId].correct++;
                if (subjectAgg[res.subjectId]) subjectAgg[res.subjectId].correct++;
            } else if (res.status === 'INCORRECT') {
                topicAgg[res.topicId].incorrect++;
            } else {
                topicAgg[res.topicId].unattempted++;
            }
            if (subjectAgg[res.subjectId]) subjectAgg[res.subjectId].total++;
        });
    });

    // Process Topics
    const processedTopics = Object.entries(topicAgg).map(([id, data]) => {
        const total = data.correct + data.incorrect + data.unattempted;
        const accuracy = total > 0 ? (data.correct / total) * 100 : 0;
        const errorRate = total > 0 ? (data.incorrect / total) * 100 : 0;
        
        // Find human readable name
        let name = id;
        syllabus.forEach(s => s.chapters.forEach(c => c.topics.forEach(t => {
            if (t.id === id) name = t.name;
        })));

        return { id, name, subjectId: data.subjectId, accuracy, errorRate, incorrect: data.incorrect };
    });

    // Filter weak topics (High error rate or low accuracy, provided meaningful attempts made)
    const weak = processedTopics
        .filter(t => t.incorrect > 0) // Only consider topics where mistakes were made
        .sort((a, b) => b.errorRate - a.errorRate) // Sort by highest error rate
        .slice(0, 5); // Top 5

    // Process Subjects for Radar
    const radarData = Object.entries(subjectAgg).map(([id, data]) => ({
        subject: id === 'phys' ? 'Physics' : id === 'chem' ? 'Chemistry' : 'Maths',
        A: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        fullMark: 100
    }));

    return { weakTopics: weak, subjectStats: radarData };
  }, [attempts, syllabus]);

  // Calculate Overall Stats
  const totalTests = attempts.length;
  const avgScore = totalTests > 0 ? Math.round(attempts.reduce((a, b) => a + b.score, 0) / totalTests) : 0;
  const avgAccuracy = totalTests > 0 ? Math.round(attempts.reduce((a, b) => a + (b.accuracy_percent || 0), 0) / totalTests) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800">Performance Analytics</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                <Trophy className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Total Tests Taken</p>
                <p className="text-2xl font-bold text-slate-800">{totalTests}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
                <Target className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Average Score</p>
                <p className="text-2xl font-bold text-slate-800">{avgScore}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mr-4">
                <Activity className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Avg. Accuracy</p>
                <p className="text-2xl font-bold text-slate-800">{avgAccuracy}%</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WEAK AREAS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" /> Areas for Improvement
            </h3>
            {weakTopics.length > 0 ? (
                <div className="space-y-4">
                    {weakTopics.map(topic => (
                        <div key={topic.id} className="p-3 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded mb-1 inline-block ${
                                        topic.subjectId === 'phys' ? 'bg-purple-200 text-purple-800' :
                                        topic.subjectId === 'chem' ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'
                                    }`}>
                                        {topic.subjectId === 'phys' ? 'Physics' : topic.subjectId === 'chem' ? 'Chemistry' : 'Maths'}
                                    </span>
                                    <h4 className="font-bold text-slate-800 text-sm">{topic.name}</h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-red-600 font-bold text-sm">{Math.round(topic.errorRate)}% Error</span>
                                </div>
                            </div>
                            <div className="mt-2 w-full bg-red-200 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-red-500 h-full" style={{ width: `${topic.errorRate}%` }}></div>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">High number of incorrect attempts.</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <TrendingDown className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="text-slate-500 text-sm">Not enough data to analyze weak points.<br/>Attempt more tests!</p>
                </div>
            )}
        </div>

        {/* SUBJECT PROFICIENCY RADAR */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">Subject Proficiency</h3>
             <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={subjectStats}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Accuracy" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
             </div>
             <p className="text-xs text-center text-slate-500 mt-2">Based on accuracy across all attempted tests</p>
        </div>
      </div>

      {/* Score History Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-6">Score History</h3>
          <div className="h-64">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                    No data available yet. Take a test!
                </div>
            )}
          </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-700">Detailed Test Reports</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Test Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Correct</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Accuracy</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                {attempts.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic">
                            No tests attempted yet.
                        </td>
                    </tr>
                ) : (
                    attempts.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(att.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{getTestTitle(att.testId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{att.score}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{att.correctCount}/{att.totalQuestions}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{att.accuracy_percent}%</td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
