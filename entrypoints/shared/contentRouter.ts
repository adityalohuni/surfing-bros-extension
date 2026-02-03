import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { SnapshotData } from './types';
import {
  clickAction,
  snapshotAction,
  scrollAction,
  waitForSelectorAction,
  navigateAction,
  typeAction,
  backAction,
  forwardAction,
  hoverAction,
  findAction,
  enterAction,
  selectAction,
  screenshotPrepAction,
} from './contentActions';

const t = initTRPC.create({
  isServer: false,
  allowOutsideOfServer: true,
});

export const contentRouter = t.router({
  ping: t.procedure.query(() => ({ ok: true })),
  click: t.procedure
    .input(z.object({ selector: z.string().min(1) }))
    .mutation(({ input }) => clickAction(input)),
  scroll: t.procedure
    .input(z.object({
      deltaX: z.number().optional(),
      deltaY: z.number().optional(),
      selector: z.string().optional(),
      behavior: z.enum(['auto', 'smooth']).optional(),
      block: z.enum(['start', 'center', 'end', 'nearest']).optional(),
    }))
    .mutation(({ input }) => scrollAction(input)),
  waitForSelector: t.procedure
    .input(z.object({
      selector: z.string().min(1),
      timeoutMs: z.number().int().positive().optional(),
    }))
    .mutation(({ input }) => waitForSelectorAction(input)),
  navigate: t.procedure
    .input(z.object({
      url: z.string().min(1),
    }))
    .mutation(({ input }) => navigateAction(input)),
  back: t.procedure.mutation(() => backAction()),
  forward: t.procedure.mutation(() => forwardAction()),
  hover: t.procedure
    .input(z.object({
      selector: z.string().min(1),
    }))
    .mutation(({ input }) => hoverAction(input)),
  enter: t.procedure
    .input(z.object({
      selector: z.string().optional(),
      key: z.string().optional(),
    }))
    .mutation(({ input }) => enterAction(input)),
  select: t.procedure
    .input(z.object({
      selector: z.string().min(1),
      value: z.string().optional(),
      label: z.string().optional(),
      index: z.number().int().optional(),
      values: z.array(z.string()).optional(),
      labels: z.array(z.string()).optional(),
      indices: z.array(z.number().int()).optional(),
      matchMode: z.enum(['exact', 'partial']).optional(),
      toggle: z.boolean().optional(),
    }))
    .mutation(({ input }) => selectAction(input)),
  screenshotPrep: t.procedure
    .input(z.object({
      selector: z.string().optional(),
      padding: z.number().int().optional(),
      format: z.enum(['png', 'jpeg']).optional(),
      quality: z.number().optional(),
      maxWidth: z.number().int().positive().optional(),
      maxHeight: z.number().int().positive().optional(),
    }))
    .mutation(({ input }) => screenshotPrepAction(input)),
  find: t.procedure
    .input(z.object({
      text: z.string().min(1),
      limit: z.number().int().positive().optional(),
      radius: z.number().int().positive().optional(),
      caseSensitive: z.boolean().optional(),
    }))
    .mutation(({ input }) => findAction(input)),
  type: t.procedure
    .input(z.object({
      selector: z.string().min(1),
      text: z.string(),
      pressEnter: z.boolean().optional(),
    }))
    .mutation(({ input }) => typeAction(input)),
  snapshot: t.procedure
    .input(z.object({
      includeHidden: z.boolean().optional(),
      maxElements: z.number().int().positive().optional(),
      maxText: z.number().int().positive().optional(),
      includeHTML: z.boolean().optional(),
      maxHTML: z.number().int().positive().optional(),
      maxHTMLTokens: z.number().int().positive().optional(),
    }))
    .query(({ input }): SnapshotData => snapshotAction(input)),
});

export type ContentRouter = typeof contentRouter;
