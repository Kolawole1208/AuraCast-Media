import React, { useState } from 'react';
import { SocialChannel } from '../types';
import { Facebook, Instagram, Twitter, Youtube, Check, Link as LinkIcon, Radio, ShieldCheck, HelpCircle, MessageSquare, Key, Sparkles, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

interface ChannelManagerProps {
  channels: SocialChannel[];
  onToggleChannel: (
    channelId: string, 
    username?: string, 
    accessToken?: string, 
    businessId?: string, 
    action?: 'connect' | 'disconnect' | 'toggle',
    apiKey?: string,
    autoPostEnabled?: boolean
  ) => Promise<void>;
  loading: boolean;
}

export default function ChannelManager({ channels, onToggleChannel, loading }: ChannelManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [handleInput, setHandleInput] = useState('');
  
  // Direct API integration options
  const [integrationMode, setIntegrationMode] = useState<'interactive' | 'direct_api'>('direct_api');
  const [tokenInput, setTokenInput] = useState('');
  const [businessIdInput, setBusinessIdInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [autoPostToggle, setAutoPostToggle] = useState(true);
  const [showHelper, setShowHelper] = useState(false);
  
  // Facebook Verification States
  const [isVerifyingFb, setIsVerifyingFb] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleVerifyFbToken = async () => {
    if (!tokenInput.trim()) {
      setVerifyError("Please enter a Page Access Token first.");
      return;
    }
    setIsVerifyingFb(true);
    setVerifyStatus(null);
    setVerifyError(null);
    try {
      const res = await fetch('/api/channels/facebook/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: businessIdInput.trim(),
          accessToken: tokenInput.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }
      setVerifyStatus(`Verified! Page: "${data.page.name}" (ID: ${data.page.id})`);
      if (data.page.name && (!handleInput || handleInput === 'My Brand Page')) {
        setHandleInput(data.page.name);
      }
      if (data.page.id) {
        setBusinessIdInput(data.page.id);
      }
    } catch (err: any) {
      setVerifyError(err.message || "Failed to verify Facebook token");
    } finally {
      setIsVerifyingFb(false);
    }
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'facebook': return <Facebook className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />;
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" />;
      case 'twitter': return <Twitter className="w-5 h-5 text-sky-400 group-hover:text-sky-300 transition-colors" />;
      case 'youtube': return <Youtube className="w-5 h-5 text-rose-400 group-hover:text-rose-300 transition-colors" />;
      case 'whatsapp': return <MessageSquare className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />;
      default: return null;
    }
  };

  const handleConnectClick = (chan: SocialChannel) => {
    setEditingId(chan.id);
    setHandleInput(chan.username || (
      chan.id === 'whatsapp' ? '+2348000000000' :
      chan.id === 'instagram' ? '@instagram_creator' :
      chan.id === 'facebook' ? 'My Brand Page' :
      chan.id === 'twitter' ? '@creative_tweets' :
      'AuraCast Channel'
    ));
    setTokenInput(chan.accessToken || '');
    setBusinessIdInput(chan.businessId || '');
    setApiKeyInput(chan.apiKey || '');
    setAutoPostToggle(chan.autoPostEnabled ?? true);
    setIntegrationMode('direct_api');
    setShowHelper(false);
    setVerifyStatus(null);
    setVerifyError(null);
  };

  const handleSaveConnect = async (id: string) => {
    if (integrationMode === 'direct_api') {
      await onToggleChannel(
        id, 
        handleInput.trim() || `@user_${id}`, 
        tokenInput.trim() || undefined, 
        businessIdInput.trim() || undefined,
        'connect',
        apiKeyInput.trim() || undefined,
        autoPostToggle
      );
    } else {
      await onToggleChannel(
        id, 
        handleInput.trim() || (id === 'whatsapp' ? 'Configured Business Number' : `@user_${id}`),
        undefined,
        undefined,
        'connect',
        undefined,
        false
      );
    }
    setEditingId(null);
    setHandleInput('');
    setTokenInput('');
    setBusinessIdInput('');
    setApiKeyInput('');
  };

  const getGuideForPlatform = (id: string) => {
    switch (id) {
      case 'facebook':
        return (
          <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/20 text-[10.5px] text-slate-300 space-y-1.5 leading-relaxed font-sans">
            <p className="font-bold text-white flex items-center gap-1">
              <Key className="w-3 h-3 text-indigo-400" /> Free Facebook Page Graph API Setup:
            </p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Visit <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-mono">developers.facebook.com</a> (Free developer account).</li>
              <li>Create an app with <strong className="text-white">Facebook Page Publishing</strong> permissions (<code className="text-indigo-300">pages_manage_posts</code>, <code className="text-indigo-300">pages_read_engagement</code>).</li>
              <li>Copy your <strong className="text-indigo-300">Page ID</strong> & generate a <strong className="text-indigo-300">Page Access Token</strong> from Graph API Explorer.</li>
            </ol>
          </div>
        );
      case 'instagram':
        return (
          <div className="bg-slate-950 p-3 rounded-xl border border-pink-500/20 text-[10.5px] text-slate-300 space-y-1.5 leading-relaxed font-sans">
            <p className="font-bold text-white flex items-center gap-1">
              <Key className="w-3 h-3 text-pink-400" /> Free Instagram Graph API Setup:
            </p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Convert your Instagram profile to a <strong className="text-pink-300">Professional/Creator account</strong> linked to a Facebook Page.</li>
              <li>In Meta Developer Portal, select <strong className="text-white">Instagram Content Publishing API</strong>.</li>
              <li>Enter your <strong className="text-pink-300">Instagram Business Account ID</strong> and <strong className="text-pink-300">Meta Access Token</strong>.</li>
            </ol>
          </div>
        );
      case 'youtube':
        return (
          <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/20 text-[10.5px] text-slate-300 space-y-1.5 leading-relaxed font-sans">
            <p className="font-bold text-white flex items-center gap-1">
              <Key className="w-3 h-3 text-rose-400" /> Free YouTube Data API v3 Key:
            </p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Open <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="text-rose-400 underline font-mono">console.cloud.google.com</a> (Free GCP tier).</li>
              <li>Enable <strong className="text-white">YouTube Data API v3</strong> in API Library.</li>
              <li>Create a free API Key or OAuth Client ID for your YouTube Channel.</li>
            </ol>
          </div>
        );
      case 'twitter':
        return (
          <div className="bg-slate-950 p-3 rounded-xl border border-sky-500/20 text-[10.5px] text-slate-300 space-y-1.5 leading-relaxed font-sans">
            <p className="font-bold text-white flex items-center gap-1">
              <Key className="w-3 h-3 text-sky-400" /> Free Twitter/X Developer API v2:
            </p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Sign up on <a href="https://developer.x.com" target="_blank" rel="noreferrer" className="text-sky-400 underline font-mono">developer.x.com</a> (Free tier available).</li>
              <li>Generate your <strong className="text-white">API Key / Bearer Token</strong> with Write permissions to post tweets automatically.</li>
            </ol>
          </div>
        );
      case 'whatsapp':
        return (
          <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/20 text-[10.5px] text-slate-300 space-y-1.5 leading-relaxed font-sans">
            <p className="font-bold text-white flex items-center gap-1">
              <Key className="w-3 h-3 text-emerald-400" /> Free WhatsApp Cloud API Setup:
            </p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Go to <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-mono">Meta Developers</a> and create a WhatsApp product app.</li>
              <li>Get your free test <strong className="text-white">Phone Number ID</strong> and <strong className="text-white">Permanent System User Token</strong>.</li>
            </ol>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900/65 backdrop-blur-xl rounded-2xl border border-slate-800/90 shadow-2xl p-6 ring-1 ring-white/5 relative overflow-hidden group">
      {/* Background ambient lighting */}
      <div className="absolute -left-12 -bottom-12 w-28 h-28 bg-violet-600/10 rounded-full blur-2xl group-hover:bg-violet-600/15 transition-all duration-500" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-base font-display font-semibold text-white tracking-tight flex items-center gap-2">
            Social Connections & Auto-Posting Engine
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Configure Direct API keys for background posting or interactive dispatch mode</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Auto-Posting Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        {channels.map((chan) => {
          const hasDirectApi = chan.connected && Boolean(chan.accessToken || chan.apiKey || chan.businessId);

          return (
            <div
              key={chan.id}
              id={`channel-card-${chan.id}`}
              className={`p-4 rounded-2xl border transition-all duration-200 group/item relative overflow-hidden ${
                chan.connected
                  ? 'border-emerald-500/35 bg-slate-950/90 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/20'
                  : 'border-dashed border-slate-800 bg-transparent opacity-75 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              {/* Top Accent Bar for Connected State */}
              {chan.connected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 shadow-sm shadow-emerald-500/50" />
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl transition-all relative ${
                    chan.connected 
                      ? 'bg-emerald-950/40 border border-emerald-500/40 shadow-sm' 
                      : 'bg-slate-950/60 border border-slate-800'
                  }`}>
                    {getIcon(chan.id)}
                    {chan.connected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-200 font-sans tracking-tight leading-none">
                        {chan.name}
                      </h3>
                      {chan.connected ? (
                        <span className="text-[9.5px] font-mono font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Connected
                        </span>
                      ) : (
                        <span className="text-[9.5px] font-mono font-bold text-slate-400 bg-slate-800/80 border border-slate-700/50 px-2 py-0.5 rounded-full">
                          Disconnected
                        </span>
                      )}
                    </div>

                    {chan.connected ? (
                      <div className="flex flex-col mt-1.5">
                        <span className="text-[11px] text-indigo-300 font-semibold font-mono inline-block truncate max-w-[160px]">
                          {chan.username}
                        </span>
                        {hasDirectApi ? (
                          <span className="text-[8.5px] text-emerald-400 font-mono font-bold uppercase flex items-center gap-1 mt-0.5">
                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> Direct API Auto-Post Active
                          </span>
                        ) : (
                          <span className="text-[8.5px] text-amber-400 font-mono font-bold uppercase flex items-center gap-1 mt-0.5">
                            <Radio className="w-2.5 h-2.5 text-amber-400" /> Guided Dispatch Active
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 mt-1.5 inline-block font-sans">Click below to connect</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {chan.connected && editingId !== chan.id && (
                    <button
                      onClick={() => handleConnectClick(chan)}
                      disabled={loading}
                      className="text-[10px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                    >
                      Settings
                    </button>
                  )}

                  {chan.connected ? (
                    <button
                      onClick={() => onToggleChannel(chan.id, undefined, undefined, undefined, 'disconnect')}
                      disabled={loading}
                      className="text-[10px] font-bold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1.5 rounded-lg border border-rose-500/20 transition-colors cursor-pointer"
                    >
                      Disconnect
                    </button>
                  ) : (
                    editingId !== chan.id && (
                      <button
                        onClick={() => handleConnectClick(chan)}
                        disabled={loading}
                        className="text-[10px] font-bold text-emerald-300 hover:text-white bg-emerald-600/20 hover:bg-emerald-600/30 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition-colors flex items-center gap-1 cursor-pointer shadow-sm shadow-emerald-950/50"
                      >
                        <LinkIcon className="w-3 h-3 text-emerald-400" />
                        + Connect
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* EDITING / CONFIGURATION PANEL */}
              {editingId === chan.id && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-3 animate-fadeIn">
                  
                  {/* MODE SELECTOR */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider font-sans">
                        Connection Mode
                      </span>
                      <button 
                        onClick={() => setShowHelper(!showHelper)}
                        type="button"
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-sans"
                      >
                        <HelpCircle className="w-3 h-3" /> Get Free API Key?
                      </button>
                    </div>

                    {showHelper && getGuideForPlatform(chan.id)}

                    <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-850">
                      <button
                        onClick={() => setIntegrationMode('direct_api')}
                        type="button"
                        className={`py-1.5 px-2 text-[10px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          integrationMode === 'direct_api' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" /> Direct API Token
                      </button>
                      <button
                        onClick={() => setIntegrationMode('interactive')}
                        type="button"
                        className={`py-1.5 px-2 text-[10px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          integrationMode === 'interactive' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Radio className="w-3 h-3" /> Guided Helper
                      </button>
                    </div>
                  </div>

                  {/* USERNAME / HANDLE FIELD */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                      {chan.id === 'whatsapp' ? 'WhatsApp Business Phone Number' : 'Account Handle / Channel Name'}
                    </label>
                    <input
                      type="text"
                      value={handleInput}
                      onChange={(e) => setHandleInput(e.target.value)}
                      placeholder={chan.id === 'whatsapp' ? 'e.g. +2348000000000' : 'e.g. @your_account'}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 font-mono text-slate-200"
                    />
                  </div>

                  {/* DIRECT API EXTRA FIELDS */}
                  {integrationMode === 'direct_api' && (
                    <div className="space-y-2 pt-1 border-t border-slate-900">
                      
                      {/* ID Field (Business ID, Page ID, Channel ID, Phone ID) */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                          {chan.id === 'facebook' ? 'Facebook Page ID' :
                           chan.id === 'instagram' ? 'Instagram Business Account ID' :
                           chan.id === 'youtube' ? 'YouTube Channel ID' :
                           chan.id === 'whatsapp' ? 'WhatsApp Phone Number ID' :
                           'Account / Project ID'}
                        </label>
                        <input
                          type="text"
                          value={businessIdInput}
                          onChange={(e) => setBusinessIdInput(e.target.value)}
                          placeholder="e.g. 104958273910294"
                          className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 font-mono text-slate-200"
                        />
                      </div>

                      {/* Token / Access Secret Field */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                          {chan.id === 'youtube' ? 'YouTube Data API Key / OAuth Token' :
                           chan.id === 'twitter' ? 'Twitter/X Bearer Token or API Key' :
                           chan.id === 'facebook' ? 'Facebook Page Access Token (pages_manage_posts permission)' :
                           'Platform Access Token / API Key'}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                            placeholder="EAAW... or AIza..."
                            className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 font-mono text-slate-200"
                          />
                          {chan.id === 'facebook' && (
                            <button
                              type="button"
                              onClick={handleVerifyFbToken}
                              disabled={isVerifyingFb}
                              className="px-3 py-1.5 text-[10px] font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                            >
                              {isVerifyingFb ? 'Verifying...' : 'Verify Token'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Facebook Verification Banners */}
                      {chan.id === 'facebook' && verifyStatus && (
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] font-semibold text-emerald-400 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{verifyStatus}</span>
                        </div>
                      )}

                      {chan.id === 'facebook' && verifyError && (
                        <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[10px] text-rose-300 flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{verifyError}</span>
                        </div>
                      )}

                      {/* AUTO-POST TOGGLE */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-200 font-sans">Enable Background Auto-Publish</span>
                          <span className="text-[9px] text-slate-400 font-sans">Post directly via API without tab popups</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAutoPostToggle(!autoPostToggle)}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                        >
                          {autoPostToggle ? (
                            <ToggleRight className="w-6 h-6 text-indigo-400" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-slate-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-slate-850 mt-1 justify-end">
                    <button
                      onClick={() => setEditingId(null)}
                      type="button"
                      className="text-[11px] font-bold text-slate-400 hover:text-slate-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveConnect(chan.id)}
                      type="button"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-md shadow-indigo-600/30"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save Configuration
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
