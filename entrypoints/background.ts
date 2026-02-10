import { createChromeHandler } from 'trpc-browser/adapter';
import { chromeLink } from 'trpc-browser/link';
import { createTRPCProxyClient } from '@trpc/client';
import { browser, defineBackground } from '#imports';

import { createBackgroundRouter } from './shared/backgroundRouter';
import type { ContentRouter } from './shared/contentRouter';
import type {
  WSCommand,
  WSResponse,
  ClickPayload,
  SnapshotPayload,
  SnapshotData,
  ScrollPayload,
  WaitForSelectorPayload,
  NavigatePayload,
  TypePayload,
  HoverPayload,
  FindPayload,
  FindResponse,
  EnterPayload,
  SelectPayload,
  ScreenshotPayload,
  ScreenshotResponse,
  ScreenshotPrepResponse,
  RecordedAction,
  RecordingStateResponse,
  TabInfo,
  OwnedTabsEntry,
  OpenTabPayload,
  CloseTabPayload,
  ClaimTabPayload,
  ReleaseTabPayload,
  SetTabSharingPayload,
} from './shared/types';

let ws: WebSocket | null = null;
let wsUrl = 'ws://localhost:9099/ws';
let wsConnected = false;
let lastError: string | null = null;
let lastCommand: WSCommand | null = null;
let lastSnapshot: SnapshotData | null = null;
let targetTabId: number | null = null;
let recording = false;
let recordedActions: RecordedAction[] = [];
const LOCAL_SESSION_ID = 'sidepanel-local';
const tabOwners = new Map<number, TabOwnership>();
const sessionTabs = new Map<string, Set<number>>();

const chromeApi = (globalThis.chrome ?? (browser as unknown as typeof chrome));

const handleRuntimeMessage = (message: unknown) => {
  if ((message as any)?.type === 'record_event' && recording) {
    const payload = (message as any).payload as RecordedAction;
    if (payload?.type && payload?.timestamp) {
      recordedActions.push(payload);
    }
  }
};

async function getActiveTabId(preferredTabId?: number | null): Promise<number | null> {
  if (preferredTabId != null) return preferredTabId;
  if (targetTabId != null) return targetTabId;
  const tabs = await chromeApi.tabs.query({ active: true, lastFocusedWindow: true });
  const tab = tabs.find(t => t.id != null && !t.url?.startsWith('chrome://') && !t.url?.startsWith('chrome-extension://'));
  return tab?.id ?? null;
}

async function listTabs() {
  const tabs = await chromeApi.tabs.query({});
  return tabs
    .filter(t => t.id != null && t.url && !t.url.startsWith('chrome://') && !t.url.startsWith('chrome-extension://'))
    .map(t => ({ id: t.id as number, title: t.title || 'Untitled', url: t.url || '' }));
}

async function listOwnedTabs(): Promise<OwnedTabsEntry[]> {
  const tabs = await listTabs();
  const tabMap = new Map<number, TabInfo>();
  for (const tab of tabs) tabMap.set(tab.id, tab);
  const entries: OwnedTabsEntry[] = [];
  for (const [sessionId, set] of sessionTabs) {
    const owned: TabInfo[] = [];
    for (const tabId of set) {
      const info = tabMap.get(tabId);
      if (info && allowTabAccess(tabId, sessionId)) {
        owned.push(info);
      }
    }
    entries.push({ sessionId, tabs: owned });
  }
  return entries;
}

type TabOwnership = {
  mode: 'exclusive' | 'shared';
  owners: Set<string>;
  allowShared: boolean;
};

function getOwner(tabId: number): TabOwnership | undefined {
  return tabOwners.get(tabId);
}

