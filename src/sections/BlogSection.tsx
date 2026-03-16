import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FALLBACK_BLOG_POSTS } from '../lib/constants';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: any;
  image: string;
  category: string;
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('date', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blogPosts: BlogPost[] = [];
      snapshot.forEach((doc) => {
        blogPosts.push({ id: doc.id, ...doc.data() } as BlogPost);
      });
      setPosts(blogPosts.length > 0 ? blogPosts : (FALLBACK_BLOG_POSTS as any));
    });

    return () => unsubscribe();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-[#070A12] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#2D6BFF]/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#2D6BFF]" />
              </div>
              <span className="text-[#2D6BFF] font-semibold text-sm tracking-wider uppercase">AI Analysis</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#F4F6FF]">
              Latest from our <span className="text-gradient">Insights Lab</span>
            </h2>
          </div>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-[#A7B1C8] hover:text-[#F4F6FF] transition-colors group"
          >
            View all insights
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.id}`}
              className="glass-card group hover:border-[#2D6BFF]/30 transition-all duration-500 overflow-hidden"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3 text-[10px] font-semibold tracking-widest uppercase">
                  <span className="text-[#2D6BFF]">{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[#A7B1C8] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date?.toDate ? post.date.toDate().toLocaleDateString() : 'New'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#F4F6FF] mb-3 group-hover:text-[#2D6BFF] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-[#A7B1C8] text-xs line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                <span className="text-[#F4F6FF] text-xs font-semibold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read Analysis <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
