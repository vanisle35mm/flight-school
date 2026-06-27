import { LogIn, Plane } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { isAdminPasswordConfigured, verifyAdminPassword } from '../../lib/adminAuth';
import { signInSecurely } from '../../lib/secureAuth';
import { verifyStudentPassword } from '../../lib/studentAuth';
import { activateUserData, renameGroundSchoolUser, syncActiveUserData } from '../../lib/storage';
import type { GroundSchoolData } from '../../types';

export const LoginView = ({ data, onDataChange, onLogin, onSecureLogin }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; onLogin: () => void; onSecureLogin: () => Promise<boolean> }) => {
  const synced = syncActiveUserData(data);
  const users = Object.values(synced.users);
  const [studentName, setStudentName] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [message, setMessage] = useState('');
  const [checkingStudent, setCheckingStudent] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  const loginAs = (userId: string) => {
    onDataChange(activateUserData(synced, userId));
    onLogin();
  };

  const findUserByName = (name: string, role: 'admin' | 'student') => {
    const searchName = name.trim().toLowerCase();
    return users.find((user) => user.role === role && user.firstName.trim().toLowerCase() === searchName);
  };

  const loginStudent = async () => {
    if (!studentName.trim()) return setMessage('Enter your first name.');
    if (!studentPassword) {
      setMessage('Enter your student password.');
      return;
    }

    setCheckingStudent(true);
    const secureResult = await signInSecurely(studentName, studentPassword, 'student');
    if (secureResult.mode === 'secure') {
      const loaded = secureResult.ok ? await onSecureLogin() : false;
      setCheckingStudent(false);
      if (secureResult.ok && loaded) return;
      setMessage(secureResult.reason === 'password-reset-required'
        ? 'Your admin needs to set your new secure password in the User Console.'
        : secureResult.reason === 'unavailable' || (secureResult.ok && !loaded)
          ? 'Secure student login is temporarily unavailable. Please try again.'
          : 'Student name or password is incorrect.');
      return;
    }

    const user = findUserByName(studentName, 'student');
    if (!user) {
      setCheckingStudent(false);
      setMessage('Student profile not found. Check the name or ask the admin to create your login.');
      return;
    }
    if (!user.passwordHash) {
      setCheckingStudent(false);
      setMessage('This student needs a password. Ask the admin to set one in the User Console.');
      return;
    }

    const result = await verifyStudentPassword(studentName, studentPassword, user);
    setCheckingStudent(false);

    if (!result.configured) {
      setMessage('Student login is temporarily unavailable. Please try again.');
      return;
    }
    if (!result.ok) {
      setMessage(result.reason === 'password-not-set'
        ? 'This student needs a password. Ask the admin to set one in the User Console.'
        : result.reason === 'not-found'
          ? 'Student profile not found. Check the name or ask the admin to create your login.'
          : 'Student password is incorrect.');
      return;
    }

    loginAs(result.userId && synced.users[result.userId] ? result.userId : user.id);
  };

  const loginAdmin = async () => {
    if (!adminName.trim()) {
      setMessage('Enter the admin first name.');
      return;
    }

    if (!adminPassword) {
      setMessage('Enter the admin password.');
      return;
    }

    setCheckingAdmin(true);
    const secureResult = await signInSecurely(adminName, adminPassword, 'admin');
    if (secureResult.mode === 'secure') {
      const loaded = secureResult.ok ? await onSecureLogin() : false;
      setCheckingAdmin(false);
      if (secureResult.ok && loaded) return;
      setMessage(secureResult.reason === 'unavailable' || (secureResult.ok && !loaded)
        ? 'Secure admin login is temporarily unavailable. Please try again.'
        : 'Admin name or password is incorrect.');
      return;
    }

    if (!isAdminPasswordConfigured()) {
      setCheckingAdmin(false);
      setMessage('Admin password is not configured yet.');
      return;
    }

    const passwordResult = await verifyAdminPassword(adminPassword);
    setCheckingAdmin(false);

    if (!passwordResult.configured) {
      setMessage('Admin password is not configured yet.');
      return;
    }

    if (!passwordResult.ok) {
      setMessage('Admin password is incorrect.');
      return;
    }

    const user = findUserByName(adminName, 'admin');
    if (user) {
      loginAs(user.id);
      return;
    }

    const admins = users.filter((user) => user.role === 'admin');
    const defaultAdmin = admins.length === 1 && admins[0].id === 'user_default' && admins[0].firstName === 'Pilot' ? admins[0] : null;
    if (defaultAdmin && adminName.trim()) {
      const renamedData = renameGroundSchoolUser(synced, defaultAdmin.id, adminName);
      onDataChange(activateUserData(renamedData, defaultAdmin.id));
      onLogin();
      return;
    }

    if (!user) {
      setMessage('Admin profile not found.');
      return;
    }
  };

  const adminLoginOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') void loginAdmin();
  };

  const studentLoginOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') void loginStudent();
  };

  return <main className="login-screen">
    <section className="login-panel">
      <div className="login-brand"><Plane size={30} /><span>Flight School</span></div>
      <div className="login-heading"><span className="eyebrow">CYYJ Ground School</span><h1>Welcome aboard</h1><p>Sign in with your first name and password.</p></div>

      {message && <div className="login-message">{message}</div>}

      <div className="login-user-list">
        <div className="login-user-card static">
          <div><strong>Student login</strong><span>Open your lessons, notes, cards, and tasks.</span></div>
          <div className="login-field-stack">
            <input value={studentName} onChange={(event) => { setStudentName(event.target.value); setMessage(''); }} onKeyDown={studentLoginOnEnter} placeholder="First name" autoComplete="username" />
            <input value={studentPassword} onChange={(event) => { setStudentPassword(event.target.value); setMessage(''); }} onKeyDown={studentLoginOnEnter} placeholder="Password" type="password" autoComplete="current-password" />
          </div>
          <button onClick={() => void loginStudent()} disabled={checkingStudent}><LogIn size={17} />{checkingStudent ? 'Checking' : 'Login'}</button>
        </div>
        <div className="login-user-card static">
          <div><strong>Admin login</strong><span>Admin users can open the full user console.</span></div>
          <div className="login-field-stack">
            <input value={adminName} onChange={(event) => { setAdminName(event.target.value); setMessage(''); }} onKeyDown={adminLoginOnEnter} placeholder="Admin first name" />
            <input value={adminPassword} onChange={(event) => { setAdminPassword(event.target.value); setMessage(''); }} onKeyDown={adminLoginOnEnter} placeholder="Admin password" type="password" autoComplete="current-password" />
          </div>
          <button onClick={() => void loginAdmin()} disabled={checkingAdmin}><LogIn size={17} />{checkingAdmin ? 'Checking' : 'Admin'}</button>
        </div>
      </div>
    </section>
  </main>;
};
