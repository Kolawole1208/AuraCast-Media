import React, { useState, useEffect } from 'react';
import { BrandKit } from '../types';
import {
  Palette,
  Image as ImageIcon,
  Type,
  Volume2,
  Bookmark,
  Sparkles,
  Check,
  Shield,
  Zap,
  Globe,
  Upload,
  Layers,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Send,
  Eye,
  Tag,
  AtSign,
  Phone
} from 'lucide-react';

interface BrandKitManagerProps {
  brandKit?: BrandKit;
  onSaveBrandKit: (updatedKit: BrandKit) => Promise<void>;
  loading: boolean;
}

const COLOR_PRESETS = [
  { name: 'Midnight Cyber', primary: '#0f172a', secondary: '#1e293b', accent: '#06b6d4' },
  { name: 'Cosmic Violet', primary: '#1e1b4b', secondary: '#312e81', accent: '#8b5cf6' },
  { name: 'Emerald Growth', primary: '#064e3b', secondary: '#047857', accent: '#10b981' },
  { name: 'Gold Luxury', primary: '#1c1917', secondary: '#292524', accent: '#f59e0b' },
  { name: 'Rose Allure', primary: '#4c0519', secondary: '#831843', accent: '#f43f5e' },
  { name: 'Electric Ocean', primary: '#0c4a6e', secondary: '#0369a1', accent: '#38bdf8' }
];

