import React from 'react';
import { CompetitorIntelligenceData, CompetitorProfile } from '../types';
import {
  LineChart,
  Users,
  Target,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Eye,
  CheckCircle2,
  Award,
  ShieldAlert
} from 'lucide-react';

interface CompetitorIntelligenceProps {
  competitorData?: CompetitorIntelligenceData;
  onAddCompetitor?: (name: string, handle: string, platform: string) => void;
}

const DEFAULT_COMPETITOR_DATA: CompetitorIntelligenceData = {
  trackedCompetitors: [
    {
      id: 'comp_1',
      name: 'MediaFlow Global',
      handle: '@mediaflow_app',
      platform: 'Instagram & TikTok',
      followerCount: '142,000',
      postingFrequency: '4 posts/day',
      topContentType: 'Vertical Short Videos (Reels)',
      avgEngagementRate: 6.8,
      popularPostsCount: 48,
      aiOpportunityAlerts: [
        'Receiving 3.2x higher engagement on short-form video than image carousels.',
        'Audience asking repeatedly for pricing transparency in post comments.'
      ]
    },
    {
      id: 'comp_2',
      name: 'ContentPulse AI',
      handle: '@contentpulse_ai',
      platform: 'LinkedIn & Twitter',
      followerCount: '89,500',
      postingFrequency: '2 posts/day',
      topContentType: 'Text Articles & Polls',
      avgEngagementRate: 4.2,
      popularPostsCount: 22,
      aiOpportunityAlerts: [
        'Lacks active Instagram Reel presence — major market void for vertical video.',
        'High comment activity on workflow automation templates.'
      ]
    }
  ],
  aiStrategicInsights: [
    'Competitor A (@mediaflow_app) is receiving significantly higher engagement on short-form video reels.',
    'Competitor B (@contentpulse_ai) posts consistently at 9:00 AM EST, leaving evening peak hours (7:00 PM - 9:00 PM) open for audience capture.',
    'Audience sentiment reveals 38% dissatisfaction with competitor onboarding speed.'
  ],
  unclaimedOpportunities: [
    'Publish 3 vertical video shorts per week comparing AI speed vs manual editing.',
    'Offer an downloadable "Enterprise Brand Kit Template" in caption link.',
    'Target the evening 8:00 PM posting window when competitor posting drops by 70%.',
    'Host a bi-weekly LinkedIn Live Q&A session addressing customer pain points.',
    'Leverage interactive poll questions on YouTube Community posts for instant audience feedback.'
  ]
};

export default function CompetitorIntelligence({
  competitorData = DEFAULT_COMPETITOR_DATA
}: CompetitorIntelligenceProps) {
  const data = competitorData || DEFAULT_COMPETITOR_DATA;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
            <LineChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Competitor Intelligence & Market Benchmark Matrix
              </h2>
              <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded uppercase">
                2 Competitors Monitored
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Track competitor posting cadence, top formats, audience engagement gaps, and strategic market opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* AI STRATEGIC WARNING BANNER */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Aura Copilot Strategic Intelligence Insight</span>
        </div>

        <ul className="space-y-1.5 text-xs text-slate-700 font-sans pl-2">
          {data.aiStrategicInsights.map((insight, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* TRACKED COMPETITORS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.trackedCompetitors.map((comp) => (
          <div
            key={comp.id}
            className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-sans">{comp.name}</h3>
                <span className="text-xs font-mono text-blue-700">{comp.handle} • {comp.platform}</span>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded block">
                  {comp.avgEngagementRate}% Avg Eng.
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-0.5 block">{comp.followerCount} Followers</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Posting Frequency</span>
                <strong className="text-slate-800">{comp.postingFrequency}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Top Format</span>
                <strong className="text-blue-700">{comp.topContentType}</strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-semibold text-slate-600 uppercase block">Observed Audience Gaps:</span>
              <div className="space-y-1">
                {comp.aiOpportunityAlerts.map((alert, i) => (
                  <div key={i} className="text-xs text-amber-900 bg-amber-50 border border-amber-200 p-2 rounded-lg font-sans">
                    💡 {alert}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5 UNCLAIMED BRAND OPPORTUNITIES */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase">
          <Target className="w-4 h-4 text-blue-600" />
          <span>5 Growth Opportunities Your Brand Isn't Currently Utilizing</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.unclaimedOpportunities.map((opp, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 space-y-1 shadow-2xs">
              <span className="text-[10px] font-mono font-semibold text-blue-700 uppercase block">Opportunity #{idx + 1}</span>
              <p className="text-xs text-slate-700 font-sans leading-relaxed">{opp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
