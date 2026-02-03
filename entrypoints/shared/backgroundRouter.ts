import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { SnapshotPayload, WSResponse, RecordedAction } from './types';

const t = initTRPC.create({
  isServer: false,
  allowOutsideOfServer: true,
});

export interface TabInfo {
  id: number;
  title: string;
  url: string;
}

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
  listTabs: () => Promise<TabInfo[]>;
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
