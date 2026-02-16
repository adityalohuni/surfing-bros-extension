import { useEffect, useMemo, useState } from 'react';
import { createTRPCProxyClient } from '@trpc/client';
import { browser, storage } from '#imports';
import { chromeLink } from 'trpc-browser/link';
import { useThemeSync } from '../shared/hooks/useThemeSync';
import type { BackgroundRouter } from '../shared/backgroundRouter';
import type { PromptTemplate } from './types';
import { useProviderRegistry } from '../shared/llm/useProviderRegistry';
import { testProvider } from '../shared/llm/test';
import { McpHeader } from './components/McpHeader';
import { ConnectionCard } from './components/ConnectionCard';
import { AppearanceCard } from './components/AppearanceCard';
import { TemplatesCard } from './components/TemplatesCard';
import { RecorderCard } from './components/RecorderCard';
import { TemplatesModal } from './components/TemplatesModal';
import { ProvidersCard } from './components/ProvidersCard';
import { ProvidersModal } from './components/ProvidersModal';


const STORAGE_KEY = 'surfingbro_sidepanel_state_v1';

const DEFAULT_PROMPT_ID = 'default-browsing-v1';
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

function useBackgroundClient() {
  return useMemo(() => {
    const port = browser.runtime.connect({ name: 'mcp-ui' });
    return createTRPCProxyClient<BackgroundRouter>({
      links: [chromeLink({ port })],
    });
  }, []);
}

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