function ensureOwner(tabId: number, sessionId: string, mode: 'exclusive' | 'shared') {
  const ownership = tabOwners.get(tabId);
  if (!ownership) {
    tabOwners.set(tabId, { mode, owners: new Set([sessionId]), allowShared: false });
    addSessionTab(sessionId, tabId);
    return;
  }
  if (mode === 'shared') {
    ownership.mode = 'shared';
    ownership.owners.add(sessionId);
  } else {
    ownership.mode = 'exclusive';
    ownership.owners = new Set([sessionId]);
  }
  addSessionTab(sessionId, tabId);
}

function releaseOwner(tabId: number, sessionId: string) {
  const ownership = tabOwners.get(tabId);
  if (!ownership) return;
  ownership.owners.delete(sessionId);
  removeSessionTab(sessionId, tabId);
  if (ownership.owners.size === 0) {
    tabOwners.delete(tabId);
  } else if (ownership.mode === 'exclusive') {
    const next = ownership.owners.values().next().value;
    ownership.owners = new Set([next]);
  }
}

function allowTabAccess(tabId: number, sessionId: string): boolean {
  const ownership = tabOwners.get(tabId);
  if (!ownership) return false;
  return ownership.owners.has(sessionId);
}

async function getLocalTabId(tabIdOverride?: number | null): Promise<number | null> {
  const tabId = await getActiveTabId(tabIdOverride);
  if (!tabId) return null;
  if (!allowTabAccess(tabId, LOCAL_SESSION_ID)) {
    ensureOwner(tabId, LOCAL_SESSION_ID, 'exclusive');
  }
  return tabId;
}

async function handleClickLocal(payload: ClickPayload): Promise<WSResponse> {
  const tabId = await getLocalTabId();
  if (!tabId) return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  return handleClick(payload, tabId, LOCAL_SESSION_ID);
}

async function handleSnapshotLocal(payload: SnapshotPayload): Promise<WSResponse> {
  const tabId = await getLocalTabId();
  if (!tabId) return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  return handleSnapshot(payload, tabId, LOCAL_SESSION_ID);
}

async function handleNavigateLocal(payload: NavigatePayload): Promise<WSResponse> {
  const tabId = await getLocalTabId();
  if (!tabId) return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  return handleNavigate(payload, tabId, LOCAL_SESSION_ID);
}

async function handleTypeLocal(payload: TypePayload): Promise<WSResponse> {
  const tabId = await getLocalTabId();
  if (!tabId) return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  return handleType(payload, tabId, LOCAL_SESSION_ID);
}

async function handleEnterLocal(payload: EnterPayload): Promise<WSResponse> {
  const tabId = await getLocalTabId();
  if (!tabId) return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  return handleEnter(payload, tabId, LOCAL_SESSION_ID);
}

async function handleSelectLocal(payload: SelectPayload): Promise<WSResponse> {
  const tabId = await getLocalTabId();
  if (!tabId) return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  return handleSelect(payload, tabId, LOCAL_SESSION_ID);
}

async function handleScrollLocal(payload: ScrollPayload): Promise<WSResponse> {
  const tabId = await getLocalTabId();
  if (!tabId) return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  return handleScroll(payload, tabId, LOCAL_SESSION_ID);
}

async function handleWaitForSelectorLocal(payload: WaitForSelectorPayload): Promise<WSResponse> {
  const tabId = await getLocalTabId();
  if (!tabId) return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  return handleWaitForSelector(payload, tabId, LOCAL_SESSION_ID);
}

async function handleFindLocal(payload: FindPayload): Promise<WSResponse> {
  const tabId = await getLocalTabId();
  if (!tabId) return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  return handleFind(payload, tabId, LOCAL_SESSION_ID);
}

async function handleHoverLocal(payload: HoverPayload): Promise<WSResponse> {
  const tabId = await getLocalTabId();
  if (!tabId) return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  return handleHover(payload, tabId, LOCAL_SESSION_ID);
}

async function handleBackLocal(): Promise<WSResponse> {
  const tabId = await getLocalTabId();
  if (!tabId) return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  return handleBack(tabId, LOCAL_SESSION_ID);
}

