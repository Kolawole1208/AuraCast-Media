import React, { useState } from 'react';
import { TargetAudiencePersona, ContentPillar, WeeklyCampaignPlan, MarketingStrategy } from '../types';
import { 
  BrainCircuit, 
  Sparkles, 
  Zap, 
  Target, 
  Users, 
  Layers, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  Compass, 
  RefreshCw,
  MessageSquare,
  BarChart3,
  Flame,
  Globe
} from 'lucide-react';

interface StrategyEngineProps {
  strategy?: MarketingStrategy;
  onGenerateStrategy: (params: {
    brandDescription: string;
    goals: string[];
    targetAudience?: string;
    preferredPlatforms?: string[];
    postingFrequency?: string;
  }) => Promise<void>;
  onSparkTopic: (topic: string, channels: string[], toneGoal?: string) => Promise<void>;
  loading: boolean;
  activeConnectedChannels: string[];
}

const PRESET_EXAMPLES = [
  {
    label: "Christian Motivational & Growth Page",
    prompt: "I run a Christian motivational page targeting young Nigerians aged 18-32 with daily spiritual encouragement, career guidance, and mental discipline.",
    goals: ["Brand Awareness", "Community Engagement", "Leads & Growth"]
  },
  {
    label: "Creative Agency & Design Hub",
    prompt: "We are an elite digital branding agency providing UI/UX design, social video production, and visual storytelling for high-growth startups in Africa.",
    goals: ["Thought Leadership", "Leads & Sales", "Brand Awareness"]
  },
  {
    label: "E-commerce & Lifestyle Brand",
    prompt: "A modern African streetwear brand focusing on sustainable fashion, urban youth culture, and high-energy lifestyle storytelling.",
    goals: ["Brand Awareness", "Leads & Sales", "Community Engagement"]
  }
];

const AVAILABLE_GOALS = [
  "Brand Awareness",
  "Community Engagement",
  "Leads & Sales",
  "Thought Leadership",
  "Customer Retention",
  "Viral Organic Reach"
];

const ALL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'X / Twitter' },
  { id: 'youtube', label: 'YouTube Shorts' }
];

