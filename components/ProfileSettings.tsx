
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { COACHING_INSTITUTES, TARGET_YEARS, TARGET_EXAMS } from '../constants';
import { 
  User as UserIcon, Mail, Building, GraduationCap, Calendar, Save, Phone, School, 
  CheckCircle2, Link as LinkIcon, UserPlus, AlertCircle, XCircle, Copy, ChevronDown, Target, Users, Loader2, Search
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface ProfileSettingsProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  onSendRequest?: (studentId: string) => void;
  onRespondRequest?: (accept: boolean) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdateUser, onSendRequest, onRespondRequest }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name, email: user.email, institute: user.institute || '', school: user.school || '',
    course: user.course || '', targetYear: user.targetYear, targetExam: user.targetExam || 'JEE Main & Advanced',
    phone: user.phone || '', dob: user.dob || '', gender: user.gender || '', avatarUrl: user.avatarUrl
  });
  
  // Connection State
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<{id: string, name: string, email: string}[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [requestStatus, setRequestStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');
  
  const [isSaved, setIsSaved] = useState(false);

  // Auto-generate avatar based on gender change
  useEffect(() => {
      if (formData.email) {
          const seed = formData.email;
          let newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
          if (formData.gender === 'MALE') {
              newAvatarUrl += '&top[]=shortHair&top[]=shortHairTheCaesar&top[]=shortHairShortFlat&top[]=shortHairFrizzle&facialHairProbability=20';
          } else if (formData.gender === 'FEMALE') {
              newAvatarUrl += '&top[]=longHair&top[]=longHairBob&top[]=longHairCurly&top[]=longHairStraight&facialHairProbability=0';
          }
          setFormData(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
      }
  }, [formData.gender, formData.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSearch = async () => {
      if (!searchInput.trim()) return;
      setIsSearching(true);
      setSearchError('');
      setSearchResults([]);

      try {
          const res = await fetch(`${API_BASE_URL}/send_request.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  action: 'search',
                  query: searchInput
              })
          });
          
          if (!res.ok) throw new Error("Search failed");
          
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
              setSearchResults(data);
          } else {
              setSearchError("No student found with that Name or ID.");
          }
      } catch (err) {
          setSearchError("Unable to search. Please try again.");
      } finally {
          setIsSearching(false);
      }
  };

  const handleSendToId = (id: string) => {
    if (onSendRequest) {
        onSendRequest(id);
        setRequestStatus('SUCCESS');
        setSearchResults([]); // Clear results
        setSearchInput('');
        setTimeout(() => setRequestStatus('IDLE'), 4000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center space-x-4">
            <div className="relative group">
                <img src={formData.avatarUrl || user.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-blue-50 transition-transform group-hover:scale-105"/>
                <div className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full border-2 border-white cursor-pointer">
                    <UserIcon className="w-3 h-3 text-white" />
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800">{formData.name}</h2>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wide">{user.role}</span>
            </div>
         </div>
         {user.role === 'STUDENT' && (
             <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-end">
                 <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Your Student ID</span>
                 <div className="flex items-center space-x-2">
                     <code className="text-lg font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">{user.id}</code>
                     <button className="text-slate-400 hover:text-blue-600 transition-colors" title="Copy ID"><Copy className="w-4 h-4" /></button>
                 </div>
                 <span className="text-xs text-slate-400 mt-1">Share this with your parent</span>
             </div>
         )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><Users className="w-5 h-5 mr-2 text-blue-600" /> Family Connections</h3>
          {user.role === 'STUDENT' ? (
              <div>
                  {user.pendingRequest ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in zoom-in-95">
                        <div className="flex items-start gap-3">
                            <div className="bg-amber-100 p-2 rounded-full mt-1"><LinkIcon className="w-5 h-5 text-amber-700" /></div>
                            <div>
                                <h3 className="font-bold text-amber-900 text-base">Connection Request</h3>
                                <p className="text-amber-800 text-sm"><strong>{user.pendingRequest.fromName}</strong> wants to link to your account.</p>
                            </div>
                        </div>
                        <div className="flex space-x-3 w-full md:w-auto">
                            <button onClick={() => onRespondRequest && onRespondRequest(false)} className="flex-1 md:flex-none px-4 py-2 border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-100 font-medium flex items-center justify-center text-xs"><XCircle className="w-4 h-4 mr-2" /> Decline</button>
                            <button onClick={() => onRespondRequest && onRespondRequest(true)} className="flex-1 md:flex-none px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-bold shadow-md flex items-center justify-center text-xs"><CheckCircle2 className="w-4 h-4 mr-2" /> Accept</button>
                        </div>
                      </div>
                  ) : user.parentId ? (
                      <div className="flex items-center text-green-700 bg-green-50 p-4 rounded-xl border border-green-200">
                          <CheckCircle2 className="w-5 h-5 mr-3" />
                          <div><p className="font-bold text-sm">Active Connection</p><p className="text-xs opacity-80">Linked to Parent ID: {user.parentId}</p></div>
                      </div>
                  ) : (
                      <p className="text-sm text-slate-500 italic flex items-center"><AlertCircle className="w-4 h-4 mr-2" /> No active family connections. Share your Student ID with your parent.</p>
                  )}
              </div>
          ) : (
              <div>
                  {user.studentId ? (
                       <div className="flex items-center space-x-3 text-green-700 bg-green-50 p-4 rounded-xl border border-green-200">
                           <CheckCircle2 className="w-5 h-5" />
                           <span className="font-medium">Connected to Student ID: <strong>{user.studentId}</strong></span>
                       </div>
                  ) : (
                      <div className="space-y-4">
                          <p className="text-sm text-slate-600">Search for your child by <strong>Name</strong> or <strong>Student ID</strong>.</p>
                          <div className="flex flex-col sm:flex-row gap-3">
                              <input 
                                type="text" 
                                placeholder="e.g. Rahul Sharma or 100025" 
                                value={searchInput} 
                                onChange={(e) => setSearchInput(e.target.value)} 
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              />
                              <button 
                                type="button" 
                                onClick={handleSearch} 
                                disabled={isSearching}
                                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-sm flex items-center justify-center whitespace-nowrap text-sm disabled:opacity-70"
                              >
                                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                                Find Student
                              </button>
                          </div>

                          {/* Search Results */}
                          {searchResults.length > 0 && (
                              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                  <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">Search Results</div>
                                  {searchResults.map(result => (
                                      <div key={result.id} className="p-4 flex items-center justify-between border-b border-slate-100 last:border-0 hover:bg-white transition-colors">
                                          <div>
                                              <p className="font-bold text-slate-800 text-sm">{result.name}</p>
                                              <p className="text-xs text-slate-500 font-mono">ID: {result.id} • {result.email}</p>
                                          </div>
                                          <button 
                                            onClick={() => handleSendToId(result.id)}
                                            className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-colors flex items-center"
                                          >
                                              <UserPlus className="w-3 h-3 mr-1" /> Connect
                                          </button>
                                      </div>
                                  ))}
                              </div>
                          )}

                          {searchError && (
                              <div className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in">
                                  <AlertCircle className="w-4 h-4 mr-2 shrink-0" /> {searchError}
                              </div>
                          )}

                          {requestStatus === 'SUCCESS' && (
                              <div className="flex items-center text-green-700 bg-green-100 p-3 rounded-lg border border-green-200 text-sm animate-in fade-in slide-in-from-top-1">
                                  <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" /> Request Sent Successfully!
                              </div>
                          )}
                      </div>
                  )}
              </div>
          )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <h3 className="text-lg font-bold text-slate-800">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"/></div>
            <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"/></div>
            
            {/* Common Fields */}
            <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone</label><input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"/></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase ml-1">DOB</label><input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"/></div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Gender</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value as any})}>
                        <option value="">Select</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
            </div>

            {user.role === 'STUDENT' && (
                <>
                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Target Exam</label><select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white" value={formData.targetExam} onChange={(e) => setFormData({...formData, targetExam: e.target.value})}>{TARGET_EXAMS.map(exam => <option key={exam} value={exam}>{exam}</option>)}</select></div>
                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Target Year</label><select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white" value={formData.targetYear} onChange={(e) => setFormData({...formData, targetYear: parseInt(e.target.value)})}>{TARGET_YEARS.map(year => <option key={year} value={year}>{year}</option>)}</select></div>
                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Institute</label><select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white" value={formData.institute} onChange={(e) => setFormData({...formData, institute: e.target.value})}><option value="">Select</option>{COACHING_INSTITUTES.map(inst => <option key={inst} value={inst}>{inst}</option>)}</select></div>
                </>
            )}
        </div>
        <div className="flex justify-end pt-4">
            <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center shadow-lg active:scale-95">
                {isSaved ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />} 
                {isSaved ? 'Saved!' : 'Save Changes'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
