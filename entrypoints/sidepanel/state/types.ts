export type Role = 'system' | 'user' | 'assistant';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  meta?: {
    debug?: string;
    toolSteps?: string[];
  };
};

export type ContextType = 'tab' | 'file' | 'bookmark' | 'history' | 'memory';

export type ContextItem = {
  id: string;
  type: ContextType;
  title: string;
  content: string;
  createdAt: number;
  pinned?: boolean;
};

export type ChatSession = {
  id: string;
  title: string;
  systemPromptId: string;
  messages: ChatMessage[];
  contexts: ContextItem[];
  createdAt: number;
  modelProviderId?: string;
  modelId?: string;
};

export type MemoryItem = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
};

export type PromptTemplate = {
  id: string;
  name: string;
  content: string;
  createdAt: number;
};

export type StoredState = {
  sessions: ChatSession[];
  activeSessionId: string | null;
  memories: MemoryItem[];
  templates?: PromptTemplate[];
  defaultPromptId?: string;
  theme?: ThemeMode;
  mcpStreamUrl?: string;
  mcpToken?: string;
  mcpClientName?: string;
  mcpClientId?: string;
};

export type TabOption = {
  id: number;
  title: string;
  url: string;
};

export type BookmarkOption = {
  id: string;
  title: string;
  url: string;
};

export type HistoryOption = {
  id: string;
  title: string;
  url: string;
  lastVisitTime?: number;
};

export const STORAGE_KEY = 'surfingbro_sidepanel_state_v1';

export const DEFAULT_PROMPT_ID = 'default-browsing-v1';

export const defaultTemplate = (): PromptTemplate => ({
  id: DEFAULT_PROMPT_ID,
  name: 'Browsing Agent (Strict)',
  content:
    'You are a precise MCP browsing agent. Begin each turn by running a snapshot (or screenshot when necessary) before thinking, describing the task, or issuing any action. ' +
    'Describe the page, break the user’s goal into explicit subtasks, and think through how to accomplish each one. ' +
    'Explain what is wrong if a task cannot proceed, then plan the next safe move. ' +
    'Do not guess page state; every assumption must be based on the snapshot/screenshot or DOM tools. ' +
    'Avoid logins, CAPTCHAs, or any personal-data actions; ask the user to intervene if those appear. ' +
    'If you hit blockers (missing permissions, unexpected structure), clearly describe the problem, the attempted steps, and the next safe move. ' +
    'Whenever you need the browser to change something, respond with only valid JSON containing a top-level "tool_calls" array; do not wrap commands in prose. ' +
    'Keep status updates short, factual, and tied to tool results.',
  createdAt: Date.now(),
});

export const defaultSession = (promptId: string): ChatSession => ({
  id: crypto.randomUUID(),
  title: 'New Session',
  systemPromptId: promptId,
  messages: [],
  contexts: [],
  createdAt: Date.now(),
});
