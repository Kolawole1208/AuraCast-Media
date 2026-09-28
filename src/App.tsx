import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TopicItem, SocialChannel, ActivityLog, MarketingStrategy, AutonomousCampaign, BrandKit, AdvancedVideoStudioProject, AnalyticsIntelligence, AILearningLoopData, InboxSummary, TeamWorkspace, TeamRole, ApprovalWorkflowPost, ContentLibraryData, LibraryAsset, AISearchResult } from './types';
import TopicCreator from './components/TopicCreator';
import ContentWorkspace from './components/ContentWorkspace';
import ChannelManager from './components/ChannelManager';
import ActivityLogs from './components/ActivityLogs';
import AICopilot from './components/AICopilot';
import StrategyEngine from './components/StrategyEngine';
import ContentCalendar from './components/ContentCalendar';
import AutonomousCampaignBuilder from './components/AutonomousCampaignBuilder';
import BrandKitManager from './components/BrandKitManager';
import AIVideoStudio from './components/AIVideoStudio';
import AuraCastInsights from './components/AuraCastInsights';
import AILearningLoopEngine from './components/AILearningLoopEngine';
import UnifiedSocialInbox from './components/UnifiedSocialInbox';
import TeamCollaboration from './components/TeamCollaboration';
import ContentLibraryWorkspace from './components/ContentLibraryWorkspace';
import ContentRepurposer from './components/ContentRepurposer';
import AIContentSearch from './components/AIContentSearch';
import ABTestingStudio from './components/ABTestingStudio';
import TrendRadar from './components/TrendRadar';
import CompetitorIntelligence from './components/CompetitorIntelligence';
import LeadConversionTracker from './components/LeadConversionTracker';
import SmartLinkManager from './components/SmartLinkManager';
import SmartNotificationsBar from './components/SmartNotificationsBar';
import EnterpriseSecuritySuite from './components/EnterpriseSecuritySuite';
import SubscriptionBillingManager from './components/SubscriptionBillingManager';
import AuraCastAPIStudio from './components/AuraCastAPIStudio';
import AuraCopilotBrain from './components/AuraCopilotBrain';
import AIMarketingCommandCenter from './components/AIMarketingCommandCenter';
import AuthPage from './components/AuthPage';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { Sparkles, Library, AlertTriangle, RefreshCw, CalendarRange, ListFilter, Plus, LogOut, User as UserIcon, LayoutDashboard, Brain, Palette, Calendar, MessageSquare, BarChart3, Users, Code2, Settings, Send, HelpCircle, Layers, Menu, X, Search, Bell, BellRing, ChevronDown, TrendingDown, Flame, FileText, Zap, Bot, Video, Sliders, Target, UserCheck, Share2, ShieldCheck } from 'lucide-react';

export type PageTab =
  | 'dashboard'
  | 'copilot'
  | 'strategy'
  | 'studio'
  | 'calendar'
  | 'inbox'
  | 'analytics'
  | 'settings'
  | 'developer'
  | 'video'
  | 'brandkit'
  | 'campaigns'
  | 'leads'
  | 'channels'
  | 'security'
  | 'repurpose';

