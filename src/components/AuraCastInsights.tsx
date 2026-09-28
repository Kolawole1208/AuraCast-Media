import React, { useState } from 'react';
import { AnalyticsIntelligence, PostPerformanceSummary } from '../types';
import {
  TrendingUp,
  BarChart3,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MousePointer,
  Sparkles,
  Zap,
  Award,
  AlertTriangle,
  Clock,
  Smartphone,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  BrainCircuit,
  Filter,
  Lightbulb
} from 'lucide-react';

interface AuraCastInsightsProps {
  analytics?: AnalyticsIntelligence;
  onRefreshAnalytics: () => Promise<void>;
  loading: boolean;
}

const DEFAULT_ANALYTICS_SEED: AnalyticsIntelligence = {
  lastUpdated: new Date().toISOString(),
  metrics: {
    totalFollowers: 24850,
    followersNetGain: 3420,
    followersGrowthPercent: 15.9,
    engagementRate: 6.4,
    likes: 18420,
    comments: 2980,
    shares: 4150,
    saves: 3890,
    reach: 128400,
    impressions: 340200,
    clicks: 5210
  },
  bestPlatform: 'Instagram Reels & Stories',
  bestPostingTime: '7:00 PM – 9:00 PM GMT+1',
  aiInsights: [
    {
      id: 'insight_1',
      type: 'insight',
      title: 'Motivational vs. Educational Performance',
      observation: 'Your motivational posts received 42% more engagement than educational posts.',
      actionableRecommendation: 'Increase weekly motivational quotes and reel hooks from 2 → 4 posts.',
      impactScore: 'High'
    },
    {
      id: 'insight_2',
      type: 'insight',
      title: 'Platform Visual Affinity',
      observation: 'Instagram performs 3.2x better for your high-contrast visual graphic cards than Twitter.',
      actionableRecommendation: 'Auto-convert text posts into Instagram carousel image slides.',
      impactScore: 'High'
    },
    {
      id: 'insight_3',
      type: 'insight',
      title: 'Optimal Evening Audience Peak',
      observation: 'Posts published between 7–9 PM have 68% higher initial comment volume.',
      actionableRecommendation: 'Schedule your top-priority video posts exclusively in the 7–9 PM time slot.',
      impactScore: 'Critical'
    }
  ],
  recommendations: [
    'Next week, increase motivational content allocation from 2 → 4 posts.',
    'Repurpose top 3 text quotes into short vertical Reels with background music.',
    'Add a direct comment keyword CTA ("Comment RESET below") to double share rate.'
  ],
  bestPerformingPosts: [
    {
      id: 'post_top_1',
      title: '3 Morning Habits of High Performers',
      platform: 'Instagram Reel',
      engagementRate: 9.8,
      likes: 4210,
      comments: 680,
      shares: 1240,
      saves: 1100,
      postedAt: '3 days ago',
      contentType: 'Short Video Reel'
    },
    {
      id: 'post_top_2',
      title: 'Stop Overthinking Your Next Big Move',
      platform: 'Instagram / Twitter',
      engagementRate: 8.4,
      likes: 3100,
      comments: 420,
      shares: 980,
      saves: 850,
      postedAt: '5 days ago',
      contentType: 'Quote Graphic'
    }
  ],
  worstPerformingPosts: [
    {
      id: 'post_low_1',
      title: 'Comprehensive Q3 Social Media Industry Report',
      platform: 'Facebook Feed',
      engagementRate: 1.8,
      likes: 120,
      comments: 14,
      shares: 8,
      saves: 12,
      postedAt: '1 week ago',
      contentType: 'Long Text Article'
    }
  ],
  platformBreakdown: [
    { platform: 'Instagram', followers: 12400, engagementRate: 7.8, totalPosts: 42, topPostingTime: '8:00 PM' },
    { platform: 'TikTok', followers: 6800, engagementRate: 8.2, totalPosts: 28, topPostingTime: '7:30 PM' },
    { platform: 'Twitter / X', followers: 3200, engagementRate: 4.1, totalPosts: 65, topPostingTime: '12:00 PM' },
    { platform: 'Facebook', followers: 1600, engagementRate: 2.3, totalPosts: 18, topPostingTime: '6:00 PM' },
    { platform: 'YouTube Shorts', followers: 850, engagementRate: 6.9, totalPosts: 12, topPostingTime: '9:00 PM' }
  ]
};

