import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Loader2, Share2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';
import { FALLBACK_BLOG_POSTS } from '../lib/constants';

interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: any;
  image: string;
  category: string;
}

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data() as BlogPost);
        } else {
          // Check fallbacks if not in Firestore
          const fallback = FALLBACK_BLOG_POSTS.find(p => p.id === id);
          if (fallback) {
            setPost(fallback as any);
          }
        }
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#2D6BFF] animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h2 className="text-2xl text-[#F4F6FF]">Post not found</h2>
        <Link to="/blog" className="text-[#2D6BFF] hover:underline mt-4 inline-block">
          Return to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-[#A7B1C8] hover:text-[#F4F6FF] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to listing
        </Link>

        {/* Hero Image */}
        <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-10 glass-card p-0 border-white/5">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm">
          <span className="text-[#2D6BFF] font-semibold uppercase tracking-wider px-3 py-1 rounded bg-[#2D6BFF]/10">
            {post.category}
          </span>
          <div className="flex items-center gap-2 text-[#A7B1C8]">
            <Calendar className="w-4 h-4" />
            {(post.date || (post as any).createdAt)?.toDate ? (post.date || (post as any).createdAt).toDate().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }) : 'Newly Published'}
          </div>
          <div className="flex items-center gap-2 text-[#A7B1C8]">
            <User className="w-4 h-4" />
            {post.author}
          </div>
          <button className="ml-auto p-2 rounded-full hover:bg-white/5 text-[#A7B1C8] hover:text-[#F4F6FF] transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6FF] leading-tight mb-8">
          {post.title}
        </h1>

        {/* Content */}
        <div className="prose prose-invert prose-blue max-w-none">
          <div className="text-[#A7B1C8] text-lg leading-relaxed space-y-6">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-[#A7B1C8] mb-6">Want more insights delivered to your inbox?</p>
          <div className="flex max-w-md mx-auto gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-[#F4F6FF] focus:border-[#2D6BFF] focus:ring-1 focus:ring-[#2D6BFF] outline-none"
            />
            <button className="btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
    </article>
  );
}
