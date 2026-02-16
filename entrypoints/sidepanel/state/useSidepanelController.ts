import { useEffect, useMemo, useState } from 'react';
import { browser, storage } from '#imports';
import { createTRPCProxyClient } from '@trpc/client';
import { chromeLink } from 'trpc-browser/link';
import type { BackgroundRouter } from '../../shared/backgroundRouter';
import { useProviderRegistry } from '../../shared/llm/useProviderRegistry';
import type { ProviderConfig } from '../../shared/llm/types';
import type { ToolCall, ToolDefinition } from '../../shared/llm/tools';
import { sendChat, sendChatStream, supportsStreaming, extractToolCallsFromText, type LlmMessage } from '../../shared/llm/send';
import { McpStreamClient, type McpCallToolResult, type McpResource, type McpResourceTemplate, type McpTool } from '../../shared/mcp/client';
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

type ListedTool = {
  alias: string;
  name: string;
  description: string;
  schema: Record<string, unknown>;
};

const INTERNAL_TOOL_PREFIX = 'mcp_';

const aliasFromToolName = (name: string, used: Set<string>): string => {
  const base = name
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 56) || 'tool';
  let alias = base;
  let i = 2;
  while (used.has(alias)) {
    alias = `${base}_${i}`.slice(0, 64);
    i += 1;
  }
  used.add(alias);
  return alias;
};

const normalizeSchema = (schema: unknown): Record<string, unknown> => {
  if (schema && typeof schema === 'object' && !Array.isArray(schema)) {
    return schema as Record<string, unknown>;
  }
  return { type: 'object', properties: {} };
};

const mapMcpTools = (tools: McpTool[]): ListedTool[] => {
  const used = new Set<string>();
  return tools.map((tool) => ({
    alias: aliasFromToolName(tool.name, used),
    name: tool.name,
    description: tool.description?.trim() || `Call MCP tool ${tool.name}`,
    schema: normalizeSchema(tool.inputSchema),
  }));
};

const internalToolDefinitions: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: `${INTERNAL_TOOL_PREFIX}read_resource`,
      description: 'Read an MCP resource by URI.',
      parameters: {
        type: 'object',
        properties: {
          uri: { type: 'string' },
        },
        required: ['uri'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: `${INTERNAL_TOOL_PREFIX}list_resources`,
      description: 'List all available MCP resources.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: `${INTERNAL_TOOL_PREFIX}list_resource_templates`,
      description: 'List all available MCP resource templates.',
      parameters: { type: 'object', properties: {} },
    },
  },
];

const buildToolProtocolBlock = (listedTools: ListedTool[]): string => {
  const names = [
    ...listedTools.map((tool) => tool.alias),
    ...internalToolDefinitions.map((tool) => tool.function.name),
  ];
  return [
    'You can call tools by emitting JSON in the exact format below.',
    'If you need to use tools, respond with ONLY this JSON object (no extra text):',
    '{',
    '  "tool_calls": [',
    '    {',
    '      "id": "call_1",',
    `      "name": "${names[0] || 'tool_name'}",`,
    '      "arguments": "{\\"key\\": \\"value\\"}"',
    '    }',
    '  ]',
    '}',
    'If you do not need tools, respond normally in plain text.',
    `Allowed tool names: ${names.join(', ')}`,
  ].join('\n');
};

const deriveMcpStreamUrl = (input: string): string => {
  const fallback = 'http://127.0.0.1:9099/mcp/stream';
  try {
    const url = new URL(input);
    if (url.protocol === 'ws:') url.protocol = 'http:';
    if (url.protocol === 'wss:') url.protocol = 'https:';
    url.pathname = '/mcp/stream';
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return fallback;
  }
};

const deriveWsUrlFromMcpStream = (input: string): string => {
  const fallback = 'ws://localhost:9099/ws';
  try {
    const url = new URL(input);
    if (url.protocol === 'http:') url.protocol = 'ws:';
    if (url.protocol === 'https:') url.protocol = 'wss:';
    url.pathname = '/ws';
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return fallback;
  }
};

const mcpToolToDefinition = (tool: ListedTool): ToolDefinition => ({
  type: 'function',
  function: {
    name: tool.alias,
    description: tool.description,
    parameters: tool.schema,
  },
});

const formatMcpToolResult = (result: McpCallToolResult): string => {
  if (typeof result.structuredContent !== 'undefined') {
    return JSON.stringify(result.structuredContent);
  }
  if (result.content?.length) {
    const textBlocks = result.content
      .map((item) => item.text?.trim())
      .filter((text): text is string => !!text);
    if (textBlocks.length) return textBlocks.join('\n');
  }
  return JSON.stringify(result);
};

