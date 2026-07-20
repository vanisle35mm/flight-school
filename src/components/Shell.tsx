import { Bell, BookOpen, CalendarPlus, CheckSquare, ChevronDown, CloudSun, Gauge, GraduationCap, KeyRound, Layers, LogOut, Plane, PlaneTakeoff, Search, Settings, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CelebrationOverlay } from './CelebrationOverlay';
import { getStoredWeatherSummary, WEATHER_SUMMARY_EVENT, type WeatherSummary } from '../features/weather/weather';
import type { CloudSyncStatus } from '../lib/cloudStorage';
import type { ViewId } from '../types';

const groundSchoolNavItems: Array<{ id: ViewId; label: string; icon: ReactNode }> = [
  { id: 'dashboard', label: 'Roadmap', icon: <Gauge size={18} /> },
  { id: 'notes', label: 'Ground School', icon: <BookOpen size={18} /> },
  { id: 'flashcards', label: 'Flashcards', icon: <Layers size={18} /> },
  { id: 'testing', label: 'Testing', icon: <GraduationCap size={18} /> },
  { id: 'weather', label: 'Weather', icon: <CloudSun size={18} /> }
];

const flightTrainingNavItems: Array<{ id: ViewId; label: string; icon: ReactNode }> = [
  { id: 'flightChecklist', label: 'Checklist', icon: <CheckSquare size={18} /> },
  { id: 'flightPanel', label: 'C172 Panel', icon: <Gauge size={18} /> },
  { id: 'outsideChecks', label: 'Outside Checks', icon: <PlaneTakeoff size={18} /> },
  { id: 'flightSchedule', label: 'Flight Schedule', icon: <CalendarPlus size={18} /> }
];
const FLIGHT_TRAINING_NAV_ENABLED = false;

const navItems: Array<{ id: ViewId; label: string; icon: ReactNode }> = [
  ...groundSchoolNavItems,
  ...(FLIGHT_TRAINING_NAV_ENABLED ? flightTrainingNavItems : [])
];
const groundSchoolViewIds = new Set<ViewId>(groundSchoolNavItems.map((item) => item.id));
const flightTrainingViewIds = new Set<ViewId>(flightTrainingNavItems.map((item) => item.id));
const testingViewIds = new Set<ViewId>(['testing', 'pstar', 'roca']);

const titleForView = (view: ViewId) => testingViewIds.has(view) ? 'Testing' : view === 'tasks' ? 'Action Items' : view === 'import' ? 'Import' : view === 'dashboardEdit' ? 'Edit Dashboard' : view === 'users' ? 'Admin Console' : view === 'account' ? 'Account' : navItems.find((item) => item.id === view)?.label ?? 'Dashboard';

const cloudStatusLabel: Record<CloudSyncStatus, string> = {
  local: 'Local only',
  loading: 'Loading data',
  online: 'Saved online',
  syncing: 'Saving',
  error: 'Save error'
};
const NAV_STATE_KEY = 'flightschool_nav_modules';
const loadNavModuleState = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(NAV_STATE_KEY) ?? '{}') as Partial<Record<'groundSchoolOpen' | 'flightTrainingOpen', boolean>>;
    return {
      groundSchoolOpen: typeof parsed.groundSchoolOpen === 'boolean' ? parsed.groundSchoolOpen : true,
      flightTrainingOpen: typeof parsed.flightTrainingOpen === 'boolean' ? parsed.flightTrainingOpen : false
    };
  } catch {
    return { groundSchoolOpen: true, flightTrainingOpen: false };
  }
};

