import { PlugZap, Power } from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';
import { Card } from '../../shared/components/ui/Card';

type ConnectionCardProps = {
  wsUrl: string;
  mcpStreamUrl: string;
  mcpToken: string;
  mcpClientName: string;
  onUrlChange: (next: string) => void;
  onMcpStreamUrlChange: (next: string) => void;
  onMcpTokenChange: (next: string) => void;
  onMcpClientNameChange: (next: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  lastError?: string | null;
};

export function ConnectionCard({
  wsUrl,
  mcpStreamUrl,
  mcpToken,
  mcpClientName,
  onUrlChange,
  onMcpStreamUrlChange,
  onMcpTokenChange,
  onMcpClientNameChange,
  onConnect,
  onDisconnect,
  lastError,
}: ConnectionCardProps) {
  return (
    <Card className="grid gap-3">
      <h2>Connection</h2>
      <p className="muted">WebSocket bridge + MCP stream settings used by sidepanel and console.</p>
      <div className="grid gap-2">
        <label className="grid gap-1">
          <span className="muted">WebSocket URL</span>
          <input value={wsUrl} onChange={(e) => onUrlChange(e.target.value)} className="min-w-[280px]" />
        </label>
        <label className="grid gap-1">
          <span className="muted">MCP Stream URL</span>
          <input value={mcpStreamUrl} onChange={(e) => onMcpStreamUrlChange(e.target.value)} className="min-w-[280px]" />
        </label>
        <label className="grid gap-1">
          <span className="muted">MCP Token</span>
          <input value={mcpToken} onChange={(e) => onMcpTokenChange(e.target.value)} className="min-w-[280px]" placeholder="Bearer token from mcpd config.toml" />
        </label>
        <label className="grid gap-1">
          <span className="muted">MCP Client Name</span>
          <input value={mcpClientName} onChange={(e) => onMcpClientNameChange(e.target.value)} className="min-w-[280px]" />
        </label>
      </div>
      <div className="row">
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
