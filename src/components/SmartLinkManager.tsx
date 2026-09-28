import React, { useState } from 'react';
import { SmartLink } from '../types';
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  Plus,
  MousePointerClick,
  MapPin,
  BarChart2,
  Sparkles,
  Globe
} from 'lucide-react';

interface SmartLinkManagerProps {
  links?: SmartLink[];
  onCreateLink: (link: Omit<SmartLink, 'id' | 'createdAt' | 'clicks' | 'conversions'>) => Promise<void>;
}

const DEFAULT_LINKS: SmartLink[] = [
  {
    id: 'lnk_1',
    shortCode: 'auracast.ai/go/restaurant',
    fullUrl: 'https://auracast.ai/campaigns/restaurant-menu-q4',
    slug: 'restaurant',
    title: 'Q4 Gourmet Menu Launch CTA',
    campaignName: 'Holiday Growth Sprint',
    targetPlatform: 'Instagram & TikTok',
    clicks: 430,
    conversions: 42,
    topLocation: 'Lagos, NG (64%)',
    createdAt: '3 days ago'
  },
  {
    id: 'lnk_2',
    shortCode: 'auracast.ai/go/ai-launch',
    fullUrl: 'https://auracast.ai/features/ai-video-studio',
    slug: 'ai-launch',
    title: 'AI Video Studio Free Trial',
    campaignName: 'B2B Founder Campaign',
    targetPlatform: 'LinkedIn & Twitter',
    clicks: 920,
    conversions: 85,
    topLocation: 'London, UK (48%)',
    createdAt: '1 week ago'
  }
];

export default function SmartLinkManager({
  links = DEFAULT_LINKS,
  onCreateLink
}: SmartLinkManagerProps) {
  const dataList = links.length > 0 ? links : DEFAULT_LINKS;

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('offer-special');
  const [fullUrl, setFullUrl] = useState('https://company.com/promo');
  const [campaignName, setCampaignName] = useState('Q4 Promo');
  const [targetPlatform, setTargetPlatform] = useState('Instagram');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fullUrl.trim() || !slug.trim()) return;

    try {
      await onCreateLink({
        shortCode: `auracast.ai/go/${slug}`,
        fullUrl,
        slug,
        title,
        campaignName,
        targetPlatform,
        topLocation: 'Worldwide'
      });

      setShowModal(false);
      setTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                AuraCast Smart Link Shortener & CTA Attribution System
              </h2>
              <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded uppercase">
                {dataList.length} Active Short Links
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Shorten URLs, track click analytics, monitor geographic traffic, and measure sales conversion attribution.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Create Smart Link</span>
        </button>
      </div>

      {/* LINKS LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataList.map((lnk) => (
          <div
            key={lnk.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 space-y-4 shadow-2xs flex flex-col justify-between transition-colors"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded border border-blue-200">
                  {lnk.targetPlatform}
                </span>

                <span className="text-[10px] font-mono text-slate-500">
                  Campaign: <strong className="text-slate-800">{lnk.campaignName}</strong>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 font-sans">{lnk.title}</h3>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-blue-700 truncate">
                  {lnk.shortCode}
                </span>

                <button
                  onClick={() => handleCopy(lnk.id, `https://${lnk.shortCode}`)}
                  className="text-[10px] font-mono bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedId === lnk.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs font-mono text-slate-500 truncate">
                Destination: {lnk.fullUrl}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center font-mono">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase">Total Clicks</span>
                <strong className="text-xs text-slate-900">{lnk.clicks}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase">Conversions</span>
                <strong className="text-xs text-emerald-700">{lnk.conversions}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase">Top Location</span>
                <strong className="text-xs text-blue-700 truncate block">{lnk.topLocation}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE LINK MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase">Create AuraCast Smart Link</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-700 font-semibold uppercase block mb-1">Title / Label</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q4 Restaurant Menu Promo"
                  className="w-full bg-white border border-slate-200 text-xs text-slate-900 p-2.5 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-700 font-semibold uppercase block mb-1">Custom Slug (auracast.ai/go/...)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="e.g. restaurant"
                  className="w-full bg-white border border-slate-200 text-xs text-blue-700 font-mono p-2.5 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-700 font-semibold uppercase block mb-1">Destination Target URL</label>
                <input
                  type="url"
                  value={fullUrl}
                  onChange={(e) => setFullUrl(e.target.value)}
                  placeholder="https://yourwebsite.com/landing-page"
                  className="w-full bg-white border border-slate-200 text-xs text-slate-900 p-2.5 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Generate Smart Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
