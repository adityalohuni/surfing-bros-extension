import { Button } from '../../shared/components/ui/Button';
import { Card } from '../../shared/components/ui/Card';

type ProvidersCardProps = {
  providerCount: number;
  defaultProviderLabel: string;
  defaultModelLabel: string;
  onOpen: () => void;
};

export function ProvidersCard({
  providerCount,
  defaultProviderLabel,
  defaultModelLabel,
  onOpen,
}: ProvidersCardProps) {
  return (
    <Card className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2>Providers</h2>
          <p className="muted">Configure LLM providers and defaults for the sidepanel.</p>
        </div>
        <Button variant="secondary" onClick={onOpen}>Manage providers</Button>
      </div>
      <div className="row">
        <div className="surface-soft px-3 py-2">
          <div className="text-xs uppercase tracking-widest muted">Default</div>
          <div className="font-semibold">{defaultProviderLabel} • {defaultModelLabel}</div>
        </div>
        <div className="surface-soft px-3 py-2">
          <div className="text-xs uppercase tracking-widest muted">Enabled</div>
          <div className="font-semibold">{providerCount}</div>
        </div>
      </div>
    </Card>
  );
}
