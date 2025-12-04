import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { generateMarketingAdvice } from '../services/geminiService';

const AiCoach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello, Leader! I'm your Nexus 2025 AI Coach. I can help you with recruiting scripts, team motivation, or overcoming objections. What's your focus today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const advice = await generateMarketingAdvice(input);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: advice,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-b border-white/10 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Nexus Coach AI</h2>
            <p className="text-xs text-slate-400">Powered by Gemini 2.5</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'model' ? 'bg-slate-700 text-cyan-400' : 'bg-cyan-600 text-white'
            }`}>
              {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none'
            }`}>
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className="mb-2 last:mb-0">{line}</p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            </div>
            <div className="bg-slate-800 text-slate-400 px-4 py-2 rounded-2xl rounded-tl-none text-xs border border-white/5">
              Analyzing market data...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900/80 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for recruiting scripts, motivation, or analysis..."
            className="w-full bg-slate-800 text-white rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-white/5 placeholder-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiCoach;