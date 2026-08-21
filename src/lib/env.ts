// Environment detection by hostname. Only the production host(s) count as PROD; everything else
// (preview deploys, localhost, unknown host) = DEV. Safe default: an unknown host is treated as
// DEV, so it never silently reads/writes production-flagged data.
//
// Set this to your production host once you deploy, e.g. ['my-app.example.workers.dev'].
const PROD_HOSTS: string[] = [];

export function isDevEnv(): boolean {
  if (typeof window === 'undefined' || !window.location) return true;
  return !PROD_HOSTS.includes(window.location.hostname);
}
