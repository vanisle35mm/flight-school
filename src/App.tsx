import { useEffect, useRef, useState } from 'react';
import { Shell } from './components/Shell';
import { AdminConsoleView } from './features/admin/AdminConsoleView';
import { Dashboard } from './features/dashboard/Dashboard';
import { DashboardEditView } from './features/dashboard/DashboardEditView';
import { FlashcardsView } from './features/flashcards/FlashcardsView';
import { NotesView } from './features/notes/NotesView';
import { PstarView } from './features/pstar/PstarView';
import { TasksView } from './features/tasks/TasksView';
import { LegacyImportView } from './features/import/LegacyImportView';
import { LoginView } from './features/login/LoginView';
import { WeatherPanel } from './features/weather/WeatherPanel';
import { isCloudStorageConfigured, loadCloudGroundSchoolData, saveCloudGroundSchoolData, type CloudSyncStatus } from './lib/cloudStorage';
import { activateUserData, loadGroundSchoolData, saveGroundSchoolData } from './lib/storage';
import type { GroundSchoolData, ViewId } from './types';

const getDataWeight = (data: GroundSchoolData) => {
  const users = Object.values(data.users);
  const classCount = users.reduce((sum, user) => sum + user.classes.length, 0);
  const cardCount = users.reduce((sum, user) => sum + user.classes.reduce((cardSum, session) => cardSum + session.flashcards.length, 0), 0);
  const taskCount = users.reduce((sum, user) => sum + user.todos.length, 0);
  const pstarAttemptCount = users.reduce((sum, user) => sum + user.tcHistory.length + user.tcMissedIds.length, 0);
  const namedUserCount = users.filter((user) => user.firstName !== 'Pilot' || user.id !== 'user_default').length;
  return users.length + namedUserCount + classCount * 5 + cardCount + taskCount + pstarAttemptCount;
};

export const App = () => {
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState<GroundSchoolData>(() => loadGroundSchoolData());
  const initialLocalData = useRef(data);
  const [cloudStatus, setCloudStatus] = useState<CloudSyncStatus>(() => isCloudStorageConfigured() ? 'loading' : 'local');
  const [cloudReady, setCloudReady] = useState(() => !isCloudStorageConfigured());
  const lastSavedCloudPayload = useRef('');

  useEffect(() => {
    let cancelled = false;
    if (!isCloudStorageConfigured()) {
      setCloudStatus('local');
      setCloudReady(true);
      return;
    }

    setCloudStatus('loading');
    loadCloudGroundSchoolData()
      .then((cloudData) => {
        if (cancelled) return;
        if (cloudData && getDataWeight(cloudData) >= getDataWeight(initialLocalData.current)) {
          setData(cloudData);
        }
        setCloudStatus('online');
        setCloudReady(true);
      })
      .catch((error) => {
        console.error('Flight School cloud load failed.', error);
        if (!cancelled) {
          setCloudStatus('error');
          setCloudReady(true);
        }
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    saveGroundSchoolData(data);

    if (!cloudReady || !isCloudStorageConfigured()) return;
    const payload = JSON.stringify(data);
    if (payload === lastSavedCloudPayload.current) return;
    lastSavedCloudPayload.current = payload;
    setCloudStatus('syncing');

    const timeoutId = window.setTimeout(() => {
      saveCloudGroundSchoolData(data)
        .then(() => setCloudStatus('online'))
        .catch((error) => {
          console.error('Flight School cloud save failed.', error);
          setCloudStatus('error');
        });
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [cloudReady, data]);

  const activeUser = data.users[data.activeUserId];
  const isAdmin = activeUser?.role === 'admin';
  const adminViews: ViewId[] = ['users', 'import', 'dashboardEdit'];
  const changeView = (view: ViewId) => setActiveView(adminViews.includes(view) && !isAdmin ? 'dashboard' : view);
  if (!isLoggedIn) return <LoginView data={data} onDataChange={setData} onLogin={() => setIsLoggedIn(true)} />;
  return <Shell activeView={activeView} onViewChange={changeView} search={search} onSearchChange={setSearch} activeUserName={activeUser?.firstName ?? 'Pilot'} canAdmin={isAdmin} cloudStatus={cloudStatus} onLogout={() => { setIsLoggedIn(false); setActiveView('dashboard'); }}>
    {activeView === 'dashboard' && <Dashboard data={data} onDataChange={setData} onViewChange={setActiveView} />}
    {activeView === 'notes' && <NotesView data={data} onDataChange={setData} search={search} />}
    {activeView === 'flashcards' && <FlashcardsView data={data} onDataChange={setData} search={search} />}
    {activeView === 'tasks' && <TasksView data={data} onDataChange={setData} />}
    {activeView === 'pstar' && <PstarView data={data} onDataChange={setData} />}
    {activeView === 'weather' && <WeatherPanel />}
    {activeView === 'import' && isAdmin && <LegacyImportView data={data} onDataChange={setData} onViewChange={setActiveView} />}
    {activeView === 'dashboardEdit' && isAdmin && <DashboardEditView data={data} onDataChange={setData} />}
    {activeView === 'users' && isAdmin && <AdminConsoleView data={data} onDataChange={setData} onViewAsUser={(userId) => {
      setData(activateUserData(data, userId));
      setActiveView('dashboard');
    }} />}
  </Shell>;
};
