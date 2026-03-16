import { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Loader2, 
  Hash,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import { toast } from 'sonner';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { generateChatCompletion } from '../../lib/groq';

const SUGGESTED_TOPICS = [
  "How AI is Revolving the Fintech Industry in 2026",
  "The Rise of Anonymous Crypto Deposits: Why Privacy Matters",
  "Traditional Stocks vs. Digital Assets: Building a Balanced Portfolio",
  "Understanding Smart Contract Security for Retail Investors",
  "The Impact of Global Regulations on Decentralized Finance",
  "Why Self-Custody is the Future of Private Wealth",
  "AI Analysis: Predictable Trends in the Next Crypto Bull Run"
];

export function AIBlogGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOpen = () => {
    const randomTopic = SUGGESTED_TOPICS[Math.floor(Math.random() * SUGGESTED_TOPICS.length)];
    console.log('[AIBlogGenerator] Modal opened, suggesting topic:', randomTopic);
    setTopic(randomTopic);
    setShowSuccess(false);
    setIsOpen(true);
  };

  const generateBlog = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first");
      return;
    }

    console.log('[AIBlogGenerator] Starting generation for topic:', topic);
    setIsGenerating(true);
    try {
      const prompt = `Write a comprehensive, professional investment blog post for "AI Invest Pro".
      Theme: ${topic}
      Format: JSON { title, excerpt, content, category }
      Content: Markdown format, at least 800 words, expert analysis, data-driven, professional tone.
      Category options: Market Analysis, AI Trends, Wealth Building, Security.
      Only return the JSON.`;

      console.log('[AIBlogGenerator] Requesting AI completion...');
      const response = await generateChatCompletion([
        { 
          role: 'system', 
          content: 'You are a elite financial analyst and tech researcher for a top-tier investment firm. You output strictly JSON.' 
        },
        { role: 'user', content: prompt }
      ]);

      console.log('[AIBlogGenerator] AI Response received (cleaning and parsing)...');
      // Robust JSON cleaning: extract only the JSON object, remove backticks, and handle control characters
      let cleanJson = (response || '{}').replace(/```json|```/g, '').trim();
      
      // Handle the "Bad control character" (literal newlines inside the JSON string)
      // This is common when AI outputs multi-line strings without \n escaping
      cleanJson = cleanJson.replace(/[\u0000-\u001F\u007F-\u009F]/g, " "); 
      
      const data = JSON.parse(cleanJson);
      console.log('[AIBlogGenerator] Parsed Data:', data);
      
      if (!data.title || !data.content) {
        throw new Error("Invalid response format from AI: Missing title or content.");
      }

      console.log('[AIBlogGenerator] Saving to Firestore...');
      await addDoc(collection(db, 'blogs'), {
        ...data,
        author: 'AIVEST Strategy Bot',
        date: serverTimestamp(),
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop',
      });

      console.log('[AIBlogGenerator] Firestore write successful!');
      toast.success('AI Blog post generated and published successfully!');
      setShowSuccess(true);
    } catch (error) {
      console.error('[AIBlogGenerator] Generation Error:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button 
        onClick={handleOpen}
        className="bg-gradient-to-r from-[#2D6BFF] to-[#8B5CF6] text-white hover:opacity-90 border-none shadow-lg shadow-blue-500/20"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Generate AI Blog
      </Button>

      <DialogContent className="bg-[#0A0E1A] border-white/10 text-white sm:max-w-[500px]">
        {showSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-green-500 animate-pulse" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">Article Published!</DialogTitle>
              <DialogDescription className="text-[#A7B1C8]">
                Your AI-generated article has been successfully research, written, and posted to the live blog.
              </DialogDescription>
            </DialogHeader>
            <div className="pt-6">
              <Button 
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#2D6BFF] hover:bg-[#1e4fcb]"
              >
                Close Generator
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Wand2 className="w-6 h-6 text-[#2D6BFF]" />
                AI Blog Generator
              </DialogTitle>
              <DialogDescription className="text-[#A7B1C8]">
                Enter a topic and our AI will research, write, and publish a professional 800-word article to the platform.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#A7B1C8] flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Article Theme / Topic
                </label>
                <Input 
                  placeholder="e.g. The impact of AI on Wealth Management" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-white/5 border-white/10 h-12 focus:ring-[#2D6BFF]"
                />
              </div>

              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <p className="text-xs text-[#2D6BFF] font-semibold uppercase tracking-wider mb-2">Pro Tip</p>
                <p className="text-sm text-[#A7B1C8]">
                  Specific topics yield better results. Instead of "Crypto", try "How institutional Ethereum adoption affects retail liquidity".
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="ghost" 
                onClick={() => setIsOpen(false)}
                className="text-[#A7B1C8] hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button 
                onClick={generateBlog}
                disabled={isGenerating}
                className="bg-[#2D6BFF] hover:bg-[#1e4fcb] text-white min-w-[140px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Drafting Content...
                  </>
                ) : (
                  <>
                    Confirm & Generate
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
