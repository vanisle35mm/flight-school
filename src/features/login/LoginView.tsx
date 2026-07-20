import { KeyRound, LoaderCircle, LogIn, Mail, UserRound } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { FlightSchoolLogo } from '../../components/FlightSchoolLogo';
import { isAdminPasswordConfigured, verifyAdminPassword } from '../../lib/adminAuth';
import { recoverAdminAccount, requestSecurePasswordReset, signInSecurely, signInWithEmail } from '../../lib/secureAuth';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import { verifyStudentPassword } from '../../lib/studentAuth';
import { activateUserData, renameGroundSchoolUser, syncActiveUserData } from '../../lib/storage';
import type { GroundSchoolData } from '../../types';

type LegacyRole = 'student' | 'admin';

export const LoginView = ({ data, onDataChange, onLogin, onSecureLogin }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; onLogin: () => void; onSecureLogin: () => Promise<boolean> }) => {
  const synced = syncActiveUserData(data);
  const users = Object.values(synced.users);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [recoveringAdmin, setRecoveringAdmin] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [showLegacy, setShowLegacy] = useState(!isSupabaseConfigured);
  const [legacyRole, setLegacyRole] = useState<LegacyRole>('student');
  const [legacyName, setLegacyName] = useState('');
  const [legacyPassword, setLegacyPassword] = useState('');
  const [checkingLegacy, setCheckingLegacy] = useState(false);
  const [message, setMessage] = useState('');

  const loginAs = (userId: string) => {
    onDataChange(activateUserData(synced, userId));
    onLogin();
  };

  const findUserByName = (name: string, role: LegacyRole) => {
    const searchName = name.trim().toLowerCase();
    return users.find((user) => user.role === role && user.firstName.trim().toLowerCase() === searchName);
  };

  const loginEmail = async () => {
    if (!email.trim() || !email.includes('@')) return setMessage('Enter your email address.');
    if (!password) return setMessage('Enter your password.');
    setCheckingEmail(true);
    setMessage('');
    const result = await signInWithEmail(email, password);
    const loaded = result.ok ? await onSecureLogin() : false;
    setCheckingEmail(false);
    if (result.ok && loaded) return;
    setMessage(result.ok ? 'Your account data could not be loaded. Please try again.' : result.reason ?? 'Email or password is incorrect.');
  };

  const sendPasswordReset = async () => {
    if (!email.trim() || !email.includes('@')) return setMessage('Enter your email address first.');
    setSendingReset(true);
    setMessage('');
    const result = await requestSecurePasswordReset(email);
    setSendingReset(false);
    setMessage(result.ok ? 'Check your email for a password reset link.' : result.reason ?? 'The reset email could not be sent.');
  };

  const recoverAdmin = async () => {
    if (!email.trim() || !email.includes('@')) return setMessage('Enter your admin email address in the email box.');
    if (!password) return setMessage('Enter the admin password in the password box.');
    setRecoveringAdmin(true);
    setMessage('');
    const result = await recoverAdminAccount(email, password);
    const loaded = result.ok ? await onSecureLogin() : false;
    setRecoveringAdmin(false);
    if (result.ok && loaded) return;
    setMessage(result.ok ? 'Admin account recovered, but account data could not be loaded. Please try signing in again.' : result.reason ?? 'Admin recovery failed.');
  };

  const loginLegacyStudent = async () => {
    const user = findUserByName(legacyName, 'student');
    if (!user) return setMessage('Student profile not found. Check the name or ask the admin.');
    if (!user.passwordHash) return setMessage('Ask the admin to attach your email and send an account setup link.');
    const result = await verifyStudentPassword(legacyName, legacyPassword, user);
    if (!result.configured) return setMessage('Student login is temporarily unavailable.');
    if (!result.ok) return setMessage('Student name or password is incorrect.');
    loginAs(result.userId && synced.users[result.userId] ? result.userId : user.id);
  };

  const loginLegacyAdmin = async () => {
    if (!isAdminPasswordConfigured()) return setMessage('Admin password is not configured yet.');
    const passwordResult = await verifyAdminPassword(legacyPassword);
    if (!passwordResult.configured) return setMessage('Admin password is not configured yet.');
    if (!passwordResult.ok) return setMessage('Admin password is incorrect.');

    const user = findUserByName(legacyName, 'admin');
    if (user) return loginAs(user.id);
    const admins = users.filter((candidate) => candidate.role === 'admin');
    const defaultAdmin = admins.length === 1 && admins[0].id === 'user_default' && admins[0].firstName === 'Pilot' ? admins[0] : null;
    if (defaultAdmin) {
      const renamedData = renameGroundSchoolUser(synced, defaultAdmin.id, legacyName);
      onDataChange(activateUserData(renamedData, defaultAdmin.id));
      onLogin();
      return;
    }
    setMessage('Admin profile not found.');
  };

  const loginLegacy = async () => {
    if (!legacyName.trim()) return setMessage('Enter your first name.');
    if (!legacyPassword) return setMessage('Enter your password.');
    setCheckingLegacy(true);
    setMessage('');

    const secureResult = await signInSecurely(legacyName, legacyPassword, legacyRole);
    if (secureResult.mode === 'secure') {
      const loaded = secureResult.ok ? await onSecureLogin() : false;
      setCheckingLegacy(false);
      if (secureResult.ok && loaded) return;
      setMessage(secureResult.reason === 'password-reset-required'
        ? 'Ask the admin to attach your email and send an account setup link.'
        : secureResult.reason === 'unavailable' || (secureResult.ok && !loaded)
          ? 'Secure login is temporarily unavailable. Please try again.'
          : 'Name or password is incorrect.');
      return;
    }

    if (legacyRole === 'student') await loginLegacyStudent();
    else await loginLegacyAdmin();
    setCheckingLegacy(false);
  };

  const emailOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') void loginEmail();
  };

  const legacyOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') void loginLegacy();
  };

  return <main className="login-screen">
    <section className="login-panel standard-login-panel">
      <div className="login-brand"><FlightSchoolLogo /></div>
      <div className="login-heading"><span className="eyebrow">Private Pilot Training</span><h1>Welcome aboard</h1><p>Sign in to continue your training.</p></div>

      {isSupabaseConfigured && <div className="standard-login-form">
        <label>Email address<div className="login-input-with-icon"><Mail size={18} /><input value={email} onChange={(event) => { setEmail(event.target.value); setMessage(''); }} onKeyDown={emailOnEnter} type="email" autoComplete="email" placeholder="captain@example.com" autoFocus /></div></label>
        <label>Password<div className="login-input-with-icon"><KeyRound size={18} /><input value={password} onChange={(event) => { setPassword(event.target.value); setMessage(''); }} onKeyDown={emailOnEnter} type="password" autoComplete="current-password" placeholder="Your password" /></div></label>
        {message && !showLegacy && <div className="login-message" role="status">{message}</div>}
        <button className="standard-login-submit" onClick={() => void loginEmail()} disabled={checkingEmail}>
          {checkingEmail ? <LoaderCircle className="spin" size={18} /> : <LogIn size={18} />}{checkingEmail ? 'Signing in' : 'Sign in'}
        </button>
        <button className="login-text-button" onClick={() => void recoverAdmin()} disabled={recoveringAdmin}>{recoveringAdmin ? 'Recovering admin' : 'Admin recovery'}</button>
        <button className="login-text-button" onClick={() => void sendPasswordReset()} disabled={sendingReset}>{sendingReset ? 'Sending reset email' : 'Forgot password?'}</button>
      </div>}

      <div className="legacy-login-divider"><span>Transition access</span></div>
      <button className="legacy-login-toggle" onClick={() => { setShowLegacy((open) => !open); setMessage(''); }}><UserRound size={17} />{showLegacy ? 'Hide first-name login' : 'Use first-name login'}</button>

      {showLegacy && <div className="legacy-login-panel">
        <p>Use this while your account is being moved to email login.</p>
        <div className="login-role-control" aria-label="Account type">
          <button className={legacyRole === 'student' ? 'active' : ''} onClick={() => { setLegacyRole('student'); setMessage(''); }}>Student</button>
          <button className={legacyRole === 'admin' ? 'active' : ''} onClick={() => { setLegacyRole('admin'); setMessage(''); }}>Admin</button>
        </div>
        <label>First name<input value={legacyName} onChange={(event) => { setLegacyName(event.target.value); setMessage(''); }} onKeyDown={legacyOnEnter} autoComplete="username" placeholder="First name" /></label>
        <label>Password<input value={legacyPassword} onChange={(event) => { setLegacyPassword(event.target.value); setMessage(''); }} onKeyDown={legacyOnEnter} type="password" autoComplete="current-password" placeholder="Password" /></label>
        {message && <div className="login-message" role="status">{message}</div>}
        <button className="standard-login-submit" onClick={() => void loginLegacy()} disabled={checkingLegacy}>
          {checkingLegacy ? <LoaderCircle className="spin" size={18} /> : <LogIn size={18} />}{checkingLegacy ? 'Signing in' : `Sign in as ${legacyRole}`}
        </button>
      </div>}
    </section>
  </main>;
};
