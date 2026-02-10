import * as Dialog from '@radix-ui/react-dialog';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { providerCatalog } from '../../shared/llm/catalog';
import type { ProviderConfig } from '../../shared/llm/types';
import { Button } from '../../shared/components/ui/Button';
import { IconButton } from '../../shared/components/ui/IconButton';

type ProvidersModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providers: ProviderConfig[];
  defaultProviderId?: string;
  defaultModelId?: string;
  testStatus: Record<string, { status: 'idle' | 'testing' | 'ok' | 'error'; message: string }>;
  onAddProvider: (id: string) => void;
  onRemoveProvider: (id: string) => void;
  onUpdateProvider: (id: string, patch: Partial<ProviderConfig>) => void;
  onSetProviderDefault: (providerId: string, modelId: string) => void;
  onSetGlobalDefault: (providerId: string, modelId: string) => void;
  onTestProvider: (providerId: string) => void;
  onTestAll: () => void;
};

export function ProvidersModal({
  open,
  onOpenChange,
  providers,
  defaultProviderId,
  defaultModelId,
  testStatus,
  onAddProvider,
  onRemoveProvider,
  onUpdateProvider,
  onSetProviderDefault,
  onSetGlobalDefault,
  onTestProvider,
  onTestAll,
}: ProvidersModalProps) {
  const available = providerCatalog.filter(p => !providers.some(cfg => cfg.id === p.id));
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content surface p-4 max-w-4xl w-full">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="section-title">Providers</Dialog.Title>
              <div className="muted">Add providers, set API keys, and choose defaults.</div>
            </div>
            <IconButton aria-label="Close" title="Close" onClick={() => onOpenChange(false)}>
              <X size={14} />
            </IconButton>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-3">
              <div className="surface-soft p-3 grid gap-2">
                <div className="row justify-between">
                  <div className="text-sm font-semibold">Add provider</div>
                  <Button variant="secondary" onClick={onTestAll}>Test all</Button>
                </div>
                {available.length === 0 && <div className="muted">All providers already added.</div>}
                <div className="row">
                  {available.map(p => (
                    <Button key={p.id} variant="secondary" onClick={() => onAddProvider(p.id)}>
                      {p.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                {providers.length === 0 && <div className="muted">No providers configured yet.</div>}
                {providers.map((provider) => (
                  <div key={provider.id} className="surface-soft p-3 grid gap-2">
                    <div className="row justify-between">
                      <div className="font-semibold">{provider.name}</div>
                      <div className="row">
                        <label className="row text-xs">
                          <input
                            type="checkbox"
                            checked={provider.enabled}
                            onChange={(e) => onUpdateProvider(provider.id, { enabled: e.target.checked })}
                          />
                          Enabled
                        </label>
                        <Button variant="secondary" onClick={() => onTestProvider(provider.id)}>
                          {testStatus[provider.id]?.status === 'testing' ? 'Testing…' : 'Test'}
                        </Button>
                        <Button variant="secondary" onClick={() => onRemoveProvider(provider.id)}>Remove</Button>
                      </div>
                    </div>
                    {testStatus[provider.id]?.message && (
                      <div className={`text-xs row gap-2 ${testStatus[provider.id]?.status === 'ok' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {testStatus[provider.id]?.status === 'ok' && <CheckCircle2 size={12} />}
                        {testStatus[provider.id]?.status === 'error' && <XCircle size={12} />}
                        {testStatus[provider.id]?.message}
                      </div>
                    )}
                    <input
                      value={provider.apiKey}
                      onChange={(e) => onUpdateProvider(provider.id, { apiKey: e.target.value })}
                      placeholder={`${provider.name} API key`}
                    />
                    <div className="row">
                      <select
                        value={provider.defaultModelId ?? provider.models[0]?.id}
                        onChange={(e) => onSetProviderDefault(provider.id, e.target.value)}
                      >
                        {provider.models.map(model => (
                          <option key={model.id} value={model.id}>
                            {model.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="secondary"
                        onClick={() => onSetGlobalDefault(provider.id, provider.defaultModelId ?? provider.models[0]?.id)}
                      >
                        Set as global default
                      </Button>
                      {defaultProviderId === provider.id && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">
                          Global Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-soft p-3 grid gap-2">
              <div className="text-sm font-semibold">Global Default</div>
              <div className="muted">
                {defaultProviderId
                  ? `Provider: ${providers.find(p => p.id === defaultProviderId)?.name ?? defaultProviderId}`
                  : 'No default provider set.'}
              </div>
              <div className="muted">
                {defaultModelId ? `Model: ${defaultModelId}` : 'No default model set.'}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
