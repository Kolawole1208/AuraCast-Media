// Shared data types for Topic Publisher

export interface GraphicDesign {
  bgColor: string;
  textColor: string;
  accentColor: string;
  layoutFamily: 'sans' | 'serif' | 'mono';
  pattern: 'none' | 'dots' | 'grid' | 'waves' | 'cosmic';
}

export interface VideoScript {
  title: string;
  visualPrompt: string;
  narration: string[];
  visualStory: string[];
  musicMood: string;
  durationSeconds: number;
}

export interface GeneratedContent {
  caption: string;
  hashtags: string[];
  graphicType: 'quote' | 'infographic' | 'announcement' | 'minimalist';
  graphicText: string;
  graphicTitle: string;
  graphicDesign: GraphicDesign;
  videoScript: VideoScript;
}

export interface MockComment {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface TopicItem {
  id: string;
  topic: string;
  date: string;
  status: 'draft' | 'generating' | 'generated' | 'ai_generated' | 'scheduled' | 'published' | 'failed' | 'needs_approval';
  generatedContent?: GeneratedContent;
  publishChannels: string[];
  toneGoal?: 'educational' | 'mindset' | 'storytelling' | 'conversational';
  publishedAt?: string;
  scheduledFor?: string;
  imageUrl?: string; // Created or suggested from design / Gemini Flash Image
  facebookPostUrl?: string;
  comments?: MockComment[];
}

export interface SocialChannel {
  id: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'whatsapp';
  name: string;
  connected: boolean;
  username?: string;
  avatarUrl?: string;
  accessToken?: string;
  businessId?: string;
  apiKey?: string;
  autoPostEnabled?: boolean;
}

export interface ActivityLog {
  id: string;
  topicId?: string;
  topicTitle?: string;
  channel?: string;
  action: 'generation' | 'posting' | 'scheduling' | 'error';
  status: 'success' | 'failed' | 'processing';
  message: string;
  timestamp: string;
}

export interface TargetAudiencePersona {
  name: string;
  ageGroup: string;
  location: string;
  painPoints: string[];
  aspirations: string[];
  preferredPlatforms: string[];
}

export interface ContentPillar {
  title: string;
  description: string;
  percentageAllocation: number;
}

export interface WeeklyCampaignPlan {
  weekNumber: number;
  theme: string;
  objective: string;
  contentPillars: string[];
  recommendedPlatforms: string[];
  suggestedTopics: {
    topic: string;
    toneGoal?: 'educational' | 'mindset' | 'storytelling' | 'conversational';
    suggestedChannels: string[];
    format: string;
  }[];
}

export interface MarketingStrategy {
  id: string;
  brandNameOrNiche: string;
  primaryGoals: string[];
  postingFrequency: string;
  targetPersona: TargetAudiencePersona;
  contentPillars: ContentPillar[];
  competitorGapAnalysis: string;
  weeklyPlan: WeeklyCampaignPlan[];
  createdAt: string;
}

export interface VideoScene {
  sceneNumber: number;
  timeCode: string; // e.g. "0:00 - 0:03"
  visualDescription: string;
  voiceoverScript: string;
  bRollSuggestion: string;
  captionSubtitles: string;
  screenText: string;
}

export interface AdvancedVideoStudioProject {
  id: string;
  title: string;
  conceptPrompt: string;
  format: 'TikTok (9:16)' | 'Instagram Reel (9:16)' | 'YouTube Shorts (9:16)' | 'Square Feed (1:1)' | 'Landscape (16:9)';
  hook: string;
  voiceoverScript: string;
  bRollSuggestions: string[];
  backgroundMusicMood: string;
  scenes: VideoScene[];
  callToAction: string;
  captionText: string;
  hashtags: string[];
  createdAt: string;
}

export interface BrandKit {
  id: string;
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeader: string;
  fontBody: string;
  slogan: string;
  brandDescription: string;
  brandVoice: string;
  preferredImagery: string;
  ctaStyle: string;
  hashtagStyle: string;
  socialHandles: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    whatsapp?: string;
  };
  updatedAt: string;
}

