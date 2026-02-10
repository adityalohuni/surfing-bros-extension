import { Brain, Layers, Settings } from 'lucide-react';
import { browser } from '#imports';
import { IconButton } from '../../shared/components/ui/IconButton';
import { Card } from '../../shared/components/ui/Card';
import { useSidepanel } from '../state/SidepanelContext';

export function SidepanelHeader() {
  const { actions } = useSidepanel();
  const brandIconUrl = browser.runtime.getURL('icons/128.png');

  return (
    <Card className="p-3 flex items-center justify-between gap-3">
      <div className="row gap-2">
        <img className="brand-icon" src={brandIconUrl} alt="SurfingBro" />
        <div className="title">SurfingBro</div>
      </div>
      <div className="row">
        <IconButton onClick={() => actions.setShowSessionsModal(true)} aria-label="Sessions" title="Sessions">
          <Layers size={16} />
        </IconButton>
        <IconButton onClick={() => actions.setShowMemoryModal(true)} aria-label="Memories" title="Memories">
          <Brain size={16} />
        </IconButton>
        <IconButton onClick={actions.openMcpConsole} aria-label="Settings" title="Settings">
          <Settings size={16} />
        </IconButton>
      </div>
    </Card>
  );
}
