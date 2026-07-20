import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { BookOpen, CheckSquare, CirclePlus, ClipboardCheck, EyeOff, GraduationCap, Layers, NotebookTabs, Percent, Plane, Star } from 'lucide-react';
import { DEFAULT_DASHBOARD_TILE_ORDER } from '../../lib/storage';
import { getStats } from '../../lib/stats';
import type { GroundSchoolData, ViewId } from '../../types';
import { WeatherPanel } from '../weather/WeatherPanel';

type StatId = 'classes' | 'cards' | 'accuracy' | 'tasks';
type TileId = StatId | 'taskList' | 'weather' | 'progress' | 'quickActions';

const statTargets: Record<StatId, ViewId> = {
  classes: 'notes',
  cards: 'flashcards',
  accuracy: 'testing',
  tasks: 'tasks'
};

const tileLabels: Record<TileId, string> = {
  classes: 'Lessons',
  cards: 'Flashcards',
  accuracy: 'PSTAR Score',
  tasks: 'Tasks',
  taskList: 'Task List',
  weather: 'Weather',
  progress: 'Study Progress',
  quickActions: 'Quick Actions'
};

const isTileId = (id: string): id is TileId => DEFAULT_DASHBOARD_TILE_ORDER.includes(id);
const clampPct = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const getDayPart = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

