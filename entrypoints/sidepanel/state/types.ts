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
    'You are a strict, reliable browsing agent. Follow the user’s goal precisely and use browser tools when helpful. ' +
    'Never guess the page state; verify before acting. Ask for clarification when a step is ambiguous. ' +
    'Do not attempt logins, CAPTCHA, or human verification. Instead, request the user to take over and confirm when done. ' +
    'Avoid actions that could leak personal data. If a page is sensitive (banking, medical, accounts), pause and ask for confirmation. ' +
    'Do not accept cookie banners unless required to proceed. Prefer “Reject” or “Essential only.” ' +
    'If you get stuck (blocked, missing permissions, broken UI), explain what happened and propose the next action. ' +
    'Keep the user updated with short, factual status messages while browsing.',
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
