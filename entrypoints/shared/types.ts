export type WSCommandType =
  | 'click'
  | 'snapshot'
  | 'scroll'
  | 'hover'
  | 'type'
  | 'enter'
  | 'back'
  | 'forward'
  | 'waitForSelector'
  | 'find'
  | 'navigate'
  | 'select'
  | 'screenshot'
  | 'start_recording'
  | 'stop_recording'
  | 'get_recording'
  | 'list_tabs'
  | 'open_tab'
  | 'close_tab'
  | 'claim_tab'
  | 'release_tab'
  | 'set_tab_sharing';

export interface WSCommand {
  id: string;
  type: WSCommandType;
  sessionId?: string;
  tabId?: number;
  payload?: unknown;
}

export interface WSResponse {
  id: string;
  ok: boolean;
  error?: string;
  errorCode?: string;
  data?: unknown;
}

export interface RecordedAction {
  type: WSCommandType;
  payload: unknown;
  timestamp: number;
  url: string;
  title: string;
}

export interface TabInfo {
  id: number;
  title: string;
  url: string;
}

export interface OwnedTabsEntry {
  sessionId: string;
  tabs: TabInfo[];
}

export interface OpenTabPayload {
  url?: string;
  active?: boolean;
  pinned?: boolean;
}

export interface CloseTabPayload {
  tabId: number;
}

export interface ClaimTabPayload {
  tabId: number;
  mode?: 'exclusive' | 'shared';
  requireActive?: boolean;
}

export interface ReleaseTabPayload {
  tabId: number;
}

export interface SetTabSharingPayload {
  tabId: number;
  allowShared: boolean;
}

export interface RecordingStateResponse {
  recording: boolean;
  count: number;
}

export interface ClickPayload {
  selector: string;
}

export interface SnapshotPayload {
  includeHidden?: boolean;
  maxElements?: number;
  maxText?: number;
  includeHTML?: boolean;
  maxHTML?: number;
  maxHTMLTokens?: number;
}

export interface ScreenshotPayload {
  selector?: string;
  padding?: number;
  format?: 'png' | 'jpeg';
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface ScrollPayload {
  deltaX?: number;
  deltaY?: number;
  selector?: string;
  behavior?: 'auto' | 'smooth';
  block?: 'start' | 'center' | 'end' | 'nearest';
}

export interface HoverPayload {
  selector: string;
}

export interface TypePayload {
  selector: string;
  text: string;
  pressEnter?: boolean;
}

export interface EnterPayload {
  selector?: string;
  key?: string;
}

export interface SelectPayload {
  selector: string;
  value?: string;
  label?: string;
  index?: number;
  values?: string[];
  labels?: string[];
  indices?: number[];
  matchMode?: 'exact' | 'partial';
  toggle?: boolean;
}

export interface NavigatePayload {
  url: string;
}

export interface FindPayload {
  text: string;
  limit?: number;
  radius?: number;
  caseSensitive?: boolean;
}

export interface FindResultItem {
  index: number;
  snippet: string;
}

export interface FindResponse {
  query: string;
  limit: number;
  radius: number;
  caseSensitive: boolean;
  total: number;
  returned: number;
  results: FindResultItem[];
}

export interface ScrollResponse {
  deltaX: number;
  deltaY: number;
  selector?: string;
  behavior: 'auto' | 'smooth';
  block: 'start' | 'center' | 'end' | 'nearest';
}

export interface ClickResponse {
  selector: string;
}

export interface HoverResponse {
  selector: string;
}

export interface TypeResponse {
  selector: string;
  textLength: number;
  pressEnter: boolean;
}

export interface NavigateResponse {
  url: string;
}

export interface WaitForSelectorResponse {
  selector: string;
  timeoutMs: number;
  found: boolean;
}

export interface HistoryResponse {
  direction: 'back' | 'forward';
}

export interface EnterResponse {
  selector?: string;
  key: string;
  usedActiveElement: boolean;
}

export interface SelectResponse {
  selector: string;
  value: string;
  label?: string;
  index?: number;
  values?: string[];
  labels?: string[];
  indices?: number[];
  matchMode?: 'exact' | 'partial';
  toggle?: boolean;
  multiple?: boolean;
  selectedCount?: number;
}

export interface WaitForSelectorPayload {
  selector: string;
  timeoutMs?: number;
}

export interface ElementData {
  tag?: string;
  text?: string;
  selector?: string;
  href?: string;
  inputType?: string;
  name?: string;
  id?: string;
  ariaLabel?: string;
  title?: string;
  alt?: string;
  value?: string;
  placeholder?: string;
  context?: string;
}

export interface SnapshotData {
  url: string;
  title?: string;
  text?: string;
  html?: string;
  htmlLength?: number;
  truncatedHTML?: boolean;
  htmlEstimatedTokens?: number;
  elements?: ElementData[];
  elementCount?: number;
  textLength?: number;
  truncatedText?: boolean;
  truncatedElements?: boolean;
}

export interface ScreenshotResponse {
  selector: string;
  dataUrl: string;
  width: number;
  height: number;
  format: 'png' | 'jpeg';
}

export interface ScreenshotPrepResponse {
  selector: string;
  rect: { x: number; y: number; width: number; height: number };
  dpr: number;
}
