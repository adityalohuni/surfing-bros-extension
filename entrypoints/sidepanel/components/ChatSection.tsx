import { useSidepanel } from '../state/SidepanelContext';

export function ChatSection() {
  const { activeSession } = useSidepanel();

  return (
    <>
      <div className="chat-header">
        <div className="section-title">Chat</div>
      </div>
      <div className="chat">
        {activeSession?.messages.map(m => {
          const isAssistant = m.role === 'assistant';
          const isUser = m.role === 'user';
          const isSystem = m.role === 'system';
          const className = isSystem ? 'system-line' : (isAssistant ? 'message assistant' : `bubble ${m.role}`);
          return (
            <div
              key={m.id}
              className={`w-full flex items-start ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {isSystem ? (
                <div className={`${className} bubble-animate`}>{m.content}</div>
              ) : (
                <div
                  className={`${className} bubble-animate`}
                  style={{ display: 'inline-flex', width: 'fit-content', maxWidth: '75%' }}
                >
                  <div className="grid gap-2">
                    <div>{m.content}</div>
                    {m.meta?.toolSteps && m.meta.toolSteps.length > 0 && (
                      <details className="text-xs text-ui-muted dark:text-ui-mutedDark">
                        <summary className="cursor-pointer select-none">Tool steps</summary>
                        <div className="grid gap-1 mt-1">
                          {m.meta.toolSteps.map((step, idx) => (
                            <div key={`${m.id}-tool-${idx}`}>{step}</div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              )}
              {m.meta?.debug && (
                <div className="muted text-[10px] ml-2 self-center">
                  {m.meta.debug}
                </div>
              )}
            </div>
          );
        })}
        {!activeSession?.messages.length && (
          <div className="chat-empty">Start chatting to plan a browsing task.</div>
        )}
      </div>
    </>
  );
}
