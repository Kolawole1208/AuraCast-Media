import React, { useState } from 'react';
import { SocialInboxMessage, InboxSummary } from '../types';
import {
  Inbox,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  Filter,
  User,
  Clock,
  ThumbsUp,
  HelpCircle,
  AlertCircle,
  Bot,
  RefreshCw,
  Search,
  MessageCircle,
  Smile,
  Zap,
  ArrowRight
} from 'lucide-react';

interface UnifiedSocialInboxProps {
  inboxData?: InboxSummary;
  onSendReply: (messageId: string, replyText: string) => Promise<void>;
  onSuggestReply: (messageId: string, tone?: string) => Promise<string>;
  onRefreshInbox: () => Promise<void>;
  loading: boolean;
}

const DEFAULT_INBOX_SEED: InboxSummary = {
  totalMessages: 24,
  unrepliedCount: 6,
  avgResponseTimeMinutes: 3,
  aiCopilotSuggestedCount: 22,
  flaggedCount: 2,
  leadCount: 4,
  messages: [
    {
      id: 'msg_1',
      platform: 'Instagram',
      messageType: 'comment',
      authorName: 'Sarah Jenkins',
      authorHandle: '@sarahj_creative',
      postTitle: '3 Morning Habits of High Performers (Reel)',
      content: 'This morning habit routine completely transformed my workday! What coffee or tea do you drink during step 2?',
      createdAt: '12 minutes ago',
      status: 'unreplied',
      sentiment: 'positive',
      intentClassification: 'question',
      humanInterventionRequired: false,
      suggestedReply: 'So glad it helped Sarah! ☕ I usually stick to a warm matcha latte or black organic espresso. What is your morning go-to drink?'
    },
    {
      id: 'msg_angry_1',
      platform: 'Twitter',
      messageType: 'mention',
      authorName: 'Robert Vance',
      authorHandle: '@rvance_tech',
      content: 'My delivery arrived 4 days late and the packaging was damaged! I tried emailing customer support twice with zero reply. Fix this NOW!',
      createdAt: '25 minutes ago',
      status: 'unreplied',
      sentiment: 'critical',
      intentClassification: 'complaint',
      humanInterventionRequired: true,
      humanReason: '🔴 Angry customer detected with unresolved support ticket. Automated reply paused. High churn risk — recommended human intervention.',
      suggestedReply: 'Hi Robert, I am deeply sorry for the delay and packaging issue! I am personally escalating your ticket right now to our support manager. Can you DM us your order # so we can make this right immediately?'
    },
    {
      id: 'msg_lead_1',
      platform: 'Instagram',
      messageType: 'dm',
      authorName: 'Apex Growth Agency',
      authorHandle: '@apexgrowth.io',
      content: 'Hey! We manage social strategy for 15 enterprise brands. Are you taking on wholesale enterprise workspace accounts right now?',
      createdAt: '38 minutes ago',
      status: 'unreplied',
      sentiment: 'lead',
      intentClassification: 'sales_lead',
      humanInterventionRequired: true,
      humanReason: '🎯 High-value enterprise lead detected (15 brand accounts). Direct human sales outreach recommended.',
      suggestedReply: 'Hi there! Yes, we offer custom Enterprise Workspace tiers with multi-team approval workflows and dedicated support. Let’s schedule a 15-min call with our founder!'
    },
    {
      id: 'msg_2',
      platform: 'YouTube',
      messageType: 'question',
      authorName: 'David Chen',
      authorHandle: '@davidchen_tech',
      postTitle: 'Stop Overthinking Your Next Big Move',
      content: 'Great insights! Is there a template or PDF checklist we can download for this framework?',
      createdAt: '45 minutes ago',
      status: 'unreplied',
      sentiment: 'question',
      intentClassification: 'question',
      humanInterventionRequired: false,
      suggestedReply: 'Thanks David! Yes, you can grab the free PDF execution checklist right from the link in our channel bio! 🚀'
    },
    {
      id: 'msg_spam_1',
      platform: 'Facebook',
      messageType: 'comment',
      authorName: 'CryptoBot_99',
      authorHandle: 'CryptoBot_99',
      postTitle: 'Consistency vs. Intensity Graphic',
      content: 'Earn $5000 daily with automated telegram signal bot! Click link below bit.ly/crypto-scam-123',
      createdAt: '1 hour ago',
      status: 'flagged',
      sentiment: 'spam',
      intentClassification: 'spam',
      humanInterventionRequired: false,
      suggestedReply: '[Auto-Filtered Spam - Reply Disabled]'
    },
    {
      id: 'msg_3',
      platform: 'Twitter',
      messageType: 'mention',
      authorName: 'Alex Rivera',
      authorHandle: '@arivera_builds',
      content: 'Just implemented @AuraCastSocial content schedule for our product launch. Saved us 10+ hours this week!',
      createdAt: '2 hours ago',
      status: 'unreplied',
      sentiment: 'positive',
      intentClassification: 'praise',
      humanInterventionRequired: false,
      suggestedReply: '10 hours saved is a huge win Alex! 🔥 Huge congrats on the launch! Let us know how the audience engagement scales.'
    }
  ]
};

