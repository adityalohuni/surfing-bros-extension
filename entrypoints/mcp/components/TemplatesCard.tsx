import { Button } from '../../shared/components/ui/Button';
import { Card } from '../../shared/components/ui/Card';

type TemplatesCardProps = {
  defaultTemplateName: string;
  onOpen: () => void;
};

export function TemplatesCard({ defaultTemplateName, onOpen }: TemplatesCardProps) {
  return (
    <Card className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2>Prompt Templates</h2>
          <p className="muted">Manage the prompts used by the sidepanel client.</p>
        </div>
        <Button variant="secondary" onClick={onOpen}>Manage templates</Button>
      </div>
      <div className="row">
        <div className="surface-soft px-3 py-2">
          <div className="text-xs uppercase tracking-widest muted">Default</div>
          <div className="font-semibold">{defaultTemplateName}</div>
        </div>
      </div>
    </Card>
  );
}
