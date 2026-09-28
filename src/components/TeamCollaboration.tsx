import React, { useState } from 'react';
import { TeamWorkspace, TeamMember, ApprovalWorkflowPost, TeamRole } from '../types';
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  MessageCircle,
  FileEdit,
  Building2,
  Lock,
  ChevronRight,
  Eye,
  Check,
  X,
  Sparkles,
  ArrowRight,
  UserCheck,
  Layers
} from 'lucide-react';

interface TeamCollaborationProps {
  workspaceData?: TeamWorkspace;
  onInviteMember: (name: string, email: string, role: TeamRole) => Promise<void>;
  onApprovePost: (postId: string) => Promise<void>;
  onRequestChanges: (postId: string, note: string) => Promise<void>;
  onSubmitPostForReview: (post: Omit<ApprovalWorkflowPost, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  loading: boolean;
}

const DEFAULT_WORKSPACE_SEED: TeamWorkspace = {
  organizationName: 'AuraCast Global Media',
  members: [
    {
      id: 'usr_1',
      name: 'Alex Rivera',
      email: 'alex@auracast.ai',
      role: 'Owner',
      assignedCount: 12,
      status: 'active'
    },
    {
      id: 'usr_2',
      name: 'Sarah Chen',
      email: 'sarah.c@auracast.ai',
      role: 'Marketing Manager',
      assignedCount: 8,
      status: 'active'
    },
    {
      id: 'usr_3',
      name: 'Marcus Vance',
      email: 'marcus.v@auracast.ai',
      role: 'Content Creator',
      assignedCount: 15,
      status: 'active'
    },
    {
      id: 'usr_4',
      name: 'Elena Rostova',
      email: 'elena.r@auracast.ai',
      role: 'Reviewer',
      assignedCount: 5,
      status: 'active'
    }
  ],
  approvalQueue: [
    {
      id: 'appr_1',
      topicTitle: 'Q4 Product Launch - AI Video Feature Reel',
      creatorName: 'Marcus Vance',
      reviewerName: 'Sarah Chen',
      platform: 'Instagram Reel & TikTok',
      contentType: 'Vertical Short Video',
      postContent: '🚀 Stop spending 10+ hours editing videos! Watch how AuraCast generates studio-grade vertical shorts with voiceovers in under 60 seconds.',
      scheduledTime: 'Tomorrow at 5:00 PM',
      status: 'pending_review',
      workflowStage: 'Review',
      version: 2,
      versionHistory: [
        { version: 1, editedBy: 'Marcus Vance', timestamp: '3 hours ago', content: 'Draft version without voiceover mention.', note: 'Initial draft created' },
        { version: 2, editedBy: 'Marcus Vance', timestamp: '2 hours ago', content: '🚀 Stop spending 10+ hours editing videos! Watch how AuraCast generates studio-grade vertical shorts with voiceovers in under 60 seconds.', note: 'Added hook & CTA' }
      ],
      comments: [
        { id: 'cm_1', author: 'Sarah Chen', text: 'Great energy in the opening hook. Ensure brand watermark is placed in top right.', timestamp: '1 hour ago' }
      ],
      createdAt: '2 hours ago'
    },
    {
      id: 'appr_2',
      topicTitle: '3 Proven Hooks for B2B Engagement',
      creatorName: 'Marcus Vance',
      reviewerName: 'Sarah Chen',
      platform: 'LinkedIn Article',
      contentType: 'Infographic Carousel',
      postContent: 'Consistency beats intensity in B2B marketing. Here are the top 3 hook frameworks analyzed across 10,000 top-performing posts.',
      scheduledTime: 'Friday at 9:00 AM',
      status: 'approved',
      workflowStage: 'Approved',
      version: 1,
      versionHistory: [
        { version: 1, editedBy: 'Marcus Vance', timestamp: '1 day ago', content: 'Consistency beats intensity in B2B marketing. Here are the top 3 hook frameworks analyzed across 10,000 top-performing posts.' }
      ],
      comments: [
        { id: 'cm_2', author: 'Sarah Chen', text: 'Approved for distribution. Excellent engagement stats.', timestamp: '18 hours ago' }
      ],
      approvalTimestamp: 'Yesterday at 4:15 PM',
      reviewerNote: 'Approved by Sarah Chen. Clear messaging and great graphic aesthetic.',
      createdAt: '1 day ago'
    },
    {
      id: 'appr_3',
      topicTitle: 'Weekly Community Q&A Highlight',
      creatorName: 'Elena Rostova',
      reviewerName: 'Sarah Chen',
      platform: 'YouTube Community Post',
      contentType: 'Text & Poll',
      postContent: 'Which AI workflow saved you the most time this month? Vote below!',
      scheduledTime: 'In 3 days',
      status: 'changes_requested',
      workflowStage: 'Draft',
      version: 1,
      versionHistory: [
        { version: 1, editedBy: 'Elena Rostova', timestamp: '3 hours ago', content: 'Which AI workflow saved you the most time this month? Vote below!' }
      ],
      comments: [
        { id: 'cm_3', author: 'Sarah Chen', text: 'Please refine options before publishing.', timestamp: '2 hours ago' }
      ],
      rejectionReason: 'Missing poll choices for Shorts vs Reels comparisons.',
      reviewerNote: 'Please add 4 poll choices specifically referencing YouTube shorts vs Instagram Reels.',
      createdAt: '3 hours ago'
    }
  ]
};

const ROLES_LIST: { role: TeamRole; badgeColor: string; description: string }[] = [
  { role: 'Owner', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30', description: 'Full admin rights & billing control' },
  { role: 'Admin', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', description: 'Manages team & platform integrations' },
  { role: 'Marketing Manager', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', description: 'Approves content & oversees campaigns' },
  { role: 'Content Creator', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', description: 'Drafts posts & video scripts' },
  { role: 'Reviewer', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30', description: 'Evaluates compliance & brand guidelines' },
  { role: 'Viewer', badgeColor: 'bg-slate-800 text-slate-400 border-slate-700', description: 'Read-only analytics & reporting' }
];

export default function TeamCollaboration({
  workspaceData = DEFAULT_WORKSPACE_SEED,
  onInviteMember,
  onApprovePost,
  onRequestChanges,
  onSubmitPostForReview,
  loading
}: TeamCollaborationProps) {
  const data = workspaceData || DEFAULT_WORKSPACE_SEED;

  const [activeTab, setActiveTab] = useState<'queue' | 'members' | 'new_post'>('queue');
  const [filterQueueStatus, setFilterQueueStatus] = useState<string>('all');

  // Invite Member Form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('Content Creator');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Changes Request Form
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [changeNote, setChangeNote] = useState('');

  // Submit New Post for Review
  const [newTopic, setNewTopic] = useState('');
  const [newPlatform, setNewPlatform] = useState('Instagram');
  const [newContent, setNewContent] = useState('');
  const [newScheduledTime, setNewScheduledTime] = useState('Tomorrow at 10:00 AM');
  const [postSubmitSuccess, setPostSubmitSuccess] = useState(false);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    try {
      await onInviteMember(inviteName, inviteEmail, inviteRole);
      setInviteName('');
      setInviteEmail('');
      setInviteSuccess(true);
      setTimeout(() => setInviteSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim() || !newContent.trim()) return;
    try {
      await onSubmitPostForReview({
        topicTitle: newTopic,
        creatorName: 'Marcus Vance (Creator)',
        platform: newPlatform,
        contentType: 'Social Post',
        postContent: newContent,
        scheduledTime: newScheduledTime,
        workflowStage: 'Review',
        version: 1,
        versionHistory: [{ version: 1, editedBy: 'Marcus Vance', timestamp: 'Just now', content: newContent }],
        comments: []
      });
      setNewTopic('');
      setNewContent('');
      setPostSubmitSuccess(true);
      setTimeout(() => setPostSubmitSuccess(false), 3000);
      setActiveTab('queue');
    } catch (err) {
      console.error(err);
    }
  };

  const filteredQueue = data.approvalQueue.filter((p) => {
    if (filterQueueStatus === 'all') return true;
    return p.status === filterQueueStatus;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                Team Collaboration & Editorial Approval Workflows
              </h2>
              <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1">
                <Building2 className="w-2.5 h-2.5 text-blue-600" />
                Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Creator → Reviewer → Manager Approval → Automated Multi-Channel Publishing Pipeline.
            </p>
          </div>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('queue')}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approval Queue ({data.approvalQueue.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'members'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Team Members ({data.members.length})
          </button>
          <button
            onClick={() => setActiveTab('new_post')}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'new_post'
                ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Submit Post
          </button>
        </div>
      </div>

      {/* SUITABLE ORGANIZATIONS BADGES */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
        <span className="font-semibold text-slate-800 uppercase text-[10px]">🏢 Suitable For:</span>
        {['Companies', 'Agencies', 'NGOs & Non-Profits', 'Schools', 'Churches', 'Government Orgs', 'SMEs'].map((org) => (
          <span key={org} className="bg-white border border-slate-200 px-2.5 py-0.5 rounded text-slate-700 text-xs">
            ✓ {org}
          </span>
        ))}
      </div>

      {/* TAB 1: EDITORIAL APPROVAL QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Pending Content Approvals
            </h3>

            <div className="flex items-center gap-1">
              {['all', 'pending_review', 'approved', 'changes_requested'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterQueueStatus(st)}
                  className={`text-[10px] font-medium capitalize px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                    filterQueueStatus === st
                      ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQueue.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 space-y-3.5 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {post.platform}
                    </span>

                    {post.status === 'pending_review' && (
                      <span className="text-[10px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                        ⏳ Pending Review
                      </span>
                    )}
                    {post.status === 'approved' && (
                      <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                        ✅ Approved
                      </span>
                    )}
                    {post.status === 'changes_requested' && (
                      <span className="text-[10px] font-mono font-semibold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded">
                        💬 Feedback Needed
                      </span>
                    )}
                  </div>

                  {/* WORKFLOW STAGE STEPPER PIPELINE */}
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block font-semibold">Lifecycle Stage:</span>
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      {['Draft', 'Review', 'Approved', 'Scheduled', 'Published'].map((stage, idx) => {
                        const isCurrent = post.workflowStage === stage || (post.status === 'approved' && stage === 'Approved') || (post.status === 'changes_requested' && stage === 'Draft');
                        return (
                          <div key={stage} className="flex items-center gap-0.5">
                            <span className={`px-1.5 py-0.5 rounded font-semibold ${
                              isCurrent
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-400 bg-white border border-slate-200'
                            }`}>
                              {stage}
                            </span>
                            {idx < 4 && <span className="text-slate-400">→</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 font-sans leading-tight">
                    {post.topicTitle}
                  </h4>

                  <div className="text-[10px] font-mono text-slate-500 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span>Creator: <strong className="text-slate-800">{post.creatorName}</strong></span>
                      <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded text-slate-700 font-semibold">
                        v{post.version || 1}
                      </span>
                    </div>
                    {post.reviewerName && (
                      <div>Reviewer: <span className="text-slate-800 font-semibold">{post.reviewerName}</span></div>
                    )}
                    {post.approvalTimestamp && (
                      <div className="text-emerald-700">Approved: {post.approvalTimestamp}</div>
                    )}
                    <div>Target Schedule: <span className="text-slate-700">{post.scheduledTime}</span></div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 font-sans leading-relaxed">
                    "{post.postContent}"
                  </div>

                  {post.rejectionReason && (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-xs font-sans text-rose-800 space-y-0.5">
                      <strong className="block font-mono uppercase font-semibold text-rose-900">Rejection Reason:</strong>
                      <p>{post.rejectionReason}</p>
                    </div>
                  )}

                  {post.reviewerNote && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs font-sans text-amber-800 space-y-0.5">
                      <strong className="block font-mono text-[9px] uppercase font-semibold">Manager Notes:</strong>
                      <p>{post.reviewerNote}</p>
                    </div>
                  )}

                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[9px] font-mono font-semibold text-slate-500 uppercase block">Comments ({post.comments.length}):</span>
                      {post.comments.map((cm) => (
                        <div key={cm.id} className="text-xs font-sans text-slate-700">
                          <strong className="text-slate-900">{cm.author}:</strong> "{cm.text}" <span className="text-[9px] text-slate-400 font-mono">({cm.timestamp})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* APPROVAL ACTION CONTROLS */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  {post.status === 'pending_review' ? (
                    <>
                      <button
                        onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
                        className="text-[10px] font-mono bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3 text-amber-600" />
                        <span>Feedback</span>
                      </button>

                      <button
                        onClick={() => onApprovePost(post.id)}
                        className="text-[10px] font-mono bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer font-semibold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Approve Post</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 italic">
                      Workflow stage complete
                    </span>
                  )}
                </div>

                {/* REQUEST CHANGES NOTE MODAL / INLINE INPUT */}
                {selectedPostId === post.id && (
                  <div className="pt-2 space-y-2 bg-slate-50 p-3 rounded-lg border border-amber-200">
                    <textarea
                      value={changeNote}
                      onChange={(e) => setChangeNote(e.target.value)}
                      placeholder="Add specific feedback for creator..."
                      className="w-full bg-white border border-slate-200 text-xs text-slate-900 p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedPostId(null)}
                        className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onRequestChanges(post.id, changeNote);
                          setSelectedPostId(null);
                          setChangeNote('');
                        }}
                        className="text-xs font-semibold bg-amber-600 text-white px-3 py-1 rounded-md shadow-2xs hover:bg-amber-700 transition-colors cursor-pointer"
                      >
                        Send Feedback
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TEAM MEMBERS & ROLES */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* MEMBERS LIST */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Workspace Roster ({data.members.length} Active Users)
            </h3>

            <div className="space-y-2">
              {data.members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {member.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 font-sans">{member.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {member.role}
                    </span>

                    <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                      {member.assignedCount} Posts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INVITE NEW MEMBER FORM */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span>Invite New Team Member</span>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. David Miller"
                  className="w-full bg-white border border-slate-200 focus:border-blue-600 text-xs text-slate-900 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. david@company.com"
                  className="w-full bg-white border border-slate-200 focus:border-blue-600 text-xs text-slate-900 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Role & Permissions</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                  className="w-full bg-white border border-slate-200 text-xs text-slate-900 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r.role} value={r.role}>
                      {r.role} — {r.description}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !inviteName.trim() || !inviteEmail.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {inviteSuccess ? 'Invitation Sent!' : 'Send Team Invitation'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: SUBMIT NEW POST FOR APPROVAL */}
      {activeTab === 'new_post' && (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase">
            <FileEdit className="w-4 h-4 text-blue-600" />
            <span>Submit Post to Editorial Review Queue</span>
          </div>

          <form onSubmit={handleCreatePostSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Campaign Topic Title</label>
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="e.g. Q4 Growth Case Study Reel"
                className="w-full bg-white border border-slate-200 text-xs text-slate-900 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Target Platform</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-xs text-slate-900 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  {['Instagram', 'YouTube', 'Twitter', 'Facebook', 'LinkedIn', 'TikTok'].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Target Schedule</label>
                <input
                  type="text"
                  value={newScheduledTime}
                  onChange={(e) => setNewScheduledTime(e.target.value)}
                  placeholder="e.g. Tomorrow at 5:00 PM"
                  className="w-full bg-white border border-slate-200 text-xs text-slate-900 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Post Draft Content</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                placeholder="Write the exact caption, copy, or script here..."
                className="w-full bg-white border border-slate-200 text-xs text-slate-900 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !newTopic.trim() || !newContent.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              {postSubmitSuccess ? 'Submitted for Review!' : 'Submit to Manager for Approval'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
