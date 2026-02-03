import { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  Brain,
  X,
  Folder,
  Layers,
  Moon,
  Plus,
  RefreshCw,
  Settings,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { browser, storage } from '#imports';

type Role = 'system' | 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
};

type ContextType = 'tab' | 'file' | 'bookmark' | 'history' | 'memory';

type ContextItem = {
  id: string;
  type: ContextType;
  title: string;
  content: string;
  createdAt: number;
  pinned?: boolean;
};

type ChatSession = {
  id: string;
  title: string;
  systemPromptId: string;
  messages: ChatMessage[];
  contexts: ContextItem[];
  createdAt: number;
};

type MemoryItem = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
};

type StoredState = {
  sessions: ChatSession[];
  activeSessionId: string | null;
  memories: MemoryItem[];
  templates?: PromptTemplate[];
  defaultPromptId?: string;
  theme?: ThemeMode;
};

type TabOption = {
  id: number;
  title: string;
  url: string;
};

type BookmarkOption = {
  id: string;
  title: string;
  url: string;
};

type HistoryOption = {
  id: string;
  title: string;
  url: string;
  lastVisitTime?: number;
};

const STORAGE_KEY = 'surfingbro_sidepanel_state_v1';

const chromeApi = (globalThis.chrome ?? (browser as unknown as typeof chrome));

type ThemeMode = 'light' | 'dark' | 'system';

type PromptTemplate = {
  id: string;
  name: string;
  content: string;
  createdAt: number;
};

const DEFAULT_PROMPT_ID = 'default-browsing-v1';

const defaultSession = (promptId: string): ChatSession => ({
  id: crypto.randomUUID(),
  title: 'New Session',
  systemPromptId: promptId,
  messages: [],
  contexts: [],
  createdAt: Date.now(),
});

const defaultTemplate = (): PromptTemplate => ({
  id: DEFAULT_PROMPT_ID,
  name: 'Browsing Agent (Strict)',
  content:
    'You are a strict, reliable browsing agent. Follow the user’s goal precisely and use browser tools when helpful. ' +
    'Never guess the page state; verify before acting. Ask for clarification when a step is ambiguous. ' +
    'Do not attempt logins, CAPTCHA, or human verification. Instead, request the user to take over and confirm when done. ' +
    'Avoid actions that could leak personal data. If a page is sensitive (banking, medical, accounts), pause and ask for confirmation. ' +
    'Do not accept cookie banners unless required to proceed. Prefer “Reject” or “Essential only.” ' +
    'If you get stuck (blocked, missing permissions, broken UI), explain what happened and propose the next action. ' +
    'Keep the user updated with short, factual status messages while browsing.',
  createdAt: Date.now(),
});

const modelOptions = [
  {
    id: 'auto',
    label: 'Automatic',
    description: 'Model changes dynamically to use the best one for the task.',
  },
  {
    id: 'advanced',
    label: 'Advanced Model',
    description: 'Search, Vision, Tools. Premium recommended for complex tasks.',
  },
  {
    id: 'fast',
    label: 'Fast Model',
    description: 'Fast responses with Search enabled.',
  },
];

const modelLabel = (id: string) => modelOptions.find(o => o.id === id)?.label ?? 'Automatic';


const nextTheme = (current: ThemeMode): ThemeMode => {
  if (current === 'system') return 'light';
  if (current === 'light') return 'dark';
  return 'system';
};

