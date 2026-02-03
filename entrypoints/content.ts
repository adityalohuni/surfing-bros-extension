import { createChromeHandler } from 'trpc-browser/adapter';
import { browser, defineContentScript } from '#imports';

import { contentRouter } from './shared/contentRouter';

let recordingEnabled = false;
let scrollTimer: number | null = null;
let lastScrollY = 0;
const inputTimers = new WeakMap<HTMLElement, number>();
const chromeApi = (globalThis.chrome ?? (browser as unknown as typeof chrome));

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    try {
      createChromeHandler({
        router: contentRouter,
        chrome: chromeApi,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (!message.includes('not implemented')) {
        throw err;
      }
      console.warn('Skipping chrome handler creation: runtime onConnect not implemented');
    }

    chromeApi.runtime.onMessage.addListener((message) => {
      if (message?.type === 'recording:set') {
        recordingEnabled = !!message.enabled;
      }
    });

    document.addEventListener('click', (event) => {
      if (!recordingEnabled) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const selector = selectorFor(target);
      if (!selector) return;
      recordAction('click', { selector });
    }, true);

    document.addEventListener('input', (event) => {
      if (!recordingEnabled) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (!isTextInput(target)) return;
      const selector = selectorFor(target);
      if (!selector) return;
      const value = (target as HTMLInputElement).value ?? '';
      const existing = inputTimers.get(target);
      if (existing) window.clearTimeout(existing);
      const timer = window.setTimeout(() => {
        recordAction('type', { selector, text: value });
      }, 500);
      inputTimers.set(target, timer);
    }, true);

    document.addEventListener('change', (event) => {
      if (!recordingEnabled) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (isSelect(target)) {
        const selector = selectorFor(target);
        if (!selector) return;
        const select = target as HTMLSelectElement;
        const values = Array.from(select.selectedOptions).map((opt) => opt.value);
        recordAction('select', { selector, values });
      }
    }, true);

    document.addEventListener('keydown', (event) => {
      if (!recordingEnabled) return;
      if (event.key !== 'Enter') return;
      const target = event.target as HTMLElement | null;
      const selector = target ? selectorFor(target) : undefined;
      recordAction('enter', { selector, key: 'Enter' });
    }, true);

    window.addEventListener('scroll', () => {
      if (!recordingEnabled) return;
      if (scrollTimer) window.clearTimeout(scrollTimer);
      const prevY = lastScrollY;
      scrollTimer = window.setTimeout(() => {
        const deltaY = window.scrollY - prevY;
        if (deltaY !== 0) {
          recordAction('scroll', { deltaY });
        }
        lastScrollY = window.scrollY;
      }, 300);
    }, { passive: true });
  },
});

function recordAction(type: string, payload: any) {
  chromeApi.runtime.sendMessage({
    type: 'record_event',
    payload: {
      type,
      payload,
      timestamp: Date.now(),
      url: window.location.href,
      title: document.title,
    },
  });
}

function isTextInput(el: HTMLElement) {
  const tag = el.tagName.toLowerCase();
  if (tag === 'textarea') return true;
  if (tag !== 'input') return false;
  const type = (el as HTMLInputElement).type?.toLowerCase() || 'text';
  return ['text', 'search', 'email', 'url', 'password', 'tel', 'number'].includes(type);
}

function isSelect(el: HTMLElement) {
  return el.tagName.toLowerCase() === 'select';
}

function selectorFor(el: HTMLElement): string {
  if (el.id) return `#${el.id}`;
  const dataTestId = el.getAttribute('data-testid');
  if (dataTestId) return `${el.tagName.toLowerCase()}[data-testid="${dataTestId}"]`;
  const name = el.getAttribute('name');
  if (name) return `${el.tagName.toLowerCase()}[name="${name}"]`;
  const aria = el.getAttribute('aria-label');
  if (aria) return `${el.tagName.toLowerCase()}[aria-label="${aria}"]`;
  const className = (el.className || '').toString().split(' ').filter(Boolean)[0];
  if (className) return `${el.tagName.toLowerCase()}.${className}`;
  return el.tagName.toLowerCase();
}
