// src/features/shared/useLoad.ts — ładowanie danych ekranu z przeładowaniem po mutacji.
import { useCallback, useEffect, useState } from 'react';

export function useLoad<T>(load: () => Promise<T>, deps: readonly unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  // deps przekazywane świadomie przez wołającego (np. seasonId) — nie liczone automatycznie
  const reload = useCallback(() => {
    load()
      .then((d) => { setData(d); setError(null); })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, deps);
  useEffect(() => { reload(); }, [reload]);
  return { data, error, reload };
}
