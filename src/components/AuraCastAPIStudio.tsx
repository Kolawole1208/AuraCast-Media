import React, { useState } from 'react';
import { DeveloperApiKey, WebhookEndpoint } from '../types';
import {
  Code2,
  Key,
  Webhook,
  Terminal,
  Copy,
  Check,
  Plus,
  Trash2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Activity,
  Server,
  Layers,
  Globe,
  ShoppingCart,
  Database,
  Smartphone,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface AuraCastAPIStudioProps {
  apiKeys?: DeveloperApiKey[];
  webhooks?: WebhookEndpoint[];
  onCreateApiKey?: (name: string) => Promise<void>;
  onRevokeApiKey?: (id: string) => Promise<void>;
  onCreateWebhook?: (url: string, events: string[]) => Promise<void>;
}

const DEFAULT_KEYS: DeveloperApiKey[] = [
  {
    id: 'key_1',
    name: 'Shopify Store Automation Service',
    keyPrefix: 'ac_live_8f3a9...',
    createdDate: '3 days ago',
    lastUsedDate: '2 mins ago',
    permissions: ['campaigns:write', 'posts:schedule', 'analytics:read'],
    status: 'active'
  },
  {
    id: 'key_2',
    name: 'HubSpot CRM Webhook Trigger',
    keyPrefix: 'ac_live_7e2b1...',
    createdDate: '1 week ago',
    lastUsedDate: '1 hour ago',
    permissions: ['campaigns:write', 'webhooks:listen'],
    status: 'active'
  }
];

const DEFAULT_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: 'wh_1',
    url: 'https://mycrm.example.com/api/auracast-events',
    events: ['post.published', 'engagement.spike', 'comment.flagged'],
    status: 'active',
    secret: 'whsec_8841a029c...',
    createdDate: '5 days ago'
  }
];

