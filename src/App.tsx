// src/App.tsx — top-level: auth gate → app shell → active screen.
// The template ships one screen (Items). Add NavItems + screens as the app grows.
import { useState } from 'react';
import { useSession } from './features/auth/useSession';
import { LoginScreen } from './features/auth/LoginScreen';
import { AppShell, NavItem } from './features/shell/AppShell';
import { ItemsScreen } from './features/items/ItemsScreen';

const NAV: NavItem[] = [{ key: 'items', label: 'Items' }];

export function App() {
  const { session, loading } = useSession();
  const [active, setActive] = useState('items');

  if (loading) return <div className="login-wrap"><p className="muted">Loading…</p></div>;
  if (!session) return <LoginScreen />;

  return (
    <AppShell nav={NAV} active={active} onNavigate={setActive}>
      {active === 'items' && <ItemsScreen />}
    </AppShell>
  );
}
