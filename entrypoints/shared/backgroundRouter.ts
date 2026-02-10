import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { SnapshotPayload, WSResponse, RecordedAction, TabInfo, OwnedTabsEntry } from './types';

const t = initTRPC.create({
  isServer: false,
  allowOutsideOfServer: true,
});

export interface BackgroundState {
  wsUrl: string;
  wsConnected: boolean;
  lastError: string | null;
  lastCommand: unknown | null;
  lastSnapshot: unknown | null;
  targetTabId: number | null;
  recording: boolean;
  recordingCount: number;
}

export interface BackgroundHandlers {
  getState: () => BackgroundState;
  connect: (url: string) => void;
  disconnect: () => void;
  sendClick: (selector: string) => Promise<WSResponse>;
  sendSnapshot: (payload: SnapshotPayload) => Promise<WSResponse>;
  sendNavigate: (url: string) => Promise<WSResponse>;
  sendType: (payload: { selector: string; text: string; pressEnter?: boolean }) => Promise<WSResponse>;
  sendEnter: (payload: { selector?: string; key?: string }) => Promise<WSResponse>;
  sendSelect: (payload: { selector: string; value?: string; label?: string; index?: number; values?: string[]; labels?: string[]; indices?: number[] }) => Promise<WSResponse>;
  sendScroll: (payload: { deltaX?: number; deltaY?: number; selector?: string }) => Promise<WSResponse>;
  sendWaitForSelector: (payload: { selector: string; timeoutMs?: number }) => Promise<WSResponse>;
  sendFind: (payload: { selector: string }) => Promise<WSResponse>;
  sendHover: (payload: { selector: string }) => Promise<WSResponse>;
  sendBack: () => Promise<WSResponse>;
  sendForward: () => Promise<WSResponse>;
  sendScreenshot: (payload: { selector?: string; format?: 'png' | 'jpeg'; quality?: number; padding?: number }) => Promise<WSResponse>;
  listTabs: () => Promise<TabInfo[]>;
  listOwnedTabs: () => Promise<OwnedTabsEntry[]>;
  setTargetTab: (tabId: number | null) => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  clearRecording: () => void;
  getRecording: () => RecordedAction[];
}

export function createBackgroundRouter(handlers: BackgroundHandlers) {
  return t.router({
    getState: t.procedure.query(() => handlers.getState()),
    listTabs: t.procedure.query(() => handlers.listTabs()),
    listOwnedTabs: t.procedure.query(() => handlers.listOwnedTabs()),
    startRecording: t.procedure.mutation(async () => {
      await handlers.startRecording();
      return { ok: true };
    }),
    stopRecording: t.procedure.mutation(async () => {
      await handlers.stopRecording();
      return { ok: true };
    }),
    clearRecording: t.procedure.mutation(() => {
      handlers.clearRecording();
      return { ok: true };
    }),
    getRecording: t.procedure.query(() => handlers.getRecording()),
    setTargetTab: t.procedure
      .input(z.object({ tabId: z.number().int().nullable() }))
      .mutation(({ input }) => {
        handlers.setTargetTab(input.tabId);
        return { ok: true };
      }),
    connect: t.procedure.input(z.object({ url: z.string().min(1) })).mutation(({ input }) => {
      handlers.connect(input.url);
      return { ok: true };
    }),
    disconnect: t.procedure.mutation(() => {
      handlers.disconnect();
      return { ok: true };
    }),
    sendClick: t.procedure.input(z.object({ selector: z.string().min(1) })).mutation(({ input }) => {
      return handlers.sendClick(input.selector);
    }),
    sendNavigate: t.procedure.input(z.object({ url: z.string().min(1) })).mutation(({ input }) => {
      return handlers.sendNavigate(input.url);
    }),
    sendType: t.procedure.input(z.object({ selector: z.string().min(1), text: z.string(), pressEnter: z.boolean().optional() })).mutation(({ input }) => {
      return handlers.sendType(input);
    }),
    sendEnter: t.procedure.input(z.object({ selector: z.string().optional(), key: z.string().optional() })).mutation(({ input }) => {
      return handlers.sendEnter(input);
    }),
    sendSelect: t.procedure.input(z.object({
      selector: z.string().min(1),
      value: z.string().optional(),
      label: z.string().optional(),
      index: z.number().optional(),
      values: z.array(z.string()).optional(),
      labels: z.array(z.string()).optional(),
      indices: z.array(z.number()).optional(),
    })).mutation(({ input }) => handlers.sendSelect(input)),
    sendScroll: t.procedure.input(z.object({
      deltaX: z.number().optional(),
      deltaY: z.number().optional(),
      selector: z.string().optional(),
    })).mutation(({ input }) => handlers.sendScroll(input)),
    sendWaitForSelector: t.procedure.input(z.object({ selector: z.string().min(1), timeoutMs: z.number().optional() })).mutation(({ input }) => {
      return handlers.sendWaitForSelector(input);
    }),
    sendFind: t.procedure.input(z.object({ selector: z.string().min(1) })).mutation(({ input }) => handlers.sendFind(input)),
    sendHover: t.procedure.input(z.object({ selector: z.string().min(1) })).mutation(({ input }) => handlers.sendHover(input)),
    sendBack: t.procedure.mutation(() => handlers.sendBack()),
    sendForward: t.procedure.mutation(() => handlers.sendForward()),
    sendScreenshot: t.procedure.input(z.object({
      selector: z.string().optional(),
      format: z.enum(['png', 'jpeg']).optional(),
      quality: z.number().optional(),
      padding: z.number().optional(),
    })).mutation(({ input }) => handlers.sendScreenshot(input)),
    sendSnapshot: t.procedure
      .input(z.object({
        includeHidden: z.boolean().optional(),
        maxElements: z.number().optional(),
        maxText: z.number().optional(),
      }))
      .mutation(({ input }) => handlers.sendSnapshot(input)),
  });
}

export type BackgroundRouter = ReturnType<typeof createBackgroundRouter>;
