import { KeyRound } from 'lucide-react';
import { useState } from 'react';
import { changeSecurePassword } from '../../lib/secureAuth';

export const AccountView = ({ firstName }: { firstName: string }) => {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const changePassword = async () => {
    if (password.length < 8) return setMessage('Use at least 8 characters.');
    if (password !== confirmation) return setMessage('The passwords do not match.');
    setSaving(true);
    const result = await changeSecurePassword(password);
    setSaving(false);
    if (!result.ok) return setMessage(result.reason ?? 'Password could not be changed.');
    setPassword('');
    setConfirmation('');
    setMessage('Password updated.');
  };

  return <section className="panel account-panel">
    <div className="panel-heading"><div><span className="eyebrow">Captain {firstName}</span><h2>Account</h2></div><KeyRound size={24} /></div>
    <div className="account-form">
      <label>New password<input value={password} onChange={(event) => { setPassword(event.target.value); setMessage(''); }} type="password" autoComplete="new-password" placeholder="At least 8 characters" /></label>
      <label>Confirm password<input value={confirmation} onChange={(event) => { setConfirmation(event.target.value); setMessage(''); }} type="password" autoComplete="new-password" placeholder="Enter it again" /></label>
      <button onClick={() => void changePassword()} disabled={saving}><KeyRound size={17} />{saving ? 'Updating' : 'Change Password'}</button>
    </div>
    {message && <div className="admin-message account-message">{message}</div>}
  </section>;
};
