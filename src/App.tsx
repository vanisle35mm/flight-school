import { useEffect, useRef, useState } from 'react';
import { Shell } from './components/Shell';
import { AccountView } from './features/account/AccountView';
import { AdminConsoleView } from './features/admin/AdminConsoleView';
import { Dashboard } from './features/dashboard/Dashboard';
import { DashboardEditView } from './features/dashboard/DashboardEditView';
import { FlashcardsView } from './features/flashcards/FlashcardsView';
import { FlightTrainingView } from './features/flightTraining/FlightTrainingView';
import { NotesView } from './features/notes/NotesView';
import { PstarView } from './features/pstar/PstarView';
import { RocaView } from './features/roca/RocaView';
import { TasksView } from './features/tasks/TasksView';
import { LegacyImportView } from './features/import/LegacyImportView';
import { LoginView } from './features/login/LoginView';
import { PasswordSetupView } from './features/login/PasswordSetupView';
import { AirportOnboarding } from './features/onboarding/AirportOnboarding';
import { WeatherPanel } from './features/weather/WeatherPanel';
import { getStoredWeatherSummary, saveWeatherSummary } from './features/weather/weather';
import { isCloudStorageConfigured, loadCloudGroundSchoolData, loadSecureGroundSchoolData, saveCloudGroundSchoolData, saveSecureGroundSchoolData, type CloudSyncStatus } from './lib/cloudStorage';
import { signOutSecurely } from './lib/secureAuth';
import { supabase } from './lib/supabaseClient';
import { activateUserData, createEmptyGroundSchoolData, loadGroundSchoolData, saveGroundSchoolData, STORAGE_KEY } from './lib/storage';
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
  const [storageMode, setStorageMode] = useState<'detecting' | 'legacy' | 'secure'>(() => isCloudStorageConfigured() ? 'detecting' : 'legacy');
  const [secureAuthUserId, setSecureAuthUserId] = useState('');
  const [passwordRecoveryMode, setPasswordRecoveryMode] = useState(false);
  const lastSavedCloudPayload = useRef('');
  const authenticatedHomeAirport = secureAuthUserId ? data.users[secureAuthUserId]?.homeAirport : undefined;

  useEffect(() => {
    if (!supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecoveryMode(true);
        window.setTimeout(() => void finishSecureLogin(), 0);
      }
      if (event === 'SIGNED_IN' && session) window.setTimeout(() => void finishSecureLogin(), 0);
      if (event === 'SIGNED_OUT') setPasswordRecoveryMode(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!isCloudStorageConfigured()) {
      setCloudStatus('local');
      setCloudReady(true);
      return;
    }

    setCloudStatus('loading');
    const initializeCloud = async () => {
      try {
        const secureData = await loadSecureGroundSchoolData();
        if (secureData) {
          if (cancelled) return;
          setData(secureData);
          setStorageMode('secure');
          setSecureAuthUserId(secureData.activeUserId);
          setIsLoggedIn(true);
          setCloudStatus('online');
          setCloudReady(true);
          return;
        }
      } catch (error) {
        console.warn('Secure Flight School session could not be restored.', error);
      }

      try {
        const cloudData = await loadCloudGroundSchoolData();
        if (cancelled) return;
        if (cloudData && getDataWeight(cloudData) >= getDataWeight(initialLocalData.current)) setData(cloudData);
        setCloudStatus('online');
      } catch (error) {
        console.warn('Legacy Flight School cloud load is unavailable.', error);
        if (!cancelled) setCloudStatus('error');
      }
      if (!cancelled) {
        setStorageMode('legacy');
        setCloudReady(true);
      }
    };
    void initializeCloud();

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (storageMode === 'legacy') saveGroundSchoolData(data);

    if (!cloudReady || storageMode === 'detecting' || !isCloudStorageConfigured()) return;
    const payload = `${storageMode}:${JSON.stringify(data)}`;
    if (payload === lastSavedCloudPayload.current) return;
    lastSavedCloudPayload.current = payload;
    setCloudStatus('syncing');

    const timeoutId = window.setTimeout(() => {
      const saveOperation = storageMode === 'secure' ? saveSecureGroundSchoolData(data) : saveCloudGroundSchoolData(data);
      saveOperation
        .then(() => setCloudStatus('online'))
        .catch((error) => {
          console.error('Flight School cloud save failed.', error);
          setCloudStatus('error');
        });
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [cloudReady, data, storageMode]);

  useEffect(() => {
    if (!isLoggedIn || storageMode !== 'secure' || !authenticatedHomeAirport) return;
    const currentWeather = getStoredWeatherSummary();
    if (currentWeather.station !== authenticatedHomeAirport) {
      saveWeatherSummary({ station: authenticatedHomeAirport, temperature: '--' });
    }
  }, [authenticatedHomeAirport, isLoggedIn, storageMode]);

  async function finishSecureLogin() {
    try {
      setCloudStatus('loading');
      const secureData = await loadSecureGroundSchoolData();
      if (!secureData) return false;
      setData(secureData);
      setStorageMode('secure');
      setSecureAuthUserId(secureData.activeUserId);
      setCloudReady(true);
      setCloudStatus('online');
      setIsLoggedIn(true);
      window.localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Secure Flight School data load failed.', error);
      setCloudStatus('error');
      return false;
    }
  }

  const reloadSecureData = async () => {
    const secureData = await loadSecureGroundSchoolData();
    if (secureData) setData(secureData);
  };

  const logout = () => {
    if (storageMode === 'secure') {
      void signOutSecurely();
      setData(createEmptyGroundSchoolData());
      window.localStorage.removeItem(STORAGE_KEY);
      setStorageMode('detecting');
      setSecureAuthUserId('');
      setPasswordRecoveryMode(false);
      setCloudReady(false);
      setCloudStatus('loading');
    }
    setIsLoggedIn(false);
    setActiveView('dashboard');
  };

  const activeUser = data.users[data.activeUserId];
  const isAdmin = activeUser?.role === 'admin';
  const canManageAccount = storageMode === 'secure' && activeUser?.id === secureAuthUserId;
  const needsAirportSetup = storageMode === 'secure'
    && activeUser?.id === secureAuthUserId
    && activeUser?.role === 'student'
    && activeUser.airportSetupRequired === true;
  const needsPasswordSetup = storageMode === 'secure'
    && activeUser?.id === secureAuthUserId
    && (activeUser?.requiresPasswordReset === true || passwordRecoveryMode);
  const adminViews: ViewId[] = ['users', 'import'];
  const changeView = (view: ViewId) => setActiveView(adminViews.includes(view) && !isAdmin ? 'dashboard' : view);
  if (!isLoggedIn) return <LoginView data={data} onDataChange={setData} onLogin={() => setIsLoggedIn(true)} onSecureLogin={finishSecureLogin} />;
  if (needsPasswordSetup) return <PasswordSetupView firstName={activeUser?.firstName ?? 'Pilot'} recoveryMode={passwordRecoveryMode} onLogout={logout} onComplete={() => {
    setPasswordRecoveryMode(false);
    if (!activeUser) return;
    setData({
      ...data,
      users: {
        ...data.users,
        [activeUser.id]: { ...activeUser, requiresPasswordReset: false }
      }
    });
  }} />;
  if (needsAirportSetup) return <AirportOnboarding user={activeUser} onComplete={(homeAirport) => {
    const currentWeather = getStoredWeatherSummary();
    if (currentWeather.station !== homeAirport) saveWeatherSummary({ station: homeAirport, temperature: '--' });
    setData({
      ...data,
      users: {
        ...data.users,
        [activeUser.id]: { ...activeUser, homeAirport, airportSetupRequired: false }
      }
    });
    setActiveView('dashboard');
  }} />;
  return <Shell activeView={activeView} onViewChange={changeView} search={search} onSearchChange={setSearch} activeUserName={activeUser?.firstName ?? 'Pilot'} canAdmin={isAdmin} canManageAccount={canManageAccount} cloudStatus={cloudStatus} onLogout={logout}>
    {activeView === 'dashboard' && <Dashboard data={data} onDataChange={setData} onViewChange={setActiveView} />}
    {activeView === 'notes' && <NotesView data={data} onDataChange={setData} search={search} />}
    {activeView === 'flashcards' && <FlashcardsView data={data} onDataChange={setData} search={search} />}
    {activeView === 'tasks' && <TasksView data={data} onDataChange={setData} />}
    {activeView === 'pstar' && <PstarView data={data} onDataChange={setData} />}
    {activeView === 'roca' && <RocaView data={data} onDataChange={setData} />}
    {activeView === 'weather' && <WeatherPanel />}
    {activeView === 'flightChecklist' && <FlightTrainingView data={data} onDataChange={setData} page="checklist" />}
    {activeView === 'flightPanel' && <FlightTrainingView data={data} onDataChange={setData} page="panel" />}
    {activeView === 'outsideChecks' && <FlightTrainingView data={data} onDataChange={setData} page="outside" />}
    {activeView === 'flightSchedule' && <FlightTrainingView data={data} onDataChange={setData} page="schedule" />}
    {activeView === 'account' && canManageAccount && <AccountView firstName={activeUser?.firstName ?? 'Pilot'} />}
    {activeView === 'import' && isAdmin && <LegacyImportView data={data} onDataChange={setData} onViewChange={setActiveView} />}
    {activeView === 'dashboardEdit' && <DashboardEditView data={data} onDataChange={setData} />}
    {activeView === 'users' && isAdmin && <AdminConsoleView data={data} onDataChange={setData} secureMode={storageMode === 'secure'} onSecureReload={reloadSecureData} onViewAsUser={(userId) => {
      setData(activateUserData(data, userId));
      setActiveView('dashboard');
    }} />}
  </Shell>;
};
