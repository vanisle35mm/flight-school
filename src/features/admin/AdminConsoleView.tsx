import { Eye, Plus, Trash2, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { addGroundSchoolUser, deleteGroundSchoolUser, renameGroundSchoolUser, syncActiveUserData } from '../../lib/storage';
import type { GroundSchoolData } from '../../types';

export const AdminConsoleView = ({ data, onDataChange, onViewAsUser }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; onViewAsUser: (userId: string) => void }) => {
  const synced = syncActiveUserData(data);
  const users = Object.values(synced.users);
  const adminCount = users.filter((user) => user.role === 'admin').length;
  const [newName, setNewName] = useState('');
  const [draftNames, setDraftNames] = useState<Record<string, string>>(() => Object.fromEntries(users.map((user) => [user.id, user.firstName])));

  const addUser = () => {
    if (!newName.trim()) return;
    onDataChange(addGroundSchoolUser(synced, newName, 'student', false));
    setNewName('');
  };

  const renameUser = (userId: string) => {
    onDataChange(renameGroundSchoolUser(synced, userId, draftNames[userId] ?? 'Pilot'));
  };

  const deleteUser = (userId: string) => {
    const user = synced.users[userId];
    if (!user) return;
    const confirmed = window.confirm(`Delete ${user.firstName}'s profile? Their lessons, notes, cards, and tasks will be removed.`);
    if (confirmed) onDataChange(deleteGroundSchoolUser(synced, userId));
  };

  return <section className="panel admin-console-panel">
    <div className="panel-heading">
      <div><span className="eyebrow">Admin</span><h2>User Console</h2></div>
    </div>

    <div className="admin-add-user">
      <label>
        Add captain
        <input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="First name" />
      </label>
      <button onClick={addUser}><Plus size={17} />Add User</button>
    </div>

    <div className="admin-user-grid">
      {users.map((user) => {
        const cardCount = user.classes.reduce((sum, session) => sum + session.flashcards.length, 0);
        const unknownCount = Object.values(user.flashcardProgress).filter((status) => status === 'unknown').length;
        const isActive = user.id === synced.activeUserId;
        const isLastUser = users.length <= 1;
        const isLastAdmin = user.role === 'admin' && adminCount <= 1;
        const deleteBlocked = isLastUser || isLastAdmin;
        return <article className={isActive ? 'admin-user-card active' : 'admin-user-card'} key={user.id}>
          <div className="admin-user-head">
            <div><span>{isActive ? 'Active captain' : 'Captain'}</span><strong>{user.firstName}</strong><em>{user.role === 'admin' ? 'Admin' : 'Student'}</em></div>
            {isActive && <UserCheck size={22} />}
          </div>
          <label>
            First name
            <input value={draftNames[user.id] ?? user.firstName} onChange={(event) => setDraftNames({ ...draftNames, [user.id]: event.target.value })} />
          </label>
          <div className="admin-user-stats">
            <div><strong>{user.classes.length}</strong><span>Lessons</span></div>
            <div><strong>{cardCount}</strong><span>Cards</span></div>
            <div><strong>{user.todos.length}</strong><span>Tasks</span></div>
            <div><strong>{unknownCount}</strong><span>Needs review</span></div>
          </div>
          <div className="button-row">
            <button onClick={() => renameUser(user.id)}>Save Name</button>
            {user.role === 'student' && <button onClick={() => onViewAsUser(user.id)}><Eye size={16} />View as User</button>}
            <button className="danger-button" disabled={deleteBlocked} title={deleteBlocked ? 'Keep at least one user and one admin.' : undefined} onClick={() => deleteUser(user.id)}><Trash2 size={16} />Delete</button>
          </div>
        </article>;
      })}
    </div>
  </section>;
};
