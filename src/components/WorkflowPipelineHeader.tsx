import React from 'react';
import { Sparkles, CheckCircle2, Share2, BarChart3, Layers } from 'lucide-react';

interface WorkflowPipelineHeaderProps {
  currentStage?: 'generate' | 'review' | 'publish' | 'analyze';
  campaignTitle?: string;
}

export default function WorkflowPipelineHeader({
  currentStage = 'review',
  campaignTitle
}: WorkflowPipelineHeaderProps) {
  const stages = [
    { id: 'generate', name: '1. Topic & Generation', icon: Sparkles, desc: 'AI Captions & Graphic Assets' },
    { id: 'review', name: '2. Review & Edit', icon: CheckCircle2, desc: 'Quality Check & Formatting' },
    { id: 'publish', name: '3. Facebook Publishing', icon: Share2, desc: 'Facebook Page Dispatch' },
    { id: 'analyze', name: '4. Activity & Analytics', icon: BarChart3, desc: 'Post Confirmation & Logs' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-700 font-mono text-[10px] font-bold uppercase tracking-wider">
              AuraCast Publishing Pipeline
            </span>
            <span className="text-xs text-slate-500 font-sans">Topic → AI Content → Review → Facebook Page</span>
          </div>
          {campaignTitle && (
            <h2 className="text-xs md:text-sm font-semibold text-slate-900 mt-1 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Active Topic: <span className="text-slate-700 font-normal">"{campaignTitle}"</span>
            </h2>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Facebook Page Connection</span>
        </div>
      </div>

      {/* Clean Pipeline Step Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = currentStage === stage.id;
          const isPast = (
            (currentStage === 'review' && idx === 0) ||
            (currentStage === 'publish' && idx <= 1) ||
            (currentStage === 'analyze' && idx <= 2)
          );

          return (
            <div
              key={stage.id}
              className={`p-3 rounded-lg border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-50 border-blue-200 text-blue-950 shadow-2xs'
                  : isPast
                  ? 'bg-emerald-50/60 border-emerald-200/80 text-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-mono font-semibold tracking-tight uppercase ${
                  isActive ? 'text-blue-700' : isPast ? 'text-emerald-700' : 'text-slate-400'
                }`}>
                  {stage.name}
                </span>
                <Icon className={`w-3.5 h-3.5 ${
                  isActive ? 'text-blue-600' : isPast ? 'text-emerald-600' : 'text-slate-400'
                }`} />
              </div>
              <p className="text-[11px] font-sans font-medium text-slate-600 truncate">
                {stage.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}