export default function UnifiedSocialInbox({
  inboxData = DEFAULT_INBOX_SEED,
  onSendReply,
  onSuggestReply,
  onRefreshInbox,
  loading
}: UnifiedSocialInboxProps) {
  const data = inboxData || DEFAULT_INBOX_SEED;

  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [filterUnrepliedOnly, setFilterUnrepliedOnly] = useState<boolean>(false);
  const [selectedMsgId, setSelectedMsgId] = useState<string>(data.messages[0]?.id || '');
  const [replyInput, setReplyInput] = useState<string>('');
  const [suggesting, setSuggesting] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  // Filter logic
  const filteredMessages = data.messages.filter((msg) => {
    const matchesPlatform = selectedPlatform === 'All' || msg.platform === selectedPlatform;
    const matchesUnreplied = !filterUnrepliedOnly || msg.status === 'unreplied';
    return matchesPlatform && matchesUnreplied;
  });

  const selectedMsg = data.messages.find((m) => m.id === selectedMsgId) || filteredMessages[0] || data.messages[0];

  // Load suggestion if available into input
  React.useEffect(() => {
    if (selectedMsg) {
      if (selectedMsg.status === 'replied') {
        setReplyInput(selectedMsg.repliedContent || '');
      } else {
        setReplyInput(selectedMsg.suggestedReply || '');
      }
    }
  }, [selectedMsgId, selectedMsg]);

  const handleGenerateReply = async (tone: string = 'Helpful & Friendly') => {
    if (!selectedMsg) return;
    setSuggesting(true);
    try {
      const suggestion = await onSuggestReply(selectedMsg.id, tone);
      setReplyInput(suggestion);
    } catch (err) {
      console.error(err);
    } finally {
      setSuggesting(false);
    }
  };

  const handleSend = async () => {
    if (!selectedMsg || !replyInput.trim()) return;
    setSending(true);
    try {
      await onSendReply(selectedMsg.id, replyInput);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const getPlatformBadgeColor = (plat: string) => {
    switch (plat) {
      case 'Instagram':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'YouTube':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Twitter':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'Facebook':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6 ring-1 ring-white/5 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-white/10">
            <Inbox className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-semibold text-white tracking-tight">
                Unified Cross-Platform Social Inbox
              </h2>
              <span className="text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded tracking-widest uppercase flex items-center gap-1">
                <Bot className="w-2.5 h-2.5 text-cyan-400" />
                Aura Copilot Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Manage Instagram comments, YouTube questions, X mentions, and DMs in one stream with AI reply suggestions.
            </p>
          </div>
        </div>

        <button
          onClick={onRefreshInbox}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync All Channels</span>
        </button>
      </div>

      {/* TOP INBOX METRICS SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
            Unreplied Messages
          </span>
          <div className="text-xl font-bold text-amber-300 font-mono">
            {data.unrepliedCount} Pending
          </div>
          <p className="text-[10px] font-mono text-slate-400">
            Across 4 platforms
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
            Avg AI Response Time
          </span>
          <div className="text-xl font-bold text-emerald-300 font-mono">
            &lt; {data.avgResponseTimeMinutes} Minutes
          </div>
          <p className="text-[10px] font-mono text-emerald-400">
            95% Faster than manual
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
            Aura Copilot Auto-Drafts
          </span>
          <div className="text-xl font-bold text-cyan-300 font-mono">
            {data.aiCopilotSuggestedCount} Ready
          </div>
          <p className="text-[10px] font-mono text-cyan-300">
            Contextual & Brand-Aligned
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
            Audience Sentiment
          </span>
          <div className="text-xl font-bold text-purple-300 font-mono">
            98.2% Positive
          </div>
          <p className="text-[10px] font-mono text-purple-300">
            High Engagement Score
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Instagram', 'YouTube', 'Twitter', 'Facebook'].map((plat) => (
            <button
              key={plat}
              onClick={() => setSelectedPlatform(plat)}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedPlatform === plat
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setFilterUnrepliedOnly(!filterUnrepliedOnly)}
          className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
            filterUnrepliedOnly
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Unreplied Only</span>
        </button>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: LEFT LIST, RIGHT COPILOT RESPONDER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MESSAGE LIST COLUMN */}
        <div className="lg:col-span-5 space-y-3 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-400 text-xs font-sans">
              No messages found matching criteria.
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMsg?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMsgId(msg.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${getPlatformBadgeColor(
                          msg.platform
                        )}`}
                      >
                        {msg.platform}
                      </span>
                      <span className="font-bold text-white font-sans">{msg.authorName}</span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">{msg.createdAt}</span>
                  </div>

                  <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                    "{msg.content}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                    <span className="text-slate-400 truncate max-w-[180px]">
                      {msg.postTitle || msg.authorHandle}
                    </span>

                    {msg.status === 'replied' ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Replied
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Needs Reply
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COPILOT DETAIL & RESPONSE WORKSPACE */}
        <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-5 flex flex-col justify-between shadow-xl">
          {selectedMsg ? (
            <div className="space-y-5">
              {/* SELECTED MESSAGE HEADER */}
              <div className="space-y-3 pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm font-mono">
                      {selectedMsg.authorName[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">{selectedMsg.authorName}</h3>
                      <span className="text-[11px] text-cyan-400 font-mono">{selectedMsg.authorHandle}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded border ${getPlatformBadgeColor(selectedMsg.platform)}`}>
                    {selectedMsg.platform} • {selectedMsg.messageType.toUpperCase()}
                  </span>
                </div>

                {selectedMsg.postTitle && (
                  <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    📍 On Content: <strong className="text-slate-200">{selectedMsg.postTitle}</strong>
                  </div>
                )}

                  {/* USER ORIGINAL MESSAGE CONTENT */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs font-sans text-slate-100 leading-relaxed space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Received Message:</span>
                      {selectedMsg.intentClassification && (
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          selectedMsg.intentClassification === 'complaint'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : selectedMsg.intentClassification === 'sales_lead'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : selectedMsg.intentClassification === 'spam'
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        }`}>
                          {selectedMsg.intentClassification === 'complaint' && '🔴 Angry / Dissatisfied Customer'}
                          {selectedMsg.intentClassification === 'sales_lead' && '🎯 Potential Sales Lead'}
                          {selectedMsg.intentClassification === 'question' && '❓ Inquiry Question'}
                          {selectedMsg.intentClassification === 'praise' && '👍 Positive Review'}
                          {selectedMsg.intentClassification === 'spam' && '🚫 Spam Filtered'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium">"{selectedMsg.content}"</p>
                  </div>

                  {/* HUMAN INTERVENTION REQUIRED ALERT BANNER */}
                  {selectedMsg.humanInterventionRequired && (
                    <div className="bg-rose-950/40 border-2 border-rose-500/50 rounded-xl p-3.5 space-y-1.5 animate-pulse">
                      <div className="flex items-center gap-2 text-rose-300 text-xs font-bold font-mono">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>RECOMMENDED HUMAN INTERVENTION</span>
                      </div>
                      <p className="text-xs text-rose-200/90 font-sans leading-relaxed">
                        {selectedMsg.humanReason || 'Aura Copilot detected high churn risk or strategic lead context. Review carefully before publishing AI suggestion.'}
                      </p>
                    </div>
                  )}
                </div>

              {/* AURA COPILOT SUGGESTION ENGINE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>🤖 Aura Copilot AI Smart Reply Generator</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {['Helpful', 'Enthusiastic', 'Direct', 'Professional'].map((tone) => (
                      <button
                        key={tone}
                        onClick={() => handleGenerateReply(tone)}
                        disabled={suggesting}
                        className="text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                {/* REPLY EDIT AREA */}
                <div className="relative">
                  <textarea
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    rows={4}
                    placeholder="Aura Copilot reply suggestion will appear here..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl p-3.5 text-xs text-white font-sans focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  />

                  {suggesting && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2 text-xs font-mono text-cyan-300">
                      <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>Drafting contextual response...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleGenerateReply('Helpful & Friendly')}
                  disabled={suggesting}
                  className="bg-slate-900 hover:bg-slate-800 text-cyan-300 font-mono text-xs px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${suggesting ? 'animate-spin' : ''}`} />
                  <span>Suggest Response</span>
                </button>

                <button
                  onClick={handleSend}
                  disabled={sending || !replyInput.trim()}
                  className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer border border-white/10 disabled:opacity-50"
                >
                  {sending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Publishing Reply...</span>
                    </>
                  ) : sendSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Sent & Published!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>Send Reply Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs font-sans space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Select a message on the left to view conversation details and generate AI replies.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
