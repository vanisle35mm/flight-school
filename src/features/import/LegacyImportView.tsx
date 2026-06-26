import { ClipboardPaste, Download, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import { parseGroundSchoolJson, STORAGE_KEY } from '../../lib/storage';
import { getStats } from '../../lib/stats';
import type { GroundSchoolData, ViewId } from '../../types';

type LegacyImportViewProps = {
  data: GroundSchoolData;
  onDataChange: (data: GroundSchoolData) => void;
  onViewChange: (view: ViewId) => void;
};

export const LegacyImportView = ({ data, onDataChange, onViewChange }: LegacyImportViewProps) => {
  const [rawValue, setRawValue] = useState('');
  const [message, setMessage] = useState('');
  const parsed = useMemo(() => parseGroundSchoolJson(rawValue), [rawValue]);
  const parsedStats = parsed ? getStats(parsed) : null;
  const currentStats = getStats(data);

  const importData = () => {
    if (!parsed) {
      setMessage('Paste valid groundschool_v496 JSON first.');
      return;
    }
    onDataChange(parsed);
    setMessage(`Imported ${parsed.classes.length} lesson${parsed.classes.length === 1 ? '' : 's'} into ${STORAGE_KEY}.`);
    onViewChange(parsed.classes.length ? 'notes' : 'dashboard');
  };

  const importFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const clipboardData = parseGroundSchoolJson(clipboardText);
      if (!clipboardData) {
        setMessage('Clipboard does not contain Flight School data.');
        return;
      }
      setRawValue(clipboardText);
      onDataChange(clipboardData);
      setMessage(`Imported ${clipboardData.classes.length} lesson${clipboardData.classes.length === 1 ? '' : 's'} from clipboard.`);
      onViewChange(clipboardData.classes.length ? 'notes' : 'dashboard');
    } catch {
      setMessage('Clipboard access was blocked. Paste the copied data into the box instead.');
    }
  };

  const exportCurrent = async () => {
    const payload = JSON.stringify({ version: 'react', exportedAt: new Date().toISOString(), data }, null, 2);
    await navigator.clipboard?.writeText(payload);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flightschool-react-backup.json';
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Current React app data copied and downloaded.');
  };

  const restoreFile = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    const fileData = parseGroundSchoolJson(text);
    if (!fileData) {
      setMessage('That file does not contain Flight School data.');
      return;
    }
    onDataChange(fileData);
    setRawValue(text);
    setMessage(`Restored ${fileData.classes.length} lesson${fileData.classes.length === 1 ? '' : 's'} from file.`);
    onViewChange(fileData.classes.length ? 'notes' : 'dashboard');
  };

  return (
    <section className="panel import-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Legacy Data</span>
          <h2>Import Saved Lesson</h2>
        </div>
        <div className="button-row">
          <button onClick={exportCurrent}><Download size={17} /> Backup</button>
          <label className="file-button">
            <Upload size={17} /> Restore File
            <input type="file" accept=".json,application/json" onChange={(event) => void restoreFile(event.target.files?.[0])} />
          </label>
        </div>
      </div>

      <div className="import-grid">
        <div className="import-editor">
          <label htmlFor="legacyImport"><ClipboardPaste size={18} /> groundschool_v496 JSON</label>
          <textarea
            id="legacyImport"
            value={rawValue}
            onChange={(event) => setRawValue(event.target.value)}
            placeholder='Paste groundschool_v496 data or a flightschool-backup.json file here'
            spellCheck={false}
          />
          <div className="button-row">
            <button onClick={importFromClipboard}><ClipboardPaste size={17} /> Import From Clipboard</button>
            <button onClick={importData}><Upload size={17} /> Import Data</button>
          </div>
          {message && <p className="status">{message}</p>}
        </div>

        <div className="import-summary">
          <div>
            <span>Current App</span>
            <strong>{currentStats.classes}</strong>
            <small>lessons here now</small>
          </div>
          <div>
            <span>Import Preview</span>
            <strong>{parsedStats ? parsedStats.classes : '--'}</strong>
            <small>lessons in pasted data</small>
          </div>
          <div>
            <span>Flashcards</span>
            <strong>{parsedStats ? parsedStats.importedCards : '--'}</strong>
            <small>imported class cards</small>
          </div>
          <div>
            <span>Tasks</span>
            <strong>{parsedStats ? parsedStats.tasksRemaining : '--'}</strong>
            <small>open tasks</small>
          </div>
        </div>
      </div>
    </section>
  );
};
