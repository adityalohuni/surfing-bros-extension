import type {
  SnapshotPayload,
  SnapshotData,
  ClickPayload,
  ScrollPayload,
  WaitForSelectorPayload,
  NavigatePayload,
  TypePayload,
  HoverPayload,
  FindPayload,
  FindResponse,
  ScrollResponse,
  ClickResponse,
  HoverResponse,
  TypeResponse,
  NavigateResponse,
  WaitForSelectorResponse,
  HistoryResponse,
  EnterPayload,
  EnterResponse,
  SelectPayload,
  SelectResponse,
  ScreenshotPayload,
  ScreenshotPrepResponse,
} from './types';

export function clickAction(payload: ClickPayload): { ok: boolean; data?: ClickResponse; error?: string; errorCode?: string } {
  const el = document.querySelector(payload.selector) as HTMLElement | null;
  if (!el) {
    return { ok: false, error: 'Element not found', errorCode: 'ELEMENT_NOT_FOUND' };
  }
  el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
  el.click();
  return { ok: true, data: { selector: payload.selector } };
}

export function snapshotAction(input: SnapshotPayload): SnapshotData {
  const maxText = input.maxText ?? 10000;
  const maxElements = input.maxElements ?? 150;
  const includeHidden = input.includeHidden ?? false;
  const includeHTML = input.includeHTML ?? false;
  const maxHTML = input.maxHTML ?? 20000;
  const maxHTMLTokens = input.maxHTMLTokens ?? 0;

  const elements = collectElements(maxElements, includeHidden);
  const text = collectText(maxText);
  const fullText = document.body?.innerText ?? '';
  const normalizedFullText = fullText.replace(/\s+/g, ' ').trim();
  const truncatedText = normalizedFullText.length > text.length;
  const totalActionables = document.querySelectorAll(
    'a,button,input,select,textarea,[role=\"button\"],[role=\"link\"]'
  ).length;
  const truncatedElements = totalActionables > elements.length;
  let html: string | undefined;
  let htmlLength: number | undefined;
  let truncatedHTML: boolean | undefined;
  let htmlEstimatedTokens: number | undefined;
  if (includeHTML) {
    const rawHTML = document.documentElement?.outerHTML || '';
    htmlLength = rawHTML.length;
    htmlEstimatedTokens = estimateTokens(rawHTML);
    let limitByTokens = maxHTML;
    if (maxHTMLTokens > 0) {
      limitByTokens = Math.min(limitByTokens, maxHTMLTokens * 4);
    }
    if (rawHTML.length > limitByTokens) {
      html = rawHTML.slice(0, limitByTokens) + '…';
      truncatedHTML = true;
    } else {
      html = rawHTML;
      truncatedHTML = false;
    }
  }

  return {
    url: window.location.href,
    title: document.title,
    text,
    html,
    elements,
    elementCount: totalActionables,
    textLength: normalizedFullText.length,
    truncatedText,
    truncatedElements,
    htmlLength,
    truncatedHTML,
    htmlEstimatedTokens,
  };
}

function estimateTokens(text: string): number {
  // Rough heuristic: ~4 chars per token for English/HTML.
  return Math.ceil(text.length / 4);
}

export function scrollAction(payload: ScrollPayload): { ok: boolean; data?: ScrollResponse; error?: string; errorCode?: string } {
  const deltaX = payload.deltaX ?? 0;
  const deltaY = payload.deltaY ?? 0;
  const behavior = payload.behavior ?? 'auto';
  const block = payload.block ?? 'center';
  if (payload.selector) {
    const el = document.querySelector(payload.selector) as HTMLElement | null;
    if (!el) {
      return { ok: false, error: 'Element not found', errorCode: 'ELEMENT_NOT_FOUND' };
    }
    el.scrollIntoView({ block, inline: 'center', behavior });
    if (typeof (el as any).scrollBy === 'function') {
      (el as any).scrollBy(deltaX, deltaY);
    } else {
      window.scrollBy(deltaX, deltaY);
    }
    return { ok: true, data: { deltaX, deltaY, selector: payload.selector, behavior, block } };
  }
  window.scrollBy(deltaX, deltaY);
  return { ok: true, data: { deltaX, deltaY, behavior, block } };
}

