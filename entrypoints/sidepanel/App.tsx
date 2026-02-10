import { SidepanelProvider } from './state/SidepanelContext';
import { Card } from '../shared/components/ui/Card';
import { SidepanelHeader } from './components/SidepanelHeader';
import { ChatSection } from './components/ChatSection';
import { ContextSection } from './components/ContextSection';
import { DockSection } from './components/DockSection';
import { SidepanelModals } from './components/SidepanelModals';

function SidepanelLayout() {
  return (
    <div className="panel px-3 py-3">
      <SidepanelHeader />
      <Card className="grid gap-3 h-full grid-rows-[auto_1fr_auto_auto]">
        <ChatSection />
        <ContextSection />
        <DockSection />
      </Card>
      <SidepanelModals />
    </div>
  );
}

export default function App() {
  return (
    <SidepanelProvider>
      <SidepanelLayout />
    </SidepanelProvider>
  );
}
