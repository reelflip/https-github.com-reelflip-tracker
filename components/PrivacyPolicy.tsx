
import React from 'react';
import { Lock, FileText, Eye, Database } from 'lucide-react';
import SEO from './SEO';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-10">
      <SEO title="Privacy Policy" description="We value your privacy. Learn how IIT JEE Prep secures your data." />
      
      <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-lg">
         <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
         <p className="text-slate-400">Last Updated: October 2024</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-8 text-slate-700 leading-relaxed">
         
         <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
               <Database className="w-5 h-5 mr-2 text-blue-600" /> 1. Data Collection
            </h2>
            <p className="mb-2">We collect the following information to provide our services:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
               <li>Personal Information: Name, Email Address, Target Year, Coaching Institute.</li>
               <li>Academic Data: Mock test scores, syllabus completion status, and study logs.</li>
               <li>Usage Data: Time spent in Focus Zone, features accessed, and device type.</li>
            </ul>
         </section>

         <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
               <Eye className="w-5 h-5 mr-2 text-blue-600" /> 2. How We Use Your Data
            </h2>
            <p className="text-sm">Your data is used strictly for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
               <li>To generate personalized analytics and progress reports.</li>
               <li>To provide parents with read-only access to their child's performance (only upon approval).</li>
               <li>To improve the accuracy of our study algorithms and recommendations.</li>
            </ul>
         </section>

         <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
               <Lock className="w-5 h-5 mr-2 text-blue-600" /> 3. Data Security
            </h2>
            <p className="text-sm">
               We take security seriously. All passwords are encrypted using Bcrypt hashing before storage. 
               We use HTTPS encryption for all data transmission. We do not sell your personal data to third-party advertisers.
            </p>
         </section>

         <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
               <FileText className="w-5 h-5 mr-2 text-blue-600" /> 4. Your Rights
            </h2>
            <p className="text-sm">
               You have the right to request a copy of your data or request deletion of your account at any time. 
               You can manage your profile settings directly within the app or contact support for assistance.
            </p>
         </section>

         <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500">
            For any privacy-related concerns, please contact our Data Protection Officer at privacy@iitjeeprep.com.
         </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;