async function safeFetchJson(url: string, options?: RequestInit, retries = 2): Promise<any> {
  const customHeaders = { ...(options?.headers as Record<string, string>) };
  
  // Inject authenticated user ID if logged in
  if (auth.currentUser) {
    customHeaders['x-user-id'] = auth.currentUser.uid;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders
      }
    });
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      if (text.includes('<!DOCTYPE') || text.includes('<!doctype') || text.includes('<html')) {
        throw new Error('The server is initializing or restarting. Please wait a few seconds and try again.');
      }
      throw new Error(text || `Server returned an invalid content-type: ${contentType}`);
    }
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Operation failed');
    }
    return data;
  } catch (err: any) {
    if (retries > 0 && (err.name === 'TypeError' || err.message?.includes('Failed to fetch'))) {
      await new Promise((r) => setTimeout(r, 800));
      return safeFetchJson(url, options, retries - 1);
    }
    if (err.message === 'Failed to fetch') {
      throw new Error('Connecting to server... Please check your internet connection or retry in a moment.');
    }
    throw err;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPillarsModalOpen, setIsPillarsModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [channels, setChannels] = useState<SocialChannel[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [strategy, setStrategy] = useState<MarketingStrategy | undefined>(undefined);
  const [campaign, setCampaign] = useState<AutonomousCampaign | undefined>(undefined);
  const [brandKit, setBrandKit] = useState<BrandKit | undefined>(undefined);
  const [videoProject, setVideoProject] = useState<AdvancedVideoStudioProject | undefined>(undefined);
  const [analytics, setAnalytics] = useState<AnalyticsIntelligence | undefined>(undefined);
  const [learningLoop, setLearningLoop] = useState<AILearningLoopData | undefined>(undefined);
  const [inbox, setInbox] = useState<InboxSummary | undefined>(undefined);
  const [team, setTeam] = useState<TeamWorkspace | undefined>(undefined);
  const [library, setLibrary] = useState<ContentLibraryData | undefined>(undefined);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PageTab>('dashboard');

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        loadDashboardData(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load backend content
  const loadDashboardData = async (shouldTriggerLoader = true) => {
    if (shouldTriggerLoader) setLoading(true);
    try {
      const data = await safeFetchJson('/api/dashboard');
      setTopics(data.topics || []);
      setChannels(data.channels || []);
      setLogs(data.logs || []);
      if (data.strategy) setStrategy(data.strategy);
      if (data.brandKit) setBrandKit(data.brandKit);
      if (data.activeVideoProject) setVideoProject(data.activeVideoProject);
      if (data.analytics) setAnalytics(data.analytics);
      if (data.learningLoop) setLearningLoop(data.learningLoop);
      if (data.inbox) setInbox(data.inbox);
      if (data.team) setTeam(data.team);
      if (data.library) setLibrary(data.library);
      if (data.activeCampaign) {
        setCampaign(data.activeCampaign);
      } else if (data.campaigns && data.campaigns.length > 0) {
        setCampaign(data.campaigns[0]);
      }

      if (!data.analytics) {
        const anData = await safeFetchJson('/api/analytics');
        if (anData.analytics) setAnalytics(anData.analytics);
      }
      if (!data.learningLoop) {
        const lrnData = await safeFetchJson('/api/learning-loop');
        if (lrnData.learningLoop) setLearningLoop(lrnData.learningLoop);
      }
      if (!data.inbox) {
        const ibxData = await safeFetchJson('/api/inbox');
        if (ibxData.inbox) setInbox(ibxData.inbox);
      }
      if (!data.team) {
        const tmData = await safeFetchJson('/api/team');
        if (tmData.team) setTeam(tmData.team);
      }
      if (!data.library) {
        const libData = await safeFetchJson('/api/library');
        if (libData.library) setLibrary(libData.library);
      }

      if (data.topics && data.topics.length > 0 && !selectedTopicId) {
        setSelectedTopicId(data.topics[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      if (shouldTriggerLoader) setLoading(false);
    }
  };

  const handleAddLibraryAsset = async (asset: Omit<LibraryAsset, 'id' | 'createdAt'>) => {
    setActionLoading(true);
    try {
      const res = await safeFetchJson('/api/library/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asset)
      });
      if (res.library) setLibrary(res.library);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecuteAISearch = async (query: string): Promise<AISearchResult> => {
    const res = await safeFetchJson('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    return res.result;
  };

  const handleGenerateStrategy = async () => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/strategy/generate', { method: 'POST' });
      setStrategy(data.strategy);
      setLogs(data.logs);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSparkTopic = async (topicTitle: string, suggestedChannels?: string[], toneGoal?: string) => {
    await handleAddTopic(topicTitle, suggestedChannels || ['facebook'], toneGoal || 'conversational');
    setActiveTab('dashboard');
  };

  const handleGenerateCampaign = async () => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/campaigns/generate', { method: 'POST' });
      setCampaign(data.campaign);
      setLogs(data.logs);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveCampaign = async () => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/campaigns/approve', { method: 'POST' });
      setCampaign(data.campaign);
      setLogs(data.logs);
      await loadDashboardData(false);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveBrandKit = async (kit: BrandKit) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/brand-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kit)
      });
      setBrandKit(data.brandKit);
      setLogs(data.logs);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateVideoProject = async (prompt: string, format: AdvancedVideoStudioProject['format']) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, format })
      });
      setVideoProject(data.project);
      setLogs(data.logs);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveVideoProjectToCalendar = async (proj?: AdvancedVideoStudioProject) => {
    const targetProject = proj || videoProject;
    if (!targetProject) return;
    setActionLoading(true);
    try {
      await safeFetchJson('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `[Video Reel] ${targetProject.title}`,
          channels: ['facebook', 'instagram', 'youtube'],
          toneGoal: 'educational'
        })
      });
      await loadDashboardData(false);
      setActiveTab('calendar');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefreshAnalytics = async () => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/analytics');
      setAnalytics(data.analytics);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRunLearningCycle = async () => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/learning-loop/run', { method: 'POST' });
      setLearningLoop(data.learningLoop);
      setLogs(data.logs);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendReply = async (threadId: string, text: string) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/inbox/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, text })
      });
      setInbox(data.inbox);
      setLogs(data.logs);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuggestReply = async (threadId: string) => {
    const data = await safeFetchJson('/api/inbox/suggest-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId })
    });
    return data.suggestedReply;
  };

  const handleRefreshInbox = async () => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/inbox');
      setInbox(data.inbox);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleInviteMember = async (email: string, role: TeamRole) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      setTeam(data.team);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprovePost = async (postId: string) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/team/approve-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      });
      setTeam(data.team);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestChanges = async (postId: string, notes: string) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/team/request-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, notes })
      });
      setTeam(data.team);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitPostForReview = async (post: Omit<ApprovalWorkflowPost, 'id' | 'createdAt' | 'status'>) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/team/submit-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      setTeam(data.team);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRescheduleTopic = async (topicId: string, newDate: string) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson(`/api/topics/${topicId}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate })
      });
      if (data.topics) setTopics(data.topics);
      if (data.logs) setLogs(data.logs);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateTopicStatus = async (topicId: string, newStatus: TopicItem['status']) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson(`/api/topics/${topicId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (data.topics) setTopics(data.topics);
      if (data.logs) setLogs(data.logs);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddTopic = async (topicText: string, targetChannels: string[], toneGoal?: string) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicText, channels: targetChannels, toneGoal }),
      });
      setTopics(data.topics);
      setLogs(data.logs);
      setSelectedTopicId(data.topic.id);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleChannel = async (
    channelId: string, 
    username?: string, 
    accessToken?: string, 
    businessId?: string, 
    action?: 'connect' | 'disconnect' | 'toggle',
    apiKey?: string,
    autoPostEnabled?: boolean
  ) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson('/api/channels/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId, username, accessToken, businessId, action, apiKey, autoPostEnabled }),
      });
      setChannels(data.channels);
      setLogs(data.logs);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async (topicId: string, publishChannels: string[]) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson(`/api/topics/${topicId}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channels: publishChannels }),
      });
      setTopics(data.topics);
      setLogs(data.logs);
      return data;
    } catch (err: any) {
      setErrorMessage(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleSchedule = async (topicId: string, scheduledFor: string, publishChannels: string[]) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson(`/api/topics/${topicId}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledFor, channels: publishChannels }),
      });
      setLogs(data.logs);
      await loadDashboardData(false);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (topicId: string, updatedFields: any) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson(`/api/topics/${topicId}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      setLogs(data.logs);
      await loadDashboardData(false);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (topicId: string) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson(`/api/topics/${topicId}/delete`, { method: 'POST' });
      setTopics(data.topics);
      setLogs(data.logs);
      if (selectedTopicId === topicId) {
        setSelectedTopicId(data.topics.length > 0 ? data.topics[0].id : null);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateImage = async (topicId: string, promptText: string) => {
    setActionLoading(true);
    try {
      const data = await safeFetchJson(`/api/topics/${topicId}/generate-ai-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });
      setLogs(data.logs);
      await loadDashboardData(false);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const activeTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  const handleNavigateModule = (moduleId: string) => {
    switch (moduleId) {
      case 'strategy':
      case 'campaign':
      case 'trends':
        setActiveTab('strategy');
        break;
      case 'calendar':
        setActiveTab('calendar');
        break;
      case 'brandkit':
        setActiveTab('studio');
        break;
      case 'analytics':
      case 'learning':
      case 'conversion':
        setActiveTab('analytics');
        break;
      case 'inbox':
        setActiveTab('inbox');
        break;
      case 'team':
        setActiveTab('settings');
        break;
      default:
        setActiveTab('dashboard');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-2xs">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Loading AuraCast Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative selection:bg-blue-100">
      {/* Alert Banner */}
      {errorMessage && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white px-6 py-2.5 flex items-center justify-between text-xs z-50 shadow-md">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-white hover:underline text-xs font-semibold px-2 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 🏛️ TOP HEADER (Clean Enterprise Style) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-6 py-2.5 shadow-2xs flex items-center justify-between gap-4">
        {/* LEFT BRANDING */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-600 hover:text-slate-900 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-tight leading-none">AURACAST</h1>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono">
                  ENTERPRISE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="relative max-w-md w-full hidden md:flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search campaigns, modules, channels, assets..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-ai-copilot'))}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">AI Advisor</span>
          </button>

          {/* NOTIFICATION BELL */}
          <button 
            onClick={() => setActiveTab('inbox')}
            className="relative p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {inbox?.unreadCount ? (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {inbox.unreadCount}
              </span>
            ) : null}
          </button>

          {/* USER AVATAR */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div 
                className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 cursor-pointer"
                title={user.email || 'User'}
              >
                {user.email ? user.email.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
            </div>
          ) : null}
        </div>
      </header>

      {/* 🏛️ STREAMLINED TOP NAVIGATION BAR */}
      <nav className="bg-white border-b border-slate-200 px-4 md:px-6 py-2 sticky top-[53px] z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col gap-1.5 w-full">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full">
            {/* 1. DASHBOARD */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
              <span>Dashboard</span>
            </button>

            {/* 2. AI COPILOT */}
            <button
              onClick={() => setActiveTab('copilot')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'copilot'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Brain className="w-3.5 h-3.5 shrink-0 text-blue-600" />
              <span>Aura Copilot</span>
            </button>

            {/* 3. CREATE */}
            {(() => {
              const isCreateActive = ['studio', 'video', 'brandkit'].includes(activeTab);
              return (
                <div className="relative group/navdropdown shrink-0">
                  <button
                    onClick={() => setActiveTab('studio')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isCreateActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5 shrink-0" />
                    <span>Create</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-52 p-1.5 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover/navdropdown:opacity-100 group-hover/navdropdown:pointer-events-auto transition-all z-50 space-y-0.5">
                    <button
                      onClick={() => setActiveTab('studio')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'studio' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <Palette className="w-3.5 h-3.5 text-blue-600" />
                      <span>Content Studio</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('video')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'video' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <Video className="w-3.5 h-3.5 text-blue-600" />
                      <span>AI Video Studio</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('brandkit')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'brandkit' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <Sliders className="w-3.5 h-3.5 text-blue-600" />
                      <span>Brand Kit Manager</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 4. PLAN */}
            {(() => {
              const isPlanActive = ['strategy', 'calendar', 'campaigns'].includes(activeTab);
              return (
                <div className="relative group/navdropdown shrink-0">
                  <button
                    onClick={() => setActiveTab('strategy')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isPlanActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Plan</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-52 p-1.5 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover/navdropdown:opacity-100 group-hover/navdropdown:pointer-events-auto transition-all z-50 space-y-0.5">
                    <button
                      onClick={() => setActiveTab('strategy')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'strategy' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <Target className="w-3.5 h-3.5 text-blue-600" />
                      <span>Strategy & Campaigns</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'calendar' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Calendar Planner</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('campaigns')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'campaigns' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <Bot className="w-3.5 h-3.5 text-blue-600" />
                      <span>Autonomous Builder</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 5. ENGAGE */}
            {(() => {
              const isEngageActive = ['inbox', 'leads', 'channels'].includes(activeTab);
              return (
                <div className="relative group/navdropdown shrink-0">
                  <button
                    onClick={() => setActiveTab('inbox')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isEngageActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>Engage</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-52 p-1.5 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover/navdropdown:opacity-100 group-hover/navdropdown:pointer-events-auto transition-all z-50 space-y-0.5">
                    <button
                      onClick={() => setActiveTab('inbox')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'inbox' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Social Inbox & Comments</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('leads')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'leads' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Lead Conversion Tracker</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('channels')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'channels' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <Share2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Channel Manager</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 6. ANALYTICS */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'analytics'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              <span>Analytics</span>
            </button>

            {/* 7. WORKSPACE */}
            {(() => {
              const isWorkspaceActive = ['settings', 'developer', 'security'].includes(activeTab);
              return (
                <div className="relative group/navdropdown shrink-0">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isWorkspaceActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span>Workspace</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                  <div className="absolute top-full right-0 mt-1 w-52 p-1.5 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover/navdropdown:opacity-100 group-hover/navdropdown:pointer-events-auto transition-all z-50 space-y-0.5">
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>Team & Workspace</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('developer')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'developer' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <Code2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Developer API</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${activeTab === 'security' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Enterprise Security</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </nav>

      {/* 🏛️ FULL PORTAL LAYOUT */}
      <div className="flex-1 flex min-w-0 relative z-10">
        {/* 🏛️ LEFT SIDEBAR */}
        <aside className={`w-64 bg-white border-r border-slate-200 flex-col justify-between p-4 shrink-0 transition-all duration-300 max-h-[calc(100vh-100px)] overflow-y-auto sticky top-[100px] ${isSidebarOpen ? 'flex' : 'hidden md:flex'}`}>
          <div className="space-y-4">
            {/* PORTAL STATUS */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                WORKSPACE
              </span>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <LayoutDashboard className="w-4 h-4 text-blue-600" />
                <span>Marketing Operations</span>
              </div>
            </div>

            {/* COPILOT BRAIN HERO BUTTON */}
            <button
              onClick={() => {
                setActiveTab('copilot');
                setTimeout(() => {
                  const el = document.getElementById('copilot-ai-brain');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-left shadow-2xs ${
                activeTab === 'copilot'
                  ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Brain className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">Aura Copilot Brain</div>
                  <p className="text-[10px] text-slate-500 truncate">AI Command Hub</p>
                </div>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            </button>

            {/* COPILOT QUICK COMMANDS */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-1 block">
                Quick AI Directives
              </span>

              {[
                { type: 'CREATE_CAMPAIGN', label: 'Create Campaign', prompt: 'Create a comprehensive multi-channel campaign for our Q4 product launch.' },
                { type: 'EXPLAIN_ENGAGEMENT_DROP', label: 'Diagnose Engagement', prompt: 'Analyze our engagement drop across Instagram and LinkedIn over the last 14 days.' },
                { type: 'SCHEDULE_NEXT_WEEK', label: 'Auto-Schedule Week', prompt: "Auto-schedule next week's optimal posts across high-traffic audience windows." },
                { type: 'SHOW_TOP_PERFORMING', label: 'Show Top Content', prompt: 'Retrieve our top 3 highest-converting vertical video reels and carousel posts.' }
              ].map((directive) => (
                <button
                  key={directive.type}
                  onClick={() => {
                    setActiveTab('copilot');
                    setTimeout(() => {
                      const el = document.getElementById('copilot-ai-brain');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                    window.dispatchEvent(
                      new CustomEvent('trigger-copilot-directive', {
                        detail: { type: directive.type, prompt: directive.prompt }
                      })
                    );
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/60 transition-colors cursor-pointer truncate"
                >
                  {directive.label}
                </button>
              ))}
            </div>

            {/* HELP & RESOURCES */}
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-1 block mb-1">
                Resources
              </span>

              <button
                onClick={() => setIsPillarsModalOpen(true)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>10 Core Pillars</span>
              </button>

              <button
                onClick={() => setIsAlertsModalOpen(true)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BellRing className="w-3.5 h-3.5 text-slate-500" />
                  <span>System Alerts</span>
                </div>
                <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  4
                </span>
              </button>
            </div>
          </div>

          {/* SIDEBAR FOOTER */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Connected
              </span>
              <button
                onClick={() => loadDashboardData(true)}
                disabled={loading || actionLoading}
                className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                title="Sync Workspace"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${(loading || actionLoading) ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {user && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-600 truncate max-w-[140px] font-medium">
                  {user.email || 'Admin'}
                </span>
                <button
                  onClick={() => signOut(auth)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* 🏛️ MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 p-4 md:p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-3" />
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Loading Dashboard...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="space-y-6 max-w-7xl mx-auto"
              >
            {/* PAGE 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Executive Marketing Pulse Hero Banner */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 flex flex-col md:flex-row items-stretch justify-between gap-6">
                  <div className="max-w-xl space-y-3">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Executive Marketing Status
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                      Good morning, Abel. Here's your marketing summary.
                    </h2>
                    <p className="text-xs text-slate-600 font-normal leading-relaxed max-w-md">
                      Your content performance is currently <strong className="text-slate-900 font-semibold">18.2% above baseline</strong> across connected social channels this week.
                    </p>

                    {/* KEY METRICS */}
                    <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">Estimated Reach</span>
                        <span className="text-base font-bold text-slate-900 tracking-tight">240.5k <span className="text-xs text-emerald-600 font-semibold">+18.2%</span></span>
                      </div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">Avg Engagement</span>
                        <span className="text-base font-bold text-slate-900 tracking-tight">7.4% <span className="text-xs text-emerald-600 font-semibold">+2.4%</span></span>
                      </div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">Social Score</span>
                        <span className="text-base font-bold text-blue-600">98.4 <span className="text-xs text-slate-400 font-normal">/100</span></span>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONABLE AI RECOMMENDATION CARD */}
                  <div className="flex flex-col justify-between gap-3 min-w-[280px] md:max-w-xs bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Brain className="w-3.5 h-3.5 text-blue-600" />
                          AI Recommendation
                        </span>
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                          Optimal Time
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Publish your next post between <strong className="text-slate-900">7:00–9:00 PM</strong> to maximize engagement rate on Facebook.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('copilot');
                        setTimeout(() => {
                          const el = document.getElementById('copilot-ai-brain');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                        window.dispatchEvent(
                          new CustomEvent('trigger-copilot-directive', {
                            detail: {
                              type: 'SCHEDULE_NEXT_WEEK',
                              prompt: 'Publish and schedule our next campaign between 7:00 PM and 9:00 PM today.'
                            }
                          })
                        );
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>Execute Recommendation</span>
                    </button>
                  </div>
                </div>

                {/* Quick Workspace Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-4 space-y-6">
                    <TopicCreator
                      channels={channels}
                      onAddTopic={handleAddTopic}
                      loading={actionLoading}
                    />
                  </div>
                  <div className="lg:col-span-8 space-y-6">
                    {activeTopic ? (
                      <ContentWorkspace
                        topic={activeTopic}
                        channels={channels}
                        onPublish={handlePublish}
                        onSchedule={handleSchedule}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onGenerateImage={handleGenerateImage}
                        actionLoading={actionLoading}
                        onToggleChannel={handleToggleChannel}
                      />
                    ) : (
                      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs flex flex-col items-center justify-center min-h-[300px]">
                        <Sparkles className="w-8 h-8 text-slate-300 mb-2" />
                        <h3 className="text-sm font-semibold text-slate-900">Workspace Ready</h3>
                        <p className="text-xs text-slate-500 max-w-xs mt-1">
                          Enter a topic on the left to generate content and publish to Facebook.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PAGE: COPILOT AI BRAIN HUB */}
            {activeTab === 'copilot' && (
              <div className="space-y-6">
                <div id="copilot-ai-brain" className="scroll-mt-6">
                  <AuraCopilotBrain
                    onExecuteCommand={async (commandType, prompt) => {
                      const res = await safeFetchJson('/api/copilot/execute', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ commandType, prompt })
                      });
                      if (res.topics) setTopics(res.topics);
                      if (res.logs) setLogs(res.logs);
                      return res;
                    }}
                    onApplyGeneratedPosts={(posts) => {
                      if (posts && posts.length > 0) {
                        const first = posts[0];
                        setTopics((prev) => [
                          {
                            id: `top_${Date.now()}`,
                            title: first.title,
                            angleCategory: 'Educational & Mindset',
                            suggestedFormats: first.platforms || ['instagram', 'tiktok'],
                            targetAudience: 'Growth Seekers',
                            viralHook: first.title,
                            estimatedEngagementRate: '8.4%',
                            generatedCaptions: {
                              instagram: first.caption,
                              tiktok: first.caption,
                              twitter: first.caption,
                              facebook: first.caption,
                              linkedin: first.caption
                            }
                          },
                          ...prev
                        ]);
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* PAGE 2: STRATEGY & CAMPAIGNS */}
            {activeTab === 'strategy' && (
              <div className="space-y-6">
                <StrategyEngine
                  strategy={strategy}
                  onGenerateStrategy={handleGenerateStrategy}
                  onSparkTopic={handleSparkTopic}
                  loading={actionLoading}
                  activeConnectedChannels={channels.filter(c => c.connected).map(c => c.id)}
                />

                <AutonomousCampaignBuilder
                  campaign={campaign}
                  onGenerateCampaign={handleGenerateCampaign}
                  onApproveCampaign={handleApproveCampaign}
                  loading={actionLoading}
                />

                <ABTestingStudio
                  onCreateExperiment={async (exp) => {
                    await safeFetchJson('/api/ab-tests', {
                      method: 'POST',
                      body: JSON.stringify(exp)
                    });
                  }}
                  loading={actionLoading}
                />

                <TrendRadar
                  onCreateTrendContent={(trend) => {
                    handleSparkTopic(trend.topic, ['facebook', 'instagram', 'twitter'], 'Educational & Mindset');
                  }}
                />
              </div>
            )}

            {/* PAGE 3: CONTENT STUDIO */}
            {activeTab === 'studio' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-4 space-y-6">
                    <TopicCreator
                      channels={channels}
                      onAddTopic={handleAddTopic}
                      loading={actionLoading}
                    />
                    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4">
                      <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">Saved Content Drafts</h3>
                      <div className="space-y-1.5">
                        {topics.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTopicId(t.id)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                              activeTopic?.id === t.id
                                ? 'bg-blue-50 border-blue-200 text-blue-900 font-medium'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="font-semibold block truncate">"{t.topic}"</span>
                            <span className="text-[10px] text-slate-500 mt-0.5 block">{t.date} • {t.status}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-6">
                    {activeTopic && (
                      <ContentWorkspace
                        topic={activeTopic}
                        channels={channels}
                        onPublish={handlePublish}
                        onSchedule={handleSchedule}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onGenerateImage={handleGenerateImage}
                        actionLoading={actionLoading}
                        onToggleChannel={handleToggleChannel}
                      />
                    )}
                  </div>
                </div>

                <AIVideoStudio
                  project={videoProject}
                  onGenerateVideoProject={handleGenerateVideoProject}
                  onSaveProjectToCalendar={handleSaveVideoProjectToCalendar}
                  loading={actionLoading}
                />

                <BrandKitManager
                  brandKit={brandKit}
                  onSaveBrandKit={handleSaveBrandKit}
                  loading={actionLoading}
                />

                <ContentLibraryWorkspace
                  libraryData={library}
                  onAddAsset={handleAddLibraryAsset}
                  onRefreshLibrary={async () => {
                    const libData = await safeFetchJson('/api/library');
                    if (libData.library) setLibrary(libData.library);
                  }}
                  loading={actionLoading}
                />
              </div>
            )}

            {/* PAGE 3B: REPURPOSE STUDIO */}
            {activeTab === 'repurpose' && (
              <div className="space-y-6">
                <ContentRepurposer />
              </div>
            )}

            {/* PAGE 4: CALENDAR & SCHEDULING */}
            {activeTab === 'calendar' && (
              <div className="space-y-6">
                <ContentCalendar
                  topics={topics}
                  channels={channels}
                  onRescheduleTopic={handleRescheduleTopic}
                  onUpdateTopicStatus={handleUpdateTopicStatus}
                  onSelectTopic={(id) => setSelectedTopicId(id)}
                  onPublishTopic={async (id) => {
                    const topic = topics.find(t => t.id === id);
                    await handlePublish(id, topic?.publishChannels || []);
                  }}
                  loading={actionLoading}
                />
              </div>
            )}

            {/* PAGE 5: SOCIAL INBOX */}
            {activeTab === 'inbox' && (
              <div className="space-y-6">
                <UnifiedSocialInbox
                  inboxData={inbox}
                  onSendReply={handleSendReply}
                  onSuggestReply={handleSuggestReply}
                  onRefreshInbox={handleRefreshInbox}
                  loading={actionLoading}
                />
              </div>
            )}

            {/* PAGE 6: ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <AuraCastInsights
                  analytics={analytics}
                  onRefreshAnalytics={handleRefreshAnalytics}
                  loading={actionLoading}
                />

                <AILearningLoopEngine
                  learningData={learningLoop}
                  onRunLearningCycle={handleRunLearningCycle}
                  loading={actionLoading}
                />

                <CompetitorIntelligence />

                <LeadConversionTracker />
              </div>
            )}

            {/* PAGE 7: SETTINGS & WORKSPACE */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <ChannelManager
                  channels={channels}
                  onToggleChannel={handleToggleChannel}
                  loading={actionLoading}
                />

                <TeamCollaboration
                  workspaceData={team}
                  onInviteMember={handleInviteMember}
                  onApprovePost={handleApprovePost}
                  onRequestChanges={handleRequestChanges}
                  onSubmitPostForReview={handleSubmitPostForReview}
                  loading={actionLoading}
                />

                <EnterpriseSecuritySuite />

                <SubscriptionBillingManager
                  onUpgradeTier={async (tier) => {
                    await safeFetchJson('/api/billing/upgrade', {
                      method: 'POST',
                      body: JSON.stringify({ tier })
                    });
                  }}
                />
              </div>
            )}

            {/* PAGE 8: DEVELOPER API */}
            {activeTab === 'developer' && (
              <div className="space-y-6">
                <AuraCastAPIStudio
                  onCreateApiKey={async (name) => {
                    await safeFetchJson('/api/developer/keys', {
                      method: 'POST',
                      body: JSON.stringify({ name })
                    });
                  }}
                />

                <SmartLinkManager
                  onCreateLink={async (lnk) => {
                    await safeFetchJson('/api/smart-links', {
                      method: 'POST',
                      body: JSON.stringify(lnk)
                    });
                  }}
                />

                <AIContentSearch
                  onExecuteSearch={handleExecuteAISearch}
                  loading={actionLoading}
                />

                <ActivityLogs logs={logs} />
              </div>
            )}

            {/* SUB-MODULE: VIDEO STUDIO */}
            {activeTab === 'video' && (
              <div className="space-y-6">
                <AIVideoStudio
                  project={videoProject}
                  onGenerateVideoProject={handleGenerateVideoProject}
                  onSaveProjectToCalendar={handleSaveVideoProjectToCalendar}
                  loading={actionLoading}
                />
              </div>
            )}

            {/* SUB-MODULE: BRAND KIT */}
            {activeTab === 'brandkit' && (
              <div className="space-y-6">
                <BrandKitManager
                  brandKit={brandKit}
                  onSaveBrandKit={handleSaveBrandKit}
                  loading={actionLoading}
                />
              </div>
            )}

            {/* SUB-MODULE: AUTONOMOUS CAMPAIGNS */}
            {activeTab === 'campaigns' && (
              <div className="space-y-6">
                <AutonomousCampaignBuilder
                  campaign={campaign}
                  onGenerateCampaign={handleGenerateCampaign}
                  onApproveCampaign={handleApproveCampaign}
                  loading={actionLoading}
                />
              </div>
            )}

            {/* SUB-MODULE: LEAD TRACKER */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                <LeadConversionTracker />
              </div>
            )}

            {/* SUB-MODULE: CHANNEL MANAGER */}
            {activeTab === 'channels' && (
              <div className="space-y-6">
                <ChannelManager
                  channels={channels}
                  onToggleChannel={handleToggleChannel}
                  loading={actionLoading}
                />
              </div>
            )}

            {/* SUB-MODULE: ENTERPRISE SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <EnterpriseSecuritySuite />
              </div>
            )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Footer Version Block */}
      <footer className="max-w-7xl w-full mx-auto px-6 pb-6 pt-4 border-t border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-sans">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>AuraCast Enterprise OS <span className="font-semibold text-slate-700">v2.50</span></span>
        </div>
        <div>
          <span>Multi-Channel Social Operations & Meta Graph Publishing</span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono">
          Build 2.50.2026
        </div>
      </footer>

      {/* 10 CORE OS PILLARS MODAL */}
      {isPillarsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-semibold text-slate-900">10 Core AI Marketing Operating System Pillars</h3>
              </div>
              <button
                onClick={() => setIsPillarsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <AIMarketingCommandCenter
              onNavigateToModule={(mod) => {
                setIsPillarsModalOpen(false);
                handleNavigateModule(mod);
              }}
            />
          </div>
        </div>
      )}

      {/* AI INTELLIGENCE ALERTS MODAL */}
      {isAlertsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <BellRing className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-semibold text-slate-900">System Intelligence & Performance Alerts</h3>
              </div>
              <button
                onClick={() => setIsAlertsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SmartNotificationsBar />
          </div>
        </div>
      )}

      {/* Floating AI Marketing Assistant */}
      <AICopilot />
    </div>
  );
}