export function waitForSelectorAction(payload: WaitForSelectorPayload): Promise<{ ok: boolean; data?: WaitForSelectorResponse; error?: string; errorCode?: string }> {
  const selector = payload.selector;
  if (!selector) {
    return Promise.resolve({ ok: false, error: 'selector is required', errorCode: 'INVALID_INPUT' });
  }
  const timeoutMs = payload.timeoutMs ?? 5000;

  if (document.querySelector(selector)) {
    return Promise.resolve({ ok: true, data: { selector, timeoutMs, found: true } });
  }

  return new Promise<{ ok: boolean; error?: string }>((resolve) => {
    let done = false;
    let timer: number | undefined;

    const finish = (value: { ok: boolean; error?: string }) => {
      if (done) return;
      done = true;
      if (timer) window.clearTimeout(timer);
      observer.disconnect();
      if (value.ok) {
        resolve({ ok: true, data: { selector, timeoutMs, found: true } });
      } else {
        resolve({ ok: false, error: value.error });
      }
    };

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        finish({ ok: true });
      }
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    timer = window.setTimeout(() => {
      resolve({
        ok: false,
        error: `Timed out waiting for selector: ${selector}`,
        errorCode: 'TIMEOUT',
        data: { selector, timeoutMs, found: false },
      });
    }, timeoutMs);
  });
}

export function navigateAction(payload: NavigatePayload): { ok: boolean; data?: NavigateResponse; error?: string; errorCode?: string } {
  if (!payload.url) {
    return { ok: false, error: 'url is required', errorCode: 'INVALID_INPUT' };
  }
  try {
    window.location.assign(payload.url);
    return { ok: true, data: { url: payload.url } };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Navigation failed' };
  }
}

export function backAction(): { ok: boolean; data?: HistoryResponse; error?: string } {
  try {
    window.history.back();
    return { ok: true, data: { direction: 'back' } };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Back navigation failed' };
  }
}

export function forwardAction(): { ok: boolean; data?: HistoryResponse; error?: string } {
  try {
    window.history.forward();
    return { ok: true, data: { direction: 'forward' } };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Forward navigation failed' };
  }
}

export function hoverAction(payload: HoverPayload): { ok: boolean; data?: HoverResponse; error?: string; errorCode?: string } {
  if (!payload.selector) {
    return { ok: false, error: 'selector is required', errorCode: 'INVALID_INPUT' };
  }
  const el = document.querySelector(payload.selector) as HTMLElement | null;
  if (!el) {
    return { ok: false, error: 'Element not found', errorCode: 'ELEMENT_NOT_FOUND' };
  }
  const rect = el.getBoundingClientRect();
  const clientX = rect.left + rect.width / 2;
  const clientY = rect.top + rect.height / 2;
  const eventInit: MouseEventInit = {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
    view: window,
  };
  el.dispatchEvent(new MouseEvent('mouseover', eventInit));
  el.dispatchEvent(new MouseEvent('mouseenter', eventInit));
  el.dispatchEvent(new MouseEvent('mousemove', eventInit));
  return { ok: true, data: { selector: payload.selector } };
}

export function findAction(payload: FindPayload): { ok: boolean; data?: FindResponse; error?: string } {
  const query = payload.text?.trim();
  if (!query) {
    return { ok: false, error: 'text is required' };
  }
  const raw = document.body?.innerText || document.body?.textContent || '';
  const hay = raw.replace(/\s+/g, ' ').trim();
  const limit = Math.max(1, payload.limit ?? 50);
  const radius = Math.max(10, payload.radius ?? 40);
  const caseSensitive = payload.caseSensitive ?? false;
  if (!hay) {
    return { ok: true, data: { query, limit, radius, caseSensitive, total: 0, returned: 0, results: [] } };
  }

  const results: FindResponse['results'] = [];
  const sourceHay = caseSensitive ? hay : hay.toLowerCase();
  const sourceQuery = caseSensitive ? query : query.toLowerCase();
  let idx = 0;
  let count = 0;

  while ((idx = sourceHay.indexOf(sourceQuery, idx)) !== -1) {
    count += 1;
    const start = Math.max(0, idx - radius);
    const end = Math.min(hay.length, idx + query.length + radius);
    let snippet = hay.slice(start, end);
    if (start > 0) snippet = '…' + snippet;
    if (end < hay.length) snippet = snippet + '…';

    if (results.length < limit) {
      results.push({ index: idx, snippet });
    }
    idx = idx + sourceQuery.length;
  }

  return {
    ok: true,
    data: {
      query,
      limit,
      radius,
      caseSensitive,
      total: count,
      returned: results.length,
      results,
    },
  };
}