export interface CampaignPost {
  id: string;
  dayNumber: number;
  date: string;
  scheduledTime: string;
  topic: string;
  caption: string;
  hashtags: string[];
  contentType: 'Image Post' | 'Short Video Reel' | 'Carousel' | 'Broadcast Note';
  imagePrompt: string;
  imageUrl?: string;
  shortVideoIdea?: {
    hook: string;
    sceneDescription: string;
    audioSuggestion: string;
    cta: string;
  };
  callToAction: string;
  platformVariations: Record<string, string>;
  status: 'review' | 'approved' | 'rejected';
  contentPillar?: string;
  publishChannels: string[];
}

export interface AutonomousCampaign {
  id: string;
  campaignName: string;
  prompt: string;
  objective: string;
  audience: string;
  contentPillars: string[];
  durationDays: number;
  posts: CampaignPost[];
  createdAt: string;
  status: 'draft' | 'active' | 'approved';
}

export interface PerformanceMetrics {
  totalFollowers: number;
  followersNetGain: number;
  followersGrowthPercent: number;
  engagementRate: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  clicks: number;
}

export interface PostPerformanceSummary {
  id: string;
  title: string;
  platform: string;
  engagementRate: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  postedAt: string;
  contentType: string;
}

export interface PlatformPerformance {
  platform: string;
  followers: number;
  engagementRate: number;
  totalPosts: number;
  topPostingTime: string;
}

export interface AIIntelligenceInsight {
  id: string;
  type: 'insight' | 'recommendation' | 'alert';
  title: string;
  observation: string;
  actionableRecommendation: string;
  impactScore: 'High' | 'Medium' | 'Critical';
}

export interface AnalyticsIntelligence {
  metrics: PerformanceMetrics;
  bestPlatform: string;
  bestPostingTime: string;
  bestPerformingPosts: PostPerformanceSummary[];
  worstPerformingPosts: PostPerformanceSummary[];
  platformBreakdown: PlatformPerformance[];
  aiInsights: AIIntelligenceInsight[];
  recommendations: string[];
  lastUpdated: string;
}

export interface LearnedRule {
  id: string;
  category: 'topics' | 'hooks' | 'visuals' | 'hashtags' | 'posting_times' | 'platforms';
  title: string;
  pattern: string;
  confidenceScore: number;
  liftPercent: number;
}

export interface AILearningLoopData {
  totalAnalyzedPosts: number;
  learningModelVersion: string;
  optimizationLevelPercent: number;
  flywheelCycleCount: number;
  lastTrainedAt: string;
  learnedRules: LearnedRule[];
  winningHooks: string[];
  winningTopics: string[];
  winningHashtags: string[];
  optimalTimes: string[];
}

export interface SocialInboxMessage {
  id: string;
  platform: 'Instagram' | 'Facebook' | 'Twitter' | 'YouTube' | 'TikTok';
  messageType: 'comment' | 'mention' | 'dm' | 'question';
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  postTitle?: string;
  content: string;
  createdAt: string;
  status: 'unreplied' | 'replied' | 'flagged';
  suggestedReply?: string;
  repliedContent?: string;
  sentiment?: 'positive' | 'neutral' | 'question' | 'critical' | 'spam' | 'lead';
  intentClassification?: 'question' | 'complaint' | 'praise' | 'spam' | 'sales_lead';
  humanInterventionRequired?: boolean;
  humanReason?: string;
}

export interface InboxSummary {
  totalMessages: number;
  unrepliedCount: number;
  avgResponseTimeMinutes: number;
  aiCopilotSuggestedCount: number;
  flaggedCount: number;
  leadCount: number;
  messages: SocialInboxMessage[];
}