export default function App() {
  const client = useBackgroundClient();
  const brandIconUrl = browser.runtime.getURL('/icons/128.png');
  const [wsUrl, setWsUrl] = useState('ws://localhost:9099/ws');
  const [mcpStreamUrl, setMcpStreamUrl] = useState('http://127.0.0.1:9099/mcp/stream');
  const [mcpToken, setMcpToken] = useState('');
  const [mcpClientName, setMcpClientName] = useState('surfingbro-sidepanel');
  const [state, setState] = useState<any>(null);
  const [recording, setRecording] = useState(false);
  const [recordingCount, setRecordingCount] = useState(0);
  const [recordedJson, setRecordedJson] = useState('');
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [defaultPromptId, setDefaultPromptId] = useState(DEFAULT_PROMPT_ID);
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [templateQuery, setTemplateQuery] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [showProviders, setShowProviders] = useState(false);
  const [testStatus, setTestStatus] = useState<Record<string, { status: 'idle' | 'testing' | 'ok' | 'error'; message: string }>>({});

  const {
    registry,
    enabledProviders,
    addProvider,
    removeProvider,
    updateProvider,
    setDefaultModel,
    setGlobalDefault,
  } = useProviderRegistry();

  const defaultProvider = registry.providers.find(p => p.id === registry.defaultProviderId)
    ?? enabledProviders[0]
    ?? registry.providers[0];
  const defaultModelId = registry.defaultModelId
    ?? defaultProvider?.defaultModelId
    ?? defaultProvider?.models[0]?.id;
  const defaultProviderLabel = defaultProvider?.name ?? 'None';
  const defaultModelLabel =
    defaultProvider?.models.find(m => m.id === defaultModelId)?.label
    ?? defaultModelId
    ?? 'None';

  const handleTestProvider = async (providerId: string) => {
    const provider = registry.providers.find(p => p.id === providerId);
    if (!provider) return;
    setTestStatus(prev => ({ ...prev, [providerId]: { status: 'testing', message: 'Testing connection…' } }));
    const result = await testProvider(provider);
    setTestStatus(prev => ({
      ...prev,
      [providerId]: {
        status: result.ok ? 'ok' : 'error',
        message: result.message,
      },
    }));
  };

  const handleTestAllProviders = async () => {
    for (const provider of registry.providers) {
      await handleTestProvider(provider.id);
    }
  };

  const loadTemplates = async () => {
    const stored = await storage.getItem<{
      templates?: PromptTemplate[];
      defaultPromptId?: string;
      theme?: 'light' | 'dark' | 'system';
      mcpStreamUrl?: string;
      mcpToken?: string;
      mcpClientName?: string;
    }>(`local:${STORAGE_KEY}`);
    const nextTemplates = stored?.templates?.length ? stored.templates : [defaultTemplate()];
    setTemplates(nextTemplates);
    const resolvedDefault =
      stored?.defaultPromptId && nextTemplates.some(t => t.id === stored.defaultPromptId)
        ? stored.defaultPromptId
        : nextTemplates[0]?.id ?? DEFAULT_PROMPT_ID;
    setDefaultPromptId(resolvedDefault);
    if (stored?.theme) setTheme(stored.theme);
    setMcpStreamUrl(stored?.mcpStreamUrl || deriveMcpStreamUrl(wsUrl));
    setMcpToken(stored?.mcpToken || '');
    setMcpClientName(stored?.mcpClientName || 'surfingbro-sidepanel');
  };

  const saveTemplates = async (nextTemplates: PromptTemplate[], nextDefaultId: string) => {
    const stored = (await storage.getItem<Record<string, unknown>>(`local:${STORAGE_KEY}`)) ?? {};
    await storage.setItem(`local:${STORAGE_KEY}`, {
      ...stored,
      templates: nextTemplates,
      defaultPromptId: nextDefaultId,
    });
  };

  const saveTheme = async (nextTheme: 'light' | 'dark' | 'system') => {
    const stored = (await storage.getItem<Record<string, unknown>>(`local:${STORAGE_KEY}`)) ?? {};
    await storage.setItem(`local:${STORAGE_KEY}`, {
      ...stored,
      theme: nextTheme,
    });
  };

  const saveMcpSettings = async (settings: {
    mcpStreamUrl: string;
    mcpToken: string;
    mcpClientName: string;
  }) => {
    const stored = (await storage.getItem<Record<string, unknown>>(`local:${STORAGE_KEY}`)) ?? {};
    await storage.setItem(`local:${STORAGE_KEY}`, {
      ...stored,
      mcpStreamUrl: settings.mcpStreamUrl,
      mcpToken: settings.mcpToken,
      mcpClientName: settings.mcpClientName,
    });
  };

  const refresh = async () => {
    const data = await client.getState.query();
    setState(data);
    if (data?.wsUrl) {
      setWsUrl(data.wsUrl);
      setMcpStreamUrl((prev) => (prev ? prev : deriveMcpStreamUrl(data.wsUrl)));
    }
    if (typeof data?.recording === 'boolean') setRecording(data.recording);
    if (typeof data?.recordingCount === 'number') setRecordingCount(data.recordingCount);
  };

  useEffect(() => {
    void refresh();
    const id = setInterval(refresh, 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    void loadTemplates();
  }, []);

  useEffect(() => {
    void saveMcpSettings({ mcpStreamUrl, mcpToken, mcpClientName });
  }, [mcpStreamUrl, mcpToken, mcpClientName]);

  useThemeSync({ storageKey: STORAGE_KEY, theme, setTheme });

  const connect = async () => {
    await saveMcpSettings({ mcpStreamUrl, mcpToken, mcpClientName });
    await client.connect.mutate({ url: wsUrl });
    await refresh();
  };

  const disconnect = async () => {
    await client.disconnect.mutate();
    await refresh();
  };

  const startRecording = async () => {
    await client.startRecording.mutate();
    await refresh();
  };

  const stopRecording = async () => {
    await client.stopRecording.mutate();
    await refresh();
  };

  const clearRecording = async () => {
    await client.clearRecording.mutate();
    setRecordedJson('');
    await refresh();
  };

  const exportRecording = async () => {
    const data = await client.getRecording.query();
    setRecordedJson(JSON.stringify(data, null, 2));
  };

  const addTemplate = async () => {
    if (!templateName.trim() || !templateContent.trim()) return;
    const next = [
      ...templates,
      {
        id: crypto.randomUUID(),
        name: templateName.trim(),
        content: templateContent.trim(),
        createdAt: Date.now(),
      },
    ];
    setTemplates(next);
    setTemplateName('');
    setTemplateContent('');
    await saveTemplates(next, defaultPromptId);
  };

  const updateTemplate = async (id: string, patch: Partial<PromptTemplate>) => {
    const next = templates.map(t => (t.id === id ? { ...t, ...patch } : t));
    setTemplates(next);
    await saveTemplates(next, defaultPromptId);
  };

  const deleteTemplate = async (id: string) => {
    const next = templates.filter(t => t.id !== id);
    const nextDefault = defaultPromptId === id ? (next[0]?.id ?? DEFAULT_PROMPT_ID) : defaultPromptId;
    setTemplates(next);
    setDefaultPromptId(nextDefault);
    await saveTemplates(next, nextDefault);
  };

  const setDefaultTemplate = async (id: string) => {
    setDefaultPromptId(id);
    await saveTemplates(templates, id);
  };

  const openTemplateEditor = (id: string) => {
    const t = templates.find((tpl) => tpl.id === id);
    if (!t) return;
    setEditingTemplateId(id);
    setDraftName(t.name);
    setDraftContent(t.content);
  };

  const clearTemplateEditor = () => {
    setEditingTemplateId(null);
    setDraftName('');
    setDraftContent('');
  };

  const saveTemplateDraft = async () => {
    if (!editingTemplateId) return;
    await updateTemplate(editingTemplateId, { name: draftName.trim(), content: draftContent.trim() });
    clearTemplateEditor();
  };

  const setThemeAndPersist = async (next: 'light' | 'dark' | 'system') => {
    setTheme(next);
    await saveTheme(next);
  };

  return (
    <div className="max-w-5xl mx-auto grid gap-4 px-4 py-4">
      <McpHeader iconUrl={brandIconUrl} connected={!!state?.wsConnected} />

      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <ConnectionCard
          wsUrl={wsUrl}
          mcpStreamUrl={mcpStreamUrl}
          mcpToken={mcpToken}
          mcpClientName={mcpClientName}
          onUrlChange={setWsUrl}
          onMcpStreamUrlChange={setMcpStreamUrl}
          onMcpTokenChange={setMcpToken}
          onMcpClientNameChange={setMcpClientName}
          onConnect={connect}
          onDisconnect={disconnect}
          lastError={state?.lastError}
        />
        <AppearanceCard theme={theme} onSetTheme={setThemeAndPersist} />
      </div>

      <TemplatesCard
        defaultTemplateName={templates.find(t => t.id === defaultPromptId)?.name ?? 'None'}
        onOpen={() => setShowTemplates(true)}
      />

      <ProvidersCard
        providerCount={enabledProviders.length}
        defaultProviderLabel={defaultProviderLabel}
        defaultModelLabel={defaultModelLabel}
        onOpen={() => setShowProviders(true)}
      />

      <RecorderCard
        recording={recording}
        recordingCount={recordingCount}
        recordedJson={recordedJson}
        onStart={startRecording}
        onStop={stopRecording}
        onExport={exportRecording}
        onClear={clearRecording}
        onRecordedJsonChange={setRecordedJson}
      />

      <TemplatesModal
        open={showTemplates}
        onOpenChange={(open) => {
          setShowTemplates(open);
          if (!open) clearTemplateEditor();
        }}
        templates={templates}
        defaultPromptId={defaultPromptId}
        templateName={templateName}
        templateContent={templateContent}
        templateQuery={templateQuery}
        editingTemplateId={editingTemplateId}
        draftName={draftName}
        draftContent={draftContent}
        onTemplateNameChange={setTemplateName}
        onTemplateContentChange={setTemplateContent}
        onTemplateQueryChange={setTemplateQuery}
        onDraftNameChange={setDraftName}
        onDraftContentChange={setDraftContent}
        onAddTemplate={addTemplate}
        onSetDefault={setDefaultTemplate}
        onEditTemplate={openTemplateEditor}
        onDeleteTemplate={deleteTemplate}
        onCancelEdit={clearTemplateEditor}
        onSaveEdit={saveTemplateDraft}
      />

      <ProvidersModal
        open={showProviders}
        onOpenChange={setShowProviders}
        providers={registry.providers}
        defaultProviderId={registry.defaultProviderId}
        defaultModelId={defaultModelId}
        testStatus={testStatus}
        onAddProvider={addProvider}
        onRemoveProvider={removeProvider}
        onUpdateProvider={updateProvider}
        onSetProviderDefault={setDefaultModel}
        onSetGlobalDefault={setGlobalDefault}
        onTestProvider={handleTestProvider}
        onTestAll={handleTestAllProviders}
      />
    </div>
  );
}
