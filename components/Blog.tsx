
import React, { useState } from 'react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../constants';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';
import SEO from './SEO';

interface BlogProps {
    posts?: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({ posts = BLOG_POSTS }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 pb-10">
        <SEO title={selectedPost.title} description={selectedPost.excerpt} />
        
        <button 
          onClick={() => setSelectedPost(null)}
          className="flex items-center text-slate-500 hover:text-blue-600 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
        </button>

        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="h-64 md:h-80 w-full relative">
              <img 
                src={selectedPost.imageUrl} 
                alt={selectedPost.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                 <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 inline-block">
                    {selectedPost.category}
                 </span>
                 <h1 className="text-2xl md:text-4xl font-bold leading-tight">{selectedPost.title}</h1>
              </div>
           </div>

           <div className="p-8">
              <div className="flex items-center space-x-6 text-sm text-slate-500 mb-8 border-b border-slate-100 pb-6">
                 <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" /> {selectedPost.author}
                 </div>
                 <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" /> {selectedPost.date}
                 </div>
                 <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" /> 5 min read
                 </div>
              </div>

              <div 
                className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }} 
              />
           </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-10">
      <SEO title="Blog" description="Expert tips, strategies, and motivation for IIT JEE aspirants." />
      
      <div className="text-center py-8">
         <h1 className="text-4xl font-bold text-slate-900 mb-3">IIT JEE Prep Blog</h1>
         <p className="text-slate-600 max-w-2xl mx-auto">
            Strategies, success stories, and mental health tips to help you ace your preparation.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {posts.map(post => (
            <div 
              key={post.id} 
              onClick={() => setSelectedPost(post)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group flex flex-col h-full"
            >
               <div className="h-48 overflow-hidden relative">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                     <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
                        {post.category}
                     </span>
                  </div>
               </div>
               <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-xs text-slate-400 mb-3 space-x-2">
                     <span>{post.date}</span>
                     <span>•</span>
                     <span>{post.author}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                     {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-1">
                     {post.excerpt}
                  </p>
                  <div className="flex items-center text-blue-600 text-sm font-bold mt-auto">
                     Read Article <ArrowLeft className="w-4 h-4 ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default Blog;