export type TeamRole = 'Owner' | 'Admin' | 'Marketing Manager' | 'Content Creator' | 'Reviewer' | 'Viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatar?: string;
  assignedCount: number;
  status: 'active' | 'invited';
}

export interface PostVersion {
  version: number;
  editedBy: string;
  timestamp: string;
  content: string;
  note?: string;
}

export interface PostComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface ApprovalWorkflowPost {
  id: string;
  topicTitle: string;
  creatorName: string;
  reviewerName?: string;
  platform: string;
  contentType: string;
  postContent: string;
  scheduledTime: string;
  status: 'draft' | 'pending_review' | 'approved' | 'changes_requested' | 'scheduled' | 'published';
  workflowStage: 'Draft' | 'Review' | 'Approved' | 'Scheduled' | 'Published';
  version: number;
  versionHistory: PostVersion[];
  comments: PostComment[];
  approvalTimestamp?: string;
  rejectionReason?: string;
  reviewerNote?: string;
  createdAt: string;
}

export type AssetCategory = 'Campaigns' | 'Posts' | 'Images' | 'Videos' | 'Captions' | 'Hashtags' | 'Templates' | 'Brand Assets' | 'Published Content';

export interface LibraryAsset {
  id: string;
  title: string;
  category: AssetCategory;
  tags: string[];
  content: string;
  previewUrl?: string;
  associatedCampaign?: string;
  createdAt: string;
  performanceScore?: number;
}

export interface ContentLibraryData {
  totalAssets: number;
  assets: LibraryAsset[];
}

export interface AISearchResult {
  query: string;
  aiSummaryAnswer: string;
  matchedPosts: any[];
  matchedCampaigns: any[];
  matchedAssets: any[];
}

// 🧪 14. AI A/B Testing
export interface ABTestVariant {
  id: string;
  label: string; // 'Version A' | 'Version B'
  content: string;
  hook: string;
  ctaText: string;
  postingTime: string;
  engagementRate?: number;
  clickThroughRate?: number;
  conversions?: number;
  isWinner?: boolean;
}

export interface ABTestExperiment {
  id: string;
  topicTitle: string;
  platform: string;
  testType: 'Hooks' | 'Captions' | 'Images' | 'CTAs' | 'Posting Times';
  status: 'running' | 'completed' | 'draft';
  variantA: ABTestVariant;
  variantB: ABTestVariant;
  aiRecommendationReason: string;
  confidenceScore: number; // e.g. 94.8%
  createdDate: string;
}

// 🔥 15. Viral Content Intelligence & Trend Radar
export interface TrendTopic {
  id: string;
  topic: string;
  category: string;
  hashtags: string[];
  viralScore: number; // e.g., 98/100
  searchVolumeGrowth: string; // e.g., "+340% this week"
  format: 'Vertical Short Video' | 'Carousel Infographic' | 'Short Text & Poll' | 'Live Stream';
  summary: string;
  recommendedAction: string;
}

export interface TrendRadarData {
  lastUpdated: string;
  trendingTopics: TrendTopic[];
}

// 📈 16. Competitor Intelligence
export interface CompetitorProfile {
  id: string;
  name: string;
  handle: string;
  platform: string;
  followerCount: string;
  postingFrequency: string; // e.g., "3 posts/day"
  topContentType: string;
  avgEngagementRate: number; // e.g. 4.8%
  popularPostsCount: number;
  aiOpportunityAlerts: string[];
}

export interface CompetitorIntelligenceData {
  trackedCompetitors: CompetitorProfile[];
  aiStrategicInsights: string[];
  unclaimedOpportunities: string[];
}

// 💰 17. Lead & Conversion Tracking
export interface ConversionFunnelStage {
  impressions: number;
  clicks: number;
  leads: number;
  customers: number;
  revenue: number; // e.g. in local or global currency (e.g., ₦850,000 / $5,200)
  formattedRevenue: string;
}

