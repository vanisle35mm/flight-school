import { KeyRound, LoaderCircle, LogOut } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { FlightSchoolLogo } from '../../components/FlightSchoolLogo';
import { completeSecurePasswordSetup } from '../../lib/secureAuth';

type PasswordSetupViewProps = {
  firstName: string;
  recoveryMode: boolean;
  onComplete: () => void;
  onLogout: () => void;
};

export const PasswordSetupView = ({ firstName, recoveryMode, onComplete, onLogout }: PasswordSetupViewProps) => {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (password.length < 8) return setMessage('Use at least 8 characters.');
    if (password !== confirmation) return setMessage('The passwords do not match.');
    setSaving(true);
    const result = await completeSecurePasswordSetup(password);
    setSaving(false);
    if (!result.ok) return setMessage(result.reason ?? 'Your password could not be saved.');
    onComplete();
  };

  const submitOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') void submit();
  };

  return <main className="login-screen">
    <section className="login-panel password-setup-panel">
      <div className="login-brand"><FlightSchoolLogo /></div>
      <div className="login-heading">
        <span className="eyebrow">Secure account</span>
        <h1>{recoveryMode ? 'Choose a new password' : `Welcome, Captain ${firstName}`}</h1>
        <p>{recoveryMode ? 'Enter a new password to recover your account.' : 'Create your private password to finish setting up your account.'}</p>
      </div>
      <div className="standard-login-form">
        <label>New password<input value={password} onChange={(event) => { setPassword(event.target.value); setMessage(''); }} onKeyDown={submitOnEnter} type="password" autoComplete="new-password" placeholder="At least 8 characters" autoFocus /></label>
        <label>Confirm password<input value={confirmation} onChange={(event) => { setConfirmation(event.target.value); setMessage(''); }} onKeyDown={submitOnEnter} type="password" autoComplete="new-password" placeholder="Enter it again" /></label>
        {message && <div className="login-message" role="alert">{message}</div>}
        <button className="standard-login-submit" onClick={() => void submit()} disabled={saving}>
          {saving ? <LoaderCircle className="spin" size={18} /> : <KeyRound size={18} />}{saving ? 'Saving password' : 'Save password'}
        </button>
      </div>
      <button className="login-text-button" onClick={onLogout}><LogOut size={16} />Sign out</button>
    </section>
  </main>;
};
