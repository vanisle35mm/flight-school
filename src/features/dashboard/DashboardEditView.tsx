import { EyeOff, RotateCcw, Undo2 } from 'lucide-react';
import { DEFAULT_DASHBOARD_HIDDEN_TILES, DEFAULT_DASHBOARD_TILE_ORDER } from '../../lib/storage';
import type { GroundSchoolData } from '../../types';

const tileCatalog: Record<string, { label: string; description: string; group: string }> = {
  roadmap: { label: 'Roadmap', description: 'Overall private pilot journey progress.', group: 'Journey' },
  foundation: { label: 'Foundation', description: 'Ground school, medical, first lessons, and study start.', group: 'Journey' },
  preSolo: { label: 'Pre-Solo', description: 'PSTAR, ROC-A, Student Pilot Permit, and first solo.', group: 'Journey' },
  advancedTraining: { label: 'Advanced Flight Training', description: 'Cross-country planning, instrument basics, and solo XC.', group: 'Journey' },
  finalTesting: { label: 'Final Testing and Licensing', description: 'PPAER, flight test recommendation, flight test, and application.', group: 'Journey' },
  groundSchool: { label: 'Ground School', description: 'Logged ground-school hours and class schedule shortcut.', group: 'Study' },
  pstar: { label: 'PSTAR', description: 'Pre-solo air regulations test status and testing shortcut.', group: 'Testing' },
  roca: { label: 'ROC-A', description: 'Radio licence status and testing shortcut.', group: 'Testing' },
  weather: { label: 'Weather', description: 'Home airport METAR and weather page shortcut.', group: 'Flight Tools' }
};

export const DashboardEditView = ({ data, onDataChange }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void }) => {
  const tileOrder = [
    ...data.dashboardTileOrder.filter((id) => DEFAULT_DASHBOARD_TILE_ORDER.includes(id)),
    ...DEFAULT_DASHBOARD_TILE_ORDER.filter((id) => !data.dashboardTileOrder.includes(id))
  ];
  const hiddenTiles = tileOrder.filter((id) => data.dashboardHiddenTiles.includes(id));
  const visibleTiles = tileOrder.filter((id) => !data.dashboardHiddenTiles.includes(id));

  const showTile = (tileId: string) => {
    onDataChange({ ...data, dashboardHiddenTiles: data.dashboardHiddenTiles.filter((id) => id !== tileId) });
  };

  const hideTile = (tileId: string) => {
    if (data.dashboardHiddenTiles.includes(tileId)) return;
    onDataChange({ ...data, dashboardHiddenTiles: [...data.dashboardHiddenTiles, tileId] });
  };

  const resetLayout = () => {
    onDataChange({ ...data, dashboardTileOrder: [...DEFAULT_DASHBOARD_TILE_ORDER], dashboardHiddenTiles: [...DEFAULT_DASHBOARD_HIDDEN_TILES] });
  };

  return <section className="panel dashboard-edit-panel">
    <div className="panel-heading"><div><span className="eyebrow">Dashboard</span><h2>Edit Tiles</h2></div><button onClick={resetLayout}><RotateCcw size={17} />Reset</button></div>
    <div className="dashboard-edit-grid">
      <div className="field-card"><span>Visible tiles</span><strong>{visibleTiles.length}</strong><p className="empty-state">{visibleTiles.map((id) => tileCatalog[id]?.label ?? id).join(', ')}</p></div>
      <div className="field-card"><span>Hidden tiles</span><strong>{hiddenTiles.length}</strong><p className="empty-state">{hiddenTiles.length ? 'Use Add to return a tile to the dashboard.' : 'Nothing is hidden right now.'}</p></div>
    </div>
    <div className="tile-restore-list">
      {visibleTiles.map((tileId) => {
        const tile = tileCatalog[tileId];
        return <div className="tile-restore-row" key={tileId}>
          <div><span>{tile?.label ?? tileId}</span><small>{tile?.group} - {tile?.description}</small></div>
          <button onClick={() => hideTile(tileId)}><EyeOff size={16} />Remove</button>
        </div>;
      })}
      {hiddenTiles.map((tileId) => {
        const tile = tileCatalog[tileId];
        return <div className="tile-restore-row available" key={tileId}>
          <div><span>{tile?.label ?? tileId}</span><small>{tile?.group} - {tile?.description}</small></div>
          <button onClick={() => showTile(tileId)}><Undo2 size={16} />Add</button>
        </div>;
      })}
    </div>
  </section>;
};
