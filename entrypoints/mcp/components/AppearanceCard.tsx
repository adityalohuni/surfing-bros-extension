import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';
import { Card } from '../../shared/components/ui/Card';

type ThemeMode = 'light' | 'dark' | 'system';

type AppearanceCardProps = {
  theme: ThemeMode;
  onSetTheme: (next: ThemeMode) => void;
};

export function AppearanceCard({ theme, onSetTheme }: AppearanceCardProps) {
  return (
    <Card className="grid gap-3">
      <h2>Appearance</h2>
      <p className="muted">Theme controls for the sidepanel chat client.</p>
      <div className="row">
        <Button variant="secondary" className={`row ${theme === 'light' ? 'border border-ink-900' : ''}`} onClick={() => onSetTheme('light')}>
          <Sun size={16} />
          Light
        </Button>
        <Button variant="secondary" className={`row ${theme === 'dark' ? 'border border-ink-900' : ''}`} onClick={() => onSetTheme('dark')}>
          <Moon size={16} />
          Dark
        </Button>
        <Button variant="secondary" className={`row ${theme === 'system' ? 'border border-ink-900' : ''}`} onClick={() => onSetTheme('system')}>
          <Monitor size={16} />
          System
        </Button>
      </div>
    </Card>
  );
}
