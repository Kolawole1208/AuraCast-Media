import React, { useState, useEffect } from 'react';
import { CopilotCommandType, CopilotExecutionResult } from '../types';
import {
  Brain,
  Sparkles,
  Send,
  Calendar,
  BarChart2,
  TrendingDown,
  MessageSquare,
  FileText,
  Flame,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  Share2,
  Bot,
  Zap,
  RefreshCw,
  Plus,
  HelpCircle
} from 'lucide-react';

interface AuraCopilotBrainProps {
  onExecuteCommand?: (commandType: CopilotCommandType, prompt?: string) => Promise<CopilotExecutionResult>;
  onApplyGeneratedPosts?: (posts: Array<{ title: string; caption: string; platforms: string[] }>) => void;
  loading?: boolean;
}

const BRAIN_PRESETS: Array<{
  type: CopilotCommandType;
  label: string;
  icon: any;
  prompt: string;
  badge: string;
}> = [
  {
    type: 'CREATE_CAMPAIGN',
    label: 'Create a campaign',
    icon: Layers,
    prompt: 'Create a comprehensive multi-channel campaign for our Q4 product launch.',
    badge: 'Multi-Channel'
  },
  {
    type: 'EXPLAIN_ENGAGEMENT_DROP',
    label: 'Why did engagement fall?',
    icon: TrendingDown,
    prompt: 'Analyze our engagement drop across Instagram and LinkedIn over the last 14 days.',
    badge: 'Diagnostic'
  },
  {
    type: 'SCHEDULE_NEXT_WEEK',
    label: "Schedule next week's posts",
    icon: Calendar,
    prompt: "Auto-schedule next week's optimal posts across high-traffic audience windows.",
    badge: 'Auto-Pilot'
  },
  {
    type: 'SHOW_TOP_PERFORMING',
    label: 'Show my best-performing content',
    icon: Flame,
    prompt: 'Retrieve our top 3 highest-converting vertical video reels and carousel posts.',
    badge: 'Analytics'
  },
  {
    type: 'RECREATE_BEST_CONTENT',
    label: 'Create 5 posts based on best content',
    icon: Sparkles,
    prompt: 'Generate 5 new spin-off posts inspired by our top-performing content hook and format.',
    badge: 'Content Cloning'
  },
  {
    type: 'REPLY_UNANSWERED_COMMENTS',
    label: 'Reply to unanswered comments',
    icon: MessageSquare,
    prompt: 'Scan unanswered audience comments on Facebook and Instagram and draft AI replies.',
    badge: 'Inbox AI'
  },
  {
    type: 'PREPARE_MONTHLY_REPORT',
    label: 'Prepare monthly report',
    icon: FileText,
    prompt: 'Generate an executive monthly marketing ROI & impression summary for stakeholders.',
    badge: 'Executive PDF'
  },
  {
    type: 'WHAT_TO_POST_TODAY',
    label: 'What should I post today?',
    icon: Zap,
    prompt: 'Recommend today\'s highest-probability viral topic and optimal posting hour.',
    badge: 'Daily Strategy'
  }
];

