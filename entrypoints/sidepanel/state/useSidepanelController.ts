import { useEffect, useMemo, useState } from 'react';
import { browser, storage } from '#imports';
import { createTRPCProxyClient } from '@trpc/client';
import { chromeLink } from 'trpc-browser/link';
import type { BackgroundRouter } from '../../shared/backgroundRouter';
import { useProviderRegistry } from '../../shared/llm/useProviderRegistry';
import type { ProviderConfig } from '../../shared/llm/types';
import { mcpTools, toolProtocolBlock } from '../../shared/llm/tools';
import { sendChat, sendChatStream, supportsStreaming, extractToolCallsFromText, type LlmMessage, type ToolCall } from '../../shared/llm/send';
import {
  BookmarkOption,
  ChatMessage,
  ChatSession,
  ContextItem,
  DEFAULT_PROMPT_ID,
  HistoryOption,
  MemoryItem,
  PromptTemplate,
  STORAGE_KEY,
  StoredState,
  TabOption,
  ThemeMode,
  defaultSession,
  defaultTemplate,
} from './types';
import { useThemeSync } from '../../shared/hooks/useThemeSync';

type ContextBadge = {
  id: string;
  type: 'tab' | 'file';
  title: string;
};

export type ModelOption = {
  id: string;
  label: string;
  providerId: string;
  modelId: string;
  supportsTools: boolean;
  supportsVision: boolean;
};

export type SidepanelController = {
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeSession: ChatSession | null;
  input: string;
  error: string | null;
  expandedContexts: Set<string>;
  activeModelId: string;
  activeProviderId: string;
  activeModelLabel: string;
  modelOptions: ModelOption[];
  sessionQuery: string;
  showMemoryModal: boolean;
  showSessionsModal: boolean;
  showDeleteModal: boolean;
  deleteSessionId: string | null;
  memories: MemoryItem[];
  memoryTitle: string;
  memoryContent: string;
  tabs: TabOption[];
  bookmarks: BookmarkOption[];
  historyItems: HistoryOption[];
  selectedTabId: number | null;
  showContextPanel: boolean;
  theme: ThemeMode;
  templates: PromptTemplate[];
  defaultPromptId: string;
  showAddTabModal: boolean;
  activeTabPreview: TabOption | null;
  activeTabError: string | null;
  contextBadges: ContextBadge[];
  sortedContexts: ContextItem[];
  dockIconColor: string;
  actions: {
    setInput: (value: string) => void;
    setSessionQuery: (value: string) => void;
    setShowMemoryModal: (value: boolean) => void;
    setShowSessionsModal: (value: boolean) => void;
    setShowDeleteModal: (value: boolean) => void;
    setDeleteSessionId: (value: string | null) => void;
    setMemoryTitle: (value: string) => void;
    setMemoryContent: (value: string) => void;
    setSelectedTabId: (value: number | null) => void;
    setShowContextPanel: (value: boolean) => void;
    setShowAddTabModal: (value: boolean) => void;
    setActiveModel: (providerId: string, modelId: string) => void;
    addSession: () => void;
    setActiveSessionId: (id: string | null) => void;
    updateSession: (id: string, patch: Partial<ChatSession>) => void;
    sendMessage: () => void;
    toggleContext: (id: string) => void;
    addContext: (ctx: ContextItem) => void;
    removeContext: (id: string) => void;
    togglePinContext: (id: string) => void;
    addSelectedTabContext: () => void;
    addFileContext: (file: File | null) => void;
    addBookmarkContext: (b: BookmarkOption) => void;
    addHistoryContext: (h: HistoryOption) => void;
    addMemory: () => void;
    deleteMemory: (id: string) => void;
    addMemoryContext: (m: MemoryItem) => void;
    clearAllSessions: () => void;
    keepLastSessions: (limit: number) => void;
    openMcpConsole: () => void;
    addActiveTabContext: () => void;
    confirmAddActiveTab: () => void;
    confirmDeleteSession: () => void;
    refreshSources: () => void;
    setTheme: (next: ThemeMode) => void;
    nextTheme: (current: ThemeMode) => ThemeMode;
    themeLabel: (current: ThemeMode) => string;
  };
};

