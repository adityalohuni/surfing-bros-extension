import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { createTRPCProxyClient } from '@trpc/client';
import { chromeLink } from 'trpc-browser/link';
import type { BackgroundRouter } from '../shared/backgroundRouter';

import './style.css';

function useBackgroundClient() {
  return useMemo(() => {
    const port = chrome.runtime.connect({ name: 'mcp-ui' });
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
  const [targetTabId, setTargetTabId] = useState<number | null>(null);
  const [tabFilter, setTabFilter] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordingCount, setRecordingCount] = useState(0);
  const [recordedJson, setRecordedJson] = useState('');

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
  };

  useEffect(() => {
    void refresh();
    const id = setInterval(refresh, 1500);
    return () => clearInterval(id);
  }, []);

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

  return (
    <div className="container">
      <div className="card">
        <h1>SurfingBro MCP Console</h1>
        <p>Bridge your MCP server to the active tab for agentic browsing.</p>
        <div className={`status ${state?.wsConnected ? 'connected' : ''}`}>
          <span className="dot" />
          {state?.wsConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="card">
        <h2>WebSocket</h2>
        <div className="row">
          <input value={wsUrl} onChange={(e) => setWsUrl(e.target.value)} style={{ minWidth: 320 }} />
          <button onClick={connect}>Connect</button>
          <button className="secondary" onClick={disconnect}>Disconnect</button>
        </div>
        {state?.lastError && <p>Last error: {state.lastError}</p>}
      </div>

      <div className="card">
        <h2>Actions</h2>
        <div className="row">
          <button onClick={snapshot}>Snapshot</button>
          <input placeholder="CSS selector" value={selector} onChange={(e) => setSelector(e.target.value)} style={{ minWidth: 260 }} />
          <button onClick={click}>Click</button>
        </div>
      </div>
      
      <div className="card">
        <h2>Recorder</h2>
        <div className="row">
          <div className={`status ${recording ? 'connected' : ''}`}>
            <span className="dot" />
            {recording ? 'Recording' : 'Stopped'}
          </div>
          <span>{recordingCount} events</span>
        </div>
        <div className="row">
          <button onClick={startRecording}>Start</button>
          <button className="secondary" onClick={stopRecording}>Stop</button>
          <button className="secondary" onClick={exportRecording}>Export</button>
          <button className="secondary" onClick={clearRecording}>Clear</button>
        </div>
        {recordedJson && (
          <textarea
            value={recordedJson}
            onChange={(e) => setRecordedJson(e.target.value)}
            rows={8}
            style={{ width: '100%' }}
          />
        )}
      </div>
      
      <div className="card">
        <h2>Tab Target</h2>
        <div className="row">
          <input
            placeholder="Filter tabs (title, URL, id)"
            value={tabFilter}
            onChange={(e) => setTabFilter(e.target.value)}
            style={{ minWidth: 260 }}
          />
          <div
            className="tab-list"
            tabIndex={0}
            onKeyDown={onTabListKeyDown}
          >
            <button
              className={`tab-item ${targetTabId === null ? 'active' : ''} ${highlightIndex === 0 ? 'focused' : ''}`}
              onClick={() => setTarget(null)}
            >
              <span className="tab-title">Active tab</span>
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
                  className={`tab-item ${targetTabId === t.id ? 'active' : ''} ${highlightIndex === i + 1 ? 'focused' : ''}`}
                  onClick={() => setTarget(t.id)}
                >
                  <span className="tab-title">{t.title || 'Untitled'}</span>
                  <span className="tab-meta">{t.id}</span>
                  <span className="tab-url">
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

      <div className="card">
        <h2>Last Command</h2>
        <pre>{JSON.stringify(state?.lastCommand, null, 2)}</pre>
      </div>

      <div className="card">
        <h2>Last Snapshot</h2>
        <pre>{JSON.stringify(state?.lastSnapshot, null, 2)}</pre>
      </div>
    </div>
  );
}
