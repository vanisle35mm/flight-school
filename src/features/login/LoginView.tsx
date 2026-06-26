import { LogIn, Plane, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { activateUserData, addGroundSchoolUser, renameGroundSchoolUser, syncActiveUserData } from '../../lib/storage';
import type { GroundSchoolData } from '../../types';

export const LoginView = ({ data, onDataChange, onLogin }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; onLogin: () => void }) => {
  const synced = syncActiveUserData(data);
  const users = Object.values(synced.users);
  const [studentName, setStudentName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [message, setMessage] = useState('');

  const loginAs = (userId: string) => {
    onDataChange(activateUserData(synced, userId));
    onLogin();
  };

  const findUserByName = (name: string, role: 'admin' | 'student') => {
    const searchName = name.trim().toLowerCase();
    return users.find((user) => user.role === role && user.firstName.trim().toLowerCase() === searchName);
  };

  const loginStudent = () => {
    const user = findUserByName(studentName, 'student');
    if (!user) {
      setMessage('Student profile not found. Check the name or create a new student profile.');
      return;
    }
    loginAs(user.id);
  };

  const loginAdmin = () => {
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

  const createStudent = () => {
    if (!newFirstName.trim()) return;
    onDataChange(addGroundSchoolUser(synced, newFirstName, 'student'));
    setNewFirstName('');
    onLogin();
  };

  return <main className="login-screen">
    <section className="login-panel">
      <div className="login-brand"><Plane size={30} /><span>Flight School</span></div>
      <div className="login-heading"><span className="eyebrow">CYYJ Ground School</span><h1>Welcome aboard</h1><p>Sign in by name. Student profiles stay private from the login screen.</p></div>

      {message && <div className="login-message">{message}</div>}

      <div className="login-user-list">
        <div className="login-user-card static">
          <div><strong>Student login</strong><span>Enter your first name to open your own lessons, notes, cards, and tasks.</span></div>
          <input value={studentName} onChange={(event) => { setStudentName(event.target.value); setMessage(''); }} placeholder="First name" />
          <button onClick={loginStudent}><LogIn size={17} />Login</button>
        </div>
        <div className="login-user-card static">
          <div><strong>Admin login</strong><span>Admin users can open the full user console.</span></div>
          <input value={adminName} onChange={(event) => { setAdminName(event.target.value); setMessage(''); }} placeholder="Admin first name" />
          <button onClick={loginAdmin}><LogIn size={17} />Admin</button>
        </div>
      </div>

      <div className="login-create">
        <label>
          New student
          <input value={newFirstName} onChange={(event) => setNewFirstName(event.target.value)} placeholder="First name" />
        </label>
        <button onClick={createStudent}><UserPlus size={17} />Create Login</button>
      </div>
    </section>
  </main>;
};