export const Shell = ({ children, activeView, onViewChange, search, onSearchChange, activeUserName, canAdmin, canManageAccount, cloudStatus, onLogout }: { children: ReactNode; activeView: ViewId; onViewChange: (view: ViewId) => void; search: string; onSearchChange: (value: string) => void; activeUserName: string; canAdmin: boolean; canManageAccount: boolean; cloudStatus: CloudSyncStatus; onLogout: () => void }) => {
  const [weatherSummary, setWeatherSummary] = useState(getStoredWeatherSummary);
  const adminViews: ViewId[] = ['users', 'import'];
  const isAdminView = adminViews.includes(activeView);
  const [adminMenuOpen, setAdminMenuOpen] = useState(isAdminView);
  const firstActiveViewSync = useRef(true);
  const [groundSchoolOpen, setGroundSchoolOpen] = useState(() => loadNavModuleState().groundSchoolOpen);
  const [flightTrainingOpen, setFlightTrainingOpen] = useState(() => loadNavModuleState().flightTrainingOpen);
  useEffect(() => {
    const handleWeatherSummary = (event: Event) => setWeatherSummary((event as CustomEvent<WeatherSummary>).detail);
    window.addEventListener(WEATHER_SUMMARY_EVENT, handleWeatherSummary);
    return () => window.removeEventListener(WEATHER_SUMMARY_EVENT, handleWeatherSummary);
  }, []);
  useEffect(() => {
    if (firstActiveViewSync.current) {
      firstActiveViewSync.current = false;
      return;
    }
    if (groundSchoolViewIds.has(activeView) || testingViewIds.has(activeView)) setGroundSchoolOpen(true);
    if (FLIGHT_TRAINING_NAV_ENABLED && flightTrainingViewIds.has(activeView)) setFlightTrainingOpen(true);
  }, [activeView]);
  useEffect(() => {
    window.localStorage.setItem(NAV_STATE_KEY, JSON.stringify({ groundSchoolOpen, flightTrainingOpen }));
  }, [flightTrainingOpen, groundSchoolOpen]);
  const changeView = (view: ViewId) => {
    onViewChange(view);
    setAdminMenuOpen(false);
  };
  return <div className="app-shell cockpit-shell">
  <aside className="sidebar cockpit-sidebar">
    <div className="brand cockpit-brand"><span className="brand-mark"><Plane size={21} /></span><strong>Flight School</strong></div>
    <nav className="nav-list" aria-label="Primary">
      <button className="nav-module-toggle" onClick={() => setGroundSchoolOpen((open) => !open)} aria-expanded={groundSchoolOpen} aria-controls="ground-school-navigation"><span>Ground School</span><ChevronDown className={groundSchoolOpen ? 'menu-chevron open' : 'menu-chevron'} size={15} /></button>
      {groundSchoolOpen && <div className="nav-module-group" id="ground-school-navigation">{groundSchoolNavItems.map((item) => <button className={item.id === activeView || (item.id === 'testing' && testingViewIds.has(activeView)) ? 'nav-item active' : 'nav-item'} key={item.id} onClick={() => changeView(item.id)}>{item.icon}<span>{item.label}</span></button>)}</div>}
      {FLIGHT_TRAINING_NAV_ENABLED && <>
        <button className="nav-module-toggle" onClick={() => setFlightTrainingOpen((open) => !open)} aria-expanded={flightTrainingOpen} aria-controls="flight-training-navigation"><span>Flight Training</span><ChevronDown className={flightTrainingOpen ? 'menu-chevron open' : 'menu-chevron'} size={15} /></button>
        {flightTrainingOpen && <div className="nav-module-group" id="flight-training-navigation">{flightTrainingNavItems.map((item) => <button className={item.id === activeView ? 'nav-item active' : 'nav-item'} key={item.id} onClick={() => changeView(item.id)}>{item.icon}<span>{item.label}</span></button>)}</div>}
      </>}
    </nav>
    <div className="sidebar-footer">
      {canAdmin && <div className="admin-nav-group">
        <button className={isAdminView ? 'nav-item admin-nav-toggle active' : 'nav-item admin-nav-toggle'} onClick={() => setAdminMenuOpen((open) => !open)} aria-expanded={adminMenuOpen} aria-controls="admin-navigation"><ShieldCheck size={19} /><span>Admin</span><ChevronDown className={adminMenuOpen ? 'menu-chevron open' : 'menu-chevron'} size={15} /></button>
        {adminMenuOpen && <div className="admin-submenu" id="admin-navigation">
          <button className={activeView === 'users' ? 'nav-item active' : 'nav-item'} onClick={() => changeView('users')}><ShieldCheck size={16} /><span>Users</span></button>
          <button className={activeView === 'import' ? 'nav-item active' : 'nav-item'} onClick={() => changeView('import')}><Settings size={16} /><span>Import / Export</span></button>
        </div>}
      </div>}
      <button className={activeView === 'dashboardEdit' ? 'nav-item active' : 'nav-item'} onClick={() => changeView('dashboardEdit')}><SlidersHorizontal size={19} /><span>Edit Dashboard</span></button>
      {canManageAccount && <button className={activeView === 'account' ? 'nav-item active' : 'nav-item'} onClick={() => changeView('account')} aria-label="Account settings"><KeyRound size={19} /><span>Account</span></button>}
      <button className="nav-item" onClick={onLogout} aria-label="Log out"><LogOut size={19} /><span>Logout</span></button>
    </div>
  </aside>
  <main className="main-area cockpit-main">
    <header className="topbar cockpit-topbar">
      <div className="topbar-title"><span className="eyebrow">Cockpit Dashboard</span><h1>{titleForView(activeView)}</h1></div>
      {activeView !== 'dashboard' && <label className="search-box cockpit-search"><Search size={17} /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search ground school, cards, topics" /></label>}
      <div className="status-cluster" aria-label="Flight status"><button className="user-pill" onClick={() => canAdmin ? onViewChange('users') : canManageAccount ? onViewChange('account') : onLogout()}><UserRound size={16} />Captain {activeUserName}</button><span className={`cloud-sync-pill ${cloudStatus}`}><CloudSun size={17} />{cloudStatusLabel[cloudStatus]}</span><button className="station-pill weather-shortcut" onClick={() => changeView('weather')} aria-label="Open weather page">{weatherSummary.station} <ChevronDown size={14} /></button><button className="weather-pill weather-shortcut" onClick={() => changeView('weather')} aria-label="Open weather page"><CloudSun size={17} />{weatherSummary.temperature}</button><button className="bell-button" aria-label="Notifications"><Bell size={18} /></button></div>
    </header>
    <CelebrationOverlay />
    {children}
  </main>
</div>;
};
