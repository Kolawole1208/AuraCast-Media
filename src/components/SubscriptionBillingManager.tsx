import React, { useState } from 'react';
import { SubscriptionPlan, SubscriptionTier, UsageLimitsState } from '../types';
import {
  CreditCard,
  Zap,
  Check,
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Crown,
  Lock,
  Layers,
  BarChart2,
  Download,
  Calendar
} from 'lucide-react';

interface SubscriptionBillingManagerProps {
  usageState?: UsageLimitsState;
  onUpgradeTier?: (tier: SubscriptionTier) => Promise<void>;
  loading?: boolean;
}

const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    tier: 'Free',
    name: 'Free Tier',
    monthlyPriceUSD: 0,
    annualPriceUSD: 0,
    monthlyPriceNGN: '₦0 / month',
    description: 'Perfect for exploring AuraCast AI content capabilities.',
    features: [
      '50 AI Generations / month',
      '1 Workspace',
      '2 Social Channels connected',
      'Basic Post Drafter & Preview',
      'Standard Text & Image Generator'
    ],
    limits: {
      aiGenerationsPerMonth: '50 / mo',
      workspaces: '1 Workspace',
      socialChannels: '2 Channels',
      brands: '1 Brand Kit',
      teamMembers: '1 Member'
    }
  },
  {
    tier: 'Pro',
    name: 'Pro Creator',
    monthlyPriceUSD: 29,
    annualPriceUSD: 24,
    monthlyPriceNGN: '₦29,000 / month',
    description: 'Designed for active creators and solo entrepreneurs scaling across platforms.',
    badge: 'Popular for Creators',
    isPopular: true,
    features: [
      '1,000 AI Generations / month',
      'Unlimited Campaigns & Topics',
      'Smart Auto-Scheduling & Calendar',
      'Analytics & AuraCast Insights',
      '1 Custom Brand Kit & Font Upload',
      '5 Connected Social Channels',
      'Advanced Video Studio Project Exports'
    ],
    limits: {
      aiGenerationsPerMonth: '1,000 / mo',
      workspaces: '3 Workspaces',
      socialChannels: '5 Channels',
      brands: '2 Brand Kits',
      teamMembers: '3 Members'
    }
  },
  {
    tier: 'Business',
    name: 'Business & Agency',
    monthlyPriceUSD: 79,
    annualPriceUSD: 64,
    monthlyPriceNGN: '₦79,000 / month',
    description: 'Built for agencies, marketing teams, and brands managing multi-channel workflows.',
    features: [
      '10,000 AI Generations / month',
      'Team Member Collaboration & Roles',
      'Multi-Stage Approval Workflow',
      'Advanced Analytics & ROI Funnel Tracking',
      'AI Inbox Engagement & Comment Auto-Replies',
      'Multiple Brand Kits (Up to 10 Brands)',
      'A/B Split Testing & Trend Radar'
    ],
    limits: {
      aiGenerationsPerMonth: '10,000 / mo',
      workspaces: '10 Workspaces',
      socialChannels: '15 Channels',
      brands: '10 Brand Kits',
      teamMembers: '10 Members'
    }
  },
  {
    tier: 'Enterprise',
    name: 'Enterprise Vault',
    monthlyPriceUSD: 199,
    annualPriceUSD: 159,
    monthlyPriceNGN: '₦199,000 / month',
    description: 'Custom security, SSO integration, dedicated infrastructure, and unlimited scale.',
    badge: 'Maximum Security',
    features: [
      'Unlimited AI Generations',
      'Single Sign-On (SSO) & MFA Enforcement',
      'Advanced Security Vault & Audit Logs',
      'Dedicated Server Infrastructure & Priority Processing',
      'Full API Access & Webhooks Integration',
      'Unlimited Workspaces, Channels & Brands',
      'Dedicated Account Strategist'
    ],
    limits: {
      aiGenerationsPerMonth: 'Unlimited',
      workspaces: 'Unlimited',
      socialChannels: 'Unlimited',
      brands: 'Unlimited',
      teamMembers: 'Unlimited'
    }
  }
];

const DEFAULT_USAGE: UsageLimitsState = {
  currentTier: 'Business',
  billingCycle: 'annual',
  renewsOn: 'September 1, 2026',
  generationsUsed: 384,
  generationsLimit: 10000,
  channelsConnected: 5,
  channelsLimit: 15,
  workspacesUsed: 2,
  workspacesLimit: 10,
  teamMembersCount: 3,
  teamMembersLimit: 10
};

