import React, { useState } from 'react';
import { TopicItem, SocialChannel } from '../types';
import WorkflowPipelineHeader from './WorkflowPipelineHeader';
import { Sparkles, Calendar, Share2, CornerDownRight, CheckCircle2, Trash2, Edit2, Check, Video, Eye, Type, Image as ImageIcon, MessageSquare, Heart, Bookmark, Compass, RefreshCw, HelpCircle, Radio, ShieldCheck, Info, Copy, ExternalLink, Download, FileText, Layers, Clock, Zap } from 'lucide-react';

const colorPresets = [
  { name: 'Corporate Blue', bg: '#0f172a', text: '#f8fafc', accent: '#3b82f6', pattern: 'grid' as const },
  { name: 'Pure Minimal', bg: '#ffffff', text: '#0f172a', accent: '#2563eb', pattern: 'none' as const },
  { name: 'Executive Slate', bg: '#1e293b', text: '#f8fafc', accent: '#38bdf8', pattern: 'dots' as const },
  { name: 'Clean Light', bg: '#f8fafc', text: '#0f172a', accent: '#1d4ed8', pattern: 'waves' as const },
  { name: 'Trust Emerald', bg: '#022c22', text: '#ecfdf5', accent: '#10b981', pattern: 'dots' as const },
];

interface ContentWorkspaceProps {
  topic: TopicItem;
  channels: SocialChannel[];
  onPublish: (topicId: string, channels: string[]) => Promise<void>;
  onSchedule: (topicId: string, scheduledFor: string, channels: string[]) => Promise<void>;
  onEdit: (topicId: string, updatedFields: any) => Promise<void>;
  onDelete: (topicId: string) => Promise<void>;
  onGenerateImage: (topicId: string, promptText: string) => Promise<void>;
  actionLoading: boolean;
  onToggleChannel?: (channelId: string, username?: string, accessToken?: string, businessId?: string) => Promise<void>;
}

