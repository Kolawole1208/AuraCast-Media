import React, { useState } from 'react';
import { TopicItem, SocialChannel } from '../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  Heart,
  Share2,
  List,
  Grid,
  Zap,
  MoreVertical,
  ArrowRight,
  Edit3,
  CalendarDays,
  Tag
} from 'lucide-react';

interface ContentCalendarProps {
  topics: TopicItem[];
  channels: SocialChannel[];
  onRescheduleTopic: (topicId: string, newDate: string, newScheduledFor?: string) => Promise<void>;
  onUpdateTopicStatus: (topicId: string, newStatus: TopicItem['status']) => Promise<void>;
  onSelectTopic: (topicId: string) => void;
  onPublishTopic: (topicId: string) => Promise<void>;
  loading: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  draft: {
    label: 'Draft',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-400'
  },
  generating: {
    label: 'Generating AI',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500 animate-pulse'
  },
  generated: {
    label: 'AI Generated',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500'
  },
  ai_generated: {
    label: 'AI Generated',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500'
  },
  needs_approval: {
    label: 'Needs Approval',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500'
  },
  scheduled: {
    label: 'Scheduled',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    dot: 'bg-sky-500'
  },
  published: {
    label: 'Published',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500'
  },
  failed: {
    label: 'Failed',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500'
  }
};

const PLATFORM_ICONS: Record<string, { label: string; color: string }> = {
  instagram: { label: 'IG', color: 'bg-pink-600 text-white' },
  whatsapp: { label: 'WA', color: 'bg-emerald-600 text-white' },
  facebook: { label: 'FB', color: 'bg-blue-600 text-white' },
  twitter: { label: 'X', color: 'bg-slate-800 text-white' },
  youtube: { label: 'YT', color: 'bg-red-600 text-white' }
};

