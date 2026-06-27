import { Bell, BookOpen, CheckSquare, ChevronDown, CloudSun, Gauge, GraduationCap, KeyRound, Layers, LogOut, Plane, Search, Settings, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import type { CloudSyncStatus } from '../lib/cloudStorage';
import type { ViewId } from '../types';

const navItems: Array<{ id: ViewId; label: string; icon: ReactNode }> = [
  { id: 'dashboard', label: 'Dashboard', icon: <Gauge size={18} /> },
  { id: 'notes', label: 'Notes', icon: <BookOpen size={18} /> },
  { id: 'flashcards', label: 'Flashcards', icon: <Layers size={18} /> },
  { id: 'pstar', label: 'PSTAR', icon: <GraduationCap size={18} /> },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={18} /> },
  { id: 'weather', label: 'Weather', icon: <CloudSun size={18} /> }
];

const titleForView = (view: ViewId) => view === 'import' ? 'Import' : view === 'dashboardEdit' ? 'Edit Dashboard' : view === 'users' ? 'Admin Console' : view === 'account' ? 'Account' : navItems.find((item) => item.id === view)?.label ?? 'Dashboard';

const cloudStatusLabel: Record<CloudSyncStatus, string> = {
  local: 'Local',
  loading: 'Cloud loading',
  online: 'Cloud online',
  syncing: 'Cloud syncing',
  error: 'Cloud error'
};

export const Shell = ({ children, activeView, onViewChange, search, onSearchChange, activeUserName, canAdmin, canManageAccount, cloudStatus, onLogout }: { children: ReactNode; activeView: ViewId; onViewChange: (view: ViewId) => void; search: string; onSearchChange: (value: string) => void; activeUserName: string; canAdmin: boolean; canManageAccount: boolean; cloudStatus: CloudSyncStatus; onLogout: () => void }) => <div className="app-shell cockpit-shell">
  <aside className="sidebar cockpit-sidebar">
    <div className="brand cockpit-brand"><span className="brand-mark"><Plane size={21} /></span><strong>Flight School</strong></div>
    <nav className="nav-list" aria-label="Primary">{navItems.map((item) => <button className={item.id === activeView ? 'nav-item active' : 'nav-item'} key={item.id} onClick={() => onViewChange(item.id)}>{item.icon}<span>{item.label}</span></button>)}</nav>
    <div className="sidebar-footer">{canAdmin && <button className={activeView === 'users' ? 'nav-item active' : 'nav-item'} onClick={() => onViewChange('users')} aria-label="Admin console"><ShieldCheck size={19} /><span>Admin</span></button>}{canAdmin && <button className={activeView === 'import' ? 'nav-item active' : 'nav-item'} onClick={() => onViewChange('import')} aria-label="Import and export"><Settings size={19} /><span>Import</span></button>}{canAdmin && <button className={activeView === 'dashboardEdit' ? 'nav-item active' : 'nav-item'} onClick={() => onViewChange('dashboardEdit')} aria-label="Edit dashboard tiles"><SlidersHorizontal size={19} /><span>Edit Dash</span></button>}{canManageAccount && <button className={activeView === 'account' ? 'nav-item active' : 'nav-item'} onClick={() => onViewChange('account')} aria-label="Account settings"><KeyRound size={19} /><span>Account</span></button>}<button className="nav-item" onClick={onLogout} aria-label="Log out"><LogOut size={19} /><span>Logout</span></button></div>
  </aside>
  <main className="main-area cockpit-main">
    <header className="topbar cockpit-topbar">
      <div className="topbar-title"><span className="eyebrow">Cockpit Dashboard</span><h1>{titleForView(activeView)}</h1></div>
      {activeView !== 'dashboard' && <label className="search-box cockpit-search"><Search size={17} /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search notes, cards, topics" /></label>}
      <div className="status-cluster" aria-label="Flight status"><button className="user-pill" onClick={() => canAdmin ? onViewChange('users') : canManageAccount ? onViewChange('account') : onLogout()}><UserRound size={16} />Captain {activeUserName}</button><span className={`cloud-sync-pill ${cloudStatus}`}><CloudSun size={17} />{cloudStatusLabel[cloudStatus]}</span><span className="station-pill">CYYJ <ChevronDown size={14} /></span><span className="weather-pill"><CloudSun size={17} />17 C</span><button className="bell-button" aria-label="Notifications"><Bell size={18} /></button></div>
    </header>
    {children}
  </main>
</div>;
