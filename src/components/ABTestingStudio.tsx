import React, { useState } from 'react';
import { ABTestExperiment, ABTestVariant } from '../types';
import {
  TestTube2,
  Sparkles,
  Trophy,
  BarChart2,
  ArrowRight,
  Plus,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  Flame
} from 'lucide-react';

interface ABTestingStudioProps {
  experiments?: ABTestExperiment[];
  onCreateExperiment: (experiment: Omit<ABTestExperiment, 'id' | 'createdDate'>) => Promise<void>;
  loading: boolean;
}

const DEFAULT_EXPERIMENTS: ABTestExperiment[] = [
  {
    id: 'exp_1',
    topicTitle: 'Q4 Product Launch Hook Battle',
    platform: 'Instagram Reel & TikTok',
    testType: 'Hooks',
    status: 'running',
    confidenceScore: 94.8,
    createdDate: 'Yesterday at 2:00 PM',
    variantA: {
      id: 'var_a',
      label: 'Version A',
      hook: "Don't give up.",
      content: 'Building a startup takes perseverance. Watch how AuraCast cuts video creation time by 90%.',
      ctaText: 'Try AuraCast Free',
      postingTime: '8:00 AM EST',
      engagementRate: 4.2,
      clickThroughRate: 2.1,
      conversions: 18
    },
    variantB: {
      id: 'var_b',
      label: 'Version B',
      hook: "You're closer than you think.",
      content: 'Your break-through campaign is one click away. Watch how AuraCast generates 30 days of posts in 60s.',
      ctaText: 'Claim Free Trial Now',
      postingTime: '6:00 PM EST',
      engagementRate: 8.9,
      clickThroughRate: 5.4,
      conversions: 54,
      isWinner: true
    },
    aiRecommendationReason: 'Version B ("You\'re closer than you think") triggered a 112% higher psychological curiosity loop and 2.5x more click-throughs than Version A.'
  },
  {
    id: 'exp_2',
    topicTitle: 'B2B Founder CTA Conversion Test',
    platform: 'LinkedIn',
    testType: 'CTAs',
    status: 'completed',
    confidenceScore: 97.2,
    createdDate: '3 days ago',
    variantA: {
      id: 'var_a2',
      label: 'Version A',
      hook: '3 Leadership Principles for 2026',
      content: 'Consistency beats intensity. Read our complete guide to scaling content without burnout.',
      ctaText: 'Read Full Article',
      postingTime: '9:00 AM EST',
      engagementRate: 5.1,
      clickThroughRate: 3.2,
      conversions: 24
    },
    variantB: {
      id: 'var_b2',
      label: 'Version B',
      hook: '3 Leadership Principles for 2026',
      content: 'Consistency beats intensity. Read our complete guide to scaling content without burnout.',
      ctaText: 'Get Free Growth Blueprint',
      postingTime: '9:00 AM EST',
      engagementRate: 9.4,
      clickThroughRate: 7.8,
      conversions: 72,
      isWinner: true
    },
    aiRecommendationReason: 'Specific value-add CTA ("Get Free Growth Blueprint") converted 3x more enterprise leads than generic "Read Full Article".'
  }
];

