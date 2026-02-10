import { PlugZap, Power } from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';
import { Card } from '../../shared/components/ui/Card';

type ConnectionCardProps = {
  wsUrl: string;
  onUrlChange: (next: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  lastError?: string | null;
};

export function ConnectionCard({
  wsUrl,
  onUrlChange,
  onConnect,
  onDisconnect,
  lastError,
}: ConnectionCardProps) {
  return (
    <Card className="grid gap-3">
      <h2>Connection</h2>
      <p className="muted">Connect the in-browser client to your MCP server over WebSocket.</p>
      <div className="row">
        <input value={wsUrl} onChange={(e) => onUrlChange(e.target.value)} className="min-w-[280px]" />
        <Button onClick={onConnect} className="row">
          <PlugZap size={16} />
          Connect
        </Button>
        <Button variant="secondary" className="row" onClick={onDisconnect}>
          <Power size={16} />
          Disconnect
        </Button>
      </div>
      {lastError && <p>Last error: {lastError}</p>}
    </Card>
  );
}