async function handleForwardLocal(): Promise<WSResponse> {
  const tabId = await getLocalTabId();
  if (!tabId) return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  return handleForward(tabId, LOCAL_SESSION_ID);
}

async function handleScreenshotLocal(payload: ScreenshotPayload): Promise<WSResponse> {
  const tabId = await getLocalTabId();
  if (!tabId) return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  return handleScreenshot(payload, tabId, LOCAL_SESSION_ID);
}

function addSessionTab(sessionId: string, tabId: number) {
  const set = sessionTabs.get(sessionId) ?? new Set<number>();
  set.add(tabId);
  sessionTabs.set(sessionId, set);
}

function removeSessionTab(sessionId: string, tabId: number) {
  const set = sessionTabs.get(sessionId);
  if (!set) return;
  set.delete(tabId);
  if (set.size === 0) {
    sessionTabs.delete(sessionId);
  }
}

function releaseSession(sessionId: string) {
  const set = sessionTabs.get(sessionId);
  if (!set) return;
  for (const tabId of set) {
    releaseOwner(tabId, sessionId);
  }
  sessionTabs.delete(sessionId);
}

function requireSession(cmd: WSCommand): string | null {
  const sessionId = (cmd as any).sessionId as string | undefined;
  if (!sessionId || !sessionId.trim()) {
    return null;
  }
  return sessionId;
}

function makeContentClient(tabId: number) {
  const port = chromeApi.tabs.connect(tabId, { name: 'mcp-content' });
  const client = createTRPCProxyClient<ContentRouter>({
    links: [chromeLink({ port })],
  });
  return { client, port };
}