export default function ContentWorkspace({
  topic,
  channels,
  onPublish,
  onSchedule,
  onEdit,
  onDelete,
  onGenerateImage,
  actionLoading,
  onToggleChannel
}: ContentWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'graphic' | 'caption' | 'video'>('graphic');
  const [isEditing, setIsEditing] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [showScheduler, setShowScheduler] = useState(false);

  // Connection config publishing popup states
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [instaIntegrationMode, setInstaIntegrationMode] = useState<'sandbox' | 'live'>('sandbox');
  const [instaHandle, setInstaHandle] = useState('@abel_instagram');
  const [instaToken, setInstaToken] = useState('');
  const [instaBusinessId, setInstaBusinessId] = useState('');
  const [isPublishConfigSubmitting, setIsPublishConfigSubmitting] = useState(false);
  const [showHelpPublish, setShowHelpPublish] = useState(false);
  const [selectedChannelsForModal, setSelectedChannelsForModal] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [publishedChannels, setPublishedChannels] = useState<string[] | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        return true;
      }
    } catch (err) {
      console.warn("Clipboard copy failed:", err);
      return false;
    }
  };

  // Edit states
  const [editCaption, setEditCaption] = useState('');
  const [editHashtags, setEditHashtags] = useState('');
  const [editGraphicTitle, setEditGraphicTitle] = useState('');
  const [editGraphicText, setEditGraphicText] = useState('');
  const [editBgColor, setEditBgColor] = useState('#0f172a');
  const [editTextColor, setEditTextColor] = useState('#f8fafc');
  const [editAccentColor, setEditAccentColor] = useState('#6366f1');
  const [editPattern, setEditPattern] = useState<'none' | 'dots' | 'grid' | 'waves' | 'cosmic'>('none');

  // Custom prompt for AI illustration generator
  const [customImagePrompt, setCustomImagePrompt] = useState('');
  const [showImageGenerator, setShowImageGenerator] = useState(false);

  // Connection/Interactive live comment states
  const [commentInput, setCommentInput] = useState('');
  const [localComments, setLocalComments] = useState<any[]>(topic.comments || []);
  const [prevTopicId, setPrevTopicId] = useState(topic.id);
  const [commentAuthor, setCommentAuthor] = useState('Abel Creatives');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // 5 Premium Advanced Feature States
  const [platformCaptions, setPlatformCaptions] = useState<Record<string, { caption: string; hashtags: string[] }>>({});
  const [selectedTailoredPlatform, setSelectedTailoredPlatform] = useState<string | null>(null);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isSimulatingComments, setIsSimulatingComments] = useState(false);
  const [trendingTags, setTrendingTags] = useState<string[]>(['Growth', 'Innovation', 'Consistency', 'Productivity', 'Solopreneur', 'SaaS', 'MarketingTips', 'DesignInspiration', 'DeveloperLife']);
  const [isExportingPng, setIsExportingPng] = useState(false);

  if (topic.id !== prevTopicId) {
    setPrevTopicId(topic.id);
    setLocalComments(topic.comments || []);
    setPlatformCaptions({});
    setSelectedTailoredPlatform(null);
  }

  const handleTailorCaption = async (platform: string) => {
    setIsRewriting(true);
    setToastMessage(null);
    try {
      const res = await fetch(`/api/topics/${topic.id}/rewrite`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'guest'
        },
        body: JSON.stringify({ platform }),
      });
      if (res.ok) {
        const data = await res.json();
        setPlatformCaptions(prev => ({
          ...prev,
          [platform]: { caption: data.caption, hashtags: data.hashtags }
        }));
        setSelectedTailoredPlatform(platform);
        setToastMessage(`Successfully tailored caption variation for ${platform.toUpperCase()} using Gemini!`);
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Rewrite failed');
      }
    } catch (err: any) {
      console.error(err);
      setToastMessage(`Error tailoring caption: ${err.message}`);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleApplyTailoredCaption = (platform: string) => {
    const variation = platformCaptions[platform];
    if (!variation) return;
    setEditCaption(variation.caption);
    setEditHashtags(variation.hashtags.join(', '));
    setToastMessage(`Applied the ${platform.toUpperCase()} tailored variation. Remember to click "Save Changes" to publish!`);
  };

  const handleSparkSimulatedComments = async () => {
    setIsSimulatingComments(true);
    setToastMessage(null);
    try {
      const res = await fetch(`/api/topics/${topic.id}/generate-comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'guest'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLocalComments(data.topic.comments || []);
        setToastMessage("AI Audience Simulator generated 3 highly realistic comment reactions!");
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to simulate feedback');
      }
    } catch (err: any) {
      console.error(err);
      setToastMessage(`Error: ${err.message}`);
    } finally {
      setIsSimulatingComments(false);
    }
  };

  const handleExportPNGCard = () => {
    setIsExportingPng(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const currentBg = isEditing ? editBgColor : (topic.generatedContent?.graphicDesign?.bgColor || '#0f172a');
      const currentText = isEditing ? editTextColor : (topic.generatedContent?.graphicDesign?.textColor || '#f8fafc');
      const currentAccent = isEditing ? editAccentColor : (topic.generatedContent?.graphicDesign?.accentColor || '#6366f1');
      const currentPattern = isEditing ? editPattern : (topic.generatedContent?.graphicDesign?.pattern || 'none');
      const currentTitle = isEditing ? editGraphicTitle : (topic.generatedContent?.graphicTitle || 'Topic Checklist');
      const currentQuote = isEditing ? editGraphicText : (topic.generatedContent?.graphicText || topic.topic);
      const activeUser = channels.find(c => c.connected)?.username || "auracast_brand";
      const currentHandle = activeUser.startsWith('@') ? activeUser : `@${activeUser}`;

      // 1. Draw Background
      ctx.fillStyle = currentBg;
      ctx.fillRect(0, 0, 800, 800);

      // 2. Draw Patterns
      if (currentPattern === 'dots') {
        ctx.fillStyle = currentAccent;
        ctx.globalAlpha = 0.18;
        for (let x = 30; x < 800; x += 40) {
          for (let y = 30; y < 800; y += 40) {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (currentPattern === 'grid') {
        ctx.strokeStyle = currentAccent;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.12;
        for (let x = 40; x < 800; x += 48) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 800);
          ctx.stroke();
        }
        for (let y = 40; y < 800; y += 48) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(800, y);
          ctx.stroke();
        }
      } else if (currentPattern === 'waves') {
        ctx.fillStyle = currentAccent;
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.moveTo(0, 400);
        ctx.bezierCurveTo(200, 300, 600, 500, 800, 400);
        ctx.lineTo(800, 800);
        ctx.lineTo(0, 800);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = currentAccent;
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.moveTo(0, 480);
        ctx.bezierCurveTo(250, 420, 550, 530, 800, 480);
        ctx.lineTo(800, 800);
        ctx.lineTo(0, 800);
        ctx.closePath();
        ctx.fill();
      } else if (currentPattern === 'cosmic') {
        // Draw cosmic radial glowing overlay
        const grad = ctx.createRadialGradient(400, 400, 50, 400, 400, 500);
        grad.addColorStop(0, currentAccent + '4d');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.55;
        ctx.fillRect(0, 0, 800, 800);
      }

      ctx.globalAlpha = 1.0;

      // 3. Draw Header Title Badge
      const badgeText = currentTitle.toUpperCase();
      ctx.font = "bold 15px sans-serif";
      ctx.fillStyle = currentAccent;
      const textMetrics = ctx.measureText(badgeText);
      const textWidth = textMetrics.width;

      // Draw rounded badge rect
      ctx.fillStyle = currentAccent + '22';
      ctx.beginPath();
      ctx.roundRect(80, 80, textWidth + 36, 38, 8);
      ctx.fill();

      // Print Badge Text
      ctx.fillStyle = currentAccent;
      ctx.fillText(badgeText, 98, 104);

      // 4. Draw Center Quote text wrapped
      ctx.fillStyle = currentText;
      ctx.font = "italic 32px sans-serif";
      ctx.textAlign = "center";
      
      const wrapTextCanvas = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const testWidth = ctx.measureText(testLine).width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, currentY);
      };

      wrapTextCanvas(`"${currentQuote}"`, 400, 360, 640, 50);

      // 5. Draw Footer (Handle & Timestamp)
      ctx.textAlign = "left";
      ctx.font = "14px monospace";
      ctx.fillStyle = currentText;
      ctx.globalAlpha = 0.55;
      
      ctx.fillText(currentHandle, 80, 720);
      ctx.textAlign = "right";
      ctx.fillText(topic.date, 720, 720);

      // 6. Trigger Native Browser Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `AuraCast_Card_${topic.id}.png`;
      link.href = dataUrl;
      link.click();
      setToastMessage("Successfully exported Quote Card as premium high-fidelity PNG graphic!");
    } catch (err: any) {
      console.error(err);
      setToastMessage(`Export failed: ${err.message}`);
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleExportCampaignBundle = () => {
    try {
      if (!topic.generatedContent) return;
      const markdown = `# AuraCast Campaign Asset Bundle 🌌
**Topic:** "${topic.topic}"
**Date Created:** ${topic.date}
**Campaign Narrative Goal:** ${topic.toneGoal || 'Conversational'}
**Status:** ${topic.status}

---

## 📝 1. Optimized Caption
${topic.generatedContent.caption}

**Keywords & Hashtags:**
${topic.generatedContent.hashtags.map(t => `#${t}`).join(' ')}

---

## 🎨 2. Visual Typographic Card Spec
* **Title Badge:** ${topic.generatedContent.graphicTitle}
* **Featured Statement:** "${topic.generatedContent.graphicText}"
* **Color Palette Spec:**
  - Background Hex: \`${isEditing ? editBgColor : (topic.generatedContent.graphicDesign.bgColor || '#0f172a')}\`
  - Typography Color Hex: \`${isEditing ? editTextColor : (topic.generatedContent.graphicDesign.textColor || '#f8fafc')}\`
  - Active Accent Hex: \`${isEditing ? editAccentColor : (topic.generatedContent.graphicDesign.accentColor || '#6366f1')}\`
  - Geometry Canvas Pattern: \`${isEditing ? editPattern : (topic.generatedContent.graphicDesign.pattern || 'none')}\`

---

## 🎬 3. Vertical Shorts & TikTok Storyboard Script
* **Duration target:** ${topic.generatedContent.videoScript.durationSeconds} seconds
* **Recommend Music Vibe:** "${topic.generatedContent.videoScript.musicMood}"
* **AI Visual Frame Prompt:** "${topic.generatedContent.videoScript.visualPrompt}"

### 🎞️ Sequential Board Sequence:
${topic.generatedContent.videoScript.narration.map((voice, idx) => `
### Scene Frame [${idx + 1}]
🗣️ *Narrator Speech:* "${voice}"
📹 *B-roll Art Direction:* ${topic.generatedContent?.videoScript?.visualStory?.[idx] || 'Dynamic cinematic transition'}
`).join('\n')}

---
*Created & Sync'd with AuraCast Pro Workspace Engine*
`;

      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `AuraCast_Bundle_${topic.topic.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setToastMessage("Successfully exported campaign asset bundle as clean markdown text file!");
    } catch (err: any) {
      console.error(err);
      setToastMessage(`Markdown export failed: ${err.message}`);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/topics/${topic.id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': 'guest'
        },
        body: JSON.stringify({
          author: commentAuthor,
          handle: commentAuthor === 'Abel Creatives' ? '@abel.creatives' : `@user_${commentAuthor.toLowerCase().replace(/\s+/g, '')}`,
          text: commentInput.trim()
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setLocalComments(data.topic.comments || []);
        setCommentInput('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const content = topic.generatedContent;

  const startEdit = () => {
    if (!content) return;
    setEditCaption(content.caption);
    setEditHashtags(content.hashtags.join(', '));
    setEditGraphicTitle(content.graphicTitle);
    setEditGraphicText(content.graphicText);
    setEditBgColor(content.graphicDesign.bgColor || '#0f172a');
    setEditTextColor(content.graphicDesign.textColor || '#f8fafc');
    setEditAccentColor(content.graphicDesign.accentColor || '#6366f1');
    setEditPattern(content.graphicDesign.pattern || 'none');
    setIsEditing(true);
  };

  const saveEdit = async () => {
    const tagsArray = editHashtags.split(',').map(t => t.trim().replaceAll('#', '')).filter(Boolean);
    await onEdit(topic.id, {
      caption: editCaption,
      hashtags: tagsArray,
      graphicText: editGraphicText,
      graphicTitle: editGraphicTitle,
      graphicDesign: {
        bgColor: editBgColor,
        textColor: editTextColor,
        accentColor: editAccentColor,
        pattern: editPattern
      }
    });
    setIsEditing(false);
  };

  if (topic.status === 'generating') {
    return (
      <div className="bg-slate-900/65 backdrop-blur-xl rounded-2xl border border-slate-800/90 p-12 text-center shadow-2xl flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-indigo-400 animate-bounce" />
          </div>
        </div>
        <h3 className="text-base font-display font-semibold text-white tracking-tight mb-2">Assembling Premium Assets</h3>
        <p className="text-xs text-slate-400 max-w-sm tracking-normal leading-relaxed mb-6">
          Our specialized generative engines are mapping semantic clusters, selecting eye-safe aesthetic pallettes, and scripting professional story frames...
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full text-[10px] font-mono tracking-wider uppercase font-bold animate-pulse">
          <RefreshCw className="w-3 h-3 animate-spin" /> Synthesizing design layouts...
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-slate-900/65 backdrop-blur-xl rounded-2xl border border-slate-800/90 p-12 text-center shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-sm text-slate-400">Failed to load asset layouts for this campaign block.</p>
      </div>
    );
  }

  // Render high-end decorative visual preset patterns inside our canvas
  const renderPatternBg = (pattern: string, accent: string) => {
    switch (pattern) {
      case 'dots':
        return (
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: `radial-gradient(${accent} 1.5px, transparent 1.5px)`,
            backgroundSize: '20px 20px'
          }} />
        );
      case 'grid':
        return (
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
            backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }} />
        );
      case 'waves':
        return (
          <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
            <svg className="absolute w-[200%] h-full animate-[pulse_6s_infinite] opacity-35" viewBox="0 0 100 10" preserveAspectRatio="none" style={{ color: accent }}>
              <path d="M0,5 C30,12 70,-2 100,5 L100,10 L0,10 Z" fill="currentColor" />
            </svg>
          </div>
        );
      case 'cosmic':
        return (
          <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
            <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] rounded-full opacity-60 animate-[pulse_4s_ease-in-out_infinite]" style={{
              background: `radial-gradient(circle, ${accent}3a 0%, transparent 70%)`
            }} />
          </div>
        );
      default:
        return null;
    }
  };

  const activeConnectedChannels = channels.filter(c => c.connected);

  const handleImageGenerateClick = async () => {
    const promptValue = customImagePrompt.trim() || content.videoScript.visualPrompt;
    await onGenerateImage(topic.id, promptValue);
    setShowImageGenerator(false);
  };

  return (
    <div className="space-y-6">
      <WorkflowPipelineHeader campaignTitle={topic.topic} currentStage={topic.status === 'published' ? 'analyze' : 'review'} />
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
      {toastMessage && (
        <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-6 py-3 text-xs font-semibold flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="hover:text-emerald-950 text-emerald-700 text-sm font-bold cursor-pointer px-1.5 py-0.5 rounded hover:bg-emerald-100">Dismiss</button>
        </div>
      )}
      {/* Top action block / status header */}
      <div className="border-b border-slate-200 bg-slate-50 py-4 px-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-700 font-mono tracking-widest uppercase">
              ACTIVE SOCIAL WORKSPACE
            </span>
            <h2 className="text-sm font-bold text-slate-900 font-sans tracking-tight leading-none mt-1 truncate max-w-[280px] sm:max-w-md">
              "{topic.topic}"
            </h2>
          </div>
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider ${
            topic.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            topic.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {topic.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={saveEdit}
              disabled={actionLoading}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" /> Save Edits
            </button>
          ) : (
            <button
              onClick={startEdit}
              className="text-xs text-slate-700 hover:bg-slate-100 bg-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200 shadow-2xs"
            >
              <Edit2 className="w-3.5 h-3.5" /> Customize Layout
            </button>
          )}

          <button
            onClick={() => onDelete(topic.id)}
            disabled={actionLoading}
            className="text-xs text-rose-700 hover:bg-rose-100 bg-rose-50 p-2 rounded-lg transition-colors border border-rose-200 cursor-pointer"
            title="Archive Layout"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main interactive area split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Left Side: Layout Preview and Generators (7 Columns) */}
        <div className="lg:col-span-7 p-6 border-r border-slate-200 flex flex-col justify-between bg-white">
          <div>
            {/* Visual Workspace Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mb-6">
              <button
                onClick={() => { setActiveTab('graphic'); setIsEditing(false); }}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'graphic'
                    ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Type className="w-3.5 h-3.5" /> Quote Card
              </button>
              <button
                onClick={() => { setActiveTab('caption'); }}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'caption'
                    ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Caption
              </button>
              <button
                onClick={() => { setActiveTab('video'); setIsEditing(false); }}
                className={`flex-1 py-1 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'video'
                    ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Video Story
              </button>
            </div>

            {/* TAB: Quote Card/Image Preview */}
            {activeTab === 'graphic' && (
              <div className="space-y-6">
                {/* Visual Rendering Frame resembling an elegant Mockup Frame */}
                <div className="w-full max-w-[340px] mx-auto bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                  {/* Mock Post Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-700">
                        {channels.find(c => c.connected)?.username?.substring(1, 3).toUpperCase() || 'AC'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-900 tracking-wide">
                          {channels.find(c => c.connected)?.username || "auracast_pro"}
                        </span>
                        <span className="text-[8px] text-slate-500">Sponsored Campaign</span>
                      </div>
                    </div>
                    <span className="text-slate-400 font-bold text-xs">•••</span>
                  </div>

                  {/* Absolute Canvas Frame inside Post Wrapper */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-inner border border-slate-200" style={{
                    backgroundColor: isEditing ? editBgColor : (content.graphicDesign.bgColor || '#0f172a'),
                    color: isEditing ? editTextColor : (content.graphicDesign.textColor || '#f8fafc')
                  }}>
                    {renderPatternBg(
                      isEditing ? editPattern : (content.graphicDesign.pattern || 'none'),
                      isEditing ? editAccentColor : (content.graphicDesign.accentColor || '#2563eb')
                    )}

                    <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-[8.5px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm" style={{
                          backgroundColor: (isEditing ? editAccentColor : (content.graphicDesign.accentColor || '#2563eb')) + '22',
                          color: isEditing ? editAccentColor : (content.graphicDesign.accentColor || '#2563eb')
                        }}>
                          {isEditing ? editGraphicTitle : content.graphicTitle}
                        </span>
                      </div>

                      <div className="flex-1 flex items-center justify-center my-4">
                        <p className={`text-sm sm:text-base font-semibold text-center leading-relaxed font-sans ${
                          (isEditing ? editPattern : content.graphicDesign.pattern) === 'cosmic' ? 'animate-pulse' : ''
                        }`} style={{
                          color: isEditing ? editTextColor : (content.graphicDesign.textColor || '#f8fafc')
                        }}>
                          "{isEditing ? editGraphicText : content.graphicText}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t pt-2.5" style={{
                        borderColor: (isEditing ? editTextColor : (content.graphicDesign.textColor || '#f8fafc')) + '11'
                      }}>
                        <span className="text-[8px] font-mono tracking-wider opacity-50">
                          @{channels.find(c => c.connected)?.username || "auracast"}
                        </span>
                        <span className="text-[8px] font-mono tracking-wider opacity-50">
                          {topic.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mock Action Bar */}
                  <div className="flex items-center justify-between text-slate-500 px-1 pt-1">
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 hover:text-rose-600 cursor-pointer" />
                      <MessageSquare className="w-4 h-4 hover:text-blue-600 cursor-pointer" />
                      <Share2 className="w-4 h-4 hover:text-emerald-600 cursor-pointer" />
                    </div>
                    <Bookmark className="w-4 h-4 hover:text-amber-600 cursor-pointer" />
                  </div>
                </div>

                {/* Generate Real Visual Layer using Flash Image */}
                <div className="border border-blue-100 bg-blue-50/40 p-4 rounded-xl flex items-start gap-4">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl border border-blue-200 mt-0.5 shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-xs font-bold text-slate-900 font-sans">Gemini Generative Illustration</h4>
                      <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 uppercase rounded">gemini-3.1-flash-lite-image</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans mb-2">
                      Generate custom-branded illustrations or graphics aligned with your topic.
                    </p>

                    {topic.imageUrl ? (
                      <div className="space-y-3 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dynamic Asset Created Successfully
                        </span>
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                          <img src={topic.imageUrl} alt="Generated Artwork" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                        <button
                          onClick={() => {
                            setCustomImagePrompt(content.videoScript.visualPrompt);
                            setShowImageGenerator(true);
                          }}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                        >
                          Generate another visual illustration
                        </button>
                      </div>
                    ) : (
                      <div>
                        {showImageGenerator ? (
                          <div className="space-y-3 mt-2">
                            <textarea
                              value={customImagePrompt}
                              onChange={(e) => setCustomImagePrompt(e.target.value)}
                              placeholder={`Describe the illustration rendering... e.g. ${content.videoScript.visualPrompt}`}
                              className="w-full text-xs p-3 bg-white border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-sans resize-none"
                              rows={2.5}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleImageGenerateClick}
                                disabled={actionLoading}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-2xs"
                              >
                                {actionLoading ? 'Synthesizing...' : 'Start Render'}
                              </button>
                              <button
                                onClick={() => setShowImageGenerator(false)}
                                className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold text-xs rounded-lg cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setCustomImagePrompt(content.videoScript.visualPrompt);
                              setShowImageGenerator(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                          >
                            Render Visual Illustration Artwork
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Feed Caption Workspace */}
            {activeTab === 'caption' && (
              <div className="space-y-5">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="caption-edit-textarea" className="text-xs font-semibold text-slate-700 uppercase tracking-widest font-sans mb-1.5 block">
                        Edit Social Post Caption
                      </label>
                      <textarea
                        id="caption-edit-textarea"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        rows={6}
                        className="w-full text-xs p-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-sans resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="hashtags-edit-input" className="text-xs font-semibold text-slate-700 uppercase tracking-widest font-sans mb-1.5 block">
                        Edit Keywords & Hashtags
                      </label>
                      <input
                        id="hashtags-edit-input"
                        type="text"
                        value={editHashtags}
                        onChange={(e) => setEditHashtags(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                      <span className="text-[10px] text-slate-500 font-sans mt-1.5 block">Comma separated list (e.g., Growth, Tech, Innovation)</span>

                      {/* AI Hashtag Injector Pill Panel */}
                      <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                        <span className="text-[10px] font-sans font-bold text-slate-600 uppercase tracking-wider block">Quick Inject High-Density Tags</span>
                        <div className="flex flex-wrap gap-1.5">
                          {trendingTags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                const currentTags = editHashtags.split(',').map(t => t.trim()).filter(Boolean);
                                if (!currentTags.includes(tag)) {
                                  setEditHashtags(prev => prev ? `${prev}, ${tag}` : tag);
                                  setToastMessage(`Injected hashtag #${tag}!`);
                                }
                              }}
                              className="px-2 py-0.5 text-[9px] font-mono rounded bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
                            >
                              +# {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI Platform specific Caption Transformer Panel */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-xs font-semibold text-slate-900 font-sans">Gemini AI Platform-Specific Transformer</span>
                        </div>
                        {isRewriting && (
                          <span className="text-[9px] font-mono text-blue-600 animate-pulse">Rewriting text...</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-600 font-sans">Optimize this caption layout tailored for high performance on other networks:</p>
                      
                      {/* Platform Buttons Row */}
                      <div className="flex flex-wrap gap-1.5">
                        {['linkedin', 'twitter', 'instagram', 'facebook', 'whatsapp'].map((platform) => (
                          <button
                            key={platform}
                            type="button"
                            disabled={isRewriting}
                            onClick={() => handleTailorCaption(platform)}
                            className={`px-3 py-1 text-[10px] font-sans font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                              selectedTailoredPlatform === platform
                                ? 'bg-blue-50 border-blue-300 text-blue-800'
                                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="capitalize">{platform}</span>
                          </button>
                        ))}
                      </div>

                      {/* Tailored Results Workspace Preview */}
                      {selectedTailoredPlatform && platformCaptions[selectedTailoredPlatform] && (
                        <div className="space-y-3 pt-3 border-t border-slate-200">
                          <div className="bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">Preview {selectedTailoredPlatform.toUpperCase()} Variant:</span>
                            <p className="text-xs text-slate-800 font-sans whitespace-pre-wrap">{platformCaptions[selectedTailoredPlatform].caption}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-100">
                              {platformCaptions[selectedTailoredPlatform].hashtags.map((tag) => (
                                <span key={tag} className="text-[10px] font-mono text-blue-600 font-semibold">#{tag}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                copyToClipboard(`${platformCaptions[selectedTailoredPlatform].caption}\n\n${platformCaptions[selectedTailoredPlatform].hashtags.map(t => `#${t}`).join(' ')}`);
                                setToastMessage(`Copied ${selectedTailoredPlatform.toUpperCase()} custom variation to clipboard!`);
                              }}
                              className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-[10px] rounded-lg transition-colors cursor-pointer"
                            >
                              Copy Variation
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyTailoredCaption(selectedTailoredPlatform)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                            >
                              Apply to Main Draft
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 text-slate-200">
                        <Sparkles className="w-10 h-10 opacity-30" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 font-sans uppercase relative z-10">
                        <Sparkles className="w-3.5 h-3.5" /> High-Conversions Smart Caption
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap relative z-10">
                        {content.caption}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200 relative z-10">
                        {content.hashtags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-xs text-blue-600 font-mono font-semibold hover:text-blue-800 cursor-pointer">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Read-Only platform options hint */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-semibold text-slate-900 font-sans block">Want specialized variations?</span>
                        <span className="text-[9px] text-slate-500 font-sans block">Click "Customize Layout" at top to tailor this text for LinkedIn, X, and Instagram using Gemini AI.</span>
                      </div>
                      <button
                        onClick={startEdit}
                        className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold rounded hover:bg-slate-50 cursor-pointer"
                      >
                        Start Editing
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Video Script Board Visualizer */}
            {activeTab === 'video' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold font-sans">TikTok / Shorts Storyboard Generated</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded shadow-2xs">
                    {content.videoScript.durationSeconds}s Storyboard
                  </span>
                </div>

                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {content.videoScript.narration.map((voice, idx) => {
                    const visualDescription = content.videoScript.visualStory[idx] || "Dynamic aesthetic b-roll footage transition";
                    return (
                      <div key={idx} className="border border-slate-200 bg-slate-50 hover:border-slate-300 p-3.5 rounded-xl flex gap-3 transition-all">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-start gap-1">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Narrator Speak:</span>
                            <p className="text-xs text-slate-900 font-sans font-medium">"{voice}"</p>
                          </div>
                          <div className="bg-white rounded-lg p-2.5 border border-slate-200 flex items-start gap-2">
                            <CornerDownRight className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-bold text-emerald-700 font-sans uppercase">Visual B-roll Directive</span>
                              <p className="text-[11px] text-slate-600 font-sans italic">{visualDescription}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-blue-900 text-[11px] font-sans flex gap-2">
                  <span className="text-blue-600">💡</span>
                  <span className="leading-relaxed"><strong>Audio Recommendation:</strong> Renders cleanly using background track: <em>"{content.videoScript.musicMood}"</em>. Feel free to use this storyboard sequence to record voiceovers.</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick customize options if editing quote card */}
          {activeTab === 'graphic' && isEditing && (
            <div className="mt-6 pt-5 border-t border-slate-200 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <div>
                <span className="text-[10px] font-sans font-bold text-slate-600 uppercase tracking-wider block mb-2">Preset Design Palettes</span>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setEditBgColor(preset.bg);
                        setEditTextColor(preset.text);
                        setEditAccentColor(preset.accent);
                        setEditPattern(preset.pattern);
                        setToastMessage(`Applied design theme: "${preset.name}"!`);
                      }}
                      className="px-2.5 py-1 text-[10px] font-medium font-sans rounded-lg border border-slate-200 hover:border-blue-500 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: preset.bg }} />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] font-sans font-bold text-slate-600 uppercase tracking-wider block mb-1">Bg Color</label>
                  <input
                    type="color"
                    value={editBgColor}
                    onChange={(e) => setEditBgColor(e.target.value)}
                    className="w-full h-8 rounded border border-slate-200 cursor-pointer bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-sans font-bold text-slate-600 uppercase tracking-wider block mb-1">Text Color</label>
                  <input
                    type="color"
                    value={editTextColor}
                    onChange={(e) => setEditTextColor(e.target.value)}
                    className="w-full h-8 rounded border border-slate-200 cursor-pointer bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-sans font-bold text-slate-600 uppercase tracking-wider block mb-1">Accent</label>
                  <input
                    type="color"
                    value={editAccentColor}
                    onChange={(e) => setEditAccentColor(e.target.value)}
                    className="w-full h-8 rounded border border-slate-200 cursor-pointer bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-sans font-bold text-slate-600 uppercase tracking-wider block mb-1">Pattern</label>
                  <select
                    value={editPattern}
                    onChange={(e) => setEditPattern(e.target.value as any)}
                    className="w-full h-8 py-1 px-2 bg-white border border-slate-200 text-slate-800 outline-hidden rounded text-xs"
                  >
                    <option value="none">Blank Plain</option>
                    <option value="dots">Dots Matrix</option>
                    <option value="grid">Grid Frame</option>
                    <option value="waves">Flowing Waves</option>
                    <option value="cosmic">Cosmic Flare</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Creative Asset Export & Production Download Center */}
          <div className="mt-6 pt-5 border-t border-slate-200 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-sans">Campaign Asset Production Center</h4>
                <p className="text-[10px] text-slate-500 font-sans">Export high-fidelity designs & content bundles for manual or physical posting pipelines</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleExportPNGCard}
                disabled={isExportingPng}
                className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold font-sans rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                {isExportingPng ? 'Exporting PNG...' : 'Download PNG Graphic'}
              </button>
              <button
                type="button"
                onClick={handleExportCampaignBundle}
                className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold font-sans rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                Export Campaign Bundle (MD)
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Posting Destinations & Publishing Action Controls (5 Columns) */}
        <div className="lg:col-span-5 p-6 bg-slate-50/60 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 font-sans tracking-tight mb-1">Publish Destination Setup</h3>
              <p className="text-xs text-slate-500 font-sans">Active Connections for auto-scheduling & instant post queues</p>
            </div>

            {/* Selected Accounts Visual Checklist */}
            <div className="space-y-2">
              {activeConnectedChannels.length === 0 ? (
                <div className="p-3.5 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 leading-relaxed font-sans">
                  ⚠️ No social media accounts connected. You cannot simulate posting until you authorize at least one channel in the sidebar connection manager.
                </div>
              ) : (
                channels.map((chan) => (
                  <div
                    key={chan.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      chan.connected
                        ? 'bg-white border-slate-200 shadow-2xs'
                        : 'bg-slate-100/60 border-slate-200 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${chan.connected ? 'bg-blue-600' : 'bg-slate-300'}`} />
                      <span className="text-xs font-semibold text-slate-800 font-sans">{chan.name}</span>
                    </div>
                    {chan.connected && (
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase">
                        @{chan.username || 'active'}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* AI Co-Pilot Engagement Performance Projection */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2 bg-blue-50 rounded-lg text-blue-700 text-[10px] font-mono font-bold uppercase border border-blue-200">CO-PILOT</span>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900 tracking-wide font-sans">Campaign Performance Optimizer</h4>
                  <p className="text-[9px] text-slate-500 font-sans mt-0.5">Estimated reach multipliers & tone metrics</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider font-sans block">Format Anchor</span>
                  <span className="text-[10px] font-semibold text-slate-900 mt-0.5 block capitalize font-sans">
                    {topic.toneGoal || 'conversational'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider font-sans block">Audience Spark Index</span>
                  <span className="text-[10px] font-bold text-emerald-700 mt-0.5 block font-mono">
                    {topic.toneGoal === 'mindset' ? '98.5' : topic.toneGoal === 'educational' ? '97.2' : topic.toneGoal === 'storytelling' ? '96.8' : '94.2'}/100
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div>
                  <div className="flex items-center justify-between text-[9px] font-sans pb-1">
                    <span className="text-slate-600">CTR Retention Probability</span>
                    <span className="text-blue-700 font-bold font-mono">
                      {topic.toneGoal === 'mindset' ? '92%' : topic.toneGoal === 'educational' ? '88%' : topic.toneGoal === 'storytelling' ? '94%' : '85%'}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: topic.toneGoal === 'mindset' ? '92%' : topic.toneGoal === 'educational' ? '88%' : topic.toneGoal === 'storytelling' ? '94%' : '85%' }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[9px] font-sans pb-1">
                    <span className="text-slate-600">Viral Hashtag Density</span>
                    <span className="text-emerald-700 font-bold font-mono">
                      {topic.generatedContent?.hashtags?.length ? `${Math.min(100, topic.generatedContent.hashtags.length * 20)}%` : '60%'}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: topic.generatedContent?.hashtags?.length ? `${Math.min(100, topic.generatedContent.hashtags.length * 20)}%` : '60%' }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Publishing/Scheduling Interface details */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              {topic.status === 'published' ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-emerald-700">Campaign Live</span>
                      <h4 className="text-[11px] font-sans font-bold text-slate-900 mt-0.5">Mock Active Listeners Active</h4>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  </div>

                  {/* Comments Thread list */}
                  <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1.5 scrollbar-thin">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[9px] font-mono font-bold text-blue-700 uppercase tracking-wider block">Live Engagement Thread</span>
                      <button
                        type="button"
                        disabled={isSimulatingComments}
                        onClick={handleSparkSimulatedComments}
                        className="px-2 py-0.5 text-[9px] bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold font-sans rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                        {isSimulatingComments ? 'Sparking...' : 'Spark reactions'}
                      </button>
                    </div>
                    {localComments.length === 0 ? (
                      <div className="p-3 text-center italic text-[11px] text-slate-500 border border-dashed border-slate-200 rounded-lg bg-white">
                        Waiting for initial viewer reactions...
                      </div>
                    ) : (
                      localComments.map((comment) => (
                        <div key={comment.id} className="p-2.5 rounded-lg bg-white border border-slate-200 leading-normal text-[11px] space-y-1 shadow-2xs">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              <img src={comment.avatar} alt={comment.author} className="w-4 h-4 rounded-full object-cover border border-slate-200" />
                              <span className="font-bold text-slate-900 text-[10.5px]">{comment.author}</span>
                              <span className="text-[9.5px] font-mono text-blue-600">{comment.handle}</span>
                            </div>
                            <span className="text-[8.5px] font-mono text-slate-400">
                              {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-700 font-sans pl-5">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comments input box */}
                  <form onSubmit={handleAddComment} className="space-y-2 mt-2 pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Reply Handle</label>
                      <select 
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        className="text-[9px] font-sans bg-white border border-slate-200 text-slate-700 rounded px-1.5 py-0.5"
                      >
                        <option value="Abel Creatives">Abel Creatives (@abel.creatives)</option>
                        <option value="Guest Visitor">Guest Visitor (@visitor)</option>
                        <option value="Elena Petrova">Elena Petrova (@elena.creative)</option>
                      </select>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Write a public comment response..."
                        className="flex-1 px-3 py-2 text-[11.5px] text-slate-900 placeholder-slate-400 bg-white border border-slate-200 rounded-lg focus:border-blue-600 focus:outline-hidden font-sans"
                        disabled={isSubmittingComment}
                      />
                      <button
                        type="submit"
                        disabled={!commentInput.trim() || isSubmittingComment}
                        className="px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        {isSubmittingComment ? 'Sending...' : 'Post'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      // Populate with existing instagram credentials if already connected
                      const existingInsta = channels.find(c => c.id === 'instagram');
                      if (existingInsta && existingInsta.connected) {
                        setInstaHandle(existingInsta.username || '@abel_instagram');
                        if (existingInsta.accessToken) {
                          setInstaToken(existingInsta.accessToken);
                          setInstaBusinessId(existingInsta.businessId || '');
                          setInstaIntegrationMode('live');
                        } else {
                          setInstaIntegrationMode('sandbox');
                        }
                      }
                      
                      // Pre-select all connected channels by default
                      const connectedIds = channels.filter(c => c.connected).map(c => c.id);
                      setSelectedChannelsForModal(connectedIds);
                      setShowPublishModal(true);
                    }}
                    disabled={actionLoading}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold font-sans tracking-wide transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {actionLoading ? 'Posting Daily Content...' : 'Publish Instantly Now'}
                  </button>

                  <div className="space-y-2">
                    {showScheduler ? (
                      <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs">
                        <label htmlFor="publish-datetime-picker" className="text-xs font-bold font-sans text-slate-800 block">Select Target Date & Time</label>
                        <input
                          id="publish-datetime-picker"
                          type="datetime-local"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 text-slate-900 rounded-lg font-mono focus:border-blue-600"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (scheduledDate) {
                                const connectedIds = channels.filter(c => c.connected).map(c => c.id);
                                onSchedule(topic.id, new Date(scheduledDate).toISOString(), connectedIds.length > 0 ? connectedIds : ['instagram']);
                                setShowScheduler(false);
                              }
                            }}
                            disabled={!scheduledDate || actionLoading}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                          >
                            Confirm Schedule
                          </button>
                          <button
                            onClick={() => setShowScheduler(false)}
                            className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold text-xs rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowScheduler(true)}
                        disabled={actionLoading}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold font-sans tracking-wide transition-all flex items-center justify-center gap-2 border cursor-pointer border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-2xs"
                      >
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Schedule Publishing Later
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Prompt status display info */}
          <div className="pt-6 border-t border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 leading-normal font-sans block">
              The autonomous scheduler converts graphic assets, copy vectors, and video outlines and dispatches payloads to selected channels.
            </span>
          </div>
        </div>
      </div>

      {/* Facebook Publishing & Confirmation Wizard Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl p-6 relative overflow-hidden">
            {publishedChannels ? (
              <>
                <div className="text-center py-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                    Published Successfully
                  </h3>
                  <p className="text-xs text-slate-600 font-sans mt-1">
                    Content sent to <strong className="text-slate-900 font-semibold">{channels.find(c => c.id === 'facebook')?.username || 'Facebook Page'}</strong>
                  </p>
                </div>

                <div className="space-y-3 my-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                    <span className="font-semibold text-slate-700">Target Facebook Page:</span>
                    <span className="font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-bold">
                      {channels.find(c => c.id === 'facebook')?.username || 'Facebook Page'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Status:</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dispatched via Meta Graph API
                    </span>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Published Content Preview</span>
                    <p className="text-xs text-slate-700 line-clamp-3 bg-white p-2.5 rounded-lg border border-slate-200 italic">
                      "{topic.generatedContent?.caption || topic.topic}"
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                  <a
                    href={topic.facebookPostUrl || (channels.find(c => c.id === 'facebook')?.businessId ? `https://www.facebook.com/${channels.find(c => c.id === 'facebook')?.businessId}` : 'https://www.facebook.com')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-all text-center flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View on Facebook
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setPublishedChannels(null);
                      setShowPublishModal(false);
                    }}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-all text-center cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Top aesthetic gradients */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500" />
                
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">Review Center & Campaign Launchpad</span>
                    <h3 className="text-base font-display font-bold text-white tracking-tight flex items-center gap-1.5 mt-0.5">
                      <Zap className="w-4 h-4 text-amber-400" /> Campaign Launch Control
                    </h3>
                  </div>
                  <button 
                    onClick={() => setShowPublishModal(false)}
                    className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-950 rounded-lg border border-slate-800 font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Campaign Title Box */}
                  <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" /> Campaign Title
                    </label>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-white font-sans">
                      {topic.topic}
                    </div>
                  </div>

                  {/* Publish To Checkboxes */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono block">
                      Publish to:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { id: 'facebook', name: 'Facebook Page', icon: '📘' },
                        { id: 'instagram', name: 'Instagram Business', icon: '📸' },
                        { id: 'youtube', name: 'YouTube Shorts', icon: '🎬' },
                        { id: 'twitter', name: 'X (Twitter)', icon: '🐦' },
                      ].map(item => {
                        const isSelected = selectedChannelsForModal.includes(item.id);
                        return (
                          <label 
                            key={item.id} 
                            className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all select-none ${
                              isSelected ? 'bg-indigo-500/10 border-indigo-500/50 text-white' : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  if (isSelected) {
                                    setSelectedChannelsForModal(selectedChannelsForModal.filter(id => id !== item.id));
                                  } else {
                                    setSelectedChannelsForModal([...selectedChannelsForModal, item.id]);
                                  }
                                }}
                                className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 bg-slate-900 cursor-pointer"
                              />
                              <span className="text-xs font-semibold">{item.icon} {item.name}</span>
                            </div>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          </label>
                        );
                      })}
                    </div>
                    
                    {/* Separate WhatsApp Row */}
                    <div className="pt-1">
                      <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        selectedChannelsForModal.includes('whatsapp') ? 'bg-emerald-500/10 border-emerald-500/40 text-white' : 'bg-slate-950/60 border-slate-850 text-slate-400'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={selectedChannelsForModal.includes('whatsapp')}
                            onChange={() => {
                              if (selectedChannelsForModal.includes('whatsapp')) {
                                setSelectedChannelsForModal(selectedChannelsForModal.filter(id => id !== 'whatsapp'));
                              } else {
                                setSelectedChannelsForModal([...selectedChannelsForModal, 'whatsapp']);
                              }
                            }}
                            className="rounded border-slate-800 text-emerald-600 focus:ring-emerald-500 bg-slate-900 cursor-pointer"
                          />
                          <span className="text-xs font-semibold text-slate-300">💬 WhatsApp Messaging</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Direct Messaging Hub
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Schedule Block */}
                  <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" /> Schedule Publishing
                      </label>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">Target: Today — 6:00 PM</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="flex-1 text-xs p-2 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg font-mono focus:border-indigo-500/50"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          now.setHours(18, 0, 0, 0);
                          setScheduledDate(now.toISOString().slice(0, 16));
                        }}
                        className="px-3 py-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                      >
                        Optimal (6 PM)
                      </button>
                    </div>
                  </div>

                  {/* AI Optimization Box */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Optimization Checklist
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Facebook caption: <strong className="text-emerald-400 font-mono">optimized</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Instagram caption: <strong className="text-emerald-400 font-mono">optimized</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>YouTube title: <strong className="text-emerald-400 font-mono">optimized</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Hashtags: <strong className="text-emerald-400 font-mono">optimized</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300 col-span-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Thumbnail / Graphic Card: <strong className="text-emerald-400 font-mono">generated</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-850 flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowPublishModal(false)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-200 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                      disabled={isPublishConfigSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (selectedChannelsForModal.length === 0) return;
                        setIsPublishConfigSubmitting(true);
                        try {
                          if (scheduledDate) {
                            await onSchedule(topic.id, new Date(scheduledDate).toISOString(), selectedChannelsForModal);
                          } else {
                            await onPublish(topic.id, selectedChannelsForModal);
                          }

                          const captionTxt = topic.generatedContent?.caption || topic.topic;
                          const hashtagsTxt = topic.generatedContent?.hashtags?.map(h => `#${h}`).join(' ') || '';
                          const formattedMsg = `${captionTxt}\n\n${hashtagsTxt}`;
                          const videoScriptTxt = topic.generatedContent?.videoScript?.narration?.join('\n') || formattedMsg;
                          let toastParts: string[] = [];

                          if (selectedChannelsForModal.includes('facebook')) {
                            toastParts.push("Facebook Page (AuraCast-Media)");
                          }

                          if (selectedChannelsForModal.includes('whatsapp')) {
                            toastParts.push("WhatsApp");
                          }

                          if (selectedChannelsForModal.includes('twitter')) {
                            toastParts.push("Twitter/X");
                          }

                          if (selectedChannelsForModal.includes('instagram')) {
                            toastParts.push("Instagram");
                          }

                          if (selectedChannelsForModal.includes('youtube')) {
                            toastParts.push("YouTube");
                          }

                          if (toastParts.length > 0) {
                            setToastMessage(`Content published successfully to ${toastParts.join(", ")}!`);
                            setTimeout(() => setToastMessage(null), 8000);
                          }

                          setPublishedChannels(selectedChannelsForModal);
                          setIsPublishConfigSubmitting(false);
                        } catch (err: any) {
                          console.error("Publishing error:", err);
                          setToastMessage(`Publishing failed: ${err.message || err}`);
                          setIsPublishConfigSubmitting(false);
                        }
                      }}
                      disabled={isPublishConfigSubmitting || selectedChannelsForModal.length === 0}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
                    >
                      {isPublishConfigSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Publishing to Facebook...
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 text-white" /> Publish to Facebook Page
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);
}