export default function ABTestingStudio({
  experiments = DEFAULT_EXPERIMENTS,
  onCreateExperiment,
  loading
}: ABTestingStudioProps) {
  const dataList = experiments.length > 0 ? experiments : DEFAULT_EXPERIMENTS;

  const [activeTestType, setActiveTestType] = useState<'Hooks' | 'Captions' | 'Images' | 'CTAs' | 'Posting Times'>('Hooks');
  const [showModal, setShowModal] = useState(false);

  // New Experiment Form
  const [topicTitle, setTopicTitle] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [varAHook, setVarAHook] = useState("Don't give up.");
  const [varBHook, setVarBHook] = useState("You're closer than you think.");
  const [varAContent, setVarAContent] = useState('Build your business daily without burning out.');
  const [varBContent, setVarBContent] = useState('You are one viral campaign away from massive growth.');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim()) return;

    try {
      await onCreateExperiment({
        topicTitle,
        platform,
        testType: activeTestType,
        status: 'running',
        confidenceScore: 88.5,
        aiRecommendationReason: 'Aura Copilot is dynamically routing impressions 50/50 across both variants to declare a statistically significant winner in 24 hours.',
        variantA: {
          id: 'v_a_' + Date.now(),
          label: 'Version A',
          hook: varAHook,
          content: varAContent,
          ctaText: 'Click Here',
          postingTime: '9:00 AM',
          engagementRate: 0,
          clickThroughRate: 0,
          conversions: 0
        },
        variantB: {
          id: 'v_b_' + Date.now(),
          label: 'Version B',
          hook: varBHook,
          content: varBContent,
          ctaText: 'Explore Now',
          postingTime: '6:00 PM',
          engagementRate: 0,
          clickThroughRate: 0,
          conversions: 0
        }
      });
      setShowModal(false);
      setTopicTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <TestTube2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                AI Autonomous A/B Split Testing Studio
              </h2>
              <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                Hooks • Captions • CTAs
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Test competing hooks, messaging angles, visual assets, and timing to double campaign conversion rates.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-2xs flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Split Test</span>
        </button>
      </div>

      {/* EXPERIMENTS LIST */}
      <div className="space-y-4">
        {dataList.map((exp) => (
          <div
            key={exp.id}
            className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {exp.platform}
                </span>
                <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                  Testing: {exp.testType}
                </span>
                <h3 className="text-sm font-bold text-slate-900 font-sans">{exp.topicTitle}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                  Confidence: {exp.confidenceScore}%
                </span>
                <span className="text-[10px] font-mono text-slate-500">{exp.createdDate}</span>
              </div>
            </div>

            {/* VARIANT A VS VARIANT B COMPARISON CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* VARIANT A */}
              <div className={`p-4 rounded-xl border space-y-3 relative ${
                exp.variantA.isWinner
                  ? 'bg-emerald-50/60 border-emerald-300 shadow-2xs'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {exp.variantA.label}
                  </span>
                  {exp.variantA.isWinner && (
                    <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
                      <Trophy className="w-3 h-3 text-white" /> WINNER (+112% Lift)
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Hook Tested:</span>
                  <p className="text-sm font-bold text-slate-900 font-sans">"{exp.variantA.hook}"</p>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                  {exp.variantA.content}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center font-mono">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-500 block uppercase font-sans">Engagement</span>
                    <strong className="text-xs text-blue-700 tabular-nums">{exp.variantA.engagementRate}%</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-500 block uppercase font-sans">CTR</span>
                    <strong className="text-xs text-slate-900 tabular-nums">{exp.variantA.clickThroughRate}%</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-500 block uppercase font-sans">Leads/Sales</span>
                    <strong className="text-xs text-emerald-700 tabular-nums">{exp.variantA.conversions}</strong>
                  </div>
                </div>
              </div>

              {/* VARIANT B */}
              <div className={`p-4 rounded-xl border space-y-3 relative ${
                exp.variantB.isWinner
                  ? 'bg-emerald-50/60 border-emerald-300 shadow-2xs'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {exp.variantB.label}
                  </span>
                  {exp.variantB.isWinner && (
                    <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
                      <Trophy className="w-3 h-3 text-white" /> WINNER (+112% Lift)
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Hook Tested:</span>
                  <p className="text-sm font-bold text-slate-900 font-sans">"{exp.variantB.hook}"</p>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                  {exp.variantB.content}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center font-mono">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-500 block uppercase font-sans">Engagement</span>
                    <strong className="text-xs text-blue-700 tabular-nums">{exp.variantB.engagementRate}%</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-500 block uppercase font-sans">CTR</span>
                    <strong className="text-xs text-slate-900 tabular-nums">{exp.variantB.clickThroughRate}%</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-500 block uppercase font-sans">Leads/Sales</span>
                    <strong className="text-xs text-emerald-700 tabular-nums">{exp.variantB.conversions}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* AI STRATEGIC WINNER DECISION BANNER */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-xs font-sans text-slate-800 leading-relaxed">
                <strong className="font-mono text-blue-700 uppercase">Aura Copilot Insight: </strong>
                {exp.aiRecommendationReason}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE EXPERIMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Setup AI Split Test</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Topic Title</label>
                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  placeholder="e.g. Founder Mindset Campaign Split Test"
                  className="w-full bg-white border border-slate-200 text-xs text-slate-900 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Version A Hook</label>
                  <input
                    type="text"
                    value={varAHook}
                    onChange={(e) => setVarAHook(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs text-slate-900 p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Version B Hook</label>
                  <input
                    type="text"
                    value={varBHook}
                    onChange={(e) => setVarBHook(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs text-slate-900 p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Start A/B Impression Test
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
