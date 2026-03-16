import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FALLBACK_BLOG_POSTS } from '../lib/constants';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: any;
  image: string;
  category: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We remove the server-side orderBy to be resilient to different field names (date vs createdAt)
    const q = query(collection(db, 'blogs'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blogPosts: BlogPost[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          // Support both field names for the date
          date: data.date || data.createdAt 
        } as BlogPost;
      });

      // Sort by date descending in JavaScript
      blogPosts.sort((a, b) => {
        const timeA = a.date?.toMillis?.() || 0;
        const timeB = b.date?.toMillis?.() || 0;
        return timeB - timeA;
      });

      setPosts(blogPosts.length > 0 ? blogPosts : (FALLBACK_BLOG_POSTS as any));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-[#F4F6FF] mb-6">
            Insights & <span className="text-gradient">Analysis</span>
          </h1>
          <p className="text-[#A7B1C8] text-lg max-w-2xl mx-auto mb-8">
            Stay ahead of the market with AI-generated research, technical analysis, 
            and modern wealth-building strategies.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#2D6BFF] animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <p className="text-[#A7B1C8]">No articles published yet. Stay tuned for expert AI analysis!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.id}`}
                className="glass-card group hover:border-[#2D6BFF]/50 transition-all duration-500 overflow-hidden"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-semibold text-[#2D6BFF] uppercase tracking-wider px-2 py-1 rounded bg-[#2D6BFF]/10">
                      {post.category}
                    </span>
                    <span className="text-xs text-[#A7B1C8] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date?.toDate ? post.date.toDate().toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F4F6FF] mb-3 group-hover:text-[#2D6BFF] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[#A7B1C8] text-sm mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2D6BFF] to-[#1a4fd1] flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs text-[#F4F6FF] font-medium">{post.author}</span>
                    </div>
                    <span className="text-[#2D6BFF] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
