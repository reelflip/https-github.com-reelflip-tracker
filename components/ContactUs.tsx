
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import SEO from './SEO';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending
    setSent(true);
    setTimeout(() => {
        setSent(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
        alert("Message sent successfully!");
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 pb-10">
       <SEO title="Contact Us" description="Get in touch with the IIT JEE Prep support team for queries or feedback." />
       
       <div className="text-center mb-10 pt-6">
          <h1 className="text-3xl font-bold text-slate-800">Get in Touch</h1>
          <p className="text-slate-500 mt-2">Have questions about the app? We're here to help.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-1 space-y-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                   <Mail className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-slate-800">Email Us</h3>
                   <p className="text-sm text-slate-500 mt-1">support@iitjeeprep.com</p>
                   <p className="text-sm text-slate-500">admin@iitjeeprep.com</p>
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
                <div className="bg-green-50 p-3 rounded-xl text-green-600">
                   <Phone className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-slate-800">Call Us</h3>
                   <p className="text-sm text-slate-500 mt-1">Mon-Fri from 9am to 6pm</p>
                   <p className="text-sm text-slate-500 font-mono">+91 98765 43210</p>
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
                <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
                   <MapPin className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-slate-800">Office</h3>
                   <p className="text-sm text-slate-500 mt-1">
                      123 Education Hub,<br/>
                      Kota, Rajasthan 324005
                   </p>
                </div>
             </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
             <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" /> Send us a Message
             </h2>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Your Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Your Email</label>
                      <input 
                        type="email" 
                        required
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                   <input 
                     type="text" 
                     required
                     className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
                     placeholder="How can we help?"
                     value={formData.subject}
                     onChange={e => setFormData({...formData, subject: e.target.value})}
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Message</label>
                   <textarea 
                     required
                     className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none h-32 resize-none"
                     placeholder="Type your message here..."
                     value={formData.message}
                     onChange={e => setFormData({...formData, message: e.target.value})}
                   />
                </div>

                <button 
                    type="submit" 
                    disabled={sent}
                    className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                    {sent ? <span>Sending...</span> : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Send Message</span>
                        </>
                    )}
                </button>
             </form>
          </div>
       </div>
    </div>
  );
};

export default ContactUs;