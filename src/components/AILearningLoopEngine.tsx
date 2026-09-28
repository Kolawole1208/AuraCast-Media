import React, { useState } from 'react';
import { AILearningLoopData, LearnedRule } from '../types';
import {
  RotateCw,
  BrainCircuit,
  Sparkles,
  Zap,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  Layers,
  Target,
  Hash,
  Clock,
  Smartphone,
  Flame,
  Award,
  Shield,
  ArrowRight,
  Database,
  Sliders,
  Cpu,
  BarChart2
} from 'lucide-react';

interface AILearningLoopEngineProps {
  learningData?: AILearningLoopData;
  onRunLearningCycle: () => Promise<void>;
  loading: boolean;
}

const DEFAULT_LEARNING_SEED: AILearningLoopData = {
  totalAnalyzedPosts: 128,
  learningModelVersion: 'v3.8-Enterprise',
  optimizationLevelPercent: 94.6,
  flywheelCycleCount: 14,
  lastTrainedAt: new Date().toISOString(),
  winningTopics: [
    'Workflow Automation & Scalable Marketing Systems',
    'AI Content Strategy vs. Manual Editing Bottlenecks',
    'Data-Driven Audience Engagement & Conversion'
  ],
  winningHooks: [
    'Stop wasting 10 hours creating social content manually every week.',
    '3 non-negotiable systems top teams use to scale reach...',
    'If your engagement dropped this month, check this diagnostic...'
  ],
  winningHashtags: [
    '#MarketingAutomation',
    '#AuraCastOS',
    '#ContentStrategy',
    '#SocialOperations',
    '#GrowthEngine'
  ],
  optimalTimes: [
    '7:00 PM – 9:00 PM EST (Evening Peak)',
    '12:00 PM – 1:00 PM EST (Lunchtime Activity Window)'
  ],
  learnedRules: [
    {
      id: 'rule_1',
      category: 'platforms',
      title: 'Facebook Page Caption Structure',
      pattern: 'Direct Facebook Page posts with 2-3 line structured captions outperform link-only posts.',
      confidenceScore: 96,
      liftPercent: 42
    },
    {
      id: 'rule_2',
      category: 'visuals',
      title: 'Instagram Visual Carousels',
      pattern: 'Carousel posts with 4-5 slides yield 2.8x higher save rates than single image posts on Instagram.',
      confidenceScore: 92,
      liftPercent: 38
    },
    {
      id: 'rule_3',
      category: 'posting_times',
      title: 'Evening Peak Hour Alignment',
      pattern: 'Posts published during 7:00 - 9:00 PM EST receive 54% higher initial engagement velocity.',
      confidenceScore: 94,
      liftPercent: 31
    }
  ]
};

const FLYWHEEL_STEPS = [
  { id: '1', title: '1. Generate', icon: Sparkles, desc: 'AI creates brand-aligned content' },
  { id: '2', title: '2. Publish', icon: Zap, desc: 'Direct multi-channel distribution' },
  { id: '3', title: '3. Measure', icon: BarChart2, desc: 'Real-time engagement telemetry' },
  { id: '4', title: '4. Learn', icon: BrainCircuit, desc: 'Gemini pattern recognition engine' },
  { id: '5', title: '5. Improve', icon: TrendingUp, desc: 'Automated prompt tuning & rule updating' }
];

export default function AILearningLoopEngine({
  learningData = DEFAULT_LEARNING_SEED,
  onRunLearningCycle,
  loading
}: AILearningLoopEngineProps) {
  const [activeTab, setActiveTab] = useState<'rules' | 'patterns'>('rules');
  const [cycleSuccess, setCycleSuccess] = useState(false);

  const data = learningData || DEFAULT_LEARNING_SEED;

  const handleRunCycle = async () => {
    await onRunLearningCycle();
    setCycleSuccess(true);
    setTimeout(() => setCycleSuccess(false), 3500);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
            <RotateCw className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Self-Improving AI Learning Engine
              </h2>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                FLYWHEEL ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Continuous optimization loop: Generate → Publish → Measure → Learn → Improve.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunCycle}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 shadow-2xs disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing Posts & Updating Rules...</span>
            </>
          ) : cycleSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Rules Updated!</span>
            </>
          ) : (
            <>
              <Cpu className="w-4 h-4 text-white" />
              <span>Run Learning Cycle</span>
            </>
          )}
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-0.5">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-semibold uppercase">
            <span>Posts Analyzed</span>
            <Database className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {data.totalAnalyzedPosts} Posts
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">100% Ingested</div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-0.5">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-semibold uppercase">
            <span>Model Precision</span>
            <Target className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {data.optimizationLevelPercent}%
          </div>
          <div className="text-[10px] text-slate-500 font-medium">{data.learningModelVersion}</div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-0.5">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-semibold uppercase">
            <span>Optimization Cycles</span>
            <RotateCw className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">
            Cycle #{data.flywheelCycleCount}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Auto-Trained</div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-0.5">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-semibold uppercase">
            <span>Active Rules</span>
            <Award className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {data.learnedRules.length} Enforced
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">Avg +42% ER Lift</div>
        </div>
      </div>

      {/* FLYWHEEL PIPELINE */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <RotateCw className="w-4 h-4 text-blue-600" />
            Continuous Growth Architecture
          </span>
          <span className="text-[10px] font-semibold bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
            Closed-Loop
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {FLYWHEEL_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 relative flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {idx < FLYWHEEL_STEPS.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 hidden sm:block absolute -right-2 top-3.5 z-10" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-900">{step.title}</h4>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-snug">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LEARNED RULES GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            Enforced AI Strategy Rules
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('rules')}
              className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'rules'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Learned Rules
            </button>
            <button
              onClick={() => setActiveTab('patterns')}
              className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'patterns'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Winning Patterns
            </button>
          </div>
        </div>

        {activeTab === 'rules' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.learnedRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    Confidence: {rule.confidenceScore}%
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    +{rule.liftPercent}% Lift
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900">{rule.title}</h5>
                <p className="text-xs text-slate-700 leading-snug">
                  "{rule.pattern}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-2">
              <h4 className="text-xs font-semibold text-slate-900 uppercase">Top Converting Hooks</h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {data.winningHooks.map((hk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>"{hk}"</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-2">
              <h4 className="text-xs font-semibold text-slate-900 uppercase">Optimal Posting Windows</h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {data.optimalTimes.map((tm, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{tm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