export default function StrategyEngine({
  strategy,
  onGenerateStrategy,
  onSparkTopic,
  loading,
  activeConnectedChannels
}: StrategyEngineProps) {
  const [brandInput, setBrandInput] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Brand Awareness', 'Community Engagement']);
  const [audienceInput, setAudienceInput] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'whatsapp', 'facebook']);
  const [frequencyInput, setFrequencyInput] = useState('5 Days / Week');
  const [isFormOpen, setIsFormOpen] = useState(!strategy);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'persona' | 'pillars'>('roadmap');
  const [sparkingTopic, setSparkingTopic] = useState<string | null>(null);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const togglePlatform = (platId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platId) ? prev.filter(p => p !== platId) : [...prev, platId]
    );
  };

  const handleApplyPreset = (preset: typeof PRESET_EXAMPLES[0]) => {
    setBrandInput(preset.prompt);
    setSelectedGoals(preset.goals);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandInput.trim()) return;

    await onGenerateStrategy({
      brandDescription: brandInput.trim(),
      goals: selectedGoals,
      targetAudience: audienceInput.trim() || undefined,
      preferredPlatforms: selectedPlatforms,
      postingFrequency: frequencyInput
    });

    setIsFormOpen(false);
  };

  const handleSparkClick = async (topic: string, channels: string[], toneGoal?: string) => {
    setSparkingTopic(topic);
    try {
      // Fallback to active connected channels or default
      const finalChannels = channels && channels.length > 0 
        ? channels 
        : activeConnectedChannels.length > 0 ? activeConnectedChannels : ['instagram', 'facebook'];
      await onSparkTopic(topic, finalChannels, toneGoal);
    } finally {
      setSparkingTopic(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                AI Marketing Strategy Engine
              </h2>
              <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded tracking-wider uppercase">
                30-Day Campaign Hub
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Plan → Create → Publish → Engage. Autonomous marketing strategy and 4-week roadmap generator.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="self-start sm:self-auto text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
        >
          {isFormOpen ? <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> : <Sparkles className="w-3.5 h-3.5 text-blue-600" />}
          {isFormOpen ? 'Close Generator Form' : strategy ? 'Refine / Generate New Strategy' : 'Build New Strategy'}
        </button>
      </div>

      {/* Generator Input Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Define Your Brand Vision & Audience</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Gemini AI CMO</span>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-wider block">
              Quick Preset Blueprints
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_EXAMPLES.map((pr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(pr)}
                  className="text-xs font-sans bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-left flex items-center gap-1.5 shadow-2xs"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{pr.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Prompt Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-semibold text-slate-700 uppercase tracking-wider block">
              Brand Description & Niche <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
              placeholder="e.g., I run a Christian motivational page targeting young Nigerians with daily faith encouragement, career wisdom, and mental growth tips..."
              rows={3}
              required
              className="w-full text-xs bg-white border border-slate-200 focus:border-blue-600 focus:outline-none rounded-xl p-3 text-slate-900 placeholder-slate-400 font-sans leading-relaxed shadow-2xs"
            />
          </div>

          {/* Primary Goals */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-semibold text-slate-700 uppercase tracking-wider block">
              Primary Marketing Objectives
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_GOALS.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`text-xs font-sans px-3 py-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
                    }`}
                  >
                    <Target className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{goal}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional details: Target Audience & Platforms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-semibold text-slate-700 uppercase tracking-wider block">
                Target Audience Details (Optional)
              </label>
              <input
                type="text"
                value={audienceInput}
                onChange={(e) => setAudienceInput(e.target.value)}
                placeholder="e.g. Gen Z & Millennials in Nigeria, UK & US Diaspora"
                className="w-full text-xs bg-white border border-slate-200 focus:border-blue-600 focus:outline-none rounded-xl px-3 py-2 text-slate-900 font-sans shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-semibold text-slate-700 uppercase tracking-wider block">
                Target Channels
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_PLATFORMS.map((pl) => {
                  const active = selectedPlatforms.includes(pl.id);
                  return (
                    <button
                      key={pl.id}
                      type="button"
                      onClick={() => togglePlatform(pl.id)}
                      className={`text-[10px] font-mono uppercase font-semibold px-2.5 py-1 rounded-lg border cursor-pointer transition-colors ${
                        active
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
                      }`}
                    >
                      {pl.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading || !brandInput.trim()}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 text-white animate-spin" />
                <span>Architecting 30-Day Marketing Strategy & Content Pillars...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate 30-Day AI Marketing Strategy & Campaign Roadmap</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Strategy Content Overview */}
      {strategy ? (
        <div className="space-y-6">
          {/* Active Strategy Header Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded uppercase">
                  Active Brand Blueprint
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Target Frequency: <strong className="text-slate-800">{strategy.postingFrequency}</strong>
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
                "{strategy.brandNameOrNiche}"
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {strategy.primaryGoals.map((g, i) => (
                  <span key={i} className="text-[10px] font-sans font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* View Mode Navigation Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'roadmap' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>4-Week Roadmap</span>
              </button>
              <button
                onClick={() => setActiveTab('persona')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'persona' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Audience Persona</span>
              </button>
              <button
                onClick={() => setActiveTab('pillars')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'pillars' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Pillars & Gap Analysis</span>
              </button>
            </div>
          </div>

          {/* TAB 1: 4-WEEK CAMPAIGN ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>30-Day Content Execution Roadmap (Week by Week)</span>
                </h4>
                <span className="text-[10px] text-slate-500 font-sans">
                  Click <span className="text-blue-700 font-bold">⚡ Spark Post</span> to send any topic directly into your workspace.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategy.weeklyPlan?.map((week) => (
                  <div key={week.weekNumber} className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Week {week.weekNumber}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {week.objective}
                        </span>
                      </div>

                      <h5 className="text-sm font-bold text-slate-900 font-sans leading-snug">
                        {week.theme}
                      </h5>

                      {/* Content pillars used */}
                      <div className="flex flex-wrap gap-1">
                        {week.contentPillars?.map((p, idx) => (
                          <span key={idx} className="text-[10px] font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                            #{p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actionable topics for this week */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-wider block">
                        Actionable Campaign Posts
                      </span>
                      {week.suggestedTopics?.map((top, idx) => {
                        const isSparkingThis = sparkingTopic === top.topic;
                        return (
                          <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                            <p className="text-xs text-slate-800 font-sans font-medium leading-relaxed">
                              "{top.topic}"
                            </p>

                            <div className="flex items-center justify-between gap-2 pt-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-semibold border border-blue-200">
                                  {top.format}
                                </span>
                                {top.suggestedChannels?.map((ch) => (
                                  <span key={ch} className="text-[9px] font-mono text-slate-500 uppercase font-semibold">
                                    • {ch}
                                  </span>
                                ))}
                              </div>

                              <button
                                onClick={() => handleSparkClick(top.topic, top.suggestedChannels, top.toneGoal)}
                                disabled={loading || isSparkingThis}
                                className="text-[10px] font-semibold text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 shrink-0 shadow-2xs"
                              >
                                {isSparkingThis ? (
                                  <RefreshCw className="w-3 h-3 text-white animate-spin" />
                                ) : (
                                  <Zap className="w-3 h-3 text-white" />
                                )}
                                <span>{isSparkingThis ? 'Sparking...' : 'Spark Post'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AUDIENCE PERSONA */}
          {activeTab === 'persona' && strategy.targetPersona && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">Target Customer Persona</h4>
                    <p className="text-sm font-bold text-slate-900 font-sans">{strategy.targetPersona.name}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-sans text-slate-700">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-mono">Age Demographic:</span>
                    <span className="font-semibold text-slate-900">{strategy.targetPersona.ageGroup}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-mono">Core Region:</span>
                    <span className="font-semibold text-slate-900">{strategy.targetPersona.location}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-wider block">
                    Preferred Channels
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {strategy.targetPersona.preferredPlatforms?.map((p, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-semibold uppercase">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-semibold text-rose-700 uppercase tracking-wider block">
                    Customer Pain Points
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-sans">
                    {strategy.targetPersona.painPoints?.map((pp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>{pp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 uppercase tracking-wider block">
                    Aspirations & Desired Outcomes
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-sans">
                    {strategy.targetPersona.aspirations?.map((asp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{asp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTENT PILLARS & GAP ANALYSIS */}
          {activeTab === 'pillars' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Content Pillars */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Strategic Content Pillars
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {strategy.contentPillars?.map((pil, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 font-sans">{pil.title}</span>
                          <span className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {pil.percentageAllocation}% Allocation
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-sans leading-relaxed">
                          {pil.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitor / Gap Analysis */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Competitor & Content Gap Advantage
                    </h4>
                  </div>

                  <p className="text-xs text-slate-700 font-sans leading-relaxed bg-white border border-slate-200 p-4 rounded-lg shadow-2xs">
                    {strategy.competitorGapAnalysis}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        !isFormOpen && (
          <div className="p-8 text-center text-xs text-slate-500 font-sans italic border border-dashed border-slate-200 rounded-xl bg-slate-50">
            No strategy defined yet. Click "Build New Strategy" above to generate your 30-day marketing plan.
          </div>
        )
      )}
    </div>
  );
}
