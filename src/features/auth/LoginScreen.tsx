// src/features/auth/LoginScreen.tsx — email/password sign-in via Supabase auth.
// Single-tenant apps disable sign-up (see scripts/setup-auth.sh); this screen only signs in.
import { FormEvent, useState } from 'react';
import { supabase } from '../../lib/supabase';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  }

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={onSubmit}>
        <h1>Sign in</h1>
        <label>
          Email
          <input type="email" value={email} autoComplete="username"
            onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p role="alert" className="error">{error}</p>}
        <button className="btn-primary" type="submit" disabled={busy}>
          {busy ? '…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
