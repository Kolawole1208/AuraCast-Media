import React, { useState } from 'react';
import { AutonomousCampaign, CampaignPost } from '../types';
import WorkflowPipelineHeader from './WorkflowPipelineHeader';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Send,
  RefreshCw,
  Edit3,
  Video,
  Image as ImageIcon,
  Hash,
  ArrowRight,
  Zap,
  Globe,
  Tag,
  Clock,
  ThumbsUp,
  MessageSquare,
  Play,
  Film,
  X,
  Share2
} from 'lucide-react';

interface AutonomousCampaignBuilderProps {
  campaign?: AutonomousCampaign;
  onGenerateCampaign: (params: { prompt: string; durationDays: number }) => Promise<void>;
  onApproveCampaign: (campaignId: string, postIds?: string[]) => Promise<void>;
  loading: boolean;
}

const PRESET_PROMPTS = [
  {
    title: '🍽️ 14-Day Restaurant Grand Opening',
    prompt: 'Create a 14-day campaign to promote my new restaurant launch with daily food teasers, chef stories, special menu perks, and booking CTAs.'
  },
  {
    title: '🚀 7-Day SaaS Product Launch Sprint',
    prompt: 'Create a 7-day hype campaign to launch our new AI productivity tool targeting tech founders and remote workers.'
  },
  {
    title: '🔥 30-Day Brand Growth & Lead Engine',
    prompt: 'Build a 30-day comprehensive brand awareness and lead generation campaign for a premium fitness coaching business.'
  },
  {
    title: '📱 14-Day Mobile App Downloads Boost',
    prompt: 'Create a 14-day viral campaign focused on driving user downloads and app signups for a personal finance app.'
  }
];