export default function AuraCopilotBrain({
  onExecuteCommand,
  onApplyGeneratedPosts,
  loading = false
}: AuraCopilotBrainProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [executingType, setExecutingType] = useState<CopilotCommandType | null>(null);

  useEffect(() => {
    const handleCustomDirective = (e: any) => {
      if (e.detail?.type) {
        handleRunCommand(e.detail.type, e.detail.prompt);
      }
    };
    window.addEventListener('trigger-copilot-directive', handleCustomDirective);
    return () => window.removeEventListener('trigger-copilot-directive', handleCustomDirective);
  }, []);

  const [activeResult, setActiveResult] = useState<CopilotExecutionResult | null>({
    commandType: 'WHAT_TO_POST_TODAY',
    headline: "Today's Recommended AI Strategy: Short-Form Video & Direct Page Posts",
    summary: "Based on real-time trend velocity and Facebook engagement patterns, posting high-value educational content between 7:00 PM and 9:00 PM yields peak reach.",
    details: [
      "Target Platforms: Facebook Page & Instagram Reel",
      "Optimal Posting Time: 7:00 PM - 9:00 PM EST (Peak Evening Traffic Window)",
      "Recommended Hook: 'Consistency vs. Talent: How top teams scale output with AI automation.'"
    ],
    metrics: [
      { label: "Predicted Engagement Rate", value: "8.4%", change: "+3.2%" },
      { label: "Optimal Video Length", value: "15 - 30s", change: "Optimal" },
      { label: "Reach Probability", value: "92.4%", change: "High" }
    ],
    actionItems: [
      "Review generated caption draft in Content Studio.",
      "Publish directly to connected Facebook Page via Graph API."
    ],
    generatedPosts: [
      {
        title: "Scaling Social Content Production with AI",
        caption: "Stop spending 10 hours creating social content every week. 🚀 Here is how AuraCast generates 30 days of high-converting multi-channel posts in under 60 seconds.",
        platforms: ["facebook", "instagram", "linkedin"],
        recommendedTime: "Today at 7:15 PM EST"
      }
    ]
  });

  const handleRunCommand = async (type: CopilotCommandType, promptText?: string) => {
    setExecutingType(type);
    try {
      if (onExecuteCommand) {
        const res = await onExecuteCommand(type, promptText);
        setActiveResult(res);
      } else {
        setTimeout(() => {
          setActiveResult(getFallbackResult(type, promptText));
          setExecutingType(null);
        }, 800);
        return;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExecutingType(null);
    }
  };

  const getFallbackResult = (type: CopilotCommandType, promptText?: string): CopilotExecutionResult => {
    switch (type) {
      case 'CREATE_CAMPAIGN':
        return {
          commandType: 'CREATE_CAMPAIGN',
          headline: 'Multi-Channel Growth Campaign Blueprint Created',
          summary: 'AuraCast AI has generated a 5-part synchronized campaign spanning Facebook, Instagram, LinkedIn, and Twitter.',
          details: [
            '5 Unique Posts drafted across 4 social channels',
            'Brand Kit typography and tone guidelines applied',
            'Lead attribution tracking link attached'
          ],
          metrics: [
            { label: 'Expected Reach', value: '45,000+', change: 'High' },
            { label: 'Estimated Lead Rate', value: '3.8%', change: '+1.2%' }
          ],
          actionItems: [
            'Review drafted campaign posts in calendar view.',
            'Confirm publishing schedule.'
          ],
          generatedPosts: [
            {
              title: 'Campaign Teaser: Modern Social Operations',
              caption: 'Big shifts are happening in marketing automation. Here is how top teams scale reach efficiently.',
              platforms: ['facebook', 'linkedin'],
              recommendedTime: 'Tomorrow at 9:00 AM'
            }
          ]
        };

      case 'EXPLAIN_ENGAGEMENT_DROP':
        return {
          commandType: 'EXPLAIN_ENGAGEMENT_DROP',
          headline: 'AI Engagement Diagnostic Report',
          summary: 'Analysis reveals engagement decreased by 18% over the last 14 days due to posting during off-peak afternoon hours.',
          details: [
            'Root Cause: 4 posts were published between 2:00 PM - 4:00 PM when audience activity is low.',
            'Remediation Plan: Shift default posting times to evening peak hours (7:00 PM - 9:00 PM).'
          ],
          metrics: [
            { label: 'Peak Hour Match', value: '40% (Low)', change: '-18%' },
            { label: 'Recommended Shift', value: '7:00 - 9:00 PM', change: '+2.5x' }
          ],
          actionItems: [
            'Shift default posting schedule to evening peak hours.'
          ]
        };

      default:
        return {
          commandType: type,
          headline: 'Aura Copilot Directive Executed',
          summary: 'Directive processed successfully.',
          details: ['Workspace state updated with AI recommendations.']
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Aura Copilot Brain
              </h2>
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono">
                AI COMMAND HUB
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Execute high-level marketing directives, diagnostics, and campaign creation.
            </p>
          </div>
        </div>
      </div>

      {/* COMMAND PRESETS GRID */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Copilot Directives
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {BRAIN_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isExecuting = executingType === preset.type;

            return (
              <button
                key={preset.type}
                disabled={loading || executingType !== null}
                onClick={() => handleRunCommand(preset.type, preset.prompt)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-lg text-left transition-colors cursor-pointer group flex flex-col justify-between space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-md bg-white border border-slate-200 text-blue-600 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-semibold bg-white text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                    {preset.badge}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-slate-900 font-sans leading-tight">
                    {preset.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 font-sans">
                    {preset.prompt}
                  </p>
                </div>

                {isExecuting && (
                  <div className="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center gap-2 text-blue-600 font-semibold text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Executing...
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CUSTOM PROMPT INPUT */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2">
        <Bot className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Ask Copilot anything: 'Analyze campaign ROI', 'Draft 3 LinkedIn articles'..."
          className="bg-transparent w-full text-xs text-slate-900 focus:outline-none placeholder:text-slate-400"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && customPrompt.trim()) {
              handleRunCommand('WHAT_TO_POST_TODAY', customPrompt);
            }
          }}
        />
        <button
          onClick={() => {
            if (customPrompt.trim()) handleRunCommand('WHAT_TO_POST_TODAY', customPrompt);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded-md flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
        >
          <span>Run</span>
          <Send className="w-3 h-3" />
        </button>
      </div>

      {/* EXECUTION RESULT OUTPUT */}
      {activeResult && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-semibold text-slate-900">
                {activeResult.headline}
              </h3>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Ready
            </span>
          </div>

          <p className="text-xs text-slate-700 font-sans leading-relaxed">
            {activeResult.summary}
          </p>

          {/* METRICS ROW */}
          {activeResult.metrics && activeResult.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {activeResult.metrics.map((m, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-2.5 rounded-md space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-medium block">{m.label}</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-xs font-bold text-slate-900">{m.value}</strong>
                    {m.change && (
                      <span className="text-[10px] font-semibold text-emerald-600">{m.change}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DETAILS LIST */}
          {activeResult.details && activeResult.details.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Key Insights:
              </span>
              <ul className="space-y-1 text-xs text-slate-700 font-sans">
                {activeResult.details.map((dt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{dt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* GENERATED POSTS */}
          {activeResult.generatedPosts && activeResult.generatedPosts.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  Generated Content Drafts
                </span>
                {onApplyGeneratedPosts && (
                  <button
                    onClick={() => onApplyGeneratedPosts(activeResult.generatedPosts || [])}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Apply to Post Drafter
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {activeResult.generatedPosts.map((gp, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-md border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-semibold text-slate-900">{gp.title}</h5>
                      <span className="text-[10px] text-slate-500">{gp.recommendedTime}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-sans leading-relaxed">
                      "{gp.caption}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
