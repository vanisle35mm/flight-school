import { Eye, KeyRound, Mail, Plus, Send, Trash2, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { hashPassword } from '../../lib/passwordHash';
import { getSecureAccountDirectory, runSecureAdminAction, type SecureAccountDirectoryEntry } from '../../lib/secureAuth';
import { addGroundSchoolUser, deleteGroundSchoolUser, renameGroundSchoolUser, setGroundSchoolUserPasswordHash, syncActiveUserData } from '../../lib/storage';
import type { GroundSchoolData } from '../../types';

const PLACEHOLDER_EMAIL_DOMAIN = '@users.flightschool.app';
const isRealEmail = (email = '') => Boolean(email && !email.endsWith(PLACEHOLDER_EMAIL_DOMAIN));

export const AdminConsoleView = ({ data, onDataChange, onViewAsUser, secureMode, onSecureReload }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; onViewAsUser: (userId: string) => void; secureMode: boolean; onSecureReload: () => Promise<void> }) => {
  const synced = syncActiveUserData(data);
  const users = Object.values(synced.users);
  const adminCount = users.filter((user) => user.role === 'admin').length;
  const userKey = users.map((user) => user.id).sort().join(':');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [draftNames, setDraftNames] = useState<Record<string, string>>(() => Object.fromEntries(users.map((user) => [user.id, user.firstName])));
  const [draftEmails, setDraftEmails] = useState<Record<string, string>>({});
  const [resetPasswords, setResetPasswords] = useState<Record<string, string>>({});
  const [accounts, setAccounts] = useState<Record<string, SecureAccountDirectoryEntry>>({});
  const [message, setMessage] = useState('');
  const [workingId, setWorkingId] = useState('');

  const refreshDirectory = async () => {
    if (!secureMode) return;
    const result = await getSecureAccountDirectory();
    if (!result.ok) {
      setMessage(result.reason ?? 'Account emails could not be loaded.');
      return;
    }
    const nextAccounts = Object.fromEntries(result.accounts.map((account) => [account.id, account]));
    setAccounts(nextAccounts);
    setDraftEmails((current) => ({
      ...Object.fromEntries(result.accounts.map((account) => [account.id, isRealEmail(account.email) ? account.email : ''])),
      ...current
    }));
  };

  useEffect(() => {
    void refreshDirectory();
  }, [secureMode, userKey]);

  const reloadAccounts = async () => {
    await onSecureReload();
    await refreshDirectory();
  };

  const addUser = async () => {
    if (!newName.trim()) return setMessage('Enter the student first name.');

    if (secureMode) {
      if (!newEmail.includes('@')) return setMessage('Enter the student email address.');
      setWorkingId('new');
      const result = await runSecureAdminAction({
        action: 'create',
        firstName: newName.trim(),
        email: newEmail.trim(),
        redirectTo: window.location.origin
      });
      setWorkingId('');
      if (!result.ok) return setMessage(result.reason ?? 'Student invitation could not be sent.');
      await reloadAccounts();
      setMessage(`Invitation sent to ${newEmail.trim()}.`);
      setNewName('');
      setNewEmail('');
      return;
    }

    if (users.some((user) => user.firstName.trim().toLowerCase() === newName.trim().toLowerCase())) return setMessage('That first name is already in use.');
    if (newPassword.length < 6) return setMessage('Temporary passwords must be at least 6 characters.');
    const passwordHash = await hashPassword(newPassword);
    onDataChange(addGroundSchoolUser(synced, newName, 'student', false, passwordHash));
    setMessage(`${newName.trim()}'s login was created.`);
    setNewName('');
    setNewPassword('');
  };

  const renameUser = async (userId: string) => {
    const nextName = (draftNames[userId] ?? '').trim();
    if (!nextName) return setMessage('First name cannot be blank.');
    if (secureMode) {
      setWorkingId(userId);
      const result = await runSecureAdminAction({ action: 'rename', userId, firstName: nextName });
      setWorkingId('');
      if (!result.ok) return setMessage(result.reason ?? 'Name could not be updated.');
      await onSecureReload();
    } else {
      onDataChange(renameGroundSchoolUser(synced, userId, nextName));
    }
    setMessage(`${nextName}'s name was updated.`);
  };

  const attachEmail = async (userId: string) => {
    const email = (draftEmails[userId] ?? '').trim();
    if (!email.includes('@')) return setMessage('Enter a valid personal email address.');
    setWorkingId(userId);
    const result = await runSecureAdminAction({ action: 'attach-email', userId, email, redirectTo: window.location.origin });
    setWorkingId('');
    if (!result.ok) return setMessage(result.reason ?? 'The account email could not be attached.');
    await reloadAccounts();
    setMessage(`Account setup email sent to ${email}.`);
  };

  const sendPasswordReset = async (userId: string) => {
    const email = accounts[userId]?.email ?? '';
    setWorkingId(userId);
    const result = await runSecureAdminAction({ action: 'send-password-reset', userId, redirectTo: window.location.origin });
    setWorkingId('');
    if (!result.ok) return setMessage(result.reason ?? 'The password reset email could not be sent.');
    setMessage(`Password reset sent to ${email}.`);
  };

  const deleteUser = async (userId: string) => {
    const user = synced.users[userId];
    if (!user) return;
    const confirmed = window.confirm(`Delete ${user.firstName}'s profile? Their lessons, notes, cards, and tasks will be removed.`);
    if (!confirmed) return;
    if (secureMode) {
      setWorkingId(userId);
      const result = await runSecureAdminAction({ action: 'delete', userId });
      setWorkingId('');
      if (!result.ok) return setMessage(result.reason ?? 'Student could not be deleted.');
      await reloadAccounts();
    } else {
      onDataChange(deleteGroundSchoolUser(synced, userId));
    }
  };

  const resetLocalPassword = async (userId: string) => {
    const password = resetPasswords[userId] ?? '';
    const user = synced.users[userId];
    if (!user || user.role !== 'student') return;
    if (password.length < 6) return setMessage('Student passwords must be at least 6 characters.');
    const passwordHash = await hashPassword(password);
    onDataChange(setGroundSchoolUserPasswordHash(synced, userId, passwordHash));
    setResetPasswords({ ...resetPasswords, [userId]: '' });
    setMessage(`${user.firstName}'s password was updated.`);
  };

  return <section className="panel admin-console-panel">
    <div className="panel-heading"><div><span className="eyebrow">Admin</span><h2>User Console</h2></div></div>

    <div className="admin-add-user">
      <label>Add captain<input value={newName} onChange={(event) => { setNewName(event.target.value); setMessage(''); }} placeholder="First name" /></label>
      {secureMode
        ? <label>Email address<input value={newEmail} onChange={(event) => { setNewEmail(event.target.value); setMessage(''); }} placeholder="captain@example.com" type="email" autoComplete="off" /></label>
        : <label>Temporary password<input value={newPassword} onChange={(event) => { setNewPassword(event.target.value); setMessage(''); }} placeholder="At least 6 characters" type="password" autoComplete="new-password" /></label>}
      <button onClick={() => void addUser()} disabled={workingId === 'new'}>{secureMode ? <Mail size={17} /> : <Plus size={17} />}{workingId === 'new' ? 'Sending' : secureMode ? 'Send Invite' : 'Add User'}</button>
    </div>
    {message && <div className="admin-message" role="status">{message}</div>}

    <div className="admin-user-grid">
      {users.map((user) => {
        const account = accounts[user.id];
        const email = isRealEmail(account?.email) ? account.email : '';
        const cardCount = user.classes.reduce((sum, session) => sum + session.flashcards.length, 0);
        const unknownCount = Object.values(user.flashcardProgress).filter((status) => status === 'unknown').length;
        const isActive = user.id === synced.activeUserId;
        const deleteBlocked = users.length <= 1 || (user.role === 'admin' && adminCount <= 1);
        const accountStatus = !secureMode ? 'Local account' : !email ? 'Legacy login' : user.requiresPasswordReset ? 'Setup required' : 'Active';
        return <article className={isActive ? 'admin-user-card active' : 'admin-user-card'} key={user.id}>
          <div className="admin-user-head">
            <div><span>{isActive ? 'Active captain' : 'Captain'}</span><strong>{user.firstName}</strong><em>{user.role === 'admin' ? `Admin · ${accountStatus}` : `Student · ${accountStatus}`}</em></div>
            {isActive && <UserCheck size={22} />}
          </div>
          <label>First name<input value={draftNames[user.id] ?? user.firstName} onChange={(event) => setDraftNames({ ...draftNames, [user.id]: event.target.value })} /></label>
          {secureMode && <div className="admin-email-management">
            <label>Account email<input value={draftEmails[user.id] ?? email} onChange={(event) => { setDraftEmails({ ...draftEmails, [user.id]: event.target.value }); setMessage(''); }} placeholder="captain@example.com" type="email" /></label>
            <button onClick={() => void attachEmail(user.id)} disabled={workingId === user.id}><Mail size={16} />{email ? 'Update Email' : 'Attach Email'}</button>
            {email && <button onClick={() => void sendPasswordReset(user.id)} disabled={workingId === user.id}><Send size={16} />Send Reset</button>}
          </div>}
          <div className="admin-user-stats">
            <div><strong>{user.classes.length}</strong><span>Lessons</span></div>
            <div><strong>{cardCount}</strong><span>Cards</span></div>
            <div><strong>{user.todos.length}</strong><span>Tasks</span></div>
            <div><strong>{unknownCount}</strong><span>Needs review</span></div>
          </div>
          {!secureMode && user.role === 'student' && <div className="admin-password-reset">
            <label>{user.passwordHash ? 'Reset password' : 'Set first password'}<input value={resetPasswords[user.id] ?? ''} onChange={(event) => { setResetPasswords({ ...resetPasswords, [user.id]: event.target.value }); setMessage(''); }} placeholder="At least 6 characters" type="password" autoComplete="new-password" /></label>
            <button onClick={() => void resetLocalPassword(user.id)}><KeyRound size={16} />{user.passwordHash ? 'Reset' : 'Set Password'}</button>
          </div>}
          <div className="button-row">
            <button onClick={() => void renameUser(user.id)} disabled={workingId === user.id}>Save Name</button>
            {user.role === 'student' && <button onClick={() => onViewAsUser(user.id)}><Eye size={16} />View as User</button>}
            <button className="danger-button" disabled={deleteBlocked || workingId === user.id} title={deleteBlocked ? 'Keep at least one user and one admin.' : undefined} onClick={() => void deleteUser(user.id)}><Trash2 size={16} />Delete</button>
          </div>
        </article>;
      })}
    </div>
  </section>;
};
