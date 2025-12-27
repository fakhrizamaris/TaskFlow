// web/components/dashboard/quick-actions.tsx
'use client';

import { useState, useEffect } from 'react';
import { Keyboard, Search, Clock, Star, ChevronRight, Sparkles, Command, Layout, FileText, Loader2 } from 'lucide-react';
import { searchDashboard } from '@/actions/search';
import Link from 'next/link';

type QuickActionsProps = {
  recentBoards?: Array<{
    id: string;
    title: string;
    updatedAt: Date;
  }>;
};

export const QuickActions = ({ recentBoards = [] }: QuickActionsProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    boards: { id: string; title: string; updatedAt: Date }[];
    cards: { id: string; title: string; list: { board: { id: string; title: string } } }[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const res = await searchDashboard(searchQuery);
      if (res && !('error' in res)) {
        // Fix date string issue from server action serialization
        const boards = res.boards.map((b) => ({
          ...b,
          updatedAt: new Date(b.updatedAt),
        }));
        setSearchResults({ ...res, boards });
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const shortcuts = [
    { key: 'N', label: 'Board baru', action: () => document.getElementById('create-board-btn')?.click() },
    { key: 'J', label: 'Gabung board', action: () => {} },
    { key: '/', label: 'Cari', action: () => setIsSearchOpen(true) },
  ];

  // Keyboard shortcuts
  if (typeof window !== 'undefined') {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'k') {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      }
    });
  }

  return (
    <>
      {/* Quick Actions Bar */}
      <div id="quick-actions" className="glass-card rounded-xl p-4 mb-6 border border-zinc-700/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Search Box */}
          <button onClick={() => setIsSearchOpen(true)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-all group flex-1 max-w-md">
            <Search className="h-4 w-4 text-zinc-500 group-hover:text-zinc-400" />
            <span className="text-sm text-zinc-500 group-hover:text-zinc-400">Cari board...</span>
            <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded bg-zinc-700/50 text-xs text-zinc-500">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </button>

          {/* Keyboard Shortcuts Hint */}
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-zinc-500" />
            <div className="flex items-center gap-1">
              {shortcuts.map((shortcut, index) => (
                <button
                  key={shortcut.key}
                  onClick={shortcut.action}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-all text-xs text-zinc-400 hover:text-zinc-300"
                >
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-300 font-mono">{shortcut.key}</kbd>
                  <span className="hidden sm:inline">{shortcut.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentBoards.length > 0 && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-zinc-500" />
              <span className="text-xs font-medium text-zinc-400">Baru Diakses</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {recentBoards.slice(0, 5).map((board) => (
                <a
                  key={board.id}
                  href={`/dashboard/board/${board.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/30 border border-zinc-700/50 hover:border-indigo-500/30 hover:bg-zinc-800/50 transition-all group shrink-0"
                >
                  <Star className="h-3 w-3 text-amber-500" />
                  <span className="text-sm text-zinc-300 group-hover:text-indigo-400 truncate max-w-[150px]">{board.title}</span>
                  <ChevronRight className="h-3 w-3 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4" onClick={(e) => e.target === e.currentTarget && setIsSearchOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900/95 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
              <Search className="h-5 w-5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari board, tugas, atau anggota..."
                className="flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-500 outline-none text-lg"
                autoFocus
              />
              <button onClick={() => setIsSearchOpen(false)} className="px-2 py-1 rounded bg-zinc-800 text-xs text-zinc-400 hover:text-zinc-300">
                ESC
              </button>
            </div>

            <div className="p-4 max-h-[50vh] overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-zinc-500">Mencari...</p>
                </div>
              ) : searchResults ? (
                <div className="space-y-6">
                  {/* Boards Results */}
                  {searchResults.boards.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wider px-2">Board</h4>
                      <div className="space-y-1">
                        {searchResults.boards.map((board) => (
                          <Link key={board.id} href={`/dashboard/board/${board.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-all group">
                            <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center">
                              <Layout className="h-4 w-4 text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-zinc-200 group-hover:text-white">{board.title}</p>
                              <p className="text-xs text-zinc-500">Terakhir aktif {new Date(board.updatedAt).toLocaleDateString()}</p>
                            </div>
                            <ChevronRight className="ml-auto h-4 w-4 text-zinc-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cards Results */}
                  {searchResults.cards.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wider px-2">Kartu Tugas</h4>
                      <div className="space-y-1">
                        {searchResults.cards.map((card) => (
                          <Link key={card.id} href={`/dashboard/board/${card.list.board.id}?card=${card.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-all group">
                            <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-emerald-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-zinc-200 group-hover:text-white">{card.title}</p>
                              <p className="text-xs text-zinc-500">di board {card.list.board.title}</p>
                            </div>
                            <ChevronRight className="ml-auto h-4 w-4 text-zinc-600 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.boards.length === 0 && searchResults.cards.length === 0 && (
                    <div className="text-center py-8">
                      <Search className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                      <p className="text-zinc-500">Tidak ditemukan hasil untuk "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              ) : (
                // Show Shortcuts when no search query
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-2 px-2">PINTASAN KEYBOARD</p>
                    <div className="space-y-1">
                      {[
                        { keys: ['Ctrl', 'N'], desc: 'Buat board baru' },
                        { keys: ['Ctrl', 'K'], desc: 'Buka pencarian' },
                        { keys: ['Ctrl', 'J'], desc: 'Gabung board' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between px-2 py-2 rounded hover:bg-zinc-800/50">
                          <span className="text-sm text-zinc-400">{item.desc}</span>
                          <div className="flex items-center gap-1">
                            {item.keys.map((key, j) => (
                              <kbd key={j} className="px-2 py-1 rounded bg-zinc-800 text-xs text-zinc-400 font-mono">
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
