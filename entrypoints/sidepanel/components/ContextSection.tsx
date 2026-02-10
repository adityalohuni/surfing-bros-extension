import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Card } from '../../shared/components/ui/Card';
import { useSidepanel } from '../state/SidepanelContext';

export function ContextSection() {
  const {
    showContextPanel,
    sortedContexts,
    expandedContexts,
    tabs,
    bookmarks,
    historyItems,
    selectedTabId,
    actions,
  } = useSidepanel();

  return (
    <Card className={`p-3 ${showContextPanel ? 'grid gap-2 animate-[context-reveal_220ms_ease-out]' : 'hidden'}`}>
      <div className="grid gap-2">
        {sortedContexts.length === 0 && <span className="muted">No context attached.</span>}
        {sortedContexts.map((ctx) => (
          <div key={ctx.id} className="surface-soft px-3 py-2 flex flex-wrap gap-2 items-center">
            <span className="rounded-full px-2 py-0.5 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">{ctx.type}</span>
            <span className="chip-title">{ctx.title}</span>
            {ctx.pinned && <span className="rounded-full px-2 py-0.5 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">Pinned</span>}
            <button className="rounded-full px-2 py-1 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white" onClick={() => actions.togglePinContext(ctx.id)}>
              {ctx.pinned ? 'Unpin' : 'Pin'}
            </button>
            <button className="rounded-full px-2 py-1 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white" onClick={() => actions.removeContext(ctx.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      {sortedContexts.map((ctx) => {
        const expanded = expandedContexts.has(ctx.id);
        if (!expanded) return null;
        const preview = ctx.content.length > 240 ? `${ctx.content.slice(0, 240)}...` : ctx.content;
        return (
          <div key={`${ctx.id}-preview`} className="surface-soft p-3 grid gap-2">
            <div className="context-head">
              <span>{ctx.title}</span>
              <div className="row">
                {ctx.pinned && <span className="rounded-full px-2 py-0.5 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">Pinned</span>}
                <span className="rounded-full px-2 py-0.5 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">{ctx.type}</span>
              </div>
            </div>
            <div className="context-content">{preview}</div>
            {ctx.content.length > 240 && (
              <div className="context-actions">
                <button className="secondary" onClick={() => actions.toggleContext(ctx.id)}>
                  Show more
                </button>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex items-center gap-2 flex-wrap">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="surface-soft rounded-full px-3 py-2 text-sm" aria-label="Select tab" title="Select tab">
              <span className="truncate max-w-[180px]">
                {selectedTabId == null ? 'Select a tab' : tabs.find(t => t.id === selectedTabId)?.title ?? 'Select a tab'}
              </span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="surface p-2 grid gap-1 max-h-64 overflow-auto" align="start" sideOffset={8}>
            {tabs.length === 0 && <div className="muted px-3 py-2">No tabs found.</div>}
            {tabs.map((tab) => (
              <DropdownMenu.Item
                key={tab.id}
                onSelect={() => actions.setSelectedTabId(tab.id)}
                className={`rounded-lg px-3 py-2 text-left text-sm grid gap-1 ${selectedTabId === tab.id ? 'bg-black/5 dark:bg-white/10' : ''}`}
              >
                <div className="font-semibold text-sm truncate" title={tab.title}>{tab.title}</div>
                <div className="muted" title={tab.url}>{tab.url}</div>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <button className="secondary" onClick={actions.addSelectedTabContext}>Add selected tab</button>
      </div>

      <div className="grid gap-2">
        <div className="grid gap-2">
          <div className="text-sm font-semibold">Tabs</div>
          {tabs.length === 0 && <div className="muted">No tabs available.</div>}
          {tabs.map((tab) => (
            <div key={tab.id} className="surface-soft px-2 py-1 flex items-center justify-between gap-2">
              <span className="truncate min-w-0" title={tab.title}>{tab.title}</span>
              <button className="rounded-full px-2 py-1 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white" onClick={() => actions.addContext({
                id: crypto.randomUUID(),
                type: 'tab',
                title: tab.title,
                content: tab.url,
                createdAt: Date.now(),
              })}>
                Add
              </button>
            </div>
          ))}
        </div>

        <div className="grid gap-2">
          <div className="text-sm font-semibold">Bookmarks</div>
          {bookmarks.length === 0 && <div className="muted">No bookmarks available.</div>}
          {bookmarks.map((b) => (
            <div key={b.id} className="surface-soft px-2 py-1 flex items-center justify-between gap-2">
              <span className="truncate min-w-0" title={b.title}>{b.title}</span>
              <button className="rounded-full px-2 py-1 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white" onClick={() => actions.addBookmarkContext(b)}>Add</button>
            </div>
          ))}
        </div>

        <div className="grid gap-2">
          <div className="text-sm font-semibold">History</div>
          {historyItems.length === 0 && <div className="muted">No history items.</div>}
          {historyItems.map((h) => (
            <div key={h.id} className="surface-soft px-2 py-1 flex items-center justify-between gap-2">
              <span className="truncate min-w-0" title={h.title}>{h.title}</span>
              <button className="rounded-full px-2 py-1 text-xs bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white" onClick={() => actions.addHistoryContext(h)}>Add</button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