export default function AuraCastAPIStudio({
  apiKeys = DEFAULT_KEYS,
  webhooks = DEFAULT_WEBHOOKS,
  onCreateApiKey,
  onRevokeApiKey,
  onCreateWebhook
}: AuraCastAPIStudioProps) {
  const [activeTab, setActiveTab] = useState<'flow' | 'keys' | 'webhooks' | 'docs'>('flow');
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'nodejs' | 'python'>('nodejs');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    setLoading(true);
    try {
      if (onCreateApiKey) {
        await onCreateApiKey(newKeyName);
      }
      setNewKeyName('');
      setShowKeyModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nodeSnippet = `// Node.js / TypeScript SDK Integration
import { AuraCastClient } from '@auracast/sdk';

const auracast = new AuraCastClient({
  apiKey: process.env.AURACAST_API_KEY,
  environment: 'production'
});

// Trigger automated campaign generation from Customer CRM Event
async function onCustomerPurchase(orderData) {
  const campaign = await auracast.campaigns.generate({
    topic: \`New Product Launch: \${orderData.productName}\`,
    targetPlatforms: ['instagram', 'tiktok', 'linkedin'],
    brandKitId: 'bk_default',
    tone: 'energetic'
  });

  console.log('Generated AuraCast Campaign:', campaign.id);
}`;

  const pythonSnippet = `# Python Integration Script
import os
import requests

AURACAST_API_KEY = os.getenv("AURACAST_API_KEY")
ENDPOINT = "https://auracast.ai/api/v1/campaigns/generate"

headers = {
    "Authorization": f"Bearer {AURACAST_API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "topic": "Q4 Promotional Flash Sale",
    "targetPlatforms": ["instagram", "twitter", "tiktok"],
    "autoSchedule": True
}

response = requests.post(ENDPOINT, json=payload, headers=headers)
print("AuraCast Campaign Status:", response.json())`;

  const curlSnippet = `# cURL Direct HTTP API Request
curl -X POST https://auracast.ai/api/v1/campaigns/generate \\
  -H "Authorization: Bearer ac_live_8f3a920..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "Customer Loyalty Rewards Launch",
    "targetPlatforms": ["instagram", "tiktok", "facebook"],
    "brandKitId": "bk_default"
  }'`;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Developer API & Integration Hub
              </h2>
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-blue-600" /> REST & Webhooks v1
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect external CRMs, Shopify, mobile apps, and internal systems directly into AuraCast's AI Campaign Engine.
            </p>
          </div>
        </div>

        {/* TAB BUTTONS */}
        <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center gap-1">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'flow' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Architecture Flow
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'keys' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            API Keys
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'webhooks' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Webhooks
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'docs' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Code Snippets
          </button>
        </div>
      </div>

      {/* 1. ARCHITECTURE PIPELINE FLOW */}
      {activeTab === 'flow' && (
        <div className="space-y-6">
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-6 space-y-4">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Integration Architecture Flow Pipeline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
              {/* STEP 1: CUSTOMER SYSTEM */}
              <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-2 text-center relative shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 mx-auto flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">1. Customer Systems</h4>
                <p className="text-xs text-slate-500 leading-tight">
                  CRM (HubSpot, Salesforce), Shopify, Mobile Apps & Webhooks.
                </p>
                <div className="flex flex-wrap gap-1 justify-center pt-1">
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">Shopify</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">HubSpot</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">iOS/Android</span>
                </div>
              </div>

              {/* ARROW 1 */}
              <div className="hidden md:flex justify-center text-blue-600">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* STEP 2: AURACAST API */}
              <div className="bg-white border border-blue-200 p-4 rounded-lg space-y-2 text-center relative shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 mx-auto flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">2. AuraCast API Gateway</h4>
                <p className="text-xs text-slate-500 leading-tight">
                  REST & Webhook endpoints validate HMAC tokens and rate limits.
                </p>
                <div className="flex flex-wrap gap-1 justify-center pt-1">
                  <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-mono">AES-256</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-mono">HMAC OAuth</span>
                </div>
              </div>

              {/* ARROW 2 */}
              <div className="hidden md:flex justify-center text-blue-600">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* STEP 3: AI CAMPAIGN ENGINE */}
              <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-2 text-center relative shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 mx-auto flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">3. AI Campaign Engine</h4>
                <p className="text-xs text-slate-500 leading-tight">
                  Gemini AI drafts multi-format video scripts, copy, & graphics.
                </p>
                <div className="flex flex-wrap gap-1 justify-center pt-1">
                  <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-mono">Brand Kit AI</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-mono">Hook Engine</span>
                </div>
              </div>
            </div>
          </div>

          {/* INTEGRATION CATEGORIES MATRIX */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
                <ShoppingCart className="w-4 h-4 text-blue-600" /> E-commerce & Retail
              </div>
              <p className="text-xs text-slate-600">
                Automatically generate promotional social video posts whenever a new product is published on Shopify or WooCommerce.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
                <Globe className="w-4 h-4 text-blue-600" /> CRM & Lead Automation
              </div>
              <p className="text-xs text-slate-600">
                Trigger customer spotlight campaigns or testimonial posts in response to deal stage updates in HubSpot or Salesforce.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
                <Smartphone className="w-4 h-4 text-blue-600" /> Mobile Apps & Websites
              </div>
              <p className="text-xs text-slate-600">
                Embed user-generated content moderation or AI social sharing buttons directly into your native iOS/Android apps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. API KEYS TAB */}
      {activeTab === 'keys' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-700 uppercase">
              Developer API Secret Keys ({apiKeys.length} Active)
            </h3>
            <button
              onClick={() => setShowKeyModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Generate New API Key
            </button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="bg-slate-50/70 border border-slate-200/80 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 font-mono">{key.name}</span>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                      {key.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <code className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800">{key.keyPrefix}</code>
                    <span>Created: {key.createdDate}</span>
                    <span>• Last used: {key.lastUsedDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy('ac_live_secret_key_sample_token', key.id)}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copiedKey === key.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied Prefix
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" /> Copy Secret
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onRevokeApiKey && onRevokeApiKey(key.id)}
                    className="bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. WEBHOOKS TAB */}
      {activeTab === 'webhooks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-700 uppercase">
              Configured Webhook Endpoints ({webhooks.length})
            </h3>
          </div>

          <div className="space-y-3">
            {webhooks.map((wh) => (
              <div
                key={wh.id}
                className="bg-slate-50/70 border border-slate-200/80 p-4 rounded-lg space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Webhook className="w-4 h-4 text-blue-600" />
                    <code className="text-xs font-mono font-bold text-slate-900">{wh.url}</code>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                    {wh.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-slate-500">Events Subscribed:</span>
                  {wh.events.map((evt, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded"
                    >
                      {evt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CODE SNIPPETS TAB */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-700 uppercase">
              Interactive SDK & REST Code Snippets
            </h3>

            <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center gap-1">
              <button
                onClick={() => setSelectedLanguage('nodejs')}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  selectedLanguage === 'nodejs' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Node.js
              </button>
              <button
                onClick={() => setSelectedLanguage('python')}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  selectedLanguage === 'python' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Python
              </button>
              <button
                onClick={() => setSelectedLanguage('curl')}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  selectedLanguage === 'curl' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                cURL
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto relative group text-slate-200 shadow-inner">
            <button
              onClick={() => {
                const code =
                  selectedLanguage === 'nodejs'
                    ? nodeSnippet
                    : selectedLanguage === 'python'
                    ? pythonSnippet
                    : curlSnippet;
                navigator.clipboard.writeText(code);
                setCopiedSnippet(true);
                setTimeout(() => setCopiedSnippet(false), 2000);
              }}
              className="absolute top-3 right-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-[11px] flex items-center gap-1 cursor-pointer"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedSnippet ? 'Copied' : 'Copy Code'}</span>
            </button>

            <pre className="text-blue-300 leading-relaxed">
              {selectedLanguage === 'nodejs' && nodeSnippet}
              {selectedLanguage === 'python' && pythonSnippet}
              {selectedLanguage === 'curl' && curlSnippet}
            </pre>
          </div>
        </div>
      )}

      {/* MODAL TO GENERATE KEY */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-600" /> Create API Secret Key
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">Key Name / Service Description:</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. Mobile App Backend Service"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
              />

              <button
                disabled={loading}
                onClick={handleCreateKey}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-2xs cursor-pointer flex items-center justify-center gap-2 transition-colors mt-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Generate Key'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
