import { describe, expect, it } from 'vitest';
import { isDevEnv } from './env';

describe('isDevEnv', () => {
  it('non-production host (jsdom = localhost) → dev', () => {
    // PROD_HOSTS is empty in the template, so every host is dev until you add yours.
    expect(isDevEnv()).toBe(true);
  });
});