const buildModelOptions = (providers: ProviderConfig[]): ModelOption[] => {
  const options: ModelOption[] = [];
  for (const provider of providers) {
    for (const model of provider.models) {
      options.push({
        id: `${provider.id}:${model.id}`,
        label: `${provider.name} · ${model.label}`,
        providerId: provider.id,
        modelId: model.id,
        supportsTools: model.supportsTools,
        supportsVision: model.supportsVision,
      });
    }
  }
  return options;
};

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

export function useSidepanelController(): SidepanelController {
  const bgClient = useMemo(() => {
    const port = browser.runtime.connect({ name: 'sidepanel-bg' });
    return createTRPCProxyClient<BackgroundRouter>({
      links: [chromeLink({ port })],
    });
  }, []);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [expandedContexts, setExpandedContexts] = useState<Set<string>>(new Set());
  const [activeModelId, setActiveModelId] = useState('');
  const [activeProviderId, setActiveProviderId] = useState('');
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

  const { registry, enabledProviders } = useProviderRegistry();
  const modelOptions = useMemo(() => buildModelOptions(enabledProviders), [enabledProviders]);

  const resolveDefaultModel = () => {
    const provider = registry.providers.find(p => p.id === registry.defaultProviderId)
      ?? enabledProviders[0]
      ?? registry.providers[0];
    const modelId = registry.defaultModelId
      ?? provider?.defaultModelId
      ?? provider?.models[0]?.id
      ?? '';
    return {
      providerId: provider?.id ?? '',
      modelId,
    };
  };

  useEffect(() => {
    if (activeSession?.modelProviderId && activeSession?.modelId) {
      setActiveProviderId(activeSession.modelProviderId);
      setActiveModelId(activeSession.modelId);
      return;
    }
    const resolved = resolveDefaultModel();
    setActiveProviderId(resolved.providerId);
    setActiveModelId(resolved.modelId);
  }, [
    activeSession?.id,
    activeSession?.modelProviderId,
    activeSession?.modelId,
    registry.defaultProviderId,
    registry.defaultModelId,
    enabledProviders.length,
  ]);

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
    const defaults = resolveDefaultModel();
    const migratedSessions = (stored?.sessions?.length ? stored.sessions : [defaultSession(resolvedDefaultPromptId)]).map((s) => ({
      ...s,
      systemPromptId: s.systemPromptId || resolvedDefaultPromptId,
      createdAt: s.createdAt || Date.now(),
      modelProviderId: s.modelProviderId || defaults.providerId,
      modelId: s.modelId || defaults.modelId,
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
    const firstSession = {
      ...defaultSession(resolvedDefaultPromptId),
      modelProviderId: defaults.providerId,
      modelId: defaults.modelId,
    };
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

  const refreshSources = async () => {
    try {
      const tabList = await browser.tabs.query({});
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
      if (browser.bookmarks?.getRecent) {
        const recent = await browser.bookmarks.getRecent(6);
        const list = recent
          .filter(b => b.url)
          .map(b => ({ id: b.id, title: b.title || 'Bookmark', url: b.url || '' }));
        setBookmarks(list);
      }
    } catch {
      setBookmarks([]);
    }

    try {
      if (browser.history?.search) {
        const startTime = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const recent = await browser.history.search({ text: '', startTime, maxResults: 6 });
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
    const tabs = await browser.tabs.query({ active: true, lastFocusedWindow: true });
    const tab = tabs.find(t => t.id != null && t.url);
    if (!tab?.id) return null;
    return { id: tab.id, title: tab.title || 'Active Tab', url: tab.url || '' };
  };

  useEffect(() => {
    void loadState();
    void refreshSources();
  }, []);

  useEffect(() => {
    void saveState({ sessions, activeSessionId, memories, theme, templates, defaultPromptId });
  }, [sessions, activeSessionId, memories, theme, templates, defaultPromptId]);

  useThemeSync({ storageKey: STORAGE_KEY, theme, setTheme });

  const addSession = () => {
    const defaults = resolveDefaultModel();
    const session = {
      ...defaultSession(defaultPromptId),
      modelProviderId: defaults.providerId,
      modelId: defaults.modelId,
    };
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
    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Thinking…',
      createdAt: Date.now(),
    };
    updateSession(activeSession.id, { messages: [...activeSession.messages, userMessage, assistantMessage] });
    setInput('');

    const replaceMessage = (id: string, patch: Partial<ChatMessage>) => {
      setSessions(prev =>
        prev.map((s) => {
          if (s.id !== activeSession.id) return s;
          return {
            ...s,
            messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
          };
        }),
      );
    };

    const appendToolStep = (content: string) => {
      setSessions(prev =>
        prev.map((s) => {
          if (s.id !== activeSession.id) return s;
          return {
            ...s,
            messages: s.messages.map((m) => {
              if (m.id !== assistantMessage.id) return m;
              const existing = m.meta?.toolSteps ?? [];
              return {
                ...m,
                meta: {
                  ...m.meta,
                  toolSteps: [...existing, content],
                },
              };
            }),
          };
        }),
      );
    };

    const provider = registry.providers.find(p => p.id === activeProviderId);
    if (!provider || !provider.apiKey) {
      replaceMessage(assistantMessage.id, { content: 'Configure a provider and API key in MCP Console.' });
      return;
    }

    const modelOption = modelOptions.find(o => o.providerId === activeProviderId && o.modelId === activeModelId);
    const tools = modelOption?.supportsTools ? mcpTools : undefined;

    const template = templates.find(t => t.id === defaultPromptId)?.content ?? '';
    const context = activeSession.contexts
      .map((ctx) => `- [${ctx.type}] ${ctx.title}\n${ctx.content}`)
      .join('\n\n');
    const systemContent =
      template +
      (context ? `\n\nContext:\n${context}` : '') +
      (modelOption?.supportsTools ? '' : `\n\n${toolProtocolBlock}`);

    let messages: LlmMessage[] = [
      { role: 'system', content: systemContent },
      ...activeSession.messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage.content },
    ];

    const executeTool = async (tool: ToolCall) => {
      let args: any = {};
      try {
        args = tool.arguments ? JSON.parse(tool.arguments) : {};
      } catch {
        args = {};
      }
      switch (tool.name) {
        case 'browser_click':
          return bgClient.sendClick.mutate({ selector: String(args.selector || '') });
        case 'browser_type':
          return bgClient.sendType.mutate({ selector: String(args.selector || ''), text: String(args.text || ''), pressEnter: !!args.pressEnter });
        case 'browser_enter':
          return bgClient.sendEnter.mutate({ selector: args.selector ? String(args.selector) : undefined, key: args.key ? String(args.key) : undefined });
        case 'browser_select':
          return bgClient.sendSelect.mutate({
            selector: String(args.selector || ''),
            value: args.value,
            label: args.label,
            index: args.index,
            values: args.values,
            labels: args.labels,
            indices: args.indices,
          });
        case 'browser_scroll':
          return bgClient.sendScroll.mutate({ deltaX: args.deltaX, deltaY: args.deltaY, selector: args.selector });
        case 'browser_wait_for_selector':
          return bgClient.sendWaitForSelector.mutate({ selector: String(args.selector || ''), timeoutMs: args.timeoutMs });
        case 'browser_find':
          return bgClient.sendFind.mutate({ selector: String(args.selector || '') });
        case 'browser_hover':
          return bgClient.sendHover.mutate({ selector: String(args.selector || '') });
        case 'browser_navigate':
          return bgClient.sendNavigate.mutate({ url: String(args.url || '') });
        case 'browser_snapshot':
          return bgClient.sendSnapshot.mutate({ includeHidden: args.includeHidden, maxElements: args.maxElements, maxText: args.maxText });
        case 'browser_screenshot':
          return bgClient.sendScreenshot.mutate({ selector: args.selector, format: args.format, quality: args.quality, padding: args.padding });
        case 'browser_back':
          return bgClient.sendBack.mutate();
        case 'browser_forward':
          return bgClient.sendForward.mutate();
        default:
          return { ok: false, error: `Unknown tool: ${tool.name}` } as any;
      }
    };

    const requestToolReformat = () => {
      const hint = `Your last response must be ONLY valid JSON with a top-level "tool_calls" array. No extra text.`;
      messages = [...messages, { role: 'user', content: hint }];
    };

    try {
      if (!tools && supportsStreaming(provider.id)) {
        replaceMessage(assistantMessage.id, { content: '' });
        let buffer = '';
        for await (const chunk of sendChatStream({ provider, messages, modelId: activeModelId })) {
          buffer += chunk;
          replaceMessage(assistantMessage.id, { content: buffer });
        }
        if (!buffer.trim()) {
          replaceMessage(assistantMessage.id, { content: 'No response.' });
        }
        return;
      }
      for (let i = 0; i < 3; i += 1) {
        const res = await sendChat({ provider, messages, tools, modelId: activeModelId });
        let toolCalls = res.toolCalls;
        if (!toolCalls?.length && !modelOption?.supportsTools) {
          const extracted = extractToolCallsFromText(res.text || '');
          toolCalls = extracted.toolCalls;
          if (extracted.parseError) {
            replaceMessage(assistantMessage.id, {
              meta: { debug: 'Tool call parse error — retrying with strict JSON.' },
            });
            requestToolReformat();
            continue;
          }
          if (!toolCalls?.length && extracted.cleanedText) {
            replaceMessage(assistantMessage.id, { content: extracted.cleanedText });
            return;
          }
        }
        if (toolCalls && toolCalls.length) {
          messages = [
            ...messages,
            { role: 'assistant', content: '', tool_calls: toolCalls },
          ];
          for (const tool of toolCalls) {
            appendToolStep(`Running tool: ${tool.name}`);
            const toolResult = await executeTool(tool);
            if ((toolResult as any)?.ok === false) {
              appendToolStep(`Tool failed: ${tool.name}`);
            }
            messages = [
              ...messages,
              { role: 'tool', content: JSON.stringify(toolResult), tool_call_id: tool.id },
            ];
          }
          continue;
        }
        replaceMessage(assistantMessage.id, { content: res.text || 'No response.' });
        return;
      }
      replaceMessage(assistantMessage.id, { content: 'Tool loop exceeded. Try again.' });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      replaceMessage(assistantMessage.id, { content: `Error: ${message}` });
    }
  };

  const toggleContext = (id: string) => {
    setExpandedContexts(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const addContext = (ctx: ContextItem) => {
    if (!activeSession) return;
    updateSession(activeSession.id, { contexts: [ctx, ...activeSession.contexts] });
  };

  const removeContext = (id: string) => {
    if (!activeSession) return;
    updateSession(activeSession.id, { contexts: activeSession.contexts.filter(ctx => ctx.id !== id) });
  };

  const togglePinContext = (id: string) => {
    if (!activeSession) return;
    updateSession(activeSession.id, {
      contexts: activeSession.contexts.map(ctx => (ctx.id === id ? { ...ctx, pinned: !ctx.pinned } : ctx)),
    });
  };

  const addSelectedTabContext = () => {
    if (!activeSession || selectedTabId == null) return;
    const tab = tabs.find(t => t.id === selectedTabId);
    if (!tab) return;
    addContext({
      id: crypto.randomUUID(),
      type: 'tab',
      title: tab.title,
      content: tab.url,
      createdAt: Date.now(),
    });
  };

  const addBookmarkContext = (b: BookmarkOption) => {
    if (!activeSession) return;
    addContext({
      id: crypto.randomUUID(),
      type: 'bookmark',
      title: b.title,
      content: b.url,
      createdAt: Date.now(),
    });
  };

  const addHistoryContext = (h: HistoryOption) => {
    if (!activeSession) return;
    addContext({
      id: crypto.randomUUID(),
      type: 'history',
      title: h.title,
      content: h.url,
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

  const addMemoryContext = (m: MemoryItem) => {
    if (!activeSession) return;
    addContext({
      id: crypto.randomUUID(),
      type: 'memory',
      title: m.title,
      content: m.content,
      createdAt: Date.now(),
    });
  };

  const clearAllSessions = () => {
    const next = defaultSession(defaultPromptId);
    setSessions([next]);
    setActiveSessionId(next.id);
  };

  const lastActiveAt = (session: ChatSession) =>
    session.messages[session.messages.length - 1]?.createdAt ?? session.createdAt;

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

  const addActiveTabContext = async () => {
    const tab = await getActiveTab();
    if (!tab) {
      setActiveTabError('No active tab found. Open a tab and try again.');
      setActiveTabPreview(null);
      setShowAddTabModal(true);
      return;
    }
    setActiveTabError(null);
    setActiveTabPreview(tab);
    setShowAddTabModal(true);
  };

  const confirmAddActiveTab = () => {
    if (!activeSession || !activeTabPreview) return;
    addContext({
      id: crypto.randomUUID(),
      type: 'tab',
      title: activeTabPreview.title,
      content: activeTabPreview.url,
      createdAt: Date.now(),
    });
    setShowAddTabModal(false);
  };

  const confirmDeleteSession = () => {
    if (!deleteSessionId) return;
    setSessions(prev => prev.filter(s => s.id !== deleteSessionId));
    if (activeSessionId === deleteSessionId) {
      setActiveSessionId(sessions[0]?.id ?? null);
    }
    setShowDeleteModal(false);
    setDeleteSessionId(null);
  };

  const openMcpConsole = () => {
    const url = browser.runtime.getURL('mcp.html');
    browser.tabs.create({ url }).catch(() => {});
  };

  const sortedContexts = activeSession
    ? [...activeSession.contexts].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned))
    : [];

  const activeModelLabel = modelOptions.find(o => o.providerId === activeProviderId && o.modelId === activeModelId)?.label
    ?? 'Select model';

  return {
    sessions,
    activeSessionId,
    activeSession,
    input,
    error,
    expandedContexts,
    activeModelId,
    activeProviderId,
    activeModelLabel,
    modelOptions,
    sessionQuery,
    showMemoryModal,
    showSessionsModal,
    showDeleteModal,
    deleteSessionId,
    memories,
    memoryTitle,
    memoryContent,
    tabs,
    bookmarks,
    historyItems,
    selectedTabId,
    showContextPanel,
    theme,
    templates,
    defaultPromptId,
    showAddTabModal,
    activeTabPreview,
    activeTabError,
    contextBadges,
    sortedContexts,
    dockIconColor,
    actions: {
      setInput,
      setSessionQuery,
      setShowMemoryModal,
      setShowSessionsModal,
      setShowDeleteModal,
      setDeleteSessionId,
      setMemoryTitle,
      setMemoryContent,
      setSelectedTabId,
      setShowContextPanel,
      setShowAddTabModal,
      setActiveModel: (providerId: string, modelId: string) => {
        if (!activeSession) return;
        setActiveProviderId(providerId);
        setActiveModelId(modelId);
        updateSession(activeSession.id, { modelProviderId: providerId, modelId });
      },
      addSession,
      setActiveSessionId,
      updateSession,
      sendMessage,
      toggleContext,
      addContext,
      removeContext,
      togglePinContext,
      addSelectedTabContext,
      addFileContext,
      addBookmarkContext,
      addHistoryContext,
      addMemory,
      deleteMemory,
      addMemoryContext,
      clearAllSessions,
      keepLastSessions,
      openMcpConsole,
      addActiveTabContext,
      confirmAddActiveTab,
      confirmDeleteSession,
      refreshSources,
      setTheme,
      nextTheme,
      themeLabel,
    },
  };
}
