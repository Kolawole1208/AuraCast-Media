import React, { useState } from 'react';
import { ContentLibraryData, LibraryAsset, AssetCategory } from '../types';
import {
  FolderArchive,
  Search,
  Filter,
  Tag,
  Copy,
  Check,
  Plus,
  Sparkles,
  Film,
  Image,
  FileText,
  Hash,
  Layout,
  Award,
  Globe,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

interface ContentLibraryWorkspaceProps {
  libraryData?: ContentLibraryData;
  onAddAsset: (asset: Omit<LibraryAsset, 'id' | 'createdAt'>) => Promise<void>;
  onRefreshLibrary: () => Promise<void>;
  loading: boolean;
}

const DEFAULT_LIBRARY_SEED: ContentLibraryData = {
  totalAssets: 14,
  assets: [
    {
      id: 'ast_1',
      title: 'Christmas & Holiday Season Mega Campaign Pack',
      category: 'Campaigns',
      tags: ['Christmas campaign', 'Holiday2026', 'Q4 Promo', 'Gifting'],
      content: 'Complete multi-channel holiday engagement framework featuring 12 short video scripts, 5 carousel designs, and 20 viral gift-guide hashtags.',
      associatedCampaign: 'Holiday Growth Sprint',
      createdAt: '2 weeks ago',
      performanceScore: 98.4
    },
    {
      id: 'ast_2',
      title: '3 Morning Habits of High Performers (Reel Asset)',
      category: 'Videos',
      tags: ['Leadership', 'Productivity', 'MorningRoutine', 'Reel'],
      content: '4K Vertical video asset with synchronized captions and voiceover. Optimized for 9:16 aspect ratio on Instagram & TikTok.',
      previewUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
      createdAt: '3 days ago',
      performanceScore: 94.2
    },
    {
      id: 'ast_3',
      title: 'Enterprise Growth Mindset Caption Template',
      category: 'Captions',
      tags: ['Leadership', 'B2B', 'Growth', 'Mindset'],
      content: 'True leadership isn’t about managing tasks — it’s about inspiring momentum. Here are 3 non-negotiable principles top founders practice daily: 1) Radical clarity, 2) Fast feedback loops, 3) Relentless focus.',
      createdAt: '1 week ago',
      performanceScore: 91.8
    },
    {
      id: 'ast_4',
      title: 'High-Engagement Hashtag Vault: AI & Tech Founders',
      category: 'Hashtags',
      tags: ['AITools', 'TechFounder', 'BuildInPublic', 'SaaSGrowth'],
      content: '#AITools #TechFounder #BuildInPublic #SaaSGrowth #ArtificialIntelligence #ProductivityHacks #FutureOfWork #StartupStrategy #AuraCast',
      createdAt: '5 days ago',
      performanceScore: 89.5
    },
    {
      id: 'ast_5',
      title: 'Official Brand Logo & Dark/Light Asset Kit',
      category: 'Brand Assets',
      tags: ['Branding', 'Logos', 'BrandKit', 'Vector'],
      content: 'Vector SVG & PNG logo marks, typography pairings (Playfair Display & Plus Jakarta Sans), and brand color palette (#06B6D4, #3B82F6, #0F172A).',
      previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      createdAt: '1 month ago'
    },
    {
      id: 'ast_6',
      title: 'Published Case Study: How Company X Saved 10 Hours/Week',
      category: 'Published Content',
      tags: ['CaseStudy', 'Published', 'Leadership', 'B2BSaaS'],
      content: 'Published on LinkedIn and Twitter. Generated 14,200 impressions and 42 enterprise leads within 48 hours.',
      createdAt: '4 days ago',
      performanceScore: 96.1
    }
  ]
};

const CATEGORIES: AssetCategory[] = [
  'Campaigns',
  'Posts',
  'Images',
  'Videos',
  'Captions',
  'Hashtags',
  'Templates',
  'Brand Assets',
  'Published Content'
];

export default function ContentLibraryWorkspace({
  libraryData = DEFAULT_LIBRARY_SEED,
  onAddAsset,
  onRefreshLibrary,
  loading
}: ContentLibraryWorkspaceProps) {
  const data = libraryData || DEFAULT_LIBRARY_SEED;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Asset Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<AssetCategory>('Captions');
  const [newTags, setNewTags] = useState('Marketing, Growth');
  const [newContent, setNewContent] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const parsedTags = newTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      await onAddAsset({
        title: newTitle,
        category: newCategory,
        tags: parsedTags,
        content: newContent
      });

      setNewTitle('');
      setNewContent('');
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering
  const filteredAssets = data.assets.filter((ast) => {
    const matchesCategory = selectedCategory === 'All' || ast.category === selectedCategory;
    const queryLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      ast.title.toLowerCase().includes(queryLower) ||
      ast.content.toLowerCase().includes(queryLower) ||
      ast.tags.some((t) => t.toLowerCase().includes(queryLower));

    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (cat: AssetCategory) => {
    switch (cat) {
      case 'Videos':
        return <Film className="w-3.5 h-3.5 text-rose-400" />;
      case 'Images':
        return <Image className="w-3.5 h-3.5 text-pink-400" />;
      case 'Captions':
        return <FileText className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Hashtags':
        return <Hash className="w-3.5 h-3.5 text-amber-400" />;
      case 'Templates':
        return <Layout className="w-3.5 h-3.5 text-purple-400" />;
      case 'Brand Assets':
        return <Award className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Published Content':
        return <Globe className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <FolderArchive className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6 ring-1 ring-white/5 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-white/10">
            <FolderArchive className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-semibold text-white tracking-tight">
                Campaign & Content Repository Vault
              </h2>
              <span className="text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded tracking-widest uppercase">
                {data.assets.length} Saved Assets
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Search campaigns, captions, video templates, hashtags, and published assets across your workspace.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-white/10 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Asset to Vault</span>
          </button>
        </div>
      </div>

      {/* SEARCH BAR & CATEGORY FILTERS */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search assets by keywords like "Christmas campaign", "Leadership", "#Hashtag", or "Video"...'
            className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-sans focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-white text-xs font-mono"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {getCategoryIcon(cat)}
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ASSETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-400 text-xs font-sans space-y-2">
            <FolderOpen className="w-8 h-8 text-slate-600 mx-auto" />
            <p>No repository assets match "{searchQuery}". Try a different keyword or filter.</p>
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 shadow-lg flex flex-col justify-between group transition-all"
            >
              <div className="space-y-2.5">
                {asset.previewUrl && (
                  <div className="h-32 rounded-xl overflow-hidden border border-slate-800 relative bg-slate-900">
                    <img
                      src={asset.previewUrl}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                    {getCategoryIcon(asset.category)}
                    {asset.category}
                  </span>

                  {asset.performanceScore && (
                    <span className="text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                      ★ {asset.performanceScore}% Score
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-white font-sans leading-snug">
                  {asset.title}
                </h3>

                <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  "{asset.content}"
                </p>

                {/* TAGS */}
                <div className="flex flex-wrap items-center gap-1">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">{asset.createdAt}</span>

                <button
                  onClick={() => handleCopy(asset.id, asset.content)}
                  className="bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-cyan-400" />
                      <span>Copy Content</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD ASSET MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono uppercase">Add New Asset to Vault</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveAsset} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Asset Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Christmas Promo Caption Template"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as AssetCategory)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-xl focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. Christmas, Leadership, Reel"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Asset Body / Content</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Paste caption copy, hashtag set, template text, or script..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !newTitle.trim() || !newContent.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-95 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Save to Repository
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