const normalizeToolArgs = (args: Record<string, unknown>): Record<string, unknown> => {
  const out: Record<string, unknown> = { ...args };
  const aliasMap: Record<string, string> = {
    tab_id: 'tabId',
    require_active: 'requireActive',
    match_mode: 'matchMode',
    include_hidden: 'includeHidden',
    max_elements: 'maxElements',
    max_text: 'maxText',
    timeout_ms: 'timeoutMs',
    delta_x: 'deltaX',
    delta_y: 'deltaY',
    press_enter: 'pressEnter',
    max_width: 'maxWidth',
    max_height: 'maxHeight',
  };
  for (const [from, to] of Object.entries(aliasMap)) {
    if (typeof out[from] !== 'undefined' && typeof out[to] === 'undefined') {
      out[to] = out[from];
      delete out[from];
    }
  }
  return out;
};

const sanitizeToolArgs = (toolName: string, args: Record<string, unknown>): Record<string, unknown> => {
  const allowedArgs: Record<string, string[]> = {
    'browser_click': ['selector'],
    'browser.click': ['selector'],
    'browser_type': ['selector', 'text', 'pressEnter'],
    'browser.type': ['selector', 'text', 'pressEnter'],
    'browser_enter': ['selector', 'key'],
    'browser.enter': ['selector', 'key'],
    'browser_select': ['selector', 'value', 'label', 'index', 'values', 'labels', 'indices', 'matchMode', 'toggle'],
    'browser.select': ['selector', 'value', 'label', 'index', 'values', 'labels', 'indices', 'matchMode', 'toggle'],
    'browser_scroll': ['deltaX', 'deltaY', 'selector', 'behavior', 'block'],
    'browser.scroll': ['deltaX', 'deltaY', 'selector', 'behavior', 'block'],
    'browser_wait_for_selector': ['selector', 'timeoutMs'],
    'browser.wait_for_selector': ['selector', 'timeoutMs'],
    'browser_find': ['text', 'limit', 'radius', 'caseSensitive'],
    'browser.find': ['text', 'limit', 'radius', 'caseSensitive'],
    'browser_hover': ['selector'],
    'browser.hover': ['selector'],
    'browser_navigate': ['url'],
    'browser.navigate': ['url'],
    'browser_snapshot': ['includeHidden', 'maxElements', 'maxText'],
    'browser.snapshot': ['includeHidden', 'maxElements', 'maxText'],
    'browser_screenshot': ['selector', 'format', 'quality', 'padding', 'maxWidth', 'maxHeight'],
    'browser.screenshot': ['selector', 'format', 'quality', 'padding', 'maxWidth', 'maxHeight'],
    'browser_back': [],
    'browser.back': [],
    'browser_forward': [],
    'browser.forward': [],
    'browser_claim_tab': ['tabId', 'mode', 'requireActive'],
    'browser.claim_tab': ['tabId', 'mode', 'requireActive'],
    'browser_release_tab': ['tabId'],
    'browser.release_tab': ['tabId'],
    'browser_open_tab': ['url', 'active', 'pinned'],
    'browser.open_tab': ['url', 'active', 'pinned'],
  };
  const allowed = allowedArgs[toolName];
  if (!allowed) return args;
  return Object.fromEntries(Object.entries(args).filter(([key]) => allowed.includes(key)));
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
  const [mcpStreamUrl, setMcpStreamUrl] = useState('http://127.0.0.1:9099/mcp/stream');
  const [mcpToken, setMcpToken] = useState('');
  const [mcpClientName, setMcpClientName] = useState('surfingbro-sidepanel');
  const [mcpClientId, setMcpClientId] = useState('');

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
        type: (ctx.type === 'tab' ? 'tab' : 'file') as 'tab' | 'file',
        title: ctx.title || (ctx.type === 'tab' ? 'Tab' : 'File'),
      }));
  }, [activeSession]);

  const dockIconColor = theme === 'dark' ? '#f1f5f9' : '#0f172a';

  const loadState = async () => {
    const stored = await storage.getItem<StoredState>(`local:${STORAGE_KEY}`);
    const bgState = await bgClient.getState.query().catch(() => null);
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
      setMcpStreamUrl(stored?.mcpStreamUrl || deriveMcpStreamUrl(bgState?.wsUrl || 'ws://localhost:9099/ws'));
      setMcpToken(stored?.mcpToken || '');
      setMcpClientName(stored?.mcpClientName || 'surfingbro-sidepanel');
      setMcpClientId(stored?.mcpClientId || '');
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
    setMcpStreamUrl(stored?.mcpStreamUrl || deriveMcpStreamUrl(bgState?.wsUrl || 'ws://localhost:9099/ws'));
    setMcpToken(stored?.mcpToken || '');
    setMcpClientName(stored?.mcpClientName || 'surfingbro-sidepanel');
    setMcpClientId(stored?.mcpClientId || '');
  };

  const saveState = async (state: StoredState) => {
    const prev = (await storage.getItem<StoredState>(`local:${STORAGE_KEY}`)) ?? undefined;
    await storage.setItem(`local:${STORAGE_KEY}`, {
      ...(prev ?? {}),
      ...state,
      mcpStreamUrl: state.mcpStreamUrl?.trim() ? state.mcpStreamUrl : prev?.mcpStreamUrl,
      mcpToken: typeof state.mcpToken === 'string' && state.mcpToken.length > 0 ? state.mcpToken : prev?.mcpToken,
      mcpClientName: state.mcpClientName?.trim() ? state.mcpClientName : prev?.mcpClientName,
      mcpClientId: state.mcpClientId?.trim() ? state.mcpClientId : prev?.mcpClientId,
    });
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
    void saveState({
      sessions,
      activeSessionId,
      memories,
      theme,
      templates,
      defaultPromptId,
      mcpStreamUrl,
      mcpToken,
      mcpClientName,
      mcpClientId,
    });
  }, [sessions, activeSessionId, memories, theme, templates, defaultPromptId, mcpStreamUrl, mcpToken, mcpClientName, mcpClientId]);

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
    const latestStored = await storage.getItem<StoredState>(`local:${STORAGE_KEY}`).catch(() => null);
    const effectiveMcpStreamUrl = (latestStored?.mcpStreamUrl || mcpStreamUrl || '').trim();
    const effectiveMcpToken = (latestStored?.mcpToken || mcpToken || '').trim();
    const effectiveMcpClientName = (latestStored?.mcpClientName || mcpClientName || 'surfingbro-sidepanel').trim();
    const effectiveMcpClientId = (latestStored?.mcpClientId || mcpClientId || '').trim();

    const storedMcpStreamUrl = latestStored?.mcpStreamUrl ?? '';
    const storedMcpToken = latestStored?.mcpToken ?? '';
    const storedMcpClientName = latestStored?.mcpClientName ?? '';
    const storedMcpClientId = latestStored?.mcpClientId ?? '';

    if (storedMcpStreamUrl && storedMcpStreamUrl !== mcpStreamUrl) {
      setMcpStreamUrl(storedMcpStreamUrl);
    }
    if (storedMcpToken !== mcpToken) {
      setMcpToken(storedMcpToken);
    }
    if (storedMcpClientName && storedMcpClientName !== mcpClientName) {
      setMcpClientName(storedMcpClientName);
    }
    if (storedMcpClientId && storedMcpClientId !== mcpClientId) {
      setMcpClientId(storedMcpClientId);
    }

    const mcp = new McpStreamClient({
      streamUrl: effectiveMcpStreamUrl,
      token: effectiveMcpToken,
      clientName: effectiveMcpClientName || 'surfingbro-sidepanel',
      clientVersion: '0.1.0',
      clientId: effectiveMcpClientId || undefined,
    });

    try {
      const bgState = await bgClient.getState.query();
      if (!bgState.wsConnected) {
        const wsUrl = (bgState.wsUrl || '').trim() || deriveWsUrlFromMcpStream(effectiveMcpStreamUrl);
        await bgClient.connect.mutate({ url: wsUrl });
      }
    } catch {
      // Non-fatal: MCP HTTP can still work for non-browser tools/resources.
    }

    const resolveActiveTabId = async (): Promise<number | null> => {
      const candidates = await Promise.all([
        browser.tabs.query({ active: true, lastFocusedWindow: true }).catch(() => []),
        browser.tabs.query({ active: true, currentWindow: true }).catch(() => []),
        browser.tabs.query({ active: true }).catch(() => []),
      ]);
      for (const list of candidates) {
        const id = list.find((tab) => tab.id != null && !!tab.url)?.id;
        if (id != null) return id;
      }
      const listed = await bgClient.listTabs.query().catch(() => []);
      const fallback = listed.find((tab) => Number.isFinite(tab.id))?.id ?? null;
      return fallback;
    };

    const requestToolReformat = (allowedNames: string[], reason = 'format') => {
      const hint = `Your last response must be ONLY valid JSON with a top-level "tool_calls" array. ${reason}. Allowed tool names: ${allowedNames.join(', ')}`;
      messages = [...messages, { role: 'user', content: hint }];
    };

    const stringifyList = (items: string[]) => (items.length ? items.join(', ') : '(none)');

    let listedTools: ListedTool[] = [];
    let resources: McpResource[] = [];
    let resourceTemplates: McpResourceTemplate[] = [];

    try {
      await mcp.initialize();
      const assigned = mcp.getAssignedClientId();
      if (assigned && assigned !== mcpClientId) {
        setMcpClientId(assigned);
      }
      const [serverTools, serverResources, serverResourceTemplates] = await Promise.all([
        mcp.listTools(),
        mcp.listResources().catch(() => []),
        mcp.listResourceTemplates().catch(() => []),
      ]);
      listedTools = mapMcpTools(serverTools);
      resources = serverResources;
      resourceTemplates = serverResourceTemplates;

      // Best-effort: claim the active tab once per turn so browser tools can run immediately.
      const claim = listedTools.find((tool) => tool.name === 'browser.claim_tab');
      if (claim) {
        try {
          const activeTabId = await resolveActiveTabId();
          if (activeTabId != null) {
            await mcp.callTool(claim.name, { tabId: activeTabId, mode: 'exclusive' });
            appendToolStep('Claimed active tab for this MCP session.');
          }
        } catch {
          // Non-fatal: the model can still claim/open tabs explicitly.
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      replaceMessage(
        assistantMessage.id,
        {
          content:
            `MCP connection failed.\n` +
            `- Stream URL: ${effectiveMcpStreamUrl}\n` +
            `- Token: ${effectiveMcpToken ? 'provided' : 'missing'}\n` +
            `Error: ${message}`,
        },
      );
      return;
    }

    const mcpToolDefinitions = listedTools.map(mcpToolToDefinition);
    const tools = modelOption?.supportsTools
      ? [...mcpToolDefinitions, ...internalToolDefinitions]
      : undefined;
    const allowedToolNames = [
      ...listedTools.map((tool) => tool.alias),
      ...internalToolDefinitions.map((tool) => tool.function.name),
    ];
    const aliasToToolName = new Map(listedTools.map((tool) => [tool.alias, tool.name]));

    const template = templates.find(t => t.id === defaultPromptId)?.content ?? '';
    const context = activeSession.contexts
      .map((ctx) => `- [${ctx.type}] ${ctx.title}\n${ctx.content}`)
      .join('\n\n');
    const resourceLines = resources.map((r) => `- ${r.uri}${r.name ? ` (${r.name})` : ''}`);
    const resourceTemplateLines = resourceTemplates.map((r) => `- ${r.uriTemplate}${r.name ? ` (${r.name})` : ''}`);
    const systemContent =
      template +
      '\n\nYou are operating through an MCP server (mcpd). Prefer MCP tools over guessing page state.' +
      (context ? `\n\nContext:\n${context}` : '') +
      `\n\nAvailable MCP tools: ${stringifyList(listedTools.map((tool) => `${tool.alias} -> ${tool.name}`))}` +
      `\nAvailable MCP resources: ${stringifyList(resourceLines)}` +
      `\nAvailable MCP resource templates: ${stringifyList(resourceTemplateLines)}` +
      `\nWhen beginning browser interaction, claim the active tab first using the browser.claim_tab alias if needed.` +
      (modelOption?.supportsTools ? '' : `\n\n${buildToolProtocolBlock(listedTools)}`);

    let messages: LlmMessage[] = [
      { role: 'system', content: systemContent },
      ...activeSession.messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage.content },
    ];

    const executeTool = async (tool: ToolCall) => {
      let args: Record<string, unknown> = {};
      try {
        args = tool.arguments ? JSON.parse(tool.arguments) : {};
      } catch {
        args = {};
      }
      args = normalizeToolArgs(args);

      if (tool.name === `${INTERNAL_TOOL_PREFIX}read_resource`) {
        const uri = String(args.uri || '');
        if (!uri) return { ok: false, error: 'uri is required' };
        const result = await mcp.readResource(uri);
        return { ok: true, data: result };
      }
      if (tool.name === `${INTERNAL_TOOL_PREFIX}list_resources`) {
        return { ok: true, data: resources };
      }
      if (tool.name === `${INTERNAL_TOOL_PREFIX}list_resource_templates`) {
        return { ok: true, data: resourceTemplates };
      }

      const realToolName = aliasToToolName.get(tool.name);
      if (!realToolName) {
        return { ok: false, error: `Unknown tool: ${tool.name}` };
      }
      args = sanitizeToolArgs(realToolName, args);
      if (realToolName === 'browser.claim_tab') {
        const hasTabId = typeof args.tabId === 'number' && Number.isFinite(args.tabId) && args.tabId > 0;
        const hasRequireActive = typeof args.requireActive === 'boolean';
        if (!hasTabId) {
          const activeTabId = await resolveActiveTabId();
          if (activeTabId != null) {
            args = { ...args, tabId: activeTabId };
          }
        }
        const hasResolvedTabId = typeof args.tabId === 'number' && Number.isFinite(args.tabId) && args.tabId > 0;
        if (!hasResolvedTabId && !hasRequireActive) {
          args = { ...args, requireActive: true };
        }
        if (typeof args.mode !== 'string' || !args.mode.trim()) {
          args = { ...args, mode: 'exclusive' };
        }
        if (!(typeof args.tabId === 'number' && Number.isFinite(args.tabId) && args.tabId > 0)) {
          return { ok: false, error: 'No active tab id available for browser.claim_tab' };
        }
      }

      let result: McpCallToolResult;
      try {
        result = await mcp.callTool(realToolName, args);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { ok: false, error: message };
      }
      if (result.isError) {
        const errorText = formatMcpToolResult(result);
        const needsClaimRetry =
          realToolName !== 'browser.claim_tab' &&
          realToolName.startsWith('browser.') &&
          /tab not owned|session required|missing properties:\s*\[\"tabId\"\]/i.test(errorText);

        if (needsClaimRetry) {
          appendToolStep('Auto-claiming active tab and retrying tool once.');
          const activeTabId = await resolveActiveTabId();
          if (activeTabId == null) {
            return { ok: false, error: 'No active tab id available for auto-claim retry', data: result };
          }
          try {
            await mcp.callTool('browser.claim_tab', { tabId: activeTabId, mode: 'exclusive' });
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { ok: false, error: `Auto-claim failed: ${message}`, data: result };
          }
          let retryResult: McpCallToolResult;
          try {
            retryResult = await mcp.callTool(realToolName, args);
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return { ok: false, error: message, data: result };
          }
          if (!retryResult.isError) {
            return { ok: true, data: retryResult };
          }
          return { ok: false, error: formatMcpToolResult(retryResult), data: retryResult };
        }

        return { ok: false, error: errorText, data: result };
      }
      return { ok: true, data: result };
    };

    try {
      if (!tools && listedTools.length === 0 && supportsStreaming(provider.id)) {
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

      for (let i = 0; i < 5; i += 1) {
        const res = await sendChat({ provider, messages, tools, modelId: activeModelId });
        let toolCalls = res.toolCalls;
        if (!toolCalls?.length && !modelOption?.supportsTools) {
          const extracted = extractToolCallsFromText(res.text || '');
          toolCalls = extracted.toolCalls;
          if (extracted.parseError) {
            replaceMessage(assistantMessage.id, {
              meta: { debug: 'Tool call parse error. Retrying with stricter format.' },
            });
            requestToolReformat(allowedToolNames, 'Invalid JSON format');
            continue;
          }
          if (!toolCalls?.length && extracted.cleanedText) {
            replaceMessage(assistantMessage.id, { content: extracted.cleanedText });
            return;
          }
        }

        if (toolCalls && toolCalls.length) {
          const unknown = toolCalls.find((tool) => !allowedToolNames.includes(tool.name));
          if (unknown) {
            requestToolReformat(allowedToolNames, `Unknown tool ${unknown.name}`);
            continue;
          }

          messages = [
            ...messages,
            { role: 'assistant', content: '', tool_calls: toolCalls },
          ];
          for (const tool of toolCalls) {
            appendToolStep(`Running MCP tool: ${tool.name}`);
            const toolResult = await executeTool(tool);
            if ((toolResult as any)?.ok === false) {
              appendToolStep(`Tool failed: ${tool.name}`);
              const failure = (toolResult as any)?.error;
              if (failure) {
                appendToolStep(`Reason: ${String(failure)}`);
              }
            }
            const toolContent = JSON.stringify((toolResult as any)?.data ?? toolResult);
            messages = [
              ...messages,
              { role: 'tool', content: toolContent, tool_call_id: tool.id },
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
    const url = browser.runtime.getURL('/mcp.html');
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