export default function SubscriptionBillingManager({
  usageState = DEFAULT_USAGE,
  onUpgradeTier,
  loading = false
}: SubscriptionBillingManagerProps) {
  const usage = usageState || DEFAULT_USAGE;
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedTierForCheckout, setSelectedTierForCheckout] = useState<SubscriptionTier | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);

  const handleConfirmUpgrade = async (tier: SubscriptionTier) => {
    setUpgrading(true);
    try {
      if (onUpgradeTier) {
        await onUpgradeTier(tier);
      }
      setUpgradeSuccess(`Successfully switched your workspace plan to ${tier}!`);
      setSelectedTierForCheckout(null);
      setTimeout(() => setUpgradeSuccess(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Subscription & Commercial Tier Billing Manager
              </h2>
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono uppercase flex items-center gap-1">
                <Crown className="w-3 h-3 text-blue-600" /> Active: {usage.currentTier}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage workspace subscription plans, usage quotas, team seat allocations, and billing invoices.
            </p>
          </div>
        </div>

        {/* BILLING CYCLE TOGGLE */}
        <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center gap-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Annual</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold uppercase">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {upgradeSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-lg text-xs font-medium text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{upgradeSuccess}</span>
        </div>
      )}

      {/* ACTIVE PLAN USAGE METERS BAR */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
          <span className="text-xs font-semibold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            Current Workspace Quotas ({usage.currentTier} Tier)
          </span>
          <span className="text-xs text-slate-500">
            Renews on: <strong className="text-slate-700 font-medium">{usage.renewsOn}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* AI GENERATIONS METERS */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">AI Generations</span>
              <strong className="text-slate-900 font-bold">
                {usage.generationsUsed} / {usage.generationsLimit === -1 ? '∞' : usage.generationsLimit}
              </strong>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{
                  width: usage.generationsLimit === -1 ? '15%' : `${Math.min(100, (usage.generationsUsed / usage.generationsLimit) * 100)}%`
                }}
              />
            </div>
          </div>

          {/* SOCIAL CHANNELS METERS */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Channels Connected</span>
              <strong className="text-slate-900 font-bold">
                {usage.channelsConnected} / {usage.channelsLimit}
              </strong>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (usage.channelsConnected / usage.channelsLimit) * 100)}%` }}
              />
            </div>
          </div>

          {/* WORKSPACES METERS */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Workspaces Used</span>
              <strong className="text-slate-900 font-bold">
                {usage.workspacesUsed} / {usage.workspacesLimit}
              </strong>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (usage.workspacesUsed / usage.workspacesLimit) * 100)}%` }}
              />
            </div>
          </div>

          {/* TEAM SEATS METERS */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Team Members</span>
              <strong className="text-slate-900 font-bold">
                {usage.teamMembersCount} / {usage.teamMembersLimit}
              </strong>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (usage.teamMembersCount / usage.teamMembersLimit) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* PLAN COMPARISON CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEFAULT_PLANS.map((plan) => {
          const isCurrent = usage.currentTier === plan.tier;
          const displayPrice = billingCycle === 'annual' ? plan.annualPriceUSD : plan.monthlyPriceUSD;

          return (
            <div
              key={plan.tier}
              className={`bg-white border rounded-xl p-5 space-y-4 shadow-2xs flex flex-col justify-between relative transition-all ${
                plan.isPopular
                  ? 'border-blue-500 ring-1 ring-blue-500/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-bold text-[9px] uppercase px-2.5 py-0.5 rounded-full shadow-2xs">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                  {isCurrent && (
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                      CURRENT
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-900">${displayPrice}</span>
                    <span className="text-xs text-slate-500 font-mono">/ mo</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">{plan.monthlyPriceNGN}</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">Plan Features:</span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  disabled={isCurrent}
                  onClick={() => setSelectedTierForCheckout(plan.tier)}
                  className={`w-full py-2.5 rounded-lg font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200'
                      : plan.isPopular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                  }`}
                >
                  {isCurrent ? (
                    <span>Active Plan</span>
                  ) : (
                    <>
                      <span>Select {plan.tier} Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SIMULATED CHECKOUT MODAL */}
      {selectedTierForCheckout && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
                <Crown className="w-4 h-4 text-blue-600" /> Upgrade to {selectedTierForCheckout} Plan
              </h3>
              <button onClick={() => setSelectedTierForCheckout(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Confirm switching your workspace plan to <strong className="text-slate-900 font-semibold">{selectedTierForCheckout}</strong> ({billingCycle} cycle).
              </p>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Tier:</span>
                  <strong className="text-slate-900 font-semibold">{selectedTierForCheckout}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Billing Interval:</span>
                  <strong className="text-blue-600 font-semibold uppercase">{billingCycle}</strong>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5 text-slate-900">
                  <span className="font-medium">Instant Access:</span>
                  <strong className="text-emerald-600 font-semibold">Activated Immediately</strong>
                </div>
              </div>

              <button
                disabled={upgrading}
                onClick={() => handleConfirmUpgrade(selectedTierForCheckout)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                {upgrading ? 'Processing Upgrade...' : `Confirm & Switch to ${selectedTierForCheckout}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
