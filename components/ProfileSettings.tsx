
import React, { useState } from 'react';
import { User } from '../types';
import { COACHING_INSTITUTES, TARGET_YEARS, TARGET_EXAMS } from '../constants';
import { 
  User as UserIcon, Mail, Building, GraduationCap, Calendar, Save, Phone, School, 
  CheckCircle2, Link as LinkIcon, UserPlus, AlertCircle, XCircle, Copy, ChevronDown, Target, Users, Loader2
} from 'lucide-react';

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
    phone: user.phone || '', dob: user.dob || '', gender: user.gender || ''
  });
  const [studentIdInput, setStudentIdInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleConnect = () => {
    if (studentIdInput && onSendRequest) {
        onSendRequest(studentIdInput);
        setRequestStatus('SUCCESS');
        setStudentIdInput('');
        setTimeout(() => setRequestStatus('IDLE'), 4000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center space-x-4">
            <div className="relative">
                <img src={user.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-blue-50"/>
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
                 <span className="text-[10px] text-slate-400 mt-1">Share this with your parent</span>
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
                          <p className="text-sm text-slate-600">Enter the <strong>Student ID</strong> found on your child's profile.</p>
                          <div className="flex flex-col sm:flex-row gap-3">
                              <input type="text" placeholder="Enter Student ID" value={studentIdInput} onChange={(e) => setStudentIdInput(e.target.value)} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"/>
                              <button type="button" onClick={handleConnect} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-sm flex items-center justify-center whitespace-nowrap text-sm"><UserPlus className="w-4 h-4 mr-2" /> Send Request</button>
                          </div>
                          {requestStatus === 'SUCCESS' && (
                              <div className="flex items-center text-green-700 bg-green-100 p-3 rounded-lg border border-green-200 text-sm animate-in fade-in slide-in-from-top-1"><CheckCircle2 className="w-4 h-4 mr-2 shrink-0" /> Request Sent!</div>
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
            {user.role === 'STUDENT' && (
                <>
                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Target Exam</label><select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white" value={formData.targetExam} onChange={(e) => setFormData({...formData, targetExam: e.target.value})}>{TARGET_EXAMS.map(exam => <option key={exam} value={exam}>{exam}</option>)}</select></div>
                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Target Year</label><select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white" value={formData.targetYear} onChange={(e) => setFormData({...formData, targetYear: parseInt(e.target.value)})}>{TARGET_YEARS.map(year => <option key={year} value={year}>{year}</option>)}</select></div>
                </>
            )}
        </div>
        <div className="flex justify-end"><button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center shadow-lg"><Save className="w-4 h-4 mr-2" /> Save Changes</button></div>
      </form>
    </div>
  );
};

export default ProfileSettings;
