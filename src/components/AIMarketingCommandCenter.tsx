import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Calendar,
  Palette,
  BarChart3,
  Brain,
  MessageSquare,
  Users,
  Flame,
  Coins,
  ArrowRight,
  CheckCircle2,
  Zap,
  PlayCircle,
  ShieldCheck,
  RefreshCw,
  Globe,
  Send,
  FileText,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Share2,
  HelpCircle,
  X
} from 'lucide-react';

interface AIMarketingCommandCenterProps {
  activeModuleCount?: number;
  onNavigateToModule?: (moduleId: string) => void;
}

const PILLARS = [
  { id: 'strategy', number: '1', name: 'AI Strategy Generator', icon: Brain, status: 'Active (Q4 Plan)', color: 'from-purple-500 to-indigo-600' },
  { id: 'campaign', number: '2', name: 'AI Campaign Builder', icon: Layers, status: 'Synced (5 Channels)', color: 'from-indigo-500 to-blue-600' },
  { id: 'calendar', number: '3', name: 'Calendar & Scheduler', icon: Calendar, status: '7 Posts Scheduled', color: 'from-cyan-500 to-teal-600' },
  { id: 'brandkit', number: '4', name: 'Brand Kit Identity', icon: Palette, status: 'Aura Premium Active', color: 'from-emerald-500 to-teal-600' },
  { id: 'analytics', number: '5', name: 'Analytics & Insights', icon: BarChart3, status: '+28% Growth Rate', color: 'from-amber-500 to-yellow-600' },
  { id: 'learning', number: '6', name: 'AI Self-Optimization', icon: Sparkles, status: 'Self-Tuning Live', color: 'from-rose-500 to-pink-600' },
  { id: 'inbox', number: '7', name: 'Unified Social Inbox', icon: MessageSquare, status: '12 Auto-Replies Drafted', color: 'from-purple-500 to-rose-600' },
  { id: 'team', number: '8', name: 'Team Approval Queue', icon: Users, status: '3 Approvals Pending', color: 'from-indigo-500 to-cyan-600' },
  { id: 'trends', number: '9', name: 'Trend & Competitors', icon: Flame, status: '2 Competitors Monitored', color: 'from-amber-500 to-rose-600' },
  { id: 'conversion', number: '10', name: 'Lead & Revenue Attrib.', icon: Coins, status: '₦2.5M Revenue Tracked', color: 'from-emerald-500 to-cyan-600' }
];

const FOUR_STEPS = [
  {
    num: '1',
    title: 'Generate AI Strategy',
    icon: Brain,
    iconColor: 'text-amber-400',
    targetModule: 'strategy',
    desc: 'Enter your brand goals or target audience. AuraCast creates a multi-channel growth playbook with viral hooks.'
  },
  {
    num: '2',
    title: 'Auto-Create Content',
    icon: Sparkles,
    iconColor: 'text-indigo-400',
    targetModule: 'brandkit',
    desc: 'AI generates high-converting captions, custom branded graphic cards, hashtag sets, and video scripts.'
  },
  {
    num: '3',
    title: 'Schedule & Publish',
    icon: Calendar,
    iconColor: 'text-cyan-400',
    targetModule: 'calendar',
    desc: 'Queue your posts into the interactive calendar. AuraCast dispatches content directly to Instagram, TikTok, X, and LinkedIn.'
  },
  {
    num: '4',
    title: 'Analyze & Scale',
    icon: TrendingUp,
    iconColor: 'text-emerald-400',
    targetModule: 'analytics',
    desc: 'Track engagement rates, lead conversions, and audience sentiment while AI self-learns what drives top revenue.'
  }
];

const FLYWHEEL_STEPS = [
  { step: '1', title: 'Strategy', desc: 'AI analyzes niche & generates 30-day growth playbook' },
  { step: '2', title: 'Content', desc: 'Multi-channel video scripts, copy, & visual assets generated' },
  { step: '3', title: 'Schedule', desc: 'Auto-queues posts for peak audience activity hours' },
  { step: '4', title: 'Publish', desc: 'Direct API dispatch to Instagram, TikTok, LinkedIn, X, Facebook, YouTube' },
  { step: '5', title: 'Engage', desc: 'AI Inbox monitors comments and drafts instant responses' },
  { step: '6', title: 'Analyze', desc: 'Full-funnel attribution tracks CTR, leads, and revenue' },
  { step: '7', title: 'Optimize', desc: 'AI Self-Learner adapts future hooks based on top performance' }
];