async function handleClick(payload: ClickPayload, tabIdOverride?: number | null, sessionId?: string | null): Promise<WSResponse> {
  const tabId = await getActiveTabId(tabIdOverride);
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  if (!sessionId || !allowTabAccess(tabId, sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.click.mutate({ selector: payload.selector });
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleSnapshot(payload: SnapshotPayload, tabIdOverride?: number | null, sessionId?: string | null): Promise<WSResponse> {
  const tabId = await getActiveTabId(tabIdOverride);
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  if (!sessionId || !allowTabAccess(tabId, sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const data = await client.snapshot.query({
      includeHidden: payload.includeHidden,
      maxElements: payload.maxElements,
      maxText: payload.maxText,
      includeHTML: payload.includeHTML,
      maxHTML: payload.maxHTML,
      maxHTMLTokens: payload.maxHTMLTokens,
    });
    lastSnapshot = data;
    return { id: '', ok: true, data };
  } finally {
    port.disconnect();
  }
}

async function handleScroll(payload: ScrollPayload, tabIdOverride?: number | null, sessionId?: string | null): Promise<WSResponse> {
  const tabId = await getActiveTabId(tabIdOverride);
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  if (!sessionId || !allowTabAccess(tabId, sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.scroll.mutate({
      deltaX: payload.deltaX,
      deltaY: payload.deltaY,
      selector: payload.selector,
      behavior: payload.behavior,
      block: payload.block,
    });
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleWaitForSelector(payload: WaitForSelectorPayload, tabIdOverride?: number | null, sessionId?: string | null): Promise<WSResponse> {
  const tabId = await getActiveTabId(tabIdOverride);
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  if (!sessionId || !allowTabAccess(tabId, sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.waitForSelector.mutate({
      selector: payload.selector,
      timeoutMs: payload.timeoutMs,
    });
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleNavigate(payload: NavigatePayload, tabIdOverride?: number | null, sessionId?: string | null): Promise<WSResponse> {
  const tabId = await getActiveTabId(tabIdOverride);
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  if (!sessionId || !allowTabAccess(tabId, sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.navigate.mutate({ url: payload.url });
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleType(payload: TypePayload, tabIdOverride?: number | null, sessionId?: string | null): Promise<WSResponse> {
  const tabId = await getActiveTabId(tabIdOverride);
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  if (!sessionId || !allowTabAccess(tabId, sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.type.mutate({
      selector: payload.selector,
      text: payload.text,
      pressEnter: payload.pressEnter,
    });
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleEnter(payload: EnterPayload, tabIdOverride?: number | null, sessionId?: string | null): Promise<WSResponse> {
  const tabId = await getActiveTabId(tabIdOverride);
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  if (!sessionId || !allowTabAccess(tabId, sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.enter.mutate({ selector: payload.selector, key: payload.key });
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleSelect(payload: SelectPayload, tabIdOverride?: number | null, sessionId?: string | null): Promise<WSResponse> {
  const tabId = await getActiveTabId(tabIdOverride);
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  if (!sessionId || !allowTabAccess(tabId, sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.select.mutate({
      selector: payload.selector,
      value: payload.value,
      label: payload.label,
      index: payload.index,
      values: payload.values,
      labels: payload.labels,
      indices: payload.indices,
      matchMode: payload.matchMode,
      toggle: payload.toggle,
    });
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleScreenshot(payload: ScreenshotPayload, tabIdOverride?: number | null, sessionId?: string | null): Promise<WSResponse> {
  const tabId = await getActiveTabId(tabIdOverride);
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  if (!sessionId || !allowTabAccess(tabId, sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const prep = await client.screenshotPrep.mutate({
      selector: payload.selector,
      padding: payload.padding,
      format: payload.format,
      quality: payload.quality,
      maxWidth: payload.maxWidth,
      maxHeight: payload.maxHeight,
    });
    if (!prep.ok) {
      return { id: '', ok: false, error: prep.error || 'Screenshot prep failed', errorCode: prep.errorCode };
    }
    const rectData = prep.data as ScreenshotPrepResponse;
    const tab = await chromeApi.tabs.get(tabId);
    const format = payload.format ?? 'png';
    const quality = payload.quality ?? 0.92;
    const dataUrl = await chromeApi.tabs.captureVisibleTab(tab.windowId!, {
      format,
      quality: format === 'jpeg' ? Math.round(quality * 100) : undefined,
    });
    const cropped = await cropDataUrl(
      dataUrl,
      rectData.rect,
      rectData.dpr,
      format,
      quality,
      payload.maxWidth,
      payload.maxHeight
    );
    const response: ScreenshotResponse = {
      selector: payload.selector || 'viewport',
      dataUrl: cropped.dataUrl,
      width: cropped.width,
      height: cropped.height,
      format,
    };
    return { id: '', ok: true, data: response };
  } catch (err: any) {
    return { id: '', ok: false, error: err?.message || 'Screenshot failed', errorCode: 'SCREENSHOT_FAILED' };
  } finally {
    port.disconnect();
  }
}

async function handleBack(tabIdOverride?: number | null, sessionId?: string | null): Promise<WSResponse> {
  const tabId = await getActiveTabId(tabIdOverride);
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  if (!sessionId || !allowTabAccess(tabId, sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.back.mutate();
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleForward(tabIdOverride?: number | null, sessionId?: string | null): Promise<WSResponse> {
  const tabId = await getActiveTabId(tabIdOverride);
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  if (!sessionId || !allowTabAccess(tabId, sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.forward.mutate();
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleHover(payload: HoverPayload, tabIdOverride?: number | null, sessionId?: string | null): Promise<WSResponse> {
  const tabId = await getActiveTabId(tabIdOverride);
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  if (!sessionId || !allowTabAccess(tabId, sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.hover.mutate({ selector: payload.selector });
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleFind(payload: FindPayload, tabIdOverride?: number | null, sessionId?: string | null): Promise<WSResponse> {
  const tabId = await getActiveTabId(tabIdOverride);
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  if (!sessionId || !allowTabAccess(tabId, sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.find.mutate({
      text: payload.text,
      limit: payload.limit,
      radius: payload.radius,
      caseSensitive: payload.caseSensitive,
    });
    if (!res.ok) {
      return { id: '', ok: false, error: res.error || 'Find failed', errorCode: res.errorCode };
    }
    return { id: '', ok: true, data: res.data as FindResponse };
  } finally {
    port.disconnect();
  }
}

async function handleCommand(cmd: WSCommand) {
  lastCommand = cmd;
  let resp: WSResponse = { id: cmd.id, ok: false, error: 'Unknown command' };
  try {
    const handler = commandHandlers[cmd.type];
    if (!handler) {
      resp = { id: cmd.id, ok: false, error: `Unsupported command: ${cmd.type}`, errorCode: 'UNSUPPORTED_COMMAND' };
    } else {
      const sessionId = requireSession(cmd);
      const res = await handler(cmd.payload, cmd.tabId ?? null, sessionId);
      resp = { ...res, id: cmd.id };
    }
  } catch (err: any) {
    resp = { id: cmd.id, ok: false, error: err?.message || 'Command failed', errorCode: 'COMMAND_FAILED' };
  }
  sendWS(resp);
}

const notImplemented = async (name: string): Promise<WSResponse> => ({
  id: '',
  ok: false,
  error: `${name} not implemented`,
  errorCode: 'NOT_IMPLEMENTED',
});

const commandHandlers: Record<string, (payload: unknown, tabId: number | null, sessionId: string | null) => Promise<WSResponse>> = {
  click: (payload, tabId, sessionId) => handleClick(payload as ClickPayload, tabId, sessionId),
  snapshot: (payload, tabId, sessionId) => handleSnapshot(payload as SnapshotPayload, tabId, sessionId),
  scroll: (payload, tabId, sessionId) => handleScroll(payload as ScrollPayload, tabId, sessionId),
  hover: (payload, tabId, sessionId) => handleHover(payload as HoverPayload, tabId, sessionId),
  type: (payload, tabId, sessionId) => handleType(payload as TypePayload, tabId, sessionId),
  enter: (payload, tabId, sessionId) => handleEnter(payload as EnterPayload, tabId, sessionId),
  select: (payload, tabId, sessionId) => handleSelect(payload as SelectPayload, tabId, sessionId),
  back: (_payload, tabId, sessionId) => handleBack(tabId, sessionId),
  forward: (_payload, tabId, sessionId) => handleForward(tabId, sessionId),
  waitForSelector: (payload, tabId, sessionId) => handleWaitForSelector(payload as WaitForSelectorPayload, tabId, sessionId),
  find: (payload, tabId, sessionId) => handleFind(payload as FindPayload, tabId, sessionId),
  navigate: (payload, tabId, sessionId) => handleNavigate(payload as NavigatePayload, tabId, sessionId),
  screenshot: (payload, tabId, sessionId) => handleScreenshot(payload as ScreenshotPayload, tabId, sessionId),
  start_recording: (_payload, tabId, sessionId) => handleStartRecording(),
  stop_recording: (_payload, tabId, sessionId) => handleStopRecording(),
  get_recording: (_payload, tabId, sessionId) => handleGetRecording(),
  list_tabs: (_payload, tabId, sessionId) => handleListTabs(sessionId),
  open_tab: (payload, _tabId, sessionId) => handleOpenTab(payload as OpenTabPayload, sessionId),
  close_tab: (payload, _tabId, sessionId) => handleCloseTab(payload as CloseTabPayload, sessionId),
  claim_tab: (payload, _tabId, sessionId) => handleClaimTab(payload as ClaimTabPayload, sessionId),
  release_tab: (payload, _tabId, sessionId) => handleReleaseTab(payload as ReleaseTabPayload, sessionId),
  set_tab_sharing: (payload, _tabId, sessionId) => handleSetTabSharing(payload as SetTabSharingPayload, sessionId),
};

async function handleStartRecording(): Promise<WSResponse> {
  await routerStartRecording();
  const data: RecordingStateResponse = { recording: true, count: recordedActions.length };
  return { id: '', ok: true, data };
}

async function handleStopRecording(): Promise<WSResponse> {
  await routerStopRecording();
  const data: RecordingStateResponse = { recording: false, count: recordedActions.length };
  return { id: '', ok: true, data };
}

async function handleGetRecording(): Promise<WSResponse> {
  return { id: '', ok: true, data: recordedActions };
}

async function handleListTabs(sessionId: string | null): Promise<WSResponse> {
  if (!sessionId) {
    return { id: '', ok: false, error: 'Session id is required', errorCode: 'SESSION_REQUIRED' };
  }
  const tabs = await listTabs();
  const scoped = tabs.filter(tab => allowTabAccess(tab.id, sessionId));
  return { id: '', ok: true, data: scoped as TabInfo[] };
}

async function handleOpenTab(payload: OpenTabPayload, sessionId: string | null): Promise<WSResponse> {
  if (!sessionId) {
    return { id: '', ok: false, error: 'Session id is required', errorCode: 'SESSION_REQUIRED' };
  }
  const tab = await chromeApi.tabs.create({
    url: payload.url || 'about:blank',
    active: payload.active ?? true,
    pinned: payload.pinned ?? false,
  });
  if (!tab?.id) {
    return { id: '', ok: false, error: 'Failed to open tab', errorCode: 'TAB_CREATE_FAILED' };
  }
  ensureOwner(tab.id, sessionId, 'exclusive');
  const info: TabInfo = { id: tab.id, title: tab.title || 'Untitled', url: tab.url || payload.url || '' };
  return { id: '', ok: true, data: info };
}

async function handleCloseTab(payload: CloseTabPayload, sessionId: string | null): Promise<WSResponse> {
  if (!sessionId) {
    return { id: '', ok: false, error: 'Session id is required', errorCode: 'SESSION_REQUIRED' };
  }
  if (!payload?.tabId) {
    return { id: '', ok: false, error: 'tabId is required', errorCode: 'TAB_ID_REQUIRED' };
  }
  if (!allowTabAccess(payload.tabId, sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  await chromeApi.tabs.remove(payload.tabId);
  tabOwners.delete(payload.tabId);
  return { id: '', ok: true };
}

async function handleClaimTab(payload: ClaimTabPayload, sessionId: string | null): Promise<WSResponse> {
  if (!sessionId) {
    return { id: '', ok: false, error: 'Session id is required', errorCode: 'SESSION_REQUIRED' };
  }
  let tabId = payload?.tabId ?? 0;
  if (tabId === 0 && payload?.requireActive) {
    const activeTabs = await chromeApi.tabs.query({ active: true, lastFocusedWindow: true });
    tabId = activeTabs.find(t => t.id != null)?.id ?? 0;
  }
  if (!tabId) {
    return { id: '', ok: false, error: 'tabId is required', errorCode: 'TAB_ID_REQUIRED' };
  }
  const tab = await chromeApi.tabs.get(tabId).catch(() => null);
  if (!tab?.id) {
    return { id: '', ok: false, error: 'Tab not found', errorCode: 'TAB_NOT_FOUND' };
  }
  if (payload.requireActive) {
    const activeTabs = await chromeApi.tabs.query({ active: true, lastFocusedWindow: true });
    const activeId = activeTabs.find(t => t.id != null)?.id;
    if (activeId !== tab.id) {
      return { id: '', ok: false, error: 'Tab is not active', errorCode: 'TAB_NOT_ACTIVE' };
    }
  }
  const mode = payload.mode === 'shared' ? 'shared' : 'exclusive';
  const ownership = getOwner(tab.id);
  if (!ownership && mode === 'shared') {
    return { id: '', ok: false, error: 'Tab must be owned before sharing', errorCode: 'TAB_NOT_OWNED' };
  }
  if (ownership && !ownership.owners.has(sessionId)) {
    if (mode === 'exclusive') {
      return { id: '', ok: false, error: 'Tab owned by another session', errorCode: 'TAB_NOT_OWNED' };
    }
    if (!ownership.allowShared) {
      return { id: '', ok: false, error: 'Tab not shareable', errorCode: 'TAB_NOT_SHAREABLE' };
    }
  }
  if (mode === 'shared' && ownership) {
    ownership.allowShared = true;
    ownership.mode = 'shared';
    for (const owner of ownership.owners) {
      ensureOwner(tab.id, owner, 'shared');
    }
  }
  ensureOwner(tab.id, sessionId, mode);
  const info: TabInfo = { id: tab.id, title: tab.title || 'Untitled', url: tab.url || '' };
  return { id: '', ok: true, data: info };
}

async function handleReleaseTab(payload: ReleaseTabPayload, sessionId: string | null): Promise<WSResponse> {
  if (!sessionId) {
    return { id: '', ok: false, error: 'Session id is required', errorCode: 'SESSION_REQUIRED' };
  }
  if (!payload?.tabId) {
    return { id: '', ok: false, error: 'tabId is required', errorCode: 'TAB_ID_REQUIRED' };
  }
  releaseOwner(payload.tabId, sessionId);
  return { id: '', ok: true };
}

async function handleSetTabSharing(payload: SetTabSharingPayload, sessionId: string | null): Promise<WSResponse> {
  if (!sessionId) {
    return { id: '', ok: false, error: 'Session id is required', errorCode: 'SESSION_REQUIRED' };
  }
  if (!payload?.tabId) {
    return { id: '', ok: false, error: 'tabId is required', errorCode: 'TAB_ID_REQUIRED' };
  }
  const ownership = getOwner(payload.tabId);
  if (!ownership || !ownership.owners.has(sessionId)) {
    return { id: '', ok: false, error: 'Tab not owned by session', errorCode: 'TAB_NOT_OWNED' };
  }
  if (!payload.allowShared && ownership.owners.size > 1) {
    return { id: '', ok: false, error: 'Multiple owners exist', errorCode: 'TAB_SHARED_ACTIVE' };
  }
  ownership.allowShared = payload.allowShared;
  if (!payload.allowShared) {
    ownership.mode = 'exclusive';
  }
  return { id: '', ok: true };
}

async function routerStartRecording() {
  recording = true;
  const tabs = await chromeApi.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      chromeApi.tabs.sendMessage(tab.id, { type: 'recording:set', enabled: true }).catch(() => {});
    }
  }
}

async function routerStopRecording() {
  recording = false;
  const tabs = await chromeApi.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      chromeApi.tabs.sendMessage(tab.id, { type: 'recording:set', enabled: false }).catch(() => {});
    }
  }
}

async function cropDataUrl(
  dataUrl: string,
  rect: { x: number; y: number; width: number; height: number },
  dpr: number,
  format: 'png' | 'jpeg',
  quality: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<{ dataUrl: string; width: number; height: number }> {
  if (typeof OffscreenCanvas === 'undefined') {
    throw new Error('OffscreenCanvas is not available');
  }
  const blob = await (await fetch(dataUrl)).blob();
  const bitmap = await createImageBitmap(blob);

  let sx = Math.max(0, rect.x * dpr);
  let sy = Math.max(0, rect.y * dpr);
  let sw = Math.max(1, rect.width * dpr);
  let sh = Math.max(1, rect.height * dpr);
  if (sx + sw > bitmap.width) sw = bitmap.width - sx;
  if (sy + sh > bitmap.height) sh = bitmap.height - sy;
  if (sw <= 0 || sh <= 0) {
    throw new Error('Crop bounds invalid');
  }

  let outW = sw;
  let outH = sh;
  const scale = computeScale(outW, outH, maxWidth, maxHeight);
  outW = Math.max(1, Math.round(outW * scale));
  outH = Math.max(1, Math.round(outH * scale));

  const canvas = new OffscreenCanvas(outW, outH);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not available');
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, outW, outH);

  const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const blobOut = await canvas.convertToBlob({ type: mime, quality: format === 'jpeg' ? quality : undefined });
  const outUrl = await blobToDataUrl(blobOut);
  return { dataUrl: outUrl, width: outW, height: outH };
}

function computeScale(w: number, h: number, maxW?: number, maxH?: number): number {
  let scale = 1;
  if (maxW && w > maxW) {
    scale = Math.min(scale, maxW / w);
  }
  if (maxH && h > maxH) {
    scale = Math.min(scale, maxH / h);
  }
  return scale;
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

function sendWS(resp: WSResponse) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify(resp));
}

function connect(url: string) {
  if (ws) ws.close();
  wsUrl = url;
  ws = new WebSocket(url);
  const sessionIds = new Set<string>();
  ws.onopen = () => {
    wsConnected = true;
    lastError = null;
  };
  ws.onclose = () => {
    wsConnected = false;
    for (const sessionId of sessionIds) {
      releaseSession(sessionId);
    }
  };
  ws.onerror = () => {
    lastError = 'WebSocket error';
  };
  ws.onmessage = (event) => {
    try {
      const cmd = JSON.parse(event.data) as WSCommand;
      if (cmd?.id && cmd?.type) {
        if (cmd.sessionId) sessionIds.add(cmd.sessionId);
        void handleCommand(cmd);
      }
    } catch (err: any) {
      lastError = err?.message || 'Invalid message';
    }
  };
}

function disconnect() {
  if (ws) {
    ws.close();
    ws = null;
  }
  wsConnected = false;
}

const router = createBackgroundRouter({
  getState: () => ({
    wsUrl,
    wsConnected,
    lastError,
    lastCommand,
    lastSnapshot,
    targetTabId,
    recording,
    recordingCount: recordedActions.length,
  }),
  connect,
  disconnect,
  sendClick: (selector) => handleClickLocal({ selector }),
  sendSnapshot: (payload) => handleSnapshotLocal(payload),
  sendNavigate: (url) => handleNavigateLocal({ url }),
  sendType: (payload) => handleTypeLocal(payload),
  sendEnter: (payload) => handleEnterLocal(payload),
  sendSelect: (payload) => handleSelectLocal(payload),
  sendScroll: (payload) => handleScrollLocal(payload),
  sendWaitForSelector: (payload) => handleWaitForSelectorLocal(payload),
  sendFind: (payload) => handleFindLocal(payload),
  sendHover: (payload) => handleHoverLocal(payload),
  sendBack: () => handleBackLocal(),
  sendForward: () => handleForwardLocal(),
  sendScreenshot: (payload) => handleScreenshotLocal(payload),
  listTabs: () => listTabs(),
  listOwnedTabs: () => listOwnedTabs(),
  setTargetTab: (tabId) => {
    targetTabId = tabId;
  },
  startRecording: async () => {
    await routerStartRecording();
  },
  stopRecording: async () => {
    await routerStopRecording();
  },
  clearRecording: () => {
    recordedActions = [];
  },
  getRecording: () => recordedActions,
});

const safeCreateChromeHandler = () => {
  try {
    createChromeHandler({
      router,
      onError: ({ error }) => {
        lastError = error.message;
      },
      chrome: chromeApi,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('not implemented')) {
      console.warn('Skipping chrome handler creation: runtime onConnect not implemented');
      return;
    }
    throw err;
  }
};

export default defineBackground(() => {
  chromeApi.sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: true }).catch(() => {});
  chromeApi.runtime.onMessage.addListener(handleRuntimeMessage);
  chromeApi.tabs.onRemoved.addListener((tabId) => {
    tabOwners.delete(tabId);
    for (const [sessionId, set] of sessionTabs) {
      if (set.has(tabId)) {
        removeSessionTab(sessionId, tabId);
      }
    }
  });
  safeCreateChromeHandler();
});
