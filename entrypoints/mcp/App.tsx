import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { createTRPCProxyClient } from '@trpc/client';
import { browser, storage } from '#imports';
import { chromeLink } from 'trpc-browser/link';
import type { BackgroundRouter } from '../shared/backgroundRouter';
import type { OwnedTabsEntry } from '../shared/types';
import { Power, PlugZap, Camera, MousePointerClick, Play, Square, Download, Trash2, Moon, Sun, Monitor } from 'lucide-react';


const chromeApi = (globalThis.chrome ?? (browser as unknown as typeof chrome));
const STORAGE_KEY = 'surfingbro_sidepanel_state_v1';

type PromptTemplate = {
  id: string;
  name: string;
  content: string;
  createdAt: number;
};

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
    const port = chromeApi.runtime.connect({ name: 'mcp-ui' });
    return createTRPCProxyClient<BackgroundRouter>({
      links: [chromeLink({ port })],
    });
  }, []);
}

export default function App() {
  const client = useBackgroundClient();
  const [wsUrl, setWsUrl] = useState('ws://localhost:9099/ws');
  const [state, setState] = useState<any>(null);
  const [selector, setSelector] = useState('');
  const [tabs, setTabs] = useState<any[]>([]);
  const [ownedTabs, setOwnedTabs] = useState<OwnedTabsEntry[]>([]);
  const [targetTabId, setTargetTabId] = useState<number | null>(null);
  const [tabFilter, setTabFilter] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordingCount, setRecordingCount] = useState(0);
  const [recordedJson, setRecordedJson] = useState('');
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [defaultPromptId, setDefaultPromptId] = useState(DEFAULT_PROMPT_ID);
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [templateQuery, setTemplateQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const loadTemplates = async () => {
    const stored = await storage.getItem<{ templates?: PromptTemplate[]; defaultPromptId?: string; theme?: 'light' | 'dark' | 'system' }>(`local:${STORAGE_KEY}`);
    const nextTemplates = stored?.templates?.length ? stored.templates : [defaultTemplate()];
    setTemplates(nextTemplates);
    const resolvedDefault =
      stored?.defaultPromptId && nextTemplates.some(t => t.id === stored.defaultPromptId)
        ? stored.defaultPromptId
        : nextTemplates[0]?.id ?? DEFAULT_PROMPT_ID;
    setDefaultPromptId(resolvedDefault);
    if (stored?.theme) setTheme(stored.theme);
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

  const refresh = async () => {
    const data = await client.getState.query();
    setState(data);
    if (data?.wsUrl) setWsUrl(data.wsUrl);
    if (typeof data?.targetTabId === 'number') setTargetTabId(data.targetTabId);
    if (data?.targetTabId === null) setTargetTabId(null);
    if (typeof data?.recording === 'boolean') setRecording(data.recording);
    if (typeof data?.recordingCount === 'number') setRecordingCount(data.recordingCount);
    const list = await client.listTabs.query();
    setTabs(list);
    const owned = await client.listOwnedTabs.query();
    setOwnedTabs(owned);
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

  useEffect(() => {
    const unwatch = storage.watch<{ theme?: 'light' | 'dark' | 'system' }>(`local:${STORAGE_KEY}`, (next) => {
      if (next?.theme && next.theme !== theme) {
        setTheme(next.theme);
      }
    });
    return () => unwatch();
  }, [theme]);

  useEffect(() => {
    setHighlightIndex(0);
  }, [tabFilter, tabs.length]);

  const connect = async () => {
    await client.connect.mutate({ url: wsUrl });
    await refresh();
  };

  const disconnect = async () => {
    await client.disconnect.mutate();
    await refresh();
  };

  const snapshot = async () => {
    await client.sendSnapshot.mutate({});
    await refresh();
  };

  const setTarget = async (tabId: number | null) => {
    await client.setTargetTab.mutate({ tabId });
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

  const filteredTabs = tabs.filter((t) => {
    if (!tabFilter.trim()) return true;
    const q = tabFilter.toLowerCase();
    return (
      (t.title || '').toLowerCase().includes(q) ||
      (t.url || '').toLowerCase().includes(q) ||
      String(t.id).includes(q)
    );
  });

  const items = [{ id: null, title: 'Active tab', url: '' }, ...filteredTabs];

  const onTabListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = items[highlightIndex];
      if (item) {
        setTarget(item.id);
      }
    }
  };

  const click = async () => {
    if (!selector) return;
    await client.sendClick.mutate({ selector });
    await refresh();
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

  const setThemeAndPersist = async (next: 'light' | 'dark' | 'system') => {
    setTheme(next);
    await saveTheme(next);
  };

  return (
    <div className="max-w-5xl mx-auto grid gap-4 px-4 py-4">
      <div className="surface p-4">
        <h1>SurfingBro MCP Console</h1>
        <p>Bridge your MCP server to the active tab for agentic browsing.</p>
        <div className={`status ${state?.wsConnected ? 'connected' : ''}`}>
          <span className="dot" />
          {state?.wsConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="surface p-4">
        <h2>WebSocket</h2>
        <div className="row">
          <input value={wsUrl} onChange={(e) => setWsUrl(e.target.value)} className="min-w-[320px]" />
          <button onClick={connect} className="row">
            <PlugZap size={16} />
            Connect
          </button>
          <button className="secondary row" onClick={disconnect}>
            <Power size={16} />
            Disconnect
          </button>
        </div>
        {state?.lastError && <p>Last error: {state.lastError}</p>}
      </div>

      <div className="surface p-4">
        <h2>Appearance</h2>
        <div className="row">
          <button className={`secondary row ${theme === 'light' ? 'border border-ink-900' : ''}`} onClick={() => void setThemeAndPersist('light')}>
            <Sun size={16} />
            Light
          </button>
          <button className={`secondary row ${theme === 'dark' ? 'border border-ink-900' : ''}`} onClick={() => void setThemeAndPersist('dark')}>
            <Moon size={16} />
            Dark
          </button>
          <button className={`secondary row ${theme === 'system' ? 'border border-ink-900' : ''}`} onClick={() => void setThemeAndPersist('system')}>
            <Monitor size={16} />
            System
          </button>
        </div>
      </div>

      <div className="surface p-4">
        <h2>Actions</h2>
        <div className="row">
          <button onClick={snapshot} className="row">
            <Camera size={16} />
            Snapshot
          </button>
          <input placeholder="CSS selector" value={selector} onChange={(e) => setSelector(e.target.value)} className="min-w-[260px]" />
          <button onClick={click} className="row">
            <MousePointerClick size={16} />
            Click
          </button>
        </div>
      </div>

      <div className="surface p-4">
        <h2>System Prompt Templates</h2>
        <p>Manage client-side prompt templates used by the extension.</p>
        <div className="grid gap-2">
          <input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template name"
          />
          <textarea
            rows={4}
            value={templateContent}
            onChange={(e) => setTemplateContent(e.target.value)}
            placeholder="Template content"
          />
          <button onClick={addTemplate}>Add template</button>
        </div>
        <div className="grid gap-2">
          <input
            value={templateQuery}
            onChange={(e) => setTemplateQuery(e.target.value)}
            placeholder="Search templates"
          />
          {templates.length === 0 && <div className="muted">No templates yet.</div>}
          {templates
            .filter((t) => {
              const q = templateQuery.trim().toLowerCase();
              if (!q) return true;
              return t.name.toLowerCase().includes(q) || t.content.toLowerCase().includes(q);
            })
            .map((t) => (
            <div key={t.id} className="surface-soft p-3 grid gap-2">
              <div className="row justify-between">
                <input
                  value={t.name}
                  onChange={(e) => void updateTemplate(t.id, { name: e.target.value })}
                  className="min-w-[240px]"
                />
                <button className="secondary" onClick={() => setDefaultTemplate(t.id)}>
                  {defaultPromptId === t.id ? 'Default' : 'Set default'}
                </button>
              </div>
              <textarea
                rows={6}
                value={t.content}
                onChange={(e) => void updateTemplate(t.id, { content: e.target.value })}
              />
              <div className="row justify-between">
                <div className="muted">Created {new Date(t.createdAt).toLocaleString()}</div>
                <button className="secondary row" onClick={() => deleteTemplate(t.id)}>
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="surface p-4">
        <h2>Recorder</h2>
        <div className="row">
          <div className={`status ${recording ? 'connected' : ''}`}>
            <span className="dot" />
            {recording ? 'Recording' : 'Stopped'}
          </div>
          <span>{recordingCount} events</span>
        </div>
        <div className="row">
          <button onClick={startRecording} className="row">
            <Play size={16} />
            Start
          </button>
          <button className="secondary row" onClick={stopRecording}>
            <Square size={16} />
            Stop
          </button>
          <button className="secondary row" onClick={exportRecording}>
            <Download size={16} />
            Export
          </button>
          <button className="secondary row" onClick={clearRecording}>
            <Trash2 size={16} />
            Clear
          </button>
        </div>
        {recordedJson && (
          <textarea
            value={recordedJson}
            onChange={(e) => setRecordedJson(e.target.value)}
            rows={8}
            className="w-full"
          />
        )}
      </div>
      
      <div className="surface p-4">
        <h2>Tab Target</h2>
        <div className="row">
          <input
            placeholder="Filter tabs (title, URL, id)"
            value={tabFilter}
            onChange={(e) => setTabFilter(e.target.value)}
            className="min-w-[260px]"
          />
          <div
            className="grid gap-2 max-h-64 overflow-auto p-2 rounded-xl bg-black/5 dark:bg-white/5"
            tabIndex={0}
            onKeyDown={onTabListKeyDown}
          >
            <button
              className={[
                'grid gap-2 p-2 rounded-xl border border-black/10 bg-white text-left dark:border-white/10 dark:bg-mist-900/70',
                'grid-cols-[1fr_auto]',
                targetTabId === null ? 'border-ink-900 shadow-[0_0_0_1px_rgba(15,17,21,0.7)_inset] dark:border-white/70 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.7)_inset]' : '',
                highlightIndex === 0 ? 'outline outline-2 outline-accent-500 outline-offset-2' : '',
              ].join(' ')}
              onClick={() => setTarget(null)}
            >
              <span className="font-semibold inline-flex items-center gap-2 truncate min-w-0">Active tab</span>
            </button>
            {filteredTabs.map((t, i) => {
              const label = [t.title, t.url, String(t.id)].filter(Boolean).join(' ');
              const q = tabFilter.trim();
              let before = label;
              let match = '';
              let after = '';
              if (q) {
                const lowerLabel = label.toLowerCase();
                const lowerQ = q.toLowerCase();
                const idx = lowerLabel.indexOf(lowerQ);
                if (idx >= 0) {
                  before = label.slice(0, idx);
                  match = label.slice(idx, idx + q.length);
                  after = label.slice(idx + q.length);
                }
              }
              return (
                <button
                  key={t.id}
                  className={[
                    'grid gap-2 p-2 rounded-xl border border-black/10 bg-white text-left dark:border-white/10 dark:bg-mist-900/70',
                    'grid-cols-[1fr_auto]',
                    targetTabId === t.id ? 'border-ink-900 shadow-[0_0_0_1px_rgba(15,17,21,0.7)_inset] dark:border-white/70 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.7)_inset]' : '',
                    highlightIndex === i + 1 ? 'outline outline-2 outline-accent-500 outline-offset-2' : '',
                  ].join(' ')}
                  onClick={() => setTarget(t.id)}
                >
                  <span className="font-semibold inline-flex items-center gap-2 truncate min-w-0" title={t.title || 'Untitled'}>
                    {t.title || 'Untitled'}
                  </span>
                  <span className="text-xs text-ui-muted dark:text-ui-mutedDark">{t.id}</span>
                  <span className="text-xs text-ui-muted dark:text-ui-mutedDark truncate col-span-2" title={t.url}>
                    {match ? (
                      <>
                        {before}
                        <mark>{match}</mark>
                        {after}
                      </>
                    ) : (
                      label
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="surface p-4">
        <h2>Owned Tabs</h2>
        {ownedTabs.length === 0 && <p>No owned tabs yet.</p>}
        {ownedTabs.map((entry) => (
          <div key={entry.sessionId} className="mb-3">
            <div className="font-semibold mb-1.5">
              Session: {entry.sessionId}
            </div>
            {entry.tabs.length === 0 && <p className="m-0">No tabs.</p>}
            {entry.tabs.map((t) => (
              <button
                key={t.id}
                className={[
                  'grid gap-2 p-2 rounded-xl border border-black/10 bg-white text-left dark:border-white/10 dark:bg-mist-900/70',
                  'grid-cols-[1fr_auto]',
                  targetTabId === t.id ? 'border-ink-900 shadow-[0_0_0_1px_rgba(15,17,21,0.7)_inset] dark:border-white/70 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.7)_inset]' : '',
                ].join(' ')}
                onClick={() => setTarget(t.id)}
              >
                <span className="font-semibold inline-flex items-center gap-2 truncate min-w-0">
                  {t.title || 'Untitled'}
                  {targetTabId === t.id && <span className="text-[10px] uppercase tracking-widest bg-ink-900 text-white px-2 py-0.5 rounded-full">Target</span>}
                </span>
                <span className="text-xs text-ui-muted dark:text-ui-mutedDark truncate">{t.url}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="surface p-4">
        <h2>Last Command</h2>
        <pre>{JSON.stringify(state?.lastCommand, null, 2)}</pre>
      </div>

      <div className="surface p-4">
        <h2>Last Snapshot</h2>
        <pre>{JSON.stringify(state?.lastSnapshot, null, 2)}</pre>
      </div>
    </div>
  );
}
