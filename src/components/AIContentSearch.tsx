import React, { useState } from 'react';
import { AISearchResult } from '../types';
import {
  Search,
  Sparkles,
  Bot,
  ArrowRight,
  BarChart3,
  FileText,
  Layers,
  CheckCircle2,
  HelpCircle,
  FolderArchive
} from 'lucide-react';

interface AIContentSearchProps {
  onExecuteSearch: (query: string) => Promise<AISearchResult>;
  loading: boolean;
}

const PRESET_QUERIES = [
  'Show me all posts about leadership',
  'Which campaign performed best?',
  'Show all Christmas campaign content',
  'List top 3 performing videos with high engagement'
];

export default function AIContentSearch({ onExecuteSearch, loading }: AIContentSearchProps) {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<AISearchResult | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearchSubmit = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const result = await onExecuteSearch(searchQuery);
      setSearchResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl p-5 ring-1 ring-cyan-500/10 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold">
          <Sparkles className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white font-display">Aura Copilot Natural Language Workspace Search</h3>
            <span className="text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">
              AI Query Engine
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Ask anything across campaigns, posts, video scripts, analytics, and performance intelligence.
          </p>
        </div>
      </div>

      {/* INPUT SEARCH BAR */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit(query);
        }}
        className="relative"
      >
        <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Ask Aura Copilot (e.g. "Show me all posts about leadership" or "Which campaign performed best?")...'
          className="w-full bg-slate-950/90 border border-cyan-500/40 focus:border-cyan-400 rounded-xl pl-10 pr-28 py-3 text-xs text-white placeholder-slate-400 font-sans focus:outline-none transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={searching || !query.trim()}
          className="absolute right-2 top-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
        >
          {searching ? (
            <Sparkles className="w-3.5 h-3.5 animate-spin text-white" />
          ) : (
            <>
              <span>Ask AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* PRESET CHIPS */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
        <span className="text-slate-400">Try Asking:</span>
        {PRESET_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => {
              setQuery(q);
              handleSearchSubmit(q);
            }}
            className="bg-slate-950 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* SEARCH RESULTS OUTPUT CONTAINER */}
      {searchResult && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              Aura Copilot Workspace Intelligence Response
            </span>
            <span className="text-[10px] font-mono text-slate-400">Query: "{searchResult.query}"</span>
          </div>

          <div className="text-xs font-sans text-slate-200 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            {searchResult.aiSummaryAnswer}
          </div>

          {searchResult.matchedPosts && searchResult.matchedPosts.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Matched Posts & Assets:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {searchResult.matchedPosts.map((p: any, idx: number) => (
                  <div key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                    <strong className="text-white block font-sans">{p.topic || p.title || 'Workspace Item'}</strong>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">"{p.content || p.postContent || p.summary}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
