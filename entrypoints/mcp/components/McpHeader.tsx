import { BrandHeader } from '../../shared/components/BrandHeader';
import { Card } from '../../shared/components/ui/Card';

type McpHeaderProps = {
  iconUrl: string;
  connected: boolean;
};

export function McpHeader({ iconUrl, connected }: McpHeaderProps) {
  return (
    <Card>
      <BrandHeader
        iconUrl={iconUrl}
        title="SurfingBro MCP Console"
        description="Settings for the in-browser client and MCP bridge."
      />
      <div className={`status ${connected ? 'connected' : ''}`}>
        <span className="dot" />
        {connected ? 'Connected' : 'Disconnected'}
      </div>
    </Card>
  );
}