const PLATFORM_ICONS: Record<string, { label: string; color: string }> = {
  instagram: { label: 'Instagram', color: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white' },
  whatsapp: { label: 'WhatsApp', color: 'bg-emerald-600 text-white' },
  facebook: { label: 'Facebook', color: 'bg-blue-600 text-white' },
  twitter: { label: 'Twitter / X', color: 'bg-slate-800 text-white' },
  youtube: { label: 'YouTube', color: 'bg-red-600 text-white' }
};

export default function AutonomousCampaignBuilder({
  campaign,
  onGenerateCampaign,
  onApproveCampaign,
  loading
}: AutonomousCampaignBuilderProps) {
  const [promptInput, setPromptInput] = useState<string>('Create a 14-day campaign to promote my new restaurant.');
  const [durationDays, setDurationDays] = useState<number>(14);
  const [activePlatformTab, setActivePlatformTab] = useState<Record<string, string>>({});
  const [editingPost, setEditingPost] = useState<CampaignPost | null>(null);
  const [approvedPostIds, setApprovedPostIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'image' | 'approved'>('all');

  const handleRunBuilder = async () => {
    if (!promptInput.trim()) return;
    await onGenerateCampaign({ prompt: promptInput, durationDays });
  };

  const handleApproveAll = async () => {
    if (campaign) {
      await onApproveCampaign(campaign.id);
    }
  };

  const handleApproveSingle = (postId: string) => {
    setApprovedPostIds(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handleSelectPreset = (presetPrompt: string) => {
    setPromptInput(presetPrompt);
    if (presetPrompt.includes('7-day')) setDurationDays(7);
    else if (presetPrompt.includes('14-day')) setDurationDays(14);
    else if (presetPrompt.includes('30-day')) setDurationDays(30);
  };

  const setPostPlatformTab = (postId: string, platformKey: string) => {
    setActivePlatformTab(prev => ({ ...prev, [postId]: platformKey }));
  };

  // Filter posts
  const filteredPosts = campaign?.posts?.filter(p => {
    if (activeFilter === 'video') return p.contentType === 'Short Video Reel';
    if (activeFilter === 'image') return p.contentType === 'Image Post' || p.contentType === 'Carousel';
    if (activeFilter === 'approved') return approvedPostIds.includes(p.id) || p.status === 'approved';
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      <WorkflowPipelineHeader campaignTitle={campaign?.campaignName} currentStage={campaign ? 'review' : 'generate'} />
      
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                AI Autonomous Campaign Builder
              </h2>
              <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-blue-600" />
                AI Marketing Employee
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Turn 1 simple prompt into a complete, ready-to-deploy multi-day campaign with video scripts, captions, and schedules.
            </p>
          </div>
        </div>

        {campaign && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPromptInput('');
              }}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>New Campaign</span>
            </button>
          </div>
        )}
      </div>

      {/* PROMPT & INPUT HUB (Shown when creating or tweaking) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Describe Your Marketing Campaign Objective</span>
          </label>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Duration:</span>
            {[7, 14, 21, 30].map(days => (
              <button
                key={days}
                onClick={() => setDurationDays(days)}
                className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                  durationDays === days
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="e.g., Create a 14-day campaign to promote my Christian motivational community and attract dedicated young professionals..."
            rows={3}
            className="w-full bg-white border border-slate-200 focus:border-blue-600 text-slate-900 placeholder-slate-400 rounded-xl p-3.5 text-xs font-sans focus:outline-none transition-colors leading-relaxed"
          />
          <button
            onClick={handleRunBuilder}
            disabled={loading || !promptInput.trim()}
            className="mt-3 w-full sm:w-auto sm:absolute sm:bottom-3 sm:right-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>AI Employee Building Campaign...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 text-white" />
                <span>Generate {durationDays}-Day Autonomous Campaign</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
            ⚡ Recommended Campaign Presets:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(p.prompt)}
                className="text-left bg-white hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 p-2.5 rounded-lg transition-colors cursor-pointer group space-y-1 shadow-2xs"
              >
                <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {p.title}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 font-sans">
                  {p.prompt}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CAMPAIGN REVIEW SCREEN */}
      {campaign && (
        <div className="space-y-6 pt-2 animate-fadeIn">
          {/* Campaign Overview Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                    Active Plan
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {campaign.id}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-sans mt-1">
                  {campaign.campaignName}
                </h3>
              </div>

              {/* TOP ACTION BUTTONS: Approve All | Edit | Regenerate */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleApproveAll}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Approve All {campaign.posts?.length || durationDays} Posts</span>
                </button>

                <button
                  onClick={handleRunBuilder}
                  disabled={loading}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {/* Campaign Core Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                  🎯 Campaign Objective
                </span>
                <p className="text-slate-800 font-sans font-medium">
                  {campaign.objective}
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                  👥 Target Audience
                </span>
                <p className="text-slate-800 font-sans font-medium line-clamp-2">
                  {campaign.audience}
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                  📌 Content Pillars
                </span>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {campaign.contentPillars?.map((pillar, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                    >
                      {pillar}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* POSTS REVIEW STREAM HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 font-sans">
                Review Campaign ({campaign.posts?.length || 0} Daily Posts Generated)
              </h3>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                Auto-Mapped to Calendar
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeFilter === 'all' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Posts ({campaign.posts?.length})
              </button>
              <button
                onClick={() => setActiveFilter('video')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeFilter === 'video' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reels & Videos
              </button>
              <button
                onClick={() => setActiveFilter('image')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeFilter === 'image' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Images
              </button>
            </div>
          </div>

          {/* POST CARDS STREAM */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isApproved = approvedPostIds.includes(post.id) || post.status === 'approved';
              const activePlatform = activePlatformTab[post.id] || 'instagram';
              const activeVariationText = post.platformVariations?.[activePlatform] || post.caption;

              return (
                <div
                  key={post.id}
                  className={`bg-white border rounded-xl p-5 space-y-4 transition-colors shadow-2xs ${
                    isApproved
                      ? 'border-emerald-300 bg-emerald-50/15'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                        Day {post.dayNumber}
                      </span>
                      <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {post.date} @ {post.scheduledTime || '09:30 AM'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold uppercase">
                        {post.contentType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveSingle(post.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isApproved ? 'Approved' : 'Approve Post'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Topic Title */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-sans">
                      "{post.topic}"
                    </h4>
                    {post.contentPillar && (
                      <span className="text-xs font-mono text-slate-500 mt-0.5 block">
                        Pillar: <strong className="text-slate-700">{post.contentPillar}</strong>
                      </span>
                    )}
                  </div>

                  {/* Caption & Hashtags Box */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                    <p className="text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-line">
                      {post.caption}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.hashtags?.map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-blue-700 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Short-Video Reel Storyboard (If Reel or Video) */}
                  {post.shortVideoIdea && (
                    <div className="bg-blue-50/50 border border-blue-200 p-4 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-semibold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-blue-600" />
                          <span>Short-Video Reel Storyboard & Hook</span>
                        </span>
                        <span className="text-[10px] font-mono text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                          15-30s Short Reel
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase block">
                            🎣 Opening Hook (0-3s):
                          </span>
                          <p className="text-slate-800 font-medium italic">
                            "{post.shortVideoIdea.hook}"
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase block">
                            🎵 Trending Audio Suggestion:
                          </span>
                          <p className="text-slate-700 font-mono text-[11px]">
                            {post.shortVideoIdea.audioSuggestion}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-blue-200/80">
                        <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase block">
                          🎬 Visual Scene Breakdown:
                        </span>
                        <p className="text-xs text-slate-700 font-sans">
                          {post.shortVideoIdea.sceneDescription}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Visual Image Prompt Box */}
                  {post.imagePrompt && (
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-0.5 flex-1">
                        <span className="text-[10px] font-mono font-semibold text-slate-600 uppercase flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-blue-600" />
                          <span>AI Image / Graphic Generation Prompt</span>
                        </span>
                        <p className="text-xs text-slate-700 font-sans italic">
                          "{post.imagePrompt}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Platform Variations Tabs */}
                  {post.platformVariations && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">
                          Platform Tailored Variations:
                        </span>
                        <div className="flex items-center gap-1">
                          {Object.keys(post.platformVariations).map((platKey) => {
                            const plat = PLATFORM_ICONS[platKey];
                            const isActive = activePlatform === platKey;

                            return (
                              <button
                                key={platKey}
                                onClick={() => setPostPlatformTab(post.id, platKey)}
                                className={`text-[10px] font-medium px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                  isActive
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                                    : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                                }`}
                              >
                                {plat ? plat.label : platKey}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs text-slate-700 font-sans italic">
                        {activeVariationText}
                      </div>
                    </div>
                  )}

                  {/* CTA Footer */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-mono text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                      CTA: {post.callToAction}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
