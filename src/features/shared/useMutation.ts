// src/features/shared/useMutation.ts — wspólny mechanizm mutacji ekranów CRUD:
// zamiast `api.x(...).then(reload)` bez `.catch` (błąd ginie, UI wygląda na zapisany),
// `run` łapie odrzucenie i wystawia je jako komunikat do wyrenderowania w role="alert".
import { useCallback, useState } from 'react';

export function useMutation() {
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (op: () => Promise<unknown>, after?: () => void) => {
    setError(null);
    try {
      await op();
      after?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  return { error, run };
}