export default function AuraCastInsights({
  analytics = DEFAULT_ANALYTICS_SEED,
  onRefreshAnalytics,
  loading
}: AuraCastInsightsProps) {
  const [appliedRecIdx, setAppliedRecIdx] = useState<number | null>(null);

  const data = analytics || DEFAULT_ANALYTICS_SEED;

  const handleApplyRec = (idx: number) => {
    setAppliedRecIdx(idx);
    setTimeout(() => setAppliedRecIdx(null), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                AuraCast Analytics & AI Performance Intelligence
              </h2>
              <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1">
                <BrainCircuit className="w-2.5 h-2.5 text-blue-600" />
                Live Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Real-time multi-channel reach, engagement, conversion ROI, and strategic AI optimization directives.
            </p>
          </div>
        </div>

        <button
          onClick={onRefreshAnalytics}
          disabled={loading}
          className="bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs px-3.5 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Intelligence</span>
        </button>
      </div>

      {/* TOP KEY PERFORMANCE INDICATORS GRID (KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Followers Growth */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-mono uppercase font-semibold">Followers</span>
            <Users className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
            {data.metrics.totalFollowers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700">
            <ArrowUpRight className="w-3 h-3" />
            <span>+{data.metrics.followersGrowthPercent}% ({data.metrics.followersNetGain})</span>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-mono uppercase font-semibold">Engagement</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg font-bold text-blue-700 font-mono tabular-nums">
            {data.metrics.engagementRate}%
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Baseline: 2.4%
          </div>
        </div>

        {/* Reach */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-mono uppercase font-semibold">Total Reach</span>
            <Eye className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
            {(data.metrics.reach / 1000).toFixed(1)}k
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            {(data.metrics.impressions / 1000).toFixed(1)}k Impr
          </div>
        </div>

        {/* Likes & Comments */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-mono uppercase font-semibold">Interactions</span>
            <Heart className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
            {(data.metrics.likes + data.metrics.comments).toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            {data.metrics.comments} Comments
          </div>
        </div>

        {/* Shares & Saves */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-mono uppercase font-semibold">Shares & Saves</span>
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg font-bold text-emerald-700 font-mono tabular-nums">
            {(data.metrics.shares + data.metrics.saves).toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            {data.metrics.saves} Bookmarks
          </div>
        </div>

        {/* Link Clicks */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-mono uppercase font-semibold">Link Clicks</span>
            <MousePointer className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
            {data.metrics.clicks.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Direct Inbound
          </div>
        </div>
      </div>

      {/* QUICK INSIGHT HIGHLIGHTS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold text-blue-700 uppercase tracking-wider block">
              🏆 Top Performing Channel
            </span>
            <p className="text-sm font-bold text-slate-900 font-sans">
              {data.bestPlatform}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-200/80 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-wider block">
              ⏰ Peak Engagement Posting Window
            </span>
            <p className="text-sm font-bold text-slate-900 font-sans">
              {data.bestPostingTime}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN 🧠 AI INTELLIGENCE & RECOMMENDATIONS BOARD */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4 text-blue-600" />
            <span>AI Strategic Insights & Recommendations</span>
          </div>
          <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded">
            Real-Time Analysis
          </span>
        </div>

        {/* AI INSIGHT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.aiInsights?.map((ins, idx) => (
            <div
              key={ins.id || idx}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    {ins.title}
                  </span>
                  <span className="text-[9px] font-mono font-semibold bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                    Score: {ins.impactScore}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-800 leading-relaxed font-sans bg-white p-2.5 rounded-lg border border-slate-200">
                  "{ins.observation}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1 mt-2">
                <span className="text-[10px] font-mono font-semibold text-blue-700 block">
                  ⚡ Recommendation:
                </span>
                <p className="text-xs text-slate-600 font-sans">
                  {ins.actionableRecommendation}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* AI ACTIONABLE RECOMMENDATION EXPLICIT BANNER */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Next Strategic Optimization Directive:</span>
            </div>
            <p className="text-xs text-slate-700 font-medium font-sans">
              "Next week, increase high-converting video and carousel allocation from <strong>2 → 4 posts</strong>."
            </p>
          </div>

          <button
            onClick={() => handleApplyRec(0)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            {appliedRecIdx === 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Directive Applied!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Apply Strategy Directive</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* BEST PERFORMING VS. WORST PERFORMING POSTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BEST PERFORMING POSTS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>🔥 Top-Performing Posts</span>
          </div>

          <div className="space-y-2.5">
            {data.bestPerformingPosts?.map((post) => (
              <div
                key={post.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 font-sans">{post.title}</span>
                  <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {post.engagementRate}% ER
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>{post.platform} • {post.contentType}</span>
                  <div className="flex items-center gap-3 text-slate-700">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>🔄 {post.shares}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WORST PERFORMING POSTS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>⚠️ Low Engagement Diagnosis</span>
          </div>

          <div className="space-y-2.5">
            {data.worstPerformingPosts?.map((post) => (
              <div
                key={post.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 font-sans">{post.title}</span>
                  <span className="text-[10px] font-mono font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {post.engagementRate}% ER
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>{post.platform} • {post.contentType}</span>
                  <div className="flex items-center gap-3 text-slate-700">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>🔄 {post.shares}</span>
                  </div>
                </div>

                <p className="text-xs font-sans text-slate-700 bg-amber-50/60 p-2 rounded-lg border border-amber-200">
                  💡 <strong>Diagnosis:</strong> Dense long text underperformed. Convert key takeaways into a 3-slide visual carousel or short reel script.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PLATFORM BREAKDOWN TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
        <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block pb-2 border-b border-slate-100">
          📊 Platform Performance Breakdown
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 font-sans">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-mono text-slate-500 uppercase bg-slate-50/50">
                <th className="py-2.5 px-3">Platform</th>
                <th className="py-2.5 px-3">Followers</th>
                <th className="py-2.5 px-3">Avg Engagement</th>
                <th className="py-2.5 px-3">Published Posts</th>
                <th className="py-2.5 px-3">Peak Posting Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.platformBreakdown?.map((plat, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">{plat.platform}</td>
                  <td className="py-3 px-3 font-mono tabular-nums">{plat.followers.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-700 tabular-nums">{plat.engagementRate}%</td>
                  <td className="py-3 px-3 font-mono tabular-nums">{plat.totalPosts} posts</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{plat.topPostingTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
