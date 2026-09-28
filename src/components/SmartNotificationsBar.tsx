import React, { useState } from 'react';
import { SmartNotification } from '../types';
import {
  Bell,
  Flame,
  AlertTriangle,
  Target,
  Sparkles,
  CheckCircle2,
  X,
  ChevronRight,
  Clock
} from 'lucide-react';

interface SmartNotificationsBarProps {
  notifications?: SmartNotification[];
  onDismissNotification?: (id: string) => void;
}

const DEFAULT_NOTIFICATIONS: SmartNotification[] = [
  {
    id: 'notif_1',
    type: 'viral_performance',
    title: 'Post Velocity Spike Detected',
    message: '🔥 Your latest Instagram Reel post is performing 84% above average engagement benchmarks.',
    timestamp: '10 mins ago',
    isRead: false,
    metricBadge: '+84% Performance'
  },
  {
    id: 'notif_2',
    type: 'timing_recommendation',
    title: 'Optimal Audience Window',
    message: '🎯 Your target audience is most active at 8:00 PM today on LinkedIn & TikTok.',
    timestamp: '1 hour ago',
    isRead: false,
    metricBadge: 'Peak Activity'
  },
  {
    id: 'notif_3',
    type: 'warning',
    title: 'Channel Health Alert',
    message: '⚠️ Your Instagram engagement dropped 21% this week due to lower posting frequency.',
    timestamp: '3 hours ago',
    isRead: false,
    metricBadge: '-21% Engagement'
  },
  {
    id: 'notif_4',
    type: 'ai_insight',
    title: 'Campaign Dispatch Prompt',
    message: '💡 AuraCast recommends posting your "Q4 Founders Mindset" campaign now for maximum viral reach.',
    timestamp: '4 hours ago',
    isRead: false,
    metricBadge: 'Action Ready'
  }
];

export default function SmartNotificationsBar({
  notifications = DEFAULT_NOTIFICATIONS
}: SmartNotificationsBarProps) {
  const [items, setItems] = useState<SmartNotification[]>(notifications);

  const handleDismiss = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            AuraCast Real-Time AI Intelligence Alerts ({items.length})
          </h3>
        </div>

        <span className="text-[10px] font-mono text-slate-400">
          Auto-optimizing channel schedule
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item) => {
          let bgClass = 'bg-slate-950/80 border-slate-800';
          let borderAccent = 'border-l-cyan-500';
          let icon = <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />;

          if (item.type === 'viral_performance') {
            bgClass = 'bg-rose-950/20 border-rose-500/30';
            borderAccent = 'border-l-rose-500';
            icon = <Flame className="w-4 h-4 text-rose-400 shrink-0" />;
          } else if (item.type === 'warning') {
            bgClass = 'bg-amber-950/20 border-amber-500/30';
            borderAccent = 'border-l-amber-500';
            icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
          } else if (item.type === 'timing_recommendation') {
            bgClass = 'bg-indigo-950/20 border-indigo-500/30';
            borderAccent = 'border-l-indigo-500';
            icon = <Target className="w-4 h-4 text-indigo-400 shrink-0" />;
          }

          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border border-l-4 ${bgClass} ${borderAccent} space-y-1.5 relative shadow-lg group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {icon}
                  <span className="text-[11px] font-bold text-white font-sans truncate">
                    {item.title}
                  </span>
                </div>

                <button
                  onClick={() => handleDismiss(item.id)}
                  className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-snug">
                {item.message}
              </p>

              <div className="flex items-center justify-between pt-1 font-mono text-[9px] text-slate-400">
                <span>{item.timestamp}</span>
                {item.metricBadge && (
                  <span className="font-bold text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    {item.metricBadge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
