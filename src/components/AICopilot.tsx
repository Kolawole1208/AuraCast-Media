import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, MessageSquare, ArrowRight, User, HelpCircle, Check, Play, RefreshCw, Layers } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am Aura Copilot, your personalized marketing assistant. 🌌\n\nI can help you build eye-catching campaigns, outline custom hashtags, brainstorm industry topics, or setup physical Meta Developer link keys. What are you looking to create today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest comment
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  // Dismiss notification banner when opening
  useEffect(() => {
    if (isOpen) {
      setShowNotification(false);
    }
  }, [isOpen]);

  // Handle custom window event to open from main navbar
  useEffect(() => {
    const handleOpenEvent = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-ai-copilot', handleOpenEvent);
    return () => {
      window.removeEventListener('open-ai-copilot', handleOpenEvent);
    };
  }, []);

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      // Gather latest history context
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: chatHistory })
      });

      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          content: data.reply || "I'm ready to assist with any other requests!",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error("Failure processing chat reply. Invalid response format or server error.");
      }
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: "I ran into a temporary network bottleneck. Don't worry! You can easily spark automated content by clicking the **+ Daily Campaign** button at the top of your screen, choosing a topic, and clicking **Spark Daily Content Engine**.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const starterPrompts = [
    { label: "➕ How to create a post?", text: "Can you give me a step-by-step guide on how to create a daily campaign post?" },
    { label: "🚀 Live vs Sandbox Instagram?", text: "What is the difference between high-fidelity Sandbox and Direct Meta Live publishing on Instagram?" },
    { label: "⚡ Give me 5 topic ideas!", text: "Let's brainstorm! Give me 5 viral social media topic ideas I should create campaigns for matching my brand." },
    { label: "🎨 Tweak graphic card design?", text: "How do I customize the card graphics, change designs or trigger image regeneration?" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Interactive Floating Pulse Badge */}
      {showNotification && !isOpen && (
        <div className="absolute bottom-16 right-2 w-72 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow-2xl animate-bounce flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-pink-400 font-mono tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" /> Live Assistance
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowNotification(false);
              }}
              className="text-slate-500 hover:text-slate-300 text-[10px]"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-slate-350 leading-normal">
            Need inspiration or can't find how to connect Instagram? Aura Copilot is here to solve anything!
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="text-[10px] text-left font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Open Copilot Chat <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Sparkles Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-850 text-violet-300 hover:text-white shadow-lg shadow-black/40 hover:shadow-violet-500/15 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group relative cursor-pointer border border-violet-500/30 hover:border-violet-400/60 backdrop-blur-md"
          title="Aura Copilot Assistance"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform text-violet-400 group-hover:text-violet-300" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-violet-400 border-2 border-slate-950 rounded-full" />
        </button>
      )}

      {/* Active Conversation Drawer */}
      {isOpen && (
        <div className="w-[380px] sm:w-[410px] h-[540px] max-h-[82vh] bg-[#0A1220]/95 backdrop-blur-xl border border-violet-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-[#07111F]/90 border-b border-slate-800 p-4 flex items-center justify-between relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-500" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-display font-bold text-white tracking-wide">Aura Copilot</h3>
                  <span className="px-1.5 py-0.5 rounded-full bg-violet-500/20 text-[9px] font-mono font-bold text-violet-300 border border-violet-500/30">
                    Aura AI
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[9.5px] font-mono text-slate-400">Ready to assist in any area</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900 border border-slate-850 rounded-lg hover:border-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-slate-850 flex items-center justify-center text-indigo-400 font-bold shrink-0 shadow-inner">
                    ✨
                  </div>
                )}
                <div className="max-w-[82%] flex flex-col gap-1">
                  <div
                    className={`p-3 rounded-2xl text-[11.5px] leading-relaxed font-sans whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-xs shadow-md'
                        : 'bg-slate-950 text-slate-200 border border-slate-850/60 rounded-tl-xs'
                    }`}
                  >
                    {/* Render plain formatting since we raw output bullets but with elegant spacing */}
                    {m.content}
                    
                    {/* Extra context guides for starter messages */}
                    {m.id === 'welcome' && (
                      <div className="mt-2 text-[10px] text-pink-400/90 font-mono font-semibold flex items-center gap-1 bg-pink-900/10 p-1.5 rounded border border-pink-500/10">
                        <HelpCircle className="w-3 h-3 shrink-0" /> Tip: Click one of the quick starter questions below to test capabilities immediately.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-slate-850 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                  ✨
                </div>
                <div className="p-3 bg-slate-950 border border-slate-850/60 rounded-2xl rounded-tl-xs text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                  <RefreshCw className="w-3 h-3 animate-spin text-pink-400" /> Aura Copilot is drafting response...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sparker Prompt Shortcuts */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-850/40">
              <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Common Quick Questions</span>
              <div className="flex flex-wrap gap-1.5">
                {starterPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(p.text)}
                    className="text-[10px] text-left px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850/80 text-slate-300 font-sans font-semibold rounded-lg border border-slate-850 hover:border-slate-750 transition-all cursor-pointer flex items-center gap-1"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Controller Tray */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 bg-slate-950/80 border-t border-slate-850 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about posts, templates, or Meta connection..."
              className="flex-1 px-3 py-2 text-xs placeholder-slate-550 text-slate-200 bg-slate-900 border border-slate-800 rounded-xl focus:outline-hidden focus:border-indigo-500 font-sans"
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className="w-8.5 h-8.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
