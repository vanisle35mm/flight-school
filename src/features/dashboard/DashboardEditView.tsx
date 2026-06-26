import { RotateCcw, Undo2 } from 'lucide-react';
import { DEFAULT_DASHBOARD_TILE_ORDER } from '../../lib/storage';
import type { GroundSchoolData } from '../../types';

const tileLabels: Record<string, string> = {
  classes: 'Lessons',
  cards: 'Flashcards',
  accuracy: 'PSTAR Score',
  tasks: 'Tasks',
  weather: 'Weather',
  progress: 'Study Progress',
  quickActions: 'Quick Actions'
};

export const DashboardEditView = ({ data, onDataChange }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void }) => {
  const hiddenTiles = DEFAULT_DASHBOARD_TILE_ORDER.filter((id) => data.dashboardHiddenTiles.includes(id));
  const visibleTiles = DEFAULT_DASHBOARD_TILE_ORDER.filter((id) => !data.dashboardHiddenTiles.includes(id));

  const showTile = (tileId: string) => {
    onDataChange({ ...data, dashboardHiddenTiles: data.dashboardHiddenTiles.filter((id) => id !== tileId) });
  };

  const resetLayout = () => {
    onDataChange({ ...data, dashboardTileOrder: [...DEFAULT_DASHBOARD_TILE_ORDER], dashboardHiddenTiles: [] });
  };

  return <section className="panel dashboard-edit-panel">
    <div className="panel-heading"><div><span className="eyebrow">Dashboard</span><h2>Edit Tiles</h2></div><button onClick={resetLayout}><RotateCcw size={17} />Reset</button></div>
    <div className="dashboard-edit-grid">
      <div className="field-card"><span>Visible tiles</span><strong>{visibleTiles.length}</strong><p className="empty-state">{visibleTiles.map((id) => tileLabels[id]).join(', ')}</p></div>
      <div className="field-card"><span>Hidden tiles</span><strong>{hiddenTiles.length}</strong><p className="empty-state">{hiddenTiles.length ? 'Use Add to return a tile to the dashboard.' : 'Nothing is hidden right now.'}</p></div>
    </div>
    <div className="tile-restore-list">
      {hiddenTiles.map((tileId) => <div className="tile-restore-row" key={tileId}><span>{tileLabels[tileId]}</span><button onClick={() => showTile(tileId)}><Undo2 size={16} />Add</button></div>)}
      {!hiddenTiles.length && <p className="empty-state">Remove a dashboard tile and it will show up here.</p>}
    </div>
  </section>;
};
