import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Folder, Layers, Plus, RefreshCw, Sparkles, X } from 'lucide-react';
import { useSidepanel } from '../state/SidepanelContext';

export function DockSection() {
  const {
    contextBadges,
    dockIconColor,
    activeModelId,
    activeProviderId,
    activeModelLabel,
    modelOptions,
    input,
    showContextPanel,
    actions,
  } = useSidepanel();

  return (
    <div className="grid gap-2 rounded-2xl px-3 py-2 text-ink-900 shadow-dock border border-black/10 dark:text-white dark:border-white/5 bg-[rgba(255,255,255,0.95)] dark:bg-[rgba(28,30,36,0.9)] backdrop-blur">
      <div className="flex flex-nowrap items-center gap-2 w-full overflow-x-auto">
        <button
          className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-ink-900 dark:text-white bg-[rgba(15,17,21,0.08)] dark:bg-[rgba(255,255,255,0.12)]"
          onClick={() => actions.setShowContextPanel(!showContextPanel)}
          aria-label="Toggle context"
          title="Toggle context"
        >
          <Plus size={16} color={dockIconColor} />
        </button>
        <button
          className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-ink-900 dark:text-white bg-[rgba(15,17,21,0.08)] dark:bg-[rgba(255,255,255,0.12)]"
          onClick={actions.addActiveTabContext}
          aria-label="Add active tab"
          title="Add active tab"
        >
          <Layers size={16} color={dockIconColor} />
        </button>
        <label
          className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-ink-900 dark:text-white bg-[rgba(15,17,21,0.08)] dark:bg-[rgba(255,255,255,0.12)]"
          aria-label="Add file"
          title="Add file"
        >
          <input
            type="file"
            className="hidden"
            onChange={(e) => void actions.addFileContext(e.target.files?.[0] ?? null)}
          />
          <Folder size={16} color={dockIconColor} />
        </label>
        <button
          className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-ink-900 dark:text-white bg-[rgba(15,17,21,0.08)] dark:bg-[rgba(255,255,255,0.12)]"
          onClick={actions.refreshSources}
          aria-label="Refresh sources"
          title="Refresh sources"
        >
          <RefreshCw size={16} color={dockIconColor} />
        </button>
      </div>
      <div className="flex flex-nowrap items-center gap-2 w-full overflow-x-auto">
        <div className="flex items-center gap-2 min-w-0">
          {contextBadges.length === 0 && (
            <span className="rounded-full px-2 py-0.5 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">
              No context
            </span>
          )}
          {contextBadges.map((ctx) => (
            <span
              key={ctx.id}
              className="inline-flex items-center gap-1 text-[10px] text-ui-text dark:text-ui-textDark max-w-[180px] rounded-full px-1.5 py-0.5 bg-black/5 dark:bg-white/10"
              title={`${ctx.type.toUpperCase()}: ${ctx.title}`}
            >
              <span className="truncate min-w-0">
                {ctx.type === 'tab' ? 'Tab' : 'File'}: {ctx.title}
              </span>
              <button
                className="inline-flex items-center justify-center rounded-full px-0.5 text-ui-muted dark:text-ui-mutedDark hover:text-ui-text dark:hover:text-ui-textDark bg-black/5 dark:bg-white/10"
                onClick={() => actions.removeContext(ctx.id)}
                aria-label={`Remove ${ctx.title}`}
                title="Remove"
              >
                <X size={9} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex-1" />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-2 py-0.5 text-xs text-ink-900 dark:text-white dark:border-white/10 relative bg-[rgba(15,17,21,0.08)] dark:bg-[rgba(255,255,255,0.12)]"
              aria-label="Model"
              title="Model"
            >
              <span
                className="inline-flex items-center justify-center rounded-full text-ink-900 dark:text-white w-6 h-6 bg-[rgba(15,17,21,0.08)] dark:bg-[rgba(255,255,255,0.12)]"
                aria-hidden="true"
              >
                <Sparkles size={14} color={dockIconColor} />
              </span>
              <span className="text-xs text-ink-900 dark:text-white pr-5">{activeModelLabel}</span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="surface p-2 grid gap-1 min-w-[220px]" align="end" sideOffset={8}>
              {modelOptions.length === 0 && (
                <div className="muted px-3 py-2">No providers configured. Add one in MCP Console.</div>
              )}
              {modelOptions.map(option => (
                <DropdownMenu.Item
                  key={option.id}
                  className={`rounded-lg px-3 py-2 text-left text-sm grid gap-1 ${(activeProviderId === option.providerId && activeModelId === option.modelId) ? 'bg-black/5 dark:bg-white/10' : ''}`}
                  onSelect={() => actions.setActiveModel(option.providerId, option.modelId)}
                >
                  <div className="font-semibold text-sm truncate">{option.label}</div>
                  <div className="muted">
                    {option.supportsTools ? 'Tools' : 'No tools'} · {option.supportsVision ? 'Vision' : 'No vision'}
                  </div>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <div className="flex flex-nowrap items-center gap-2 w-full overflow-x-auto">
        <textarea
          className="flex-1 min-w-0 bg-transparent text-sm text-ink-900 dark:text-white placeholder:text-ink-700/50 dark:placeholder:text-white/50 border-0 focus:outline-none resize-none overflow-hidden"
          rows={1}
          value={input}
          onChange={(e) => actions.setInput(e.target.value)}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = '0px';
            const next = Math.min(el.scrollHeight, 120);
            el.style.height = `${next}px`;
            el.style.overflowY = el.scrollHeight > 120 ? 'auto' : 'hidden';
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (input.trim()) {
                actions.sendMessage();
              }
            }
          }}
          placeholder="Plan a task, ask a question, or paste a URL..."
        />
        <button
          className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold text-ink-900 dark:text-white bg-[rgba(15,17,21,0.14)] dark:bg-[rgba(255,255,255,0.2)]"
          onClick={actions.sendMessage}
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
