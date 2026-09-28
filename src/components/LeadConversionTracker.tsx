import React, { useState } from 'react';
import { CampaignConversionAttribution } from '../types';
import {
  TrendingUp,
  MousePointerClick,
  Users,
  CheckCircle2,
  BarChart3,
  Sparkles,
  Coins,
  Plus,
  X
} from 'lucide-react';

interface LeadConversionTrackerProps {
  attributions?: CampaignConversionAttribution[];
}

const DEFAULT_ATTRIBUTIONS: CampaignConversionAttribution[] = [
  {
    id: 'attr_1',
    campaignTitle: 'Q4 Product Launch - Instagram Reel & TikTok',
    platform: 'Instagram Reel & TikTok',
    roiMultiplier: 14.2,
    funnel: {
      impressions: 12500,
      clicks: 430,
      leads: 42,
      customers: 8,
      revenue: 850000,
      formattedRevenue: '₦850,000 ($5,200 USD)'
    }
  },
  {
    id: 'attr_2',
    campaignTitle: '3 Proven Hooks for B2B Engagement',
    platform: 'LinkedIn Article & Carousel',
    roiMultiplier: 18.5,
    funnel: {
      impressions: 24800,
      clicks: 920,
      leads: 85,
      customers: 14,
      revenue: 1650000,
      formattedRevenue: '₦1,650,000 ($10,100 USD)'
    }
  }
];

export default function LeadConversionTracker({
  attributions = DEFAULT_ATTRIBUTIONS
}: LeadConversionTrackerProps) {
  const [dataList, setDataList] = useState<CampaignConversionAttribution[]>(
    attributions.length > 0 ? attributions : DEFAULT_ATTRIBUTIONS
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [platform, setPlatform] = useState('Instagram Reel & Stories');
  const [leadsCount, setLeadsCount] = useState(10);
  const [revenueAmount, setRevenueAmount] = useState(250000);

  const totalLeads = dataList.reduce((acc, curr) => acc + curr.funnel.leads, 0);
  const totalCustomers = dataList.reduce((acc, curr) => acc + curr.funnel.customers, 0);
  const totalRevenueNumber = dataList.reduce((acc, curr) => acc + curr.funnel.revenue, 0);

  const handleAddAttribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle.trim()) return;

    const newAttr: CampaignConversionAttribution = {
      id: `attr_${Date.now()}`,
      campaignTitle: campaignTitle.trim(),
      platform,
      roiMultiplier: parseFloat(((revenueAmount / Math.max(leadsCount * 2000, 10000)) * 1.5).toFixed(1)),
      funnel: {
        impressions: leadsCount * 180,
        clicks: leadsCount * 14,
        leads: leadsCount,
        customers: Math.max(1, Math.floor(leadsCount * 0.18)),
        revenue: revenueAmount,
        formattedRevenue: `₦${revenueAmount.toLocaleString()}`
      }
    };

    setDataList([newAttr, ...dataList]);
    setCampaignTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                Full-Funnel Lead & Revenue Attribution
              </h2>
              <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                Live Attribution
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Connect published social media content and campaigns directly to qualified leads and verified closed revenue.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Influenced Revenue</span>
            <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
              ₦{totalRevenueNumber.toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Conversion</span>
          </button>
        </div>
      </div>

      {/* SUMMARY STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Leads Captured</span>
          <span className="text-base font-mono font-bold text-slate-900 tabular-nums">{totalLeads} Qualified</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Closed Customers</span>
          <span className="text-base font-mono font-bold text-emerald-700 tabular-nums">{totalCustomers} Paying</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Avg Conversion Rate</span>
          <span className="text-base font-mono font-bold text-blue-700 tabular-nums">17.8% (Lead to Sale)</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Average Campaign ROI</span>
          <span className="text-base font-mono font-bold text-slate-900 tabular-nums">16.3x ROI</span>
        </div>
      </div>

      {/* CAMPAIGN CONVERSION FUNNELS */}
      <div className="space-y-4">
        {dataList.map((attr) => (
          <div key={attr.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <span className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {attr.platform}
                </span>
                <h3 className="text-sm font-bold text-slate-900 font-sans mt-1.5">{attr.campaignTitle}</h3>
              </div>

              <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-2">
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                  {attr.roiMultiplier}x ROI Multiplier
                </span>
                <span className="text-xs font-mono text-slate-700 font-bold tabular-nums">
                  {attr.funnel.formattedRevenue}
                </span>
              </div>
            </div>

            {/* VISUAL PIPELINE FUNNEL STEPPER */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center font-mono">
              {/* STEP 1: IMPRESSIONS */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase block font-sans">1. Impressions</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">{attr.funnel.impressions.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-sans">Reach</span>
              </div>

              {/* STEP 2: CLICKS */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase block font-sans">2. Clicks</span>
                <span className="text-sm font-bold text-blue-700 tabular-nums">{attr.funnel.clicks.toLocaleString()}</span>
                <span className="text-[10px] text-blue-600 block mt-0.5 font-sans">3.4% CTR</span>
              </div>

              {/* STEP 3: LEADS */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase block font-sans">3. Leads</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">{attr.funnel.leads}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-sans">9.7% Conv</span>
              </div>

              {/* STEP 4: CUSTOMERS */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase block font-sans">4. Customers</span>
                <span className="text-sm font-bold text-emerald-700 tabular-nums">{attr.funnel.customers}</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5 font-sans">19% Close</span>
              </div>

              {/* STEP 5: REVENUE */}
              <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200 col-span-2 md:col-span-1">
                <span className="text-[9px] text-emerald-800 uppercase block font-bold font-sans">5. Revenue</span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">{attr.funnel.formattedRevenue}</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5 font-bold font-sans">Banked</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD CONVERSION EVENT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Record Campaign Conversion</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAttribution} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Campaign or Content Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass Reel & WhatsApp Funnel"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Primary Channel</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="Instagram Reel & Stories">Instagram Reel & Stories</option>
                  <option value="WhatsApp Direct Broadcast">WhatsApp Direct Broadcast</option>
                  <option value="Facebook Page Community">Facebook Page Community</option>
                  <option value="X / Twitter Thread">X / Twitter Thread</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Qualified Leads</label>
                  <input
                    type="number"
                    min={1}
                    value={leadsCount}
                    onChange={(e) => setLeadsCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Revenue (₦)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={revenueAmount}
                    onChange={(e) => setRevenueAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  Save Attribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

