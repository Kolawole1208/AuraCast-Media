import React, { useState } from 'react';
import { Video, Share2, Sparkles, Youtube, Instagram, Facebook, Twitter, Linkedin, Copy, Check, ArrowRight, RefreshCw, Layers } from 'lucide-react';

interface RepurposedAsset {
  platform: 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  platformName: string;
  icon: string;
  badgeColor: string;
  title?: string;
  content: string;
  hashtags?: string[];
  graphicConcept?: string;
  tags?: string[];
}

export default function ContentRepurposer() {
  const [videoInput, setVideoInput] = useState('');
  const [inputTitle, setInputTitle] = useState('How to Scale Your Business with AI Automation in 2026');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [assets, setAssets] = useState<RepurposedAsset[]>([
    {
      platform: 'youtube',
      platformName: 'YouTube Long-Form & Shorts',
      icon: '🎬',
      badgeColor: 'bg-red-500/10 border-red-500/30 text-red-400',
      title: 'How to Scale Your Business with AI Automation in 2026 (Step-by-Step Guide)',
      content: 'In this complete 2026 breakdown, we analyze how modern creators and brands leverage AI workflow pipelines to automate content creation, publishing, and lead conversion without increasing team size.',
      tags: ['AI Automation', 'Business Growth 2026', 'Content Strategy', 'SaaS Growth', 'Marketing OS']
    },
    {
      platform: 'instagram',
      platformName: 'Instagram Reel & Carousel',
      icon: '📸',
      badgeColor: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
      title: 'Reel Hook: "Stop spending 10 hours a week writing captions manually..."',
      content: 'Here is the exact 3-step AI pipeline we used to generate 30 days of high-converting social content in under 15 minutes.\n\n1. Define brand voice & content pillars\n2. Run automated campaign batching\n3. Schedule at peak audience hours\n\nSave this post for your next campaign planning session! 📌',
      hashtags: ['#AIContent', '#InstagramGrowth', '#ContentAutomation', '#CreatorEconomy', '#BusinessTips']
    },
    {
      platform: 'facebook',
      platformName: 'Facebook Page Post',
      icon: '📘',
      badgeColor: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      content: 'Are you still manually managing every social post in 2026?\n\nWe just dropped a breakdown showing how smart brands are transforming 1 video into 10+ cross-platform assets with AI automation.\n\nRead the full guide or drop "AUTOMATE" below to get our workflow template delivered directly to your inbox!',
      graphicConcept: 'High-contrast graphic card with slogan: "1 Video → 10 Social Assets in 60 Seconds"'
    },
    {
      platform: 'twitter',
      platformName: 'X (Twitter) Thread',
      icon: '🐦',
      badgeColor: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
      content: '1/ 🧵 How to turn 1 YouTube video into 10 viral assets using AI automation:\n\n2/ Step 1: Extract core takeaways into bullet points.\n\n3/ Step 2: Format for platform nuance (Shorts for YT, Reels for IG, Threads for X).\n\n4/ Step 3: Auto-schedule for peak audience traffic windows.\n\n5/ Retweet if you found this valuable! 🚀'
    },
    {
      platform: 'linkedin',
      platformName: 'LinkedIn Thought Leadership',
      icon: '💼',
      badgeColor: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
      content: 'The biggest bottleneck in modern marketing isn\'t strategy—it\'s content execution velocity.\n\nIn 2026, the brands winning organic reach aren\'t working harder; they\'re building automated content pipelines that repurpose long-form video into omni-channel distribution.\n\nHere are 3 lessons from our latest research on AI workflow automation in enterprise teams...'
    }
  ]);

  const handleRepurpose = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1200);
  };

  const copyAsset = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                AI Content Repurposer
              </h2>
              <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded tracking-wider uppercase">
                1 Video → 10+ Assets
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Paste a video URL or transcript to automatically generate platform-optimized YouTube, Instagram, Facebook, X, and LinkedIn content.
            </p>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-mono font-semibold text-slate-700 uppercase tracking-wider block">
              Video Title / Topic
            </label>
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              placeholder="e.g. 10 Productivity Hacks for Busy Founders"
              className="w-full text-xs bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg px-3 py-2 font-sans focus:border-blue-600 focus:outline-none shadow-2xs"
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-mono font-semibold text-slate-700 uppercase tracking-wider block">
              YouTube Video URL or Transcript Snippet
            </label>
            <input
              type="text"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              placeholder="e.g. https://www.youtube.com/watch?v=..."
              className="w-full text-xs bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg px-3 py-2 font-mono focus:border-blue-600 focus:outline-none shadow-2xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleRepurpose}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-2xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" /> Repurposing Content...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" /> Repurpose Into 10+ Assets
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Assets List */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" /> Platform Multi-Channel Assets
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assets.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 space-y-3 relative group transition-colors shadow-2xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs font-bold text-slate-900">{item.platformName}</span>
                </div>
                <button
                  onClick={() => copyAsset(item.content, idx)}
                  className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {item.title && (
                <div className="text-xs font-semibold text-blue-700 font-sans">
                  {item.title}
                </div>
              )}

              <p className="text-xs text-slate-700 font-sans leading-relaxed whitespace-pre-line">
                {item.content}
              </p>

              {item.hashtags && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.hashtags.map((h, hIdx) => (
                    <span key={hIdx} className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-medium">
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {item.graphicConcept && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 font-sans">
                  <strong className="font-semibold">Graphic Idea:</strong> {item.graphicConcept}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