const PRESET_LOGOS = [
  { id: 'shield', label: 'Shield Monogram', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'zen', label: 'Zen Flame', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'cosmic', label: 'Cosmic Orb', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'minimal', label: 'Minimal Crest', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200&h=200' }
];

const VOICE_OPTIONS = [
  'Inspirational & Uplifting',
  'Professional & Authoritative',
  'Casual & Friendly',
  'Bold & Direct',
  'Luxury & High-End',
  'Witty & Humorous'
];

export default function BrandKitManager({
  brandKit,
  onSaveBrandKit,
  loading
}: BrandKitManagerProps) {
  const [form, setForm] = useState<BrandKit>({
    id: brandKit?.id || 'bk_1',
    brandName: brandKit?.brandName || 'AuraCast Creatives',
    logoUrl: brandKit?.logoUrl || PRESET_LOGOS[0].url,
    primaryColor: brandKit?.primaryColor || '#0f172a',
    secondaryColor: brandKit?.secondaryColor || '#1e293b',
    accentColor: brandKit?.accentColor || '#06b6d4',
    fontHeader: brandKit?.fontHeader || 'Display / Syne Bold',
    fontBody: brandKit?.fontBody || 'Plus Jakarta Sans',
    slogan: brandKit?.slogan || 'Empowering Purpose, Daily Discipline & Growth',
    brandDescription: brandKit?.brandDescription || 'A faith-driven motivational media hub for ambitious youth.',
    brandVoice: brandKit?.brandVoice || 'Inspirational & Uplifting',
    preferredImagery: brandKit?.preferredImagery || 'Dark Cosmic & High-Contrast Visuals',
    ctaStyle: brandKit?.ctaStyle || 'Comment below & click link in bio',
    hashtagStyle: brandKit?.hashtagStyle || '#GrowthMindset #DailyPurpose #Motivation',
    socialHandles: {
      instagram: brandKit?.socialHandles?.instagram || '@auracast.official',
      twitter: brandKit?.socialHandles?.twitter || '@AuraCastMedia',
      facebook: brandKit?.socialHandles?.facebook || 'AuraCast Community',
      youtube: brandKit?.socialHandles?.youtube || 'AuraCast Channel',
      whatsapp: brandKit?.socialHandles?.whatsapp || '+234 706 633 2626'
    },
    updatedAt: brandKit?.updatedAt || new Date().toISOString()
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (brandKit) {
      setForm(brandKit);
    }
  }, [brandKit]);

  const handleSave = async () => {
    await onSaveBrandKit({
      ...form,
      updatedAt: new Date().toISOString()
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const applyColorPreset = (p: typeof COLOR_PRESETS[0]) => {
    setForm(prev => ({
      ...prev,
      primaryColor: p.primary,
      secondaryColor: p.secondary,
      accentColor: p.accent
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Professional Brand Kit Engine
              </h2>
              <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded tracking-wider uppercase flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-blue-600" />
                Auto-Brand Enforcer
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Define your logo, colors, typography, and brand voice. Every AI-generated post automatically adapts to this brand DNA.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-2xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Brand Kit Enforced!</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4 text-white" />
              <span>Save & Enforce Brand Kit</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: BRAND KIT INPUT FORM (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 1: Brand Identity & Logo */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>1. Brand Identity & Logo Asset</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-semibold text-slate-700 uppercase">
                  Brand / Business Name
                </label>
                <input
                  type="text"
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 focus:border-blue-600 focus:outline-none shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-semibold text-slate-700 uppercase">
                  Brand Slogan / Tagline
                </label>
                <input
                  type="text"
                  value={form.slogan}
                  onChange={(e) => setForm({ ...form, slogan: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 focus:border-blue-600 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            {/* Logo Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="text-[10px] font-mono font-semibold text-slate-700 uppercase block">
                Brand Logo Avatar URL / Presets
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 shrink-0 overflow-hidden shadow-2xs">
                  <img
                    src={form.logoUrl || PRESET_LOGOS[0].url}
                    alt="Brand Logo"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <input
                  type="text"
                  value={form.logoUrl || ''}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  placeholder="https://... logo image link"
                  className="flex-1 bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 focus:border-blue-600 focus:outline-none font-mono shadow-2xs"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {PRESET_LOGOS.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => setForm({ ...form, logoUrl: pl.url })}
                    className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      form.logoUrl === pl.url
                        ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 shadow-2xs'
                    }`}
                  >
                    <img src={pl.url} className="w-3.5 h-3.5 rounded-full object-cover" />
                    <span>{pl.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: Color Palette */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider">
                <Palette className="w-4 h-4 text-blue-600" />
                <span>2. Brand Color Palette</span>
              </div>
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5 bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                <label className="text-[10px] font-mono font-semibold text-slate-600 uppercase block">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                    className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono font-bold text-slate-900">{form.primaryColor}</span>
                </div>
              </div>

              <div className="space-y-1.5 bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                <label className="text-[10px] font-mono font-semibold text-slate-600 uppercase block">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.secondaryColor}
                    onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                    className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono font-bold text-slate-900">{form.secondaryColor}</span>
                </div>
              </div>

              <div className="space-y-1.5 bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                <label className="text-[10px] font-mono font-semibold text-slate-600 uppercase block">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.accentColor}
                    onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                    className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono font-bold text-slate-900">{form.accentColor}</span>
                </div>
              </div>
            </div>

            {/* Quick Color Swatches */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono font-semibold text-slate-600 uppercase block">
                Quick Palette Presets:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COLOR_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyColorPreset(p)}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span className="text-[10px] font-semibold text-slate-800">{p.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primary }} />
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.secondary }} />
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.accent }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: Brand Voice & Messaging */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>3. Brand Voice & Messaging Tone</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-semibold text-slate-700 uppercase">
                  Tone & Brand Voice
                </label>
                <select
                  value={form.brandVoice}
                  onChange={(e) => setForm({ ...form, brandVoice: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-xs text-slate-900 rounded-xl px-3.5 py-2.5 focus:border-blue-600 focus:outline-none shadow-2xs"
                >
                  {VOICE_OPTIONS.map((vo) => (
                    <option key={vo} value={vo}>{vo}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-semibold text-slate-700 uppercase">
                  Preferred Call To Action (CTA)
                </label>
                <input
                  type="text"
                  value={form.ctaStyle}
                  onChange={(e) => setForm({ ...form, ctaStyle: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-xs text-slate-900 rounded-xl px-3.5 py-2.5 focus:border-blue-600 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-semibold text-slate-700 uppercase">
                Brand Core Bio & Description
              </label>
              <textarea
                value={form.brandDescription}
                onChange={(e) => setForm({ ...form, brandDescription: e.target.value })}
                rows={2}
                className="w-full bg-white border border-slate-200 text-xs text-slate-900 rounded-xl p-3 focus:border-blue-600 focus:outline-none shadow-2xs"
              />
            </div>

            {/* Social Handles */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-[10px] font-mono font-semibold text-slate-700 uppercase block">
                Social Handles & Contact Footer:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
                  <AtSign className="w-3.5 h-3.5 text-blue-600" />
                  <input
                    type="text"
                    value={form.socialHandles.instagram || ''}
                    onChange={(e) => setForm({ ...form, socialHandles: { ...form.socialHandles, instagram: e.target.value } })}
                    placeholder="Instagram handle"
                    className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <input
                    type="text"
                    value={form.socialHandles.whatsapp || ''}
                    onChange={(e) => setForm({ ...form, socialHandles: { ...form.socialHandles, whatsapp: e.target.value } })}
                    placeholder="WhatsApp number"
                    className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE BRANDED ASSET PREVIEW (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Live Branded Graphic Card Preview</span>
              </div>
              <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                Auto Enforced
              </span>
            </div>

            {/* Visual Card Sample Rendered with Brand Kit Settings */}
            <div
              className="rounded-xl p-6 min-h-[300px] flex flex-col justify-between shadow-md border relative overflow-hidden transition-all"
              style={{
                backgroundColor: form.primaryColor,
                borderColor: form.accentColor,
                color: '#ffffff'
              }}
            >
              {/* Background Accent glow */}
              <div
                className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ backgroundColor: form.accentColor }}
              />

              {/* Top Bar: Brand Logo & Title */}
              <div className="flex items-center justify-between relative z-10 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-slate-900 shrink-0">
                    <img src={form.logoUrl || PRESET_LOGOS[0].url} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-tight text-white">
                      {form.brandName}
                    </h4>
                    <p className="text-[9px] font-mono opacity-80" style={{ color: form.accentColor }}>
                      {form.slogan}
                    </p>
                  </div>
                </div>
                <span className="text-[8px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 border border-white/10">
                  {form.brandVoice}
                </span>
              </div>

              {/* Main Card Quote/Text */}
              <div className="my-6 relative z-10 space-y-2">
                <span className="text-[9px] font-mono font-semibold tracking-wider uppercase block opacity-90">
                  // DAILY BRAND INSIGHT
                </span>
                <p className="text-sm font-bold leading-relaxed font-sans text-white">
                  "Consistency isn't about being perfect. It's about showing up every day with purpose, discipline, and clarity."
                </p>
              </div>

              {/* Footer CTA & Social Handles */}
              <div
                className="pt-3 border-t border-white/10 flex items-center justify-between relative z-10 rounded-lg p-2.5 mt-auto"
                style={{ backgroundColor: form.secondaryColor }}
              >
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono font-semibold block">
                    👉 {form.ctaStyle}
                  </span>
                  <span className="text-[8px] font-mono opacity-70 block">
                    {form.socialHandles.instagram} • {form.socialHandles.whatsapp}
                  </span>
                </div>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: form.accentColor }}
                />
              </div>
            </div>

            {/* Helper Info */}
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 font-sans leading-relaxed shadow-2xs">
              💡 <strong>AI Enforcer:</strong> When you generate social posts, quotes, or video scripts in AuraCast, the AI prompt engine automatically reads this Brand Kit and embeds your logo, color palette, and tone guidelines into the output.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
