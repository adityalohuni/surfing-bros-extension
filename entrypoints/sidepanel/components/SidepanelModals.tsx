import * as Dialog from '@radix-ui/react-dialog';
import { Trash2 } from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';
import { IconButton } from '../../shared/components/ui/IconButton';
import { useSidepanel } from '../state/SidepanelContext';
import type { ChatSession } from '../state/types';

const lastActiveAt = (session: ChatSession) =>
  session.messages[session.messages.length - 1]?.createdAt ?? session.createdAt;

const formatRelativeTime = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 2_592_000_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

const isRecentSession = (timestamp: number) => Date.now() - timestamp < 24 * 60 * 60 * 1000;

export function SidepanelModals() {
  const {
    showAddTabModal,
    showSessionsModal,
    showMemoryModal,
    showDeleteModal,
    activeTabPreview,
    activeTabError,
    sessionQuery,
    sessions,
    activeSessionId,
    memories,
    memoryTitle,
    memoryContent,
    actions,
  } = useSidepanel();

  const filteredSessions = sessions.filter((session) => {
    if (!sessionQuery.trim()) return true;
    const q = sessionQuery.toLowerCase();
    return (
      session.title.toLowerCase().includes(q) ||
      session.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <Dialog.Root open={showAddTabModal} onOpenChange={actions.setShowAddTabModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content surface p-4">
            <Dialog.Title className="section-title">Add active tab</Dialog.Title>
            {activeTabError && <div className="muted">{activeTabError}</div>}
            {activeTabPreview && (
              <div className="surface-soft p-3 grid gap-1">
                <div className="font-semibold truncate" title={activeTabPreview.title}>{activeTabPreview.title}</div>
                <div className="muted truncate" title={activeTabPreview.url}>{activeTabPreview.url}</div>
              </div>
            )}
            <div className="row justify-end">
              <Dialog.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Dialog.Close>
              <Button variant="secondary" onClick={actions.confirmAddActiveTab} disabled={!activeTabPreview}>
                Add to context
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={showSessionsModal} onOpenChange={actions.setShowSessionsModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content surface p-4">
            <Dialog.Title className="section-title">Sessions</Dialog.Title>
            <div className="grid gap-2">
              <input
                value={sessionQuery}
                onChange={(e) => actions.setSessionQuery(e.target.value)}
                placeholder="Search sessions"
              />
              <div className="row">
                <Button variant="secondary" onClick={actions.addSession}>New session</Button>
                <Button variant="secondary" onClick={() => actions.keepLastSessions(10)}>Keep last 10</Button>
                <Button variant="secondary" onClick={() => actions.keepLastSessions(30)}>Keep last 30</Button>
                <Button variant="secondary" onClick={actions.clearAllSessions}>Clear all</Button>
              </div>
            </div>
            <div className="grid gap-2 max-h-[240px] overflow-auto pr-1">
              {filteredSessions.length === 0 && <div className="muted">No sessions yet.</div>}
              {filteredSessions.map((session) => {
                const lastAt = lastActiveAt(session);
                return (
                  <div key={session.id} className={`surface-soft p-2 grid gap-1 ${session.id === activeSessionId ? 'bg-white/95 dark:bg-mist-800/80' : 'bg-black/5 dark:bg-white/5'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold truncate">{session.title}</div>
                      <div className="flex items-center gap-1">
                        {isRecentSession(lastAt) && <span className="rounded-full px-2 py-0.5 text-[10px] bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">Recent</span>}
                        {session.id === activeSessionId && <span className="rounded-full px-2 py-0.5 text-[10px] bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">Active</span>}
                      </div>
                    </div>
                    <div className="row justify-between mt-0.5">
                      <div className="muted text-[10px]">
                        {session.messages.length} messages • {formatRelativeTime(lastAt)}
                      </div>
                      <div className="row">
                        <Button variant="secondary" onClick={() => actions.setActiveSessionId(session.id)}>Open</Button>
                        <IconButton
                          onClick={() => {
                            actions.setDeleteSessionId(session.id);
                            actions.setShowDeleteModal(true);
                          }}
                          aria-label="Delete session"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="row justify-end">
              <Dialog.Close asChild>
                <Button variant="secondary">Close</Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={showMemoryModal} onOpenChange={actions.setShowMemoryModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content surface p-4">
            <Dialog.Title className="section-title">Manage memories</Dialog.Title>
            <div className="grid gap-2">
              <input
                value={memoryTitle}
                onChange={(e) => actions.setMemoryTitle(e.target.value)}
                placeholder="Memory title"
              />
              <textarea
                value={memoryContent}
                onChange={(e) => actions.setMemoryContent(e.target.value)}
                placeholder="Memory detail"
                rows={3}
              />
              <Button variant="primary" onClick={actions.addMemory}>Add memory</Button>
            </div>
            <div className="grid gap-2">
              {memories.length === 0 && <div className="muted">No memories yet.</div>}
              {memories.map((m) => (
                <div key={m.id} className="surface-soft p-3 grid gap-2">
                  <div className="font-semibold">{m.title}</div>
                  <div className="muted">{m.content}</div>
                  <div className="row mt-1.5">
                    <Button variant="secondary" onClick={() => actions.addMemoryContext(m)}>Add to context</Button>
                    <Button variant="secondary" onClick={() => actions.deleteMemory(m.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="row justify-end">
              <Dialog.Close asChild>
                <Button variant="secondary">Close</Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={showDeleteModal} onOpenChange={actions.setShowDeleteModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content surface p-4">
            <Dialog.Title className="section-title">Delete conversation?</Dialog.Title>
            <div className="muted">
              This will remove the session and its messages. It cannot be undone.
            </div>
            <div className="row justify-end">
              <Dialog.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Dialog.Close>
              <Button variant="secondary" onClick={actions.confirmDeleteSession}>
                Delete
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
