import { createChromeHandler } from 'trpc-browser/adapter';
import { chromeLink } from 'trpc-browser/link';
import { createTRPCProxyClient } from '@trpc/client';

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

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === 'record_event' && recording) {
    const payload = message.payload as RecordedAction;
    if (payload?.type && payload?.timestamp) {
      recordedActions.push(payload);
    }
  }
});

async function getActiveTabId(): Promise<number | null> {
  if (targetTabId != null) return targetTabId;
  const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const tab = tabs.find(t => t.id != null && !t.url?.startsWith('chrome://') && !t.url?.startsWith('chrome-extension://'));
  return tab?.id ?? null;
}

async function listTabs() {
  const tabs = await chrome.tabs.query({});
  return tabs
    .filter(t => t.id != null && t.url && !t.url.startsWith('chrome://') && !t.url.startsWith('chrome-extension://'))
    .map(t => ({ id: t.id as number, title: t.title || 'Untitled', url: t.url || '' }));
}

function makeContentClient(tabId: number) {
  const port = chrome.tabs.connect(tabId, { name: 'mcp-content' });
  const client = createTRPCProxyClient<ContentRouter>({
    links: [chromeLink({ port })],
  });
  return { client, port };
}

async function handleClick(payload: ClickPayload): Promise<WSResponse> {
  const tabId = await getActiveTabId();
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.click.mutate({ selector: payload.selector });
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleSnapshot(payload: SnapshotPayload): Promise<WSResponse> {
  const tabId = await getActiveTabId();
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
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

async function handleScroll(payload: ScrollPayload): Promise<WSResponse> {
  const tabId = await getActiveTabId();
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
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

async function handleWaitForSelector(payload: WaitForSelectorPayload): Promise<WSResponse> {
  const tabId = await getActiveTabId();
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
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

async function handleNavigate(payload: NavigatePayload): Promise<WSResponse> {
  const tabId = await getActiveTabId();
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.navigate.mutate({ url: payload.url });
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleType(payload: TypePayload): Promise<WSResponse> {
  const tabId = await getActiveTabId();
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
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

async function handleEnter(payload: EnterPayload): Promise<WSResponse> {
  const tabId = await getActiveTabId();
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.enter.mutate({ selector: payload.selector, key: payload.key });
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleSelect(payload: SelectPayload): Promise<WSResponse> {
  const tabId = await getActiveTabId();
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
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

async function handleScreenshot(payload: ScreenshotPayload): Promise<WSResponse> {
  const tabId = await getActiveTabId();
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
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
    const tab = await chrome.tabs.get(tabId);
    const format = payload.format ?? 'png';
    const quality = payload.quality ?? 0.92;
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId!, {
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

async function handleBack(): Promise<WSResponse> {
  const tabId = await getActiveTabId();
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.back.mutate();
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleForward(): Promise<WSResponse> {
  const tabId = await getActiveTabId();
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.forward.mutate();
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleHover(payload: HoverPayload): Promise<WSResponse> {
  const tabId = await getActiveTabId();
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
  }
  const { client, port } = makeContentClient(tabId);
  try {
    const res = await client.hover.mutate({ selector: payload.selector });
    return { id: '', ok: res.ok !== false, error: res.error, errorCode: res.errorCode, data: res.data };
  } finally {
    port.disconnect();
  }
}

async function handleFind(payload: FindPayload): Promise<WSResponse> {
  const tabId = await getActiveTabId();
  if (!tabId) {
    return { id: '', ok: false, error: 'No active tab available', errorCode: 'NO_ACTIVE_TAB' };
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
      const res = await handler(cmd.payload);
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

const commandHandlers: Record<string, (payload: unknown) => Promise<WSResponse>> = {
  click: (payload) => handleClick(payload as ClickPayload),
  snapshot: (payload) => handleSnapshot(payload as SnapshotPayload),
  scroll: (payload) => handleScroll(payload as ScrollPayload),
  hover: (payload) => handleHover(payload as HoverPayload),
  type: (payload) => handleType(payload as TypePayload),
  enter: (payload) => handleEnter(payload as EnterPayload),
  select: (payload) => handleSelect(payload as SelectPayload),
  back: () => handleBack(),
  forward: () => handleForward(),
  waitForSelector: (payload) => handleWaitForSelector(payload as WaitForSelectorPayload),
  find: (payload) => handleFind(payload as FindPayload),
  navigate: (payload) => handleNavigate(payload as NavigatePayload),
  screenshot: (payload) => handleScreenshot(payload as ScreenshotPayload),
  start_recording: () => handleStartRecording(),
  stop_recording: () => handleStopRecording(),
  get_recording: () => handleGetRecording(),
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

async function routerStartRecording() {
  recording = true;
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { type: 'recording:set', enabled: true }).catch(() => {});
    }
  }
}

async function routerStopRecording() {
  recording = false;
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { type: 'recording:set', enabled: false }).catch(() => {});
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
  ws.onopen = () => {
    wsConnected = true;
    lastError = null;
  };
  ws.onclose = () => {
    wsConnected = false;
  };
  ws.onerror = () => {
    lastError = 'WebSocket error';
  };
  ws.onmessage = (event) => {
    try {
      const cmd = JSON.parse(event.data) as WSCommand;
      if (cmd?.id && cmd?.type) {
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
  sendClick: (selector) => handleClick({ selector }),
  sendSnapshot: (payload) => handleSnapshot(payload),
  listTabs: () => listTabs(),
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

createChromeHandler({
  router,
  onError: ({ error }) => {
    lastError = error.message;
  },
});