export interface CampaignConversionAttribution {
  id: string;
  campaignTitle: string;
  platform: string;
  funnel: ConversionFunnelStage;
  roiMultiplier: number; // e.g. 12.4x ROI
}

// 🔗 18. Link & CTA Management
export interface SmartLink {
  id: string;
  shortCode: string; // e.g. "go/restaurant" or "go/ai-launch"
  fullUrl: string;
  slug: string;
  title: string;
  campaignName: string;
  targetPlatform: string;
  clicks: number;
  conversions: number;
  topLocation: string;
  createdAt: string;
}

// 🔔 19. Smart Notifications
export interface SmartNotification {
  id: string;
  type: 'viral_performance' | 'warning' | 'timing_recommendation' | 'ai_insight';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  metricBadge?: string;
}

// 🛡️ 20. Enterprise Security & Audit Suite
export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  ipAddress: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'allowed' | 'blocked' | 'flagged';
}

export interface EnterpriseSecurityState {
  mfaEnabled: boolean;
  roleBasedAccessActive: boolean;
  apiKeyEncryptionStatus: 'AES-256-GCM Encrypted (Server-side)' | 'Standard';
  tokenStorageMode: 'Encrypted Server Session (No Frontend Plaintext)' | 'Basic';
  workspaceIsolationActive: boolean;
  auditLogs: SecurityAuditLog[];
}

export interface TeamWorkspace {
  organizationName: string;
  members: TeamMember[];
  approvalQueue: ApprovalWorkflowPost[];
}

// 💳 21. Subscription & Billing Tiers
export type SubscriptionTier = 'Free' | 'Pro' | 'Business' | 'Enterprise';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  monthlyPriceUSD: number;
  annualPriceUSD: number;
  monthlyPriceNGN: string;
  description: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  limits: {
    aiGenerationsPerMonth: string;
    workspaces: string;
    socialChannels: string;
    brands: string;
    teamMembers: string;
  };
}

export interface UsageLimitsState {
  currentTier: SubscriptionTier;
  billingCycle: 'monthly' | 'annual';
  renewsOn: string;
  generationsUsed: number;
  generationsLimit: number; // e.g., 500, or -1 for Unlimited
  channelsConnected: number;
  channelsLimit: number;
  workspacesUsed: number;
  workspacesLimit: number;
  teamMembersCount: number;
  teamMembersLimit: number;
}

// 🔌 23. AuraCast Developer API Types
export interface DeveloperApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdDate: string;
  lastUsedDate: string;
  permissions: string[];
  status: 'active' | 'revoked';
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'failing' | 'disabled';
  secret: string;
  createdDate: string;
}

export interface DeveloperIntegrationHub {
  apiKeys: DeveloperApiKey[];
  webhooks: WebhookEndpoint[];
  rateLimitUsage: {
    requestsToday: number;
    dailyLimit: number;
  };
}

// 🧠 24. Centralized Aura Copilot Brain Types
export type CopilotCommandType =
  | 'CREATE_CAMPAIGN'
  | 'EXPLAIN_ENGAGEMENT_DROP'
  | 'SCHEDULE_NEXT_WEEK'
  | 'SHOW_TOP_PERFORMING'
  | 'RECREATE_BEST_CONTENT'
  | 'REPLY_UNANSWERED_COMMENTS'
  | 'PREPARE_MONTHLY_REPORT'
  | 'WHAT_TO_POST_TODAY';

export interface CopilotBrainAction {
  id: string;
  type: CopilotCommandType;
  label: string;
  iconName: string;
  promptExample: string;
  description: string;
}

export interface CopilotExecutionResult {
  commandType: CopilotCommandType;
  headline: string;
  summary: string;
  details: string[];
  metrics?: { label: string; value: string; change?: string }[];
  actionItems?: string[];
  generatedPosts?: Array<{
    title: string;
    caption: string;
    platforms: string[];
    recommendedTime: string;
  }>;
}



