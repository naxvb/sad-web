// src/features/shell/AppShell.tsx — minimal app shell: left sidebar nav + main content.
// Add nav entries as you add screens; this template ships a single "Items" example screen.
import { ReactNode } from 'react';
import { supabase } from '../../lib/supabase';

export interface NavItem {
  key: string;
  label: string;
}

export function AppShell(
  { nav, active, onNavigate, children }:
  { nav: NavItem[]; active: string; onNavigate: (key: string) => void; children: ReactNode },
) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">agentic-app-starter</div>
        <nav>
          {nav.map((n) => (
            <button key={n.key} className={n.key === active ? 'nav active' : 'nav'}
              onClick={() => onNavigate(n.key)}>
              {n.label}
            </button>
          ))}
        </nav>
        <button className="nav signout" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
