import { Play, Square, Download, Trash2 } from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';
import { Card } from '../../shared/components/ui/Card';

type RecorderCardProps = {
  recording: boolean;
  recordingCount: number;
  recordedJson: string;
  onStart: () => void;
  onStop: () => void;
  onExport: () => void;
  onClear: () => void;
  onRecordedJsonChange: (next: string) => void;
};

export function RecorderCard({
  recording,
  recordingCount,
  recordedJson,
  onStart,
  onStop,
  onExport,
  onClear,
  onRecordedJsonChange,
}: RecorderCardProps) {
  return (
    <Card>
      <h2>Recorder</h2>
      <p className="muted">Record a sequence of in-browser actions for reuse by the client.</p>
      <div className="row">
        <div className={`status ${recording ? 'connected' : ''}`}>
          <span className="dot" />
          {recording ? 'Recording' : 'Stopped'}
        </div>
        <span>{recordingCount} events</span>
      </div>
      <div className="row">
        <Button onClick={onStart} className="row">
          <Play size={16} />
          Start
        </Button>
        <Button variant="secondary" className="row" onClick={onStop}>
          <Square size={16} />
          Stop
        </Button>
        <Button variant="secondary" className="row" onClick={onExport}>
          <Download size={16} />
          Export
        </Button>
        <Button variant="secondary" className="row" onClick={onClear}>
          <Trash2 size={16} />
          Clear
        </Button>
      </div>
      {recordedJson && (
        <textarea
          value={recordedJson}
          onChange={(e) => onRecordedJsonChange(e.target.value)}
          rows={8}
          className="w-full"
        />
      )}
    </Card>
  );
}