export function typeAction(payload: TypePayload): { ok: boolean; data?: TypeResponse; error?: string; errorCode?: string } {
  const { selector, text, pressEnter } = payload;
  if (!selector) {
    return { ok: false, error: 'selector is required', errorCode: 'INVALID_INPUT' };
  }
  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) {
    return { ok: false, error: 'Element not found', errorCode: 'ELEMENT_NOT_FOUND' };
  }
  const input = el as HTMLInputElement | HTMLTextAreaElement;
  if (typeof input.focus === 'function') {
    input.focus();
  }
  if ('value' in input) {
    const proto = Object.getPrototypeOf(input);
    const valueSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (valueSetter) {
      valueSetter.call(input, text);
    } else {
      (input as HTMLInputElement).value = text;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    if (pressEnter) {
      const down = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true });
      const up = new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true });
      input.dispatchEvent(down);
      input.dispatchEvent(up);
    }
    return { ok: true, data: { selector, textLength: text.length, pressEnter: !!pressEnter } };
  }
  return { ok: false, error: 'Element is not a text input', errorCode: 'INVALID_TARGET' };
}

export function enterAction(payload: EnterPayload): { ok: boolean; data?: EnterResponse; error?: string; errorCode?: string } {
  const key = payload.key && payload.key.trim() ? payload.key : 'Enter';
  let el: HTMLElement | null = null;
  let usedActiveElement = false;

  if (payload.selector) {
    el = document.querySelector(payload.selector) as HTMLElement | null;
    if (!el) {
      return { ok: false, error: 'Element not found', errorCode: 'ELEMENT_NOT_FOUND' };
    }
  } else {
    el = document.activeElement as HTMLElement | null;
    usedActiveElement = true;
    if (!el || el === document.body || el === document.documentElement) {
      return { ok: false, error: 'No active element to send key', errorCode: 'NO_ACTIVE_ELEMENT' };
    }
  }

  if (typeof el.focus === 'function') {
    el.focus();
  }
  const down = new KeyboardEvent('keydown', { key, code: key, bubbles: true });
  const up = new KeyboardEvent('keyup', { key, code: key, bubbles: true });
  el.dispatchEvent(down);
  el.dispatchEvent(up);

  return { ok: true, data: { selector: payload.selector, key, usedActiveElement } };
}

export function selectAction(payload: SelectPayload): { ok: boolean; data?: SelectResponse; error?: string; errorCode?: string } {
  if (!payload.selector) {
    return { ok: false, error: 'selector is required', errorCode: 'INVALID_INPUT' };
  }
  const el = document.querySelector(payload.selector) as HTMLSelectElement | null;
  if (!el) {
    return { ok: false, error: 'Element not found', errorCode: 'ELEMENT_NOT_FOUND' };
  }
  if (el.tagName.toLowerCase() !== 'select') {
    return { ok: false, error: 'Element is not a select', errorCode: 'INVALID_TARGET' };
  }

  const targets = resolveTargets(el, payload);
  if (!targets.ok) {
    return { ok: false, error: targets.error || 'option not found', errorCode: 'OPTION_NOT_FOUND' };
  }

  const { indices } = targets;

  if (el.multiple) {
    if (payload.toggle) {
      Array.from(el.options).forEach((opt, idx) => {
        if (indices.includes(idx)) {
          opt.selected = !opt.selected;
        }
      });
    } else {
      Array.from(el.options).forEach((opt, idx) => {
        opt.selected = indices.includes(idx);
      });
    }
  } else {
    const idx = indices[0];
    el.selectedIndex = idx;
    el.value = el.options[idx].value;
  }

  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));

  const selected = getSelected(el);
  const response: SelectResponse = {
    selector: payload.selector,
    value: selected.values[0] ?? '',
    label: selected.labels[0],
    index: selected.indices[0],
    matchMode: payload.matchMode ?? 'exact',
    toggle: payload.toggle ?? false,
    multiple: el.multiple,
    selectedCount: selected.indices.length,
  };
  if (el.multiple) {
    response.values = selected.values;
    response.labels = selected.labels;
    response.indices = selected.indices;
  }

  return { ok: true, data: response };
}