export const Dashboard = ({ data, onDataChange, onViewChange }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; onViewChange: (view: ViewId) => void }) => {
  const [draggedId, setDraggedId] = useState<TileId | null>(null);
  const activeUser = data.users[data.activeUserId];
  const firstName = activeUser?.firstName || 'Pilot';
  const stats = getStats(data);
  const noteCount = data.classes.filter((session) => session.notes.trim()).length;
  const practiceCount = data.tcHistory.length;
  const studyPct = clampPct(Math.max(stats.taskPct, stats.hasAccuracy ? stats.accuracy : 0));
  const pstarScoreNote = stats.hasAccuracy ? `${stats.pstarQuestionsScored} questions` : stats.latestPstarAttemptTotal ? 'Need 10+ q run' : 'No score yet';
  const maxLessons = Math.max(24, stats.classes);
  const maxNotes = Math.max(60, noteCount);
  const maxCards = Math.max(400, stats.cards);
  const maxPractice = Math.max(10, practiceCount);
  const openTasks = data.todos
    .map((todo, index) => ({ todo, index }))
    .filter(({ todo }) => !todo.done)
    .sort((left, right) => {
      if (!left.todo.dueDate) return 1;
      if (!right.todo.dueDate) return -1;
      return left.todo.dueDate.localeCompare(right.todo.dueDate);
    });
  const statCards = [
    { id: 'classes' as StatId, label: 'Lessons', value: stats.classes, note: 'Total', icon: <NotebookTabs size={20} /> },
    { id: 'cards' as StatId, label: 'Flashcards', value: stats.cards, note: 'Total', icon: <Layers size={20} /> },
    { id: 'accuracy' as StatId, label: 'PSTAR Score', value: stats.hasAccuracy ? `${stats.accuracy}%` : '--', note: pstarScoreNote, icon: <Percent size={20} /> },
    { id: 'tasks' as StatId, label: 'Tasks', value: stats.tasksRemaining, note: stats.dueSoon ? `${stats.dueSoon} due soon` : 'Open', icon: <CheckSquare size={20} /> }
  ];
  const progressRows = [
    { label: 'Lessons', value: `${stats.classes} / ${maxLessons}`, percent: clampPct((stats.classes / maxLessons) * 100), icon: <BookOpen size={18} /> },
    { label: 'Notes', value: `${noteCount} / ${maxNotes}`, percent: clampPct((noteCount / maxNotes) * 100), icon: <NotebookTabs size={18} /> },
    { label: 'Flashcards', value: `${stats.cards} / ${maxCards}`, percent: clampPct((stats.cards / maxCards) * 100), icon: <Layers size={18} /> },
    { label: 'PSTAR Practice', value: `${practiceCount} / ${maxPractice}`, percent: clampPct((practiceCount / maxPractice) * 100), icon: <GraduationCap size={18} /> }
  ];

  const baseOrder = data.dashboardTileOrder.filter((id): id is TileId => isTileId(id));
  DEFAULT_DASHBOARD_TILE_ORDER.forEach((id) => {
    if (isTileId(id) && !baseOrder.includes(id)) baseOrder.push(id);
  });
  const visibleOrder = baseOrder.filter((id) => !data.dashboardHiddenTiles.includes(id));

  const moveTile = (targetId: TileId) => {
    if (!draggedId || draggedId === targetId) return;
    const nextOrder = [...baseOrder];
    const fromIndex = nextOrder.indexOf(draggedId);
    const toIndex = nextOrder.indexOf(targetId);
    if (fromIndex < 0 || toIndex < 0) return;
    nextOrder.splice(fromIndex, 1);
    nextOrder.splice(toIndex, 0, draggedId);
    onDataChange({ ...data, dashboardTileOrder: nextOrder });
  };

  const removeTile = (tileId: TileId) => {
    if (data.dashboardHiddenTiles.includes(tileId)) return;
    onDataChange({ ...data, dashboardHiddenTiles: [...data.dashboardHiddenTiles, tileId] });
  };

  const renderStatTile = (tileId: StatId) => {
    const card = statCards.find((item) => item.id === tileId);
    if (!card) return null;
    return <button className="stat-card cockpit-stat-card" onClick={() => onViewChange(statTargets[card.id])}>{card.icon}<span>{card.label}</span><strong>{card.value}</strong><small>{card.note}</small></button>;
  };

  const renderTileContent = (tileId: TileId): ReactNode => {
    if (tileId === 'classes' || tileId === 'cards' || tileId === 'accuracy' || tileId === 'tasks') return renderStatTile(tileId);
    if (tileId === 'taskList') return <section className="panel cockpit-panel task-list-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">Tasks</span><h2>Upcoming</h2></div>
        <div className="task-list-summary">
          <div className="task-completion-dial" style={{ '--pct': stats.taskPct } as CSSProperties} aria-label={`${stats.taskPct}% of tasks complete`}><span>{stats.taskPct}%</span></div>
          <strong className="task-list-count">{openTasks.length} open</strong>
        </div>
      </div>
      <div className="task-tile-list">
        {openTasks.length ? openTasks.slice(0, 4).map(({ todo, index }) => <div className="task-tile-row" key={`${todo.text}-${index}`}>
          <CheckSquare size={17} />
          <span>{todo.text}</span>
          <small>{todo.dueDate ? new Date(`${todo.dueDate}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No date'}</small>
        </div>) : <p className="empty-state">No open tasks. Clear skies.</p>}
      </div>
      <div className="task-list-footer">
        <span>{openTasks.length > 4 ? `+${openTasks.length - 4} more` : 'Keep your training on track.'}</span>
        <button onClick={() => onViewChange('tasks')}><ClipboardCheck size={16} />Manage Tasks</button>
      </div>
    </section>;
    if (tileId === 'weather') return <WeatherPanel compact onOpenWeather={() => onViewChange('weather')} />;
    if (tileId === 'progress') return <section className="panel cockpit-panel progress-panel">
      <div className="panel-heading"><div><span className="eyebrow">Study Progress</span><h2>This Week</h2></div></div>
      <div className="progress-content">
        <div className="progress-ring" style={{ '--pct': studyPct } as CSSProperties}><div><strong>{studyPct}%</strong><span>This Week</span></div></div>
        <div className="progress-bars">{progressRows.map((row) => <div className="progress-row" key={row.label}><div className="progress-row-head"><span>{row.icon}{row.label}</span><strong>{row.value}</strong></div><div className="progress-track"><span style={{ width: `${row.percent}%` }} /></div></div>)}</div>
      </div>
    </section>;
    return <section className="panel cockpit-panel quick-actions-panel">
      <div className="panel-heading"><div><span className="eyebrow">Quick Actions</span><h2>Next Move</h2></div></div>
      <div className="quick-action-grid">
        <button className="quick-action" onClick={() => onViewChange('notes')}><CirclePlus size={26} /><span>New Note</span></button>
        <button className="quick-action" onClick={() => onViewChange('flashcards')}><Layers size={26} /><span>Study Flashcards</span></button>
        <button className="quick-action" onClick={() => onViewChange('testing')}><GraduationCap size={26} /><span>Testing</span></button>
        <button className="quick-action" onClick={() => onViewChange('tasks')}><ClipboardCheck size={26} /><span>View Tasks</span></button>
      </div>
    </section>;
  };

  return <div className="cockpit-dashboard">
    <section className="cockpit-hero">
      <div><h2>Good {getDayPart()}, Captain {firstName}.</h2><p>Ready for today's training?</p></div>
      <div className="wing-badge" aria-hidden="true"><Plane size={28} /><Star size={18} /></div>
    </section>

    <div className="dashboard-tile-board" aria-label="Movable dashboard tiles">
      {visibleOrder.map((tileId) => <div className={draggedId === tileId ? `dashboard-tile dashboard-tile-${tileId} dragging` : `dashboard-tile dashboard-tile-${tileId}`} draggable key={tileId} onDragStart={() => setDraggedId(tileId)} onDragEnd={() => setDraggedId(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); moveTile(tileId); setDraggedId(null); }}>
        <button className="tile-remove-button" onClick={() => removeTile(tileId)} aria-label={`Hide ${tileLabels[tileId]} tile`} title={`Hide ${tileLabels[tileId]}`}><EyeOff size={14} /></button>
        {renderTileContent(tileId)}
      </div>)}
      {!visibleOrder.length && <section className="panel empty-dashboard-panel"><h2>No dashboard tiles</h2><p className="empty-state">Use Edit Dash in the sidebar to add tiles back.</p><button onClick={() => onViewChange('dashboardEdit')}>Edit Dashboard</button></section>}
    </div>
  </div>;
};