const themeLabel = (current: ThemeMode) => {
  if (current === 'system') return 'Theme: System';
  if (current === 'light') return 'Theme: Light';
  return 'Theme: Dark';
};

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [expandedContexts, setExpandedContexts] = useState<Set<string>>(new Set());
  const [activeModel, setActiveModel] = useState('auto');
  const [sessionQuery, setSessionQuery] = useState('');
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [memoryTitle, setMemoryTitle] = useState('');
  const [memoryContent, setMemoryContent] = useState('');
  const [tabs, setTabs] = useState<TabOption[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkOption[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryOption[]>([]);
  const [selectedTabId, setSelectedTabId] = useState<number | null>(null);
  const [showContextPanel, setShowContextPanel] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [defaultPromptId, setDefaultPromptId] = useState(DEFAULT_PROMPT_ID);
  const [showAddTabModal, setShowAddTabModal] = useState(false);
  const [activeTabPreview, setActiveTabPreview] = useState<TabOption | null>(null);
  const [activeTabError, setActiveTabError] = useState<string | null>(null);

  const activeSession = useMemo(
    () => sessions.find(s => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId],
  );

  const contextBadges = useMemo(() => {
    if (!activeSession) return [];
    return activeSession.contexts
      .filter((ctx) => ctx.type === 'tab' || ctx.type === 'file')
      .map((ctx) => ({
        id: ctx.id,
        type: ctx.type,
        title: ctx.title || (ctx.type === 'tab' ? 'Tab' : 'File'),
      }));
  }, [activeSession]);

  const dockIconColor = theme === 'dark' ? '#f1f5f9' : '#0f172a';


  const loadState = async () => {
    const stored = await storage.getItem<StoredState>(`local:${STORAGE_KEY}`);
    const storedTemplates = stored?.templates?.length ? stored.templates : [defaultTemplate()];
    const resolvedDefaultPromptId =
      stored?.defaultPromptId && storedTemplates.some(t => t.id === stored.defaultPromptId)
        ? stored.defaultPromptId
        : storedTemplates[0]?.id ?? DEFAULT_PROMPT_ID;
    const migratedSessions = (stored?.sessions?.length ? stored.sessions : [defaultSession(resolvedDefaultPromptId)]).map((s) => ({
      ...s,
      systemPromptId: s.systemPromptId || resolvedDefaultPromptId,
      createdAt: s.createdAt || Date.now(),
    }));
    if (migratedSessions.length) {
      setSessions(migratedSessions);
      setActiveSessionId(stored?.activeSessionId ?? migratedSessions[0].id);
      setMemories(stored?.memories ?? []);
      setTheme(stored?.theme ?? 'system');
      setTemplates(storedTemplates);
      setDefaultPromptId(resolvedDefaultPromptId);
      return;
    }
    const firstSession = defaultSession(resolvedDefaultPromptId);
    setSessions([firstSession]);
    setActiveSessionId(firstSession.id);
    setMemories([]);
    setTheme('system');
    setTemplates([defaultTemplate()]);
    setDefaultPromptId(resolvedDefaultPromptId);
  };

  const saveState = async (state: StoredState) => {
    await storage.setItem(`local:${STORAGE_KEY}`, state);
  };

  useEffect(() => {
    void loadState();
    void refreshSources();
  }, []);

  useEffect(() => {
    void saveState({ sessions, activeSessionId, memories, theme, templates, defaultPromptId });
  }, [sessions, activeSessionId, memories, theme, templates, defaultPromptId]);

  useEffect(() => {
    const unwatch = storage.watch<StoredState>(`local:${STORAGE_KEY}`, (next) => {
      if (!next) return;
      if (next.theme && next.theme !== theme) {
        setTheme(next.theme);
      }
    });
    return () => unwatch();
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applySystem = () => {
      root.setAttribute('data-theme', media.matches ? 'dark' : 'light');
    };
    if (theme === 'system') {
      applySystem();
      media.addEventListener('change', applySystem);
      return () => media.removeEventListener('change', applySystem);
    }
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const addSession = () => {
    const session = defaultSession(defaultPromptId);
    setSessions(prev => [session, ...prev]);
    setActiveSessionId(session.id);
  };

  const updateSession = (id: string, patch: Partial<ChatSession>) => {
    setSessions(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
  };

  const sendMessage = async () => {
    if (!activeSession || !input.trim()) return;
    setError(null);
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      createdAt: Date.now(),
    };
    const nextMessages = [...activeSession.messages, userMessage];
    updateSession(activeSession.id, { messages: nextMessages });
    setInput('');
  };

  const openMcpConsole = () => {
    const url = chromeApi.runtime.getURL('mcp.html');
    chromeApi.tabs.create({ url }).catch(() => {});
  };

  const addContext = (ctx: ContextItem) => {
    if (!activeSession) return;
    updateSession(activeSession.id, { contexts: [ctx, ...activeSession.contexts] });
  };

  const openActiveTabModal = async () => {
    setActiveTabError(null);
    const tab = await getActiveTab();
    if (!tab) {
      setActiveTabPreview(null);
      setActiveTabError('No active tab found. Open a tab and try again.');
      setShowAddTabModal(true);
      return;
    }
    setActiveTabPreview(tab);
    setShowAddTabModal(true);
  };

  const confirmAddActiveTab = () => {
    if (!activeSession || !activeTabPreview) {
      setShowAddTabModal(false);
      return;
    }
    addContext({
      id: crypto.randomUUID(),
      type: 'tab',
      title: activeTabPreview.title || 'Active Tab',
      content: activeTabPreview.url,
      createdAt: Date.now(),
    });
    setShowAddTabModal(false);
  };

  const addSelectedTabContext = async () => {
    if (!activeSession || selectedTabId == null) return;
    const tab = tabs.find(t => t.id === selectedTabId);
    if (!tab) return;
    addContext({
      id: crypto.randomUUID(),
      type: 'tab',
      title: tab.title || 'Tab',
      content: tab.url,
      createdAt: Date.now(),
    });
  };

  const addFileContext = async (file: File | null) => {
    if (!file || !activeSession) return;
    const text = await file.text();
    addContext({
      id: crypto.randomUUID(),
      type: 'file',
      title: file.name,
      content: text.slice(0, 2000),
      createdAt: Date.now(),
    });
  };

  const addMemoryContext = (memory: MemoryItem) => {
    addContext({
      id: crypto.randomUUID(),
      type: 'memory',
      title: memory.title,
      content: memory.content,
      createdAt: Date.now(),
    });
  };

  const addBookmarkContext = (bookmark: BookmarkOption) => {
    addContext({
      id: crypto.randomUUID(),
      type: 'bookmark',
      title: bookmark.title || 'Bookmark',
      content: bookmark.url,
      createdAt: Date.now(),
    });
  };

  const addHistoryContext = (item: HistoryOption) => {
    addContext({
      id: crypto.randomUUID(),
      type: 'history',
      title: item.title || 'History',
      content: item.url,
      createdAt: Date.now(),
    });
  };

  const toggleContext = (id: string) => {
    setExpandedContexts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const removeContext = (id: string) => {
    if (!activeSession) return;
    const next = activeSession.contexts.filter(ctx => ctx.id !== id);
    updateSession(activeSession.id, { contexts: next });
    setExpandedContexts((prev) => {
      const nextSet = new Set(prev);
      nextSet.delete(id);
      return nextSet;
    });
  };

  const togglePinContext = (id: string) => {
    if (!activeSession) return;
    const next = activeSession.contexts.map(ctx =>
      ctx.id === id ? { ...ctx, pinned: !ctx.pinned } : ctx,
    );
    updateSession(activeSession.id, { contexts: next });
  };

  const deleteSession = (id: string) => {
    const next = sessions.filter(s => s.id !== id);
    setSessions(next);
    if (activeSessionId === id) {
      setActiveSessionId(next[0]?.id ?? null);
    }
  };

  const requestDeleteSession = (id: string) => {
    setDeleteSessionId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteSession = () => {
    if (deleteSessionId) {
      deleteSession(deleteSessionId);
    }
    setDeleteSessionId(null);
    setShowDeleteModal(false);
  };

  const addMemory = () => {
    if (!memoryTitle.trim() || !memoryContent.trim()) return;
    const item: MemoryItem = {
      id: crypto.randomUUID(),
      title: memoryTitle.trim(),
      content: memoryContent.trim(),
      createdAt: Date.now(),
    };
    setMemories(prev => [item, ...prev]);
    setMemoryTitle('');
    setMemoryContent('');
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const clearAllSessions = () => {
    const next = defaultSession();
    setSessions([next]);
    setActiveSessionId(next.id);
  };

  const lastActiveAt = (session: ChatSession) =>
    session.messages[session.messages.length - 1]?.createdAt ?? session.createdAt;

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60_000) return 'Just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    if (diff < 2_592_000_000) return `${Math.floor(diff / 86_400_000)}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const isRecentSession = (timestamp: number) => Date.now() - timestamp < 24 * 60 * 60 * 1000;

  const keepLastSessions = (limit: number) => {
    setSessions(prev => {
      const sorted = [...prev].sort((a, b) => lastActiveAt(b) - lastActiveAt(a));
      const kept = sorted.slice(0, limit);
      if (!kept.find(s => s.id === activeSessionId)) {
        setActiveSessionId(kept[0]?.id ?? null);
      }
      return kept;
    });
  };

  const refreshSources = async () => {
    try {
      const tabList = await chromeApi.tabs.query({});
      const filtered = tabList
        .filter(t => t.id != null)
        .map(t => ({
          id: t.id as number,
          title: t.title || 'Untitled',
          url: t.url || '',
        }));
      setTabs(filtered);
      if (filtered.length && selectedTabId == null) {
        setSelectedTabId(filtered[0].id);
      }
    } catch {
      setTabs([]);
    }

    try {
      if (chromeApi.bookmarks?.getRecent) {
        const recent = await chromeApi.bookmarks.getRecent(6);
        const list = recent
          .filter(b => b.url)
          .map(b => ({ id: b.id, title: b.title || 'Bookmark', url: b.url || '' }));
        setBookmarks(list);
      }
    } catch {
      setBookmarks([]);
    }

    try {
      if (chromeApi.history?.search) {
        const startTime = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const recent = await chromeApi.history.search({ text: '', startTime, maxResults: 6 });
        const list = recent
          .filter(h => h.url)
          .map(h => ({ id: String(h.id ?? h.url), title: h.title || 'History', url: h.url || '', lastVisitTime: h.lastVisitTime }));
        setHistoryItems(list);
      }
    } catch {
      setHistoryItems([]);
    }
  };

  const getActiveTab = async () => {
    const tabs = await chromeApi.tabs.query({ active: true, lastFocusedWindow: true });
    const tab = tabs.find(t => t.id != null && t.url);
    if (!tab?.id) return null;
    return { id: tab.id, title: tab.title || 'Active Tab', url: tab.url || '' };
  };

  const sortedContexts = activeSession
    ? [...activeSession.contexts].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned))
    : [];

  return (
    <div className="panel px-3 py-3">
      <div className="surface p-3 flex items-center justify-between gap-3">
        <div>
          <div className="title">SurfingBro</div>
        </div>
        <div className="row">
          <button className="icon-button" onClick={() => setShowSessionsModal(true)} aria-label="Sessions" title="Sessions">
            <Layers size={16} />
          </button>
          <button className="icon-button" onClick={() => setShowMemoryModal(true)} aria-label="Memories" title="Memories">
            <Brain size={16} />
          </button>
          <button className="icon-button" onClick={openMcpConsole} aria-label="Settings" title="Settings">
            <Settings size={16} />
          </button>
        </div>
      </div>

      <div className="surface p-4 grid gap-3 h-full grid-rows-[auto_1fr_auto_auto]">
        <div className="chat-header">
          <div className="section-title">Chat</div>
        </div>
        <div className="chat">
          {activeSession?.messages.map(m => (
            <div key={m.id} className={`bubble ${m.role} bubble-animate`}>
              <div className="muted">{m.role}</div>
              {m.content}
            </div>
          ))}
          {!activeSession?.messages.length && (
            <div className="chat-empty">Start chatting to plan a browsing task.</div>
          )}
        </div>

        <div className={`surface p-3 ${showContextPanel ? 'grid gap-2 animate-[context-reveal_220ms_ease-out]' : 'hidden'}`}>
          <div className="grid gap-2">
            {sortedContexts.length === 0 && <span className="muted">No context attached.</span>}
            {sortedContexts.map((ctx) => (
              <div key={ctx.id} className="surface-soft px-3 py-2 flex flex-wrap gap-2 items-center">
                <span className="rounded-full px-2 py-0.5 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">{ctx.type}</span>
                <span className="chip-title">{ctx.title}</span>
                {ctx.pinned && <span className="rounded-full px-2 py-0.5 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">Pinned</span>}
                <button className="rounded-full px-2 py-1 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white" onClick={() => togglePinContext(ctx.id)}>
                  {ctx.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button className="rounded-full px-2 py-1 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white" onClick={() => removeContext(ctx.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          {sortedContexts.map((ctx) => {
            const expanded = expandedContexts.has(ctx.id);
            if (!expanded) return null;
            const preview = ctx.content.length > 240 ? `${ctx.content.slice(0, 240)}...` : ctx.content;
            return (
              <div key={`${ctx.id}-preview`} className="surface-soft p-3 grid gap-2">
                <div className="context-head">
                  <span>{ctx.title}</span>
                  <div className="row">
                    {ctx.pinned && <span className="rounded-full px-2 py-0.5 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">Pinned</span>}
                    <span className="rounded-full px-2 py-0.5 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">{ctx.type}</span>
                  </div>
                </div>
                <div className="context-content">{preview}</div>
                {ctx.content.length > 240 && (
                  <div className="context-actions">
                    <button className="secondary" onClick={() => toggleContext(ctx.id)}>
                      Show more
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="surface-soft rounded-full px-3 py-2 text-sm" aria-label="Select tab" title="Select tab">
                  <span className="truncate max-w-[180px]">
                    {tabs.find(t => t.id === selectedTabId)?.title ?? 'Select a tab'}
                  </span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="surface p-2 grid gap-1 max-h-64 overflow-auto" align="start" sideOffset={8}>
                  {tabs.length === 0 && (
                    <div className="muted px-3 py-2">No tabs found.</div>
                  )}
                  {tabs.map(tab => (
                    <DropdownMenu.Item
                      key={tab.id}
                      className={`rounded-lg px-3 py-2 text-left text-sm grid gap-1 ${selectedTabId === tab.id ? 'bg-black/5 dark:bg-white/10' : ''}`}
                      onSelect={() => setSelectedTabId(tab.id)}
                    >
                      <div className="font-semibold text-sm truncate" title={tab.title}>{tab.title}</div>
                      <div className="muted" title={tab.url}>{tab.url}</div>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <button className="secondary" onClick={addSelectedTabContext}>Add selected tab</button>
          </div>

          <div className="grid gap-2">
            <div className="grid gap-2">
              <div className="text-sm font-semibold">Tabs</div>
              {tabs.length === 0 && <div className="muted">No tabs available.</div>}
              {tabs.map(tab => (
                <div key={tab.id} className="surface-soft px-2 py-1 flex items-center justify-between gap-2">
                  <span className="truncate min-w-0" title={tab.title}>{tab.title}</span>
                  <button className="rounded-full px-2 py-1 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white" onClick={() => addContext({
                    id: crypto.randomUUID(),
                    type: 'tab',
                    title: tab.title,
                    content: tab.url,
                    createdAt: Date.now(),
                  })}>Add</button>
                </div>
              ))}
            </div>
            <div className="grid gap-2">
              <div className="text-sm font-semibold">Bookmarks</div>
              {bookmarks.length === 0 && <div className="muted">No bookmarks available.</div>}
              {bookmarks.map(b => (
                <div key={b.id} className="surface-soft px-2 py-1 flex items-center justify-between gap-2">
                  <span className="truncate min-w-0" title={b.title}>{b.title}</span>
                  <button className="rounded-full px-2 py-1 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white" onClick={() => addBookmarkContext(b)}>Add</button>
                </div>
              ))}
            </div>
            <div className="grid gap-2">
              <div className="text-sm font-semibold">History</div>
              {historyItems.length === 0 && <div className="muted">No history items.</div>}
              {historyItems.map(h => (
                <div key={h.id} className="surface-soft px-2 py-1 flex items-center justify-between gap-2">
                  <span className="truncate min-w-0" title={h.title}>{h.title}</span>
                  <button className="rounded-full px-2 py-1 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white" onClick={() => addHistoryContext(h)}>Add</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-2 rounded-2xl px-3 py-2 text-ink-900 shadow-dock border border-black/10 dark:text-white dark:border-white/5 bg-[rgba(255,255,255,0.95)] dark:bg-[rgba(28,30,36,0.9)] backdrop-blur">
          <div className="flex flex-nowrap items-center gap-2 w-full overflow-x-auto">
            <button
              className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-ink-900 dark:text-white bg-[rgba(15,17,21,0.08)] dark:bg-[rgba(255,255,255,0.12)]"
              onClick={() => setShowContextPanel(v => !v)}
              aria-label="Toggle context"
              title="Toggle context"
            >
              <Plus size={16} color={dockIconColor} />
            </button>
            <button
              className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-ink-900 dark:text-white bg-[rgba(15,17,21,0.08)] dark:bg-[rgba(255,255,255,0.12)]"
              onClick={openActiveTabModal}
              aria-label="Add active tab"
              title="Add active tab"
            >
              <Layers size={16} color={dockIconColor} />
            </button>
            <label
              className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-ink-900 dark:text-white bg-[rgba(15,17,21,0.08)] dark:bg-[rgba(255,255,255,0.12)]"
              aria-label="Add file"
              title="Add file"
            >
              <input
                type="file"
                className="hidden"
                onChange={(e) => void addFileContext(e.target.files?.[0] ?? null)}
              />
              <Folder size={16} color={dockIconColor} />
            </label>
            <button
              className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-ink-900 dark:text-white bg-[rgba(15,17,21,0.08)] dark:bg-[rgba(255,255,255,0.12)]"
              onClick={refreshSources}
              aria-label="Refresh sources"
              title="Refresh sources"
            >
              <RefreshCw size={16} color={dockIconColor} />
            </button>
          </div>
          <div className="flex flex-nowrap items-center gap-2 w-full overflow-x-auto">
            <div className="flex items-center gap-2 min-w-0">
              {contextBadges.length === 0 && (
                <span className="rounded-full px-2 py-0.5 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">
                  No context
                </span>
              )}
              {contextBadges.map((ctx) => (
                <span
                  key={ctx.id}
                  className="inline-flex items-center gap-1 text-[10px] text-ui-text dark:text-ui-textDark max-w-[180px] rounded-full px-1.5 py-0.5 bg-black/5 dark:bg-white/10"
                  title={`${ctx.type.toUpperCase()}: ${ctx.title}`}
                >
                  <span className="truncate min-w-0">
                    {ctx.type === 'tab' ? 'Tab' : 'File'}: {ctx.title}
                  </span>
                  <button
                    className="inline-flex items-center justify-center rounded-full px-0.5 text-ui-muted dark:text-ui-mutedDark hover:text-ui-text dark:hover:text-ui-textDark bg-black/5 dark:bg-white/10"
                    onClick={() => removeContext(ctx.id)}
                    aria-label={`Remove ${ctx.title}`}
                    title="Remove"
                  >
                    <X size={9} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex-1" />
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 px-2 py-0.5 text-xs text-ink-900 dark:text-white dark:border-white/10 relative bg-[rgba(15,17,21,0.08)] dark:bg-[rgba(255,255,255,0.12)]"
                  aria-label="Model"
                  title="Model"
                >
                  <span
                    className="inline-flex items-center justify-center rounded-full text-ink-900 dark:text-white w-6 h-6 bg-[rgba(15,17,21,0.08)] dark:bg-[rgba(255,255,255,0.12)]"
                    aria-hidden="true"
                  >
                    <Sparkles size={14} color={dockIconColor} />
                  </span>
                  <span className="text-xs text-ink-900 dark:text-white pr-5">{modelLabel(activeModel)}</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="surface p-2 grid gap-1 min-w-[220px]" align="end" sideOffset={8}>
                  {modelOptions.map(option => (
                    <DropdownMenu.Item
                      key={option.id}
                      className={`rounded-lg px-3 py-2 text-left text-sm grid gap-1 ${activeModel === option.id ? 'bg-black/5 dark:bg-white/10' : ''}`}
                      onSelect={() => setActiveModel(option.id)}
                    >
                      <div className="font-semibold text-sm truncate">{option.label}</div>
                      <div className="muted">{option.description}</div>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        <div className="flex flex-nowrap items-center gap-2 w-full overflow-x-auto">
          <textarea
            className="flex-1 min-w-0 bg-transparent text-sm text-ink-900 dark:text-white placeholder:text-ink-700/50 dark:placeholder:text-white/50 border-0 focus:outline-none resize-none overflow-hidden"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = '0px';
              const next = Math.min(el.scrollHeight, 120);
              el.style.height = `${next}px`;
              el.style.overflowY = el.scrollHeight > 120 ? 'auto' : 'hidden';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) {
                  sendMessage();
                }
              }
            }}
            placeholder="Plan a task, ask a question, or paste a URL..."
          />
            <button
              className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold text-ink-900 dark:text-white bg-[rgba(15,17,21,0.14)] dark:bg-[rgba(255,255,255,0.2)]"
              onClick={sendMessage}
              disabled={!input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <Dialog.Root open={showAddTabModal} onOpenChange={setShowAddTabModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content surface p-4">
            <Dialog.Title className="section-title">Add active tab</Dialog.Title>
            {activeTabError && <div className="muted">{activeTabError}</div>}
            {activeTabPreview && (
              <div className="surface-soft p-3 grid gap-1">
                <div className="font-semibold truncate" title={activeTabPreview.title}>{activeTabPreview.title}</div>
                <div className="muted truncate" title={activeTabPreview.url}>{activeTabPreview.url}</div>
              </div>
            )}
            <div className="row justify-end">
              <Dialog.Close asChild>
                <button className="secondary">Cancel</button>
              </Dialog.Close>
              <button className="secondary" onClick={confirmAddActiveTab} disabled={!activeTabPreview}>
                Add to context
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={showSessionsModal} onOpenChange={setShowSessionsModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content surface p-4">
            <Dialog.Title className="section-title">Sessions</Dialog.Title>
            <div className="grid gap-2">
              <input
                value={sessionQuery}
                onChange={(e) => setSessionQuery(e.target.value)}
                placeholder="Search sessions"
              />
              <div className="row">
                <button className="secondary" onClick={addSession}>New session</button>
                <button className="secondary" onClick={() => keepLastSessions(10)}>Keep last 10</button>
                <button className="secondary" onClick={() => keepLastSessions(30)}>Keep last 30</button>
                <button className="secondary" onClick={clearAllSessions}>Clear all</button>
              </div>
            </div>
            <div className="grid gap-2 max-h-[240px] overflow-auto pr-1">
              {sessions.length === 0 && <div className="muted">No sessions yet.</div>}
              {[...sessions]
                .sort((a, b) => lastActiveAt(b) - lastActiveAt(a))
                .filter((s) => {
                  const q = sessionQuery.trim().toLowerCase();
                  if (!q) return true;
                  const last = s.messages[s.messages.length - 1]?.content ?? '';
                  return s.title.toLowerCase().includes(q) || last.toLowerCase().includes(q);
                })
                .map((s) => {
                  const last = s.messages[s.messages.length - 1];
                  const lastAt = lastActiveAt(s);
                  return (
                    <div
                      key={s.id}
                      className={`surface-soft p-2 grid gap-1 ${s.id === activeSessionId ? 'bg-white/95 dark:bg-mist-800/80' : 'bg-black/5 dark:bg-white/5'}`}
                      onClick={() => setActiveSessionId(s.id)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold truncate">{s.title}</div>
                        <div className="flex items-center gap-1">
                          {isRecentSession(lastAt) && <span className="rounded-full px-2 py-0.5 text-[10px] bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">Recent</span>}
                          {s.id === activeSessionId && <span className="rounded-full px-2 py-0.5 text-[10px] bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">Active</span>}
                        </div>
                      </div>
                      <div className="row justify-between mt-0.5">
                        <div className="muted text-[10px]">
                          {formatRelativeTime(lastAt)} · {new Date(lastAt).toLocaleString()}
                        </div>
                        <button
                          className="icon-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            requestDeleteSession(s.id);
                          }}
                          aria-label="Delete session"
                          title="Delete session"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="row justify-end">
              <Dialog.Close asChild>
                <button className="secondary">Close</button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={showMemoryModal} onOpenChange={setShowMemoryModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content surface p-4">
            <Dialog.Title className="section-title">Manage memories</Dialog.Title>
            <div className="grid gap-2">
              <input
                value={memoryTitle}
                onChange={(e) => setMemoryTitle(e.target.value)}
                placeholder="Memory title"
              />
              <textarea
                rows={3}
                value={memoryContent}
                onChange={(e) => setMemoryContent(e.target.value)}
                placeholder="Memory detail"
              />
              <button className="primary" onClick={addMemory}>Add memory</button>
            </div>
            <div className="grid gap-2">
              {memories.length === 0 && <div className="muted">No memories yet.</div>}
              {memories.map((m) => (
                <div key={m.id} className="surface-soft p-3 grid gap-2">
                  <div className="font-semibold">{m.title}</div>
                  <div className="muted">{m.content}</div>
                  <div className="row mt-1.5">
                    <button className="secondary" onClick={() => addMemoryContext(m)}>Add to context</button>
                    <button className="secondary" onClick={() => deleteMemory(m.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="row justify-end">
              <Dialog.Close asChild>
                <button className="secondary">Close</button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content surface p-4">
            <Dialog.Title className="section-title">Delete conversation?</Dialog.Title>
            <div className="muted">
              This will remove the selected conversation and its history. This action cannot be undone.
            </div>
            <div className="row justify-end">
              <Dialog.Close asChild>
                <button className="secondary">Cancel</button>
              </Dialog.Close>
              <button onClick={confirmDeleteSession}>Delete</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