export async function screenshotPrepAction(
  payload: ScreenshotPayload
): Promise<{ ok: boolean; data?: ScreenshotPrepResponse; error?: string; errorCode?: string }> {
  const padding = payload.padding ?? 0;
  if (!payload.selector) {
    const width = Math.max(0, window.innerWidth);
    const height = Math.max(0, window.innerHeight);
    if (width === 0 || height === 0) {
      return { ok: false, error: 'Viewport has zero size', errorCode: 'INVALID_TARGET' };
    }
    return {
      ok: true,
      data: {
        selector: 'viewport',
        rect: { x: 0, y: 0, width, height },
        dpr: window.devicePixelRatio || 1,
      },
    };
  }

  const el = document.querySelector(payload.selector) as HTMLElement | null;
  if (!el) {
    return { ok: false, error: 'Element not found', errorCode: 'ELEMENT_NOT_FOUND' };
  }
  el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
  await new Promise((r) => setTimeout(r, 50));
  const rect = el.getBoundingClientRect();
  const x = Math.max(0, rect.left - padding);
  const y = Math.max(0, rect.top - padding);
  const width = Math.max(0, rect.width + padding * 2);
  const height = Math.max(0, rect.height + padding * 2);
  if (width === 0 || height === 0) {
    return { ok: false, error: 'Element has zero size', errorCode: 'INVALID_TARGET' };
  }
  return {
    ok: true,
    data: {
      selector: payload.selector,
      rect: { x, y, width, height },
      dpr: window.devicePixelRatio || 1,
    },
  };
}

function resolveTargets(el: HTMLSelectElement, payload: SelectPayload): { ok: boolean; error?: string; indices: number[]; values: string[]; labels: string[] } {
  const options = Array.from(el.options);
  let indices: number[] = [];
  const matchMode = payload.matchMode ?? 'exact';

  if (payload.indices && payload.indices.length > 0) {
    indices = payload.indices.slice();
  } else if (payload.values && payload.values.length > 0) {
    indices = payload.values
      .map((val) => options.findIndex((opt) => opt.value === val))
      .filter((idx) => idx >= 0);
  } else if (payload.labels && payload.labels.length > 0) {
    const wanted = payload.labels.map((l) => l.toLowerCase());
    indices = wanted
      .map((lab) => findLabelIndex(options, lab, matchMode))
      .filter((idx) => idx >= 0);
  } else if (typeof payload.index === 'number') {
    indices = [payload.index];
  } else if (payload.value) {
    const idx = options.findIndex((opt) => opt.value === payload.value);
    if (idx >= 0) indices = [idx];
  } else if (payload.label) {
    const lab = payload.label.toLowerCase();
    const idx = findLabelIndex(options, lab, matchMode);
    if (idx >= 0) indices = [idx];
  } else {
    return { ok: false, error: 'value, label, or index is required', indices: [], values: [], labels: [] };
  }

  indices = indices.filter((idx, pos, arr) => idx >= 0 && idx < options.length && arr.indexOf(idx) === pos);

  if (indices.length == 0) {
    return { ok: false, error: 'option not found', indices: [], values: [], labels: [] };
  }

  const values = indices.map((idx) => options[idx].value);
  const labels = indices.map((idx) => options[idx].text);
  return { ok: true, indices, values, labels };
}

function findLabelIndex(options: HTMLOptionElement[], labelLower: string, matchMode: 'exact' | 'partial'): number {
  if (matchMode === 'partial') {
    return options.findIndex((opt) => opt.text.toLowerCase().includes(labelLower));
  }
  return options.findIndex((opt) => opt.text.toLowerCase() === labelLower);
}