export default function AIMarketingCommandCenter({
  activeModuleCount = 10,
  onNavigateToModule
}: AIMarketingCommandCenterProps) {
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showPillarsModal, setShowPillarsModal] = useState(false);
  const [showFlywheelModal, setShowFlywheelModal] = useState(false);

  useEffect(() => {
    const handleOpenHowItWorks = () => setShowHowItWorksModal(true);
    const handleOpenPillars = () => setShowPillarsModal(true);

    window.addEventListener('open-how-it-works', handleOpenHowItWorks);
    window.addEventListener('open-pillars-modal', handleOpenPillars);

    return () => {
      window.removeEventListener('open-how-it-works', handleOpenHowItWorks);
      window.removeEventListener('open-pillars-modal', handleOpenPillars);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* 🌟 HERO BANNER SECTION (CLEAN & PROFESSIONAL ENTERPRISE) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 md:p-8 shadow-2xs space-y-5">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] font-mono font-semibold text-blue-700 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Autonomous AI Marketing System</span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Complete Social Media Marketing on Autopilot
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            Plan, generate, schedule, engage, and grow your audience seamlessly with an AI-powered marketing workspace built for scale.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* 🎯 MAIN "HOW AURACAST WORKS" BUTTON */}
            <button
              onClick={() => setShowHowItWorksModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-white" />
              <span>How AuraCast Works</span>
            </button>

            {/* 🏛️ 10 CORE OS PILLARS BUTTON */}
            <button
              onClick={() => setShowPillarsModal(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 text-xs px-5 py-2.5 rounded-lg shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>10 Core OS Pillars</span>
            </button>

            <button
              onClick={() => onNavigateToModule && onNavigateToModule('strategy')}
              className="bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs px-5 py-2.5 rounded-lg shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>Start Your AI Campaign</span>
            </button>

            <button
              onClick={() => setShowFlywheelModal(true)}
              className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-mono font-medium text-xs px-4 py-2.5 rounded-lg shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Explore AI Flywheel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🏛️ CLEAN & PROFESSIONAL PILLARS SUMMARY STRIP */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                10 Core AI Marketing Operating System Pillars
              </h3>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                10/10 Active
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans">
              All ten specialized growth, content, scheduling, inbox, and analytics modules are active and synchronized.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPillarsModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0 flex items-center gap-2"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>View All 10 Pillars</span>
        </button>
      </div>

      {/* 🚀 "HOW AURACAST WORKS" MODAL DIALOG */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 max-w-4xl w-full space-y-6 shadow-xl relative overflow-hidden my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1 max-w-xl">
                <div className="inline-flex items-center gap-2 text-blue-700 text-xs font-mono font-semibold uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>Interactive Onboarding Guide</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  How AuraCast Works
                </h2>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Four simple steps stand between you and an automated, revenue-generating social media presence.
                </p>
              </div>
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 STEPS GRID INSIDE MODAL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FOUR_STEPS.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.num}
                    onClick={() => {
                      setShowHowItWorksModal(false);
                      onNavigateToModule?.(step.targetModule);
                    }}
                    className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 space-y-3 transition-colors cursor-pointer group shadow-2xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-xs">
                          {step.num}
                        </div>
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                      <span>Explore Phase</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-sans">
                ⚡ Need custom marketing advice? Open <strong className="text-slate-800 font-semibold">Aura Copilot</strong> anytime.
              </span>
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-6 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🏛️ "10 CORE OS PILLARS" MODAL DIALOG */}
      {showPillarsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 max-w-5xl w-full space-y-6 shadow-xl relative overflow-hidden my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1 max-w-xl">
                <div className="inline-flex items-center gap-2 text-blue-700 text-xs font-mono font-semibold uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Full AI Operating System Architecture</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  10 Core AI Marketing OS Pillars
                </h2>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Every module works together in an autonomous loop to handle research, creation, scheduling, inbox replies, and revenue conversion.
                </p>
              </div>
              <button
                onClick={() => setShowPillarsModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 10 PILLARS GRID INSIDE MODAL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setShowPillarsModal(false);
                      onNavigateToModule?.(p.id);
                    }}
                    className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 p-3.5 rounded-xl space-y-3 transition-colors cursor-pointer group shadow-2xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          #{p.number}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                          {p.name}
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-700 block mt-1 font-semibold">
                          ✓ {p.status}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center text-[10px] font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                      <span>Open Module</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
              <span className="text-xs font-mono text-emerald-700 font-semibold">
                ✓ 10/10 Operating System Pillars fully synchronized & active
              </span>
              <button
                onClick={() => setShowPillarsModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                Close Pillars View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTONOMOUS FLYWHEEL MODAL */}
      {showFlywheelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-3xl w-full space-y-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  The AuraCast Autonomous AI Growth Flywheel
                </h3>
              </div>
              <button onClick={() => setShowFlywheelModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              When a user says <strong className="text-slate-900 font-semibold">"I don't know what to post,"</strong> AuraCast executes a continuous 7-step autonomous flywheel:
            </p>

            <div className="space-y-2">
              {FLYWHEEL_STEPS.map((s) => (
                <div key={s.step} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <strong className="text-slate-900 font-bold block">{s.title} Phase</strong>
                    <span className="text-xs text-slate-600 font-sans">{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowFlywheelModal(false)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Close Flywheel View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


