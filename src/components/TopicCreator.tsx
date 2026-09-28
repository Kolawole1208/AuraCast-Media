import React, { useState } from 'react';
import { SocialChannel } from '../types';
import { Send, Flame, Sparkles, Target, BookOpen, Heart, MessageSquare } from 'lucide-react';

interface TopicCreatorProps {
  channels: SocialChannel[];
  onAddTopic: (topicText: string, targetChannels: string[], toneGoal: string) => Promise<void>;
  loading: boolean;
}

export default function TopicCreator({ channels, onAddTopic, loading }: TopicCreatorProps) {
  const [topic, setTopic] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    channels.filter(c => c.connected).map(c => c.id)
  );
  const [toneGoal, setToneGoal] = useState<'educational' | 'mindset' | 'storytelling' | 'conversational'>('conversational');

  const activeConnectedChannels = channels.filter(c => c.connected);

  const handleCheckboxChange = (id: string) => {
    if (selectedChannels.includes(id)) {
      setSelectedChannels(selectedChannels.filter(c => c !== id));
    } else {
      setSelectedChannels([...selectedChannels, id]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    await onAddTopic(topic, selectedChannels, toneGoal);
    setTopic('');
  };

  const suggestedIdeas = [
    "Overcoming the imposter syndrome in engineering and design",
    "Why slow, deep reading beats rapid browsing every time",
    "The minimalist workspace setup that maximizes deep focus",
    "How to build high-converting landing pages from scratch"
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
          <Flame className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">Drop Daily Topic</h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">Enter a topic for AI content generation</p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="daily-topic-input" className="sr-only">Daily Topic</label>
          <textarea
            id="daily-topic-input"
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
            placeholder="e.g., How consistency defeats pure talent in creative projects..."
            className="w-full text-slate-900 text-xs p-3.5 rounded-lg bg-slate-50 border border-slate-200 placeholder-slate-400 outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 font-sans resize-none transition-all"
          />
        </div>

        {/* Campaign Tone Goal Selection Grid */}
        <div id="tone-goal-selector-block" className="space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-sans">
            Campaign Narrative Goal
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'conversational', label: 'Conversational', desc: 'Discussions & engagement', icon: <MessageSquare className="w-3.5 h-3.5" /> },
              { id: 'educational', label: 'Educational', desc: 'Actionable logic & guides', icon: <BookOpen className="w-3.5 h-3.5" /> },
              { id: 'mindset', label: 'Mindset Hook', desc: 'Powerful paradigm shifts', icon: <Target className="w-3.5 h-3.5" /> },
              { id: 'storytelling', label: 'Storytelling', desc: 'Immersive stories', icon: <Heart className="w-3.5 h-3.5" /> }
            ].map((option) => {
              const works = toneGoal === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setToneGoal(option.id as any)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    works
                      ? 'bg-blue-50 border-blue-300 text-blue-950 font-medium shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={works ? 'text-blue-600' : 'text-slate-400'}>
                      {option.icon}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-900 font-sans tracking-tight">
                      {option.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-sans block mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                    {option.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-700 tracking-tight font-sans block mb-2">
            Publishing Destinations
          </span>
          {activeConnectedChannels.length === 0 ? (
            <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200 flex items-start gap-2">
              <span className="text-amber-600 font-bold">⚠️</span>
              <span className="leading-normal font-sans">
                No connected channels. Please connect accounts in settings to publish content.
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {activeConnectedChannels.map((c) => {
                const isActive = selectedChannels.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCheckboxChange(c.id)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold font-sans flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70 hover:text-slate-900'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-slate-400'}`} />
                    {c.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !topic.trim() || activeConnectedChannels.length === 0}
          className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold font-sans tracking-wide transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer ${
            loading || !topic.trim() || activeConnectedChannels.length === 0
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
              : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 shadow-2xs'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating AI Content...
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Generate Content & Prepare Post
            </>
          )}
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans inline-block mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-blue-500" /> Suggested Topics
        </span>
        <div className="space-y-1">
          {suggestedIdeas.map((idea, i) => (
            <button
              key={i}
              onClick={() => { if (!loading) setTopic(idea); }}
              disabled={loading}
              className="w-full text-left p-2 rounded-md text-xs text-slate-600 font-sans hover:bg-slate-50 transition-all hover:text-blue-700 flex items-start gap-2 cursor-pointer"
            >
              <span className="text-blue-500 font-bold block mt-0.5">•</span>
              <span className="flex-1 line-clamp-1">{idea}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
