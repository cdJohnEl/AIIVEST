import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2, MinusCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { generateChatCompletion } from '../lib/groq';

const SYSTEM_PROMPT = `You are the NexusFinPro AI Support Assistant. NexusFinPro is a premium, AI-powered crypto wealth management platform.

Our Available Investment Plans (matching Dashboard & Investment Plans page):
1. **Starter**
   - Monthly Commitment: $50 – $199
   - Target ROI: 4% – 6% (Average ~5.0% monthly)
   - Features: Basic AI-managed portfolio, 24/7 risk monitoring, Weekly performance report, Secure deposits (BTC, ETH, USDT), Optional privacy layers

2. **Pro**
   - Monthly Commitment: $200 – $999
   - Target ROI: 7% – 9% (Average ~8.0% monthly)
   - Features: Advanced AI strategies (momentum & arbitrage), Priority support, Monthly strategy call, Secure deposits (BTC, ETH, USDT), Optional privacy layers

3. **Elite**
   - Monthly Commitment: $1,000+
   - Target ROI: 10% – 12% (Average ~11.0% monthly)
   - Features: Dedicated portfolio manager, Custom strategy tuning, Quarterly in-depth audit, Secure deposits (BTC, ETH, USDT), Optional privacy layers

Guidelines:
1. Always state the exact 3 plans above with their official commitment amounts and target ROI percentages when asked about plans or returns.
2. Format responses with clean Markdown (bullet points, clear headings, bold text) so they render legibly.
3. Answer questions about crypto deposits (BTC, ETH, USDT payment gateway).
4. Maintain a professional, sophisticated, and helpful brand voice.`;

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hi there! 👋 I'm the NexusFinPro AI Assistant. How can I help you optimize your portfolio today?", sender: 'bot', timestamp: new Date() },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    const newUserMessage: ChatMessage = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev: ChatMessage[]) => [...prev, newUserMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      // Format messages for Groq
      const groqMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((msg: ChatMessage) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: userMessage }
      ];

      const aiResponse = await generateChatCompletion(groqMessages as any);
      
      const botResponse: ChatMessage = {
        id: Date.now() + 1,
        text: aiResponse || "I'm having a bit of trouble connecting to my brain. Please try again or contact support at partnerships@nexusfinpro.com.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev: ChatMessage[]) => [...prev, botResponse]);
    } catch (error) {
      console.error('LiveChat Groq Error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm experiencing some technical difficulties. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev: ChatMessage[]) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#2D6BFF] to-[#8B5CF6] text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:scale-110 transition-transform z-50 group"
      >
        <MessageSquare className="w-6 h-6 group-hover:animate-pulse" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#070A12] flex items-center justify-center text-[10px] font-bold">1</span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-80 sm:w-[420px] bg-[#0D1220] border border-white/10 rounded-2xl shadow-2xl z-50 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[520px]'} flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#2D6BFF]/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-[#2D6BFF]" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0D1220]"></span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">NexusFinPro Support</h3>
            <p className="text-[10px] text-green-500">Online & Ready to Help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-[#A7B1C8] transition-colors"
          >
            <MinusCircle className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-[#A7B1C8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[88%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.sender === 'user' ? 'bg-[#2D6BFF]/20' : 'bg-white/5'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4 text-[#2D6BFF]" /> : <Bot className="w-4 h-4 text-[#A7B1C8]" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#2D6BFF] text-white rounded-tr-none' 
                      : 'bg-[#141B2D] text-[#F4F6FF] border border-white/10 rounded-tl-none overflow-x-auto'
                  }`}>
                    {msg.sender === 'bot' ? (
                      <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-[#F4F6FF] space-y-2 [&_table]:w-full [&_table]:my-2 [&_table]:border-collapse [&_th]:border [&_th]:border-white/20 [&_th]:p-1.5 [&_th]:bg-white/10 [&_td]:border [&_td]:border-white/10 [&_td]:p-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-1">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                    <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/60' : 'text-[#A7B1C8]'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[88%]">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#A7B1C8]" />
                  </div>
                  <div className="bg-white/5 text-[#A7B1C8] p-3 rounded-2xl rounded-tl-none border border-white/5">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5 rounded-b-2xl">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="bg-[#070A12] border-white/10 text-white text-sm h-10 focus:ring-[#2D6BFF]"
              />
              <Button type="submit" size="icon" className="bg-[#2D6BFF] hover:bg-[#1e4fcb] h-10 w-10 shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-[#A7B1C8] text-center mt-2">
              Typical reply time: <span className="text-[#F4F6FF]">Instant</span>
            </p>
          </form>
        </>
      )}
    </div>
  );
}