export default function ContentCalendar({
  topics,
  channels,
  onRescheduleTopic,
  onUpdateTopicStatus,
  onSelectTopic,
  onPublishTopic,
  loading
}: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 10)); // August 2026 anchor
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [draggedTopicId, setDraggedTopicId] = useState<string | null>(null);
  const [dropTargetDate, setDropTargetDate] = useState<string | null>(null);
  const [editingTopic, setEditingTopic] = useState<TopicItem | null>(null);
  const [rescheduleDateInput, setRescheduleDateInput] = useState<string>('');
  const [rescheduleTimeInput, setRescheduleTimeInput] = useState<string>('09:30');

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Generate calendar days for month view
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday

  const calendarCells = [];
  // Padding cells before first day
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ dayNumber: d, dateStr: dayStr });
  }

  // Filter topics
  const filteredTopics = topics.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) {
      if (statusFilter === 'generated' && (t.status === 'generated' || t.status === 'ai_generated')) {
        // match
      } else {
        return false;
      }
    }
    if (platformFilter !== 'all') {
      if (!t.publishChannels || !t.publishChannels.includes(platformFilter)) {
        return false;
      }
    }
    return true;
  });

  // Group topics by date
  const topicsByDate: Record<string, TopicItem[]> = {};
  filteredTopics.forEach(t => {
    const dStr = t.date ? t.date.split('T')[0] : t.scheduledFor ? t.scheduledFor.split('T')[0] : new Date().toISOString().split('T')[0];
    if (!topicsByDate[dStr]) topicsByDate[dStr] = [];
    topicsByDate[dStr].push(t);
  });

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, topicId: string) => {
    e.dataTransfer.setData('text/plain', topicId);
    setDraggedTopicId(topicId);
  };

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    setDropTargetDate(dateStr);
  };

  const handleDragLeave = () => {
    setDropTargetDate(null);
  };

  const handleDrop = async (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    const topicId = e.dataTransfer.getData('text/plain') || draggedTopicId;
    setDropTargetDate(null);
    setDraggedTopicId(null);

    if (topicId && targetDateStr) {
      const topicToMove = topics.find(t => t.id === topicId);
      if (topicToMove && topicToMove.date !== targetDateStr) {
        const isoScheduled = `${targetDateStr}T${rescheduleTimeInput}:00.000Z`;
        await onRescheduleTopic(topicId, targetDateStr, isoScheduled);
      }
    }
  };

  const openRescheduleModal = (t: TopicItem) => {
    setEditingTopic(t);
    const d = t.date || new Date().toISOString().split('T')[0];
    setRescheduleDateInput(d);
  };

  const handleSaveRescheduleModal = async () => {
    if (editingTopic && rescheduleDateInput) {
      const isoScheduled = `${rescheduleDateInput}T${rescheduleTimeInput}:00.000Z`;
      await onRescheduleTopic(editingTopic.id, rescheduleDateInput, isoScheduled);
      setEditingTopic(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      {/* Calendar Top Control Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
            <CalendarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                AI Content Calendar & Scheduling Hub
              </h2>
              <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded tracking-wider uppercase">
                Drag & Drop Hub
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Plan, organize, approval-queue, and reschedule posts across all connected channels.
            </p>
          </div>
        </div>

        {/* View Switchers & Navigation Controls */}
        <div className="flex flex-wrap items-center gap-3 self-stretch lg:self-auto justify-between lg:justify-end">
          {/* Month Navigator */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-800 px-3 min-w-[120px] text-center">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={goToday}
              className="text-[10px] font-mono font-semibold text-blue-700 hover:text-blue-800 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors cursor-pointer ml-1"
            >
              Today
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'month' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Timeline List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span>Filter Hub:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 focus:border-blue-600 focus:outline-none shadow-2xs"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="generated">AI Generated</option>
            <option value="needs_approval">Needs Approval</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
          </select>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 focus:border-blue-600 focus:outline-none shadow-2xs"
          >
            <option value="all">All Social Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter / X</option>
            <option value="youtube">YouTube Shorts</option>
          </select>
        </div>
      </div>

      {/* MONTH GRID VIEW */}
      {viewMode === 'month' && (
        <div className="space-y-2">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, idx) => {
              if (!cell) {
                return (
                  <div key={`empty_${idx}`} className="bg-slate-50/50 border border-slate-100 rounded-lg min-h-[110px]" />
                );
              }

              const { dayNumber, dateStr } = cell;
              const dayTopics = topicsByDate[dateStr] || [];
              const isDropTarget = dropTargetDate === dateStr;
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div
                  key={dateStr}
                  onDragOver={(e) => handleDragOver(e, dateStr)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, dateStr)}
                  className={`min-h-[120px] p-2 border rounded-lg flex flex-col justify-between transition-colors ${
                    isDropTarget
                      ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
                      : isToday
                      ? 'border-blue-300 bg-blue-50/30'
                      : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <span className={`text-xs font-mono font-semibold ${isToday ? 'text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded' : 'text-slate-600'}`}>
                      {dayNumber}
                    </span>
                    {dayTopics.length > 0 && (
                      <span className="text-[9px] font-mono text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {dayTopics.length} posts
                      </span>
                    )}
                  </div>

                  {/* Day Topics List */}
                  <div className="space-y-1.5 mt-1.5 flex-1 overflow-y-auto max-h-[160px] custom-scrollbar">
                    {dayTopics.map((t) => {
                      const statusCfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.draft;
                      return (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, t.id)}
                          onClick={() => onSelectTopic(t.id)}
                          className="p-2 rounded-md border text-left cursor-grab active:cursor-grabbing hover:border-blue-300 bg-white transition-colors space-y-1 shadow-2xs border-slate-200"
                          title="Click to view in Studio or Drag to Reschedule"
                        >
                          <div className="flex items-center justify-between gap-1">
                            {/* Status Indicator */}
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                              <span className={`text-[9px] font-mono font-semibold ${statusCfg.text}`}>
                                {statusCfg.label}
                              </span>
                            </div>

                            {/* Reschedule trigger icon */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openRescheduleModal(t);
                              }}
                              className="text-slate-400 hover:text-slate-700 p-0.5 rounded hover:bg-slate-100"
                              title="Quick Reschedule Date/Time"
                            >
                              <Clock className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          <p className="text-[10px] font-sans font-medium text-slate-800 line-clamp-2 leading-tight">
                            {t.topic}
                          </p>

                          {/* Platforms Icons */}
                          <div className="flex items-center justify-between pt-0.5">
                            <div className="flex items-center gap-1">
                              {t.publishChannels?.map((ch) => {
                                const plat = PLATFORM_ICONS[ch];
                                return plat ? (
                                  <span
                                    key={ch}
                                    className={`text-[8px] font-mono font-bold px-1 rounded ${plat.color}`}
                                  >
                                    {plat.label}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TIMELINE LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTopics.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 font-sans italic border border-dashed border-slate-200 rounded-xl bg-slate-50">
              No content items matching the selected filter criteria.
            </div>
          ) : (
            filteredTopics.map((t) => {
              const statusCfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.draft;
              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTopic(t.id)}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors cursor-pointer shadow-2xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border flex items-center gap-1.5 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.label}
                      </span>

                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <CalendarDays className="w-3 h-3 text-slate-400" />
                        {t.date || t.scheduledFor?.split('T')[0] || 'Unscheduled'}
                      </span>

                      {t.toneGoal && (
                        <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase font-semibold">
                          #{t.toneGoal}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 font-sans leading-relaxed">
                      "{t.topic}"
                    </h4>

                    {/* Captions Preview */}
                    {t.generatedContent && (
                      <p className="text-[11px] text-slate-500 font-sans line-clamp-1 italic">
                        "{t.generatedContent.caption}"
                      </p>
                    )}
                  </div>

                  {/* Channels & Action Controls */}
                  <div className="flex items-center gap-3 shrink-0 justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-2 md:pt-0">
                    <div className="flex items-center gap-1">
                      {t.publishChannels?.map((ch) => {
                        const plat = PLATFORM_ICONS[ch];
                        return plat ? (
                          <span key={ch} className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${plat.color}`}>
                            {plat.label}
                          </span>
                        ) : null;
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openRescheduleModal(t);
                        }}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Reschedule</span>
                      </button>

                      {t.status !== 'published' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPublishTopic(t.id);
                          }}
                          disabled={loading}
                          className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <Send className="w-3.5 h-3.5 text-white" />
                          <span>Publish Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* QUICK RESCHEDULE MODAL */}
      {editingTopic && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Reschedule Post Execution</span>
              </div>
              <button
                onClick={() => setEditingTopic(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-800 font-sans font-semibold">
                "{editingTopic.topic}"
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-wider block">
                  Select Execution Date
                </label>
                <input
                  type="date"
                  value={rescheduleDateInput}
                  onChange={(e) => setRescheduleDateInput(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 focus:border-blue-600 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-wider block">
                  Select Target Posting Time
                </label>
                <input
                  type="time"
                  value={rescheduleTimeInput}
                  onChange={(e) => setRescheduleTimeInput(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 focus:border-blue-600 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingTopic(null)}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRescheduleModal}
                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