function getSelected(el: HTMLSelectElement): { values: string[]; labels: string[]; indices: number[] } {
  const values: string[] = [];
  const labels: string[] = [];
  const indices: number[] = [];
  Array.from(el.options).forEach((opt, idx) => {
    if (opt.selected) {
      values.push(opt.value);
      labels.push(opt.text);
      indices.push(idx);
    }
  });
  return { values, labels, indices };
}

function collectText(maxText: number): string {
  const bodyText = document.body?.innerText ?? '';
  const compact = bodyText.replace(/\s+/g, ' ').trim();
  if (compact.length > maxText) {
    return compact.slice(0, maxText);
  }
  return compact;
}

function collectElements(limit: number, includeHidden: boolean) {
  const nodes = Array.from(document.querySelectorAll(
    'a,button,input,select,textarea,[role="button"],[role="link"]'
  ));
  const results = [] as any[];
  for (const node of nodes) {
    if (results.length >= limit) break;
    if (!includeHidden && !isVisible(node as HTMLElement)) continue;
    const el = node as HTMLElement;
    results.push({
      tag: el.tagName.toLowerCase(),
      text: elementText(el),
      selector: selectorFor(el),
      href: (el as HTMLAnchorElement).href || undefined,
      inputType: (el as HTMLInputElement).type || undefined,
      name: (el as HTMLInputElement).name || el.getAttribute('name') || undefined,
      id: el.id || undefined,
      ariaLabel: el.getAttribute('aria-label') || undefined,
      title: el.getAttribute('title') || undefined,
      alt: (el as HTMLImageElement).alt || el.getAttribute('alt') || undefined,
      value: (el as HTMLInputElement).value || el.getAttribute('value') || undefined,
      placeholder: (el as HTMLInputElement).placeholder || el.getAttribute('placeholder') || undefined,
      context: siblingText(el, 80),
    });
  }
  return results;
}

function isVisible(el: HTMLElement) {
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function elementText(el: HTMLElement) {
  const text = el.innerText || el.textContent || '';
  return text.replace(/\s+/g, ' ').trim();
}

function siblingText(el: HTMLElement, limit: number) {
  const parent = el.parentElement;
  if (!parent) return '';
  let text = '';
  for (const node of Array.from(parent.childNodes)) {
    if (node === el) continue;
    if (node.nodeType === Node.TEXT_NODE) {
      const t = (node.textContent || '').replace(/\s+/g, ' ').trim();
      if (t) text += t + ' ';
    }
  }
  text = text.trim();
  if (limit > 0 && text.length > limit) return text.slice(0, limit);
  return text;
}

function selectorFor(el: HTMLElement): string {
  if (el.id) return `#${el.id}`;
  const dataTestId = el.getAttribute('data-testid');
  if (dataTestId) return `${el.tagName.toLowerCase()}[data-testid="${dataTestId}"]`;
  const dataAttr = firstDataAttr(el, ['data-test', 'data-qa', 'data-automation', 'data-cy', 'data-automation-id']);
  if (dataAttr) return `${el.tagName.toLowerCase()}[${dataAttr.key}="${dataAttr.val}"]`;
  const name = el.getAttribute('name');
  if (name) return `${el.tagName.toLowerCase()}[name="${name}"]`;
  const aria = el.getAttribute('aria-label');
  if (aria) return `${el.tagName.toLowerCase()}[aria-label="${aria}"]`;
  const className = (el.className || '').toString().split(' ').filter(Boolean)[0];
  if (className) return `${el.tagName.toLowerCase()}.${className}`;
  const nth = nthChildIndex(el);
  if (nth > 0) return `${el.tagName.toLowerCase()}:nth-child(${nth})`;
  return el.tagName.toLowerCase();
}

function nthChildIndex(el: HTMLElement): number {
  const parent = el.parentElement;
  if (!parent) return 0;
  let idx = 0;
  for (const child of Array.from(parent.children)) {
    idx += 1;
    if (child === el) return idx;
  }
  return 0;
}

function firstDataAttr(el: HTMLElement, keys: string[]) {
  for (const key of keys) {
    const val = el.getAttribute(key);
    if (val) return { key, val };
  }
  return null;
}
