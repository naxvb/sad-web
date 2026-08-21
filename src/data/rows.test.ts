import { describe, expect, it } from 'vitest';
import { rowToItem } from './rows';

describe('rowToItem', () => {
  it('maps a snake_case row to a camelCase domain object', () => {
    const item = rowToItem({
      id: 'abc',
      title: 'Buy milk',
      done: false,
      created_at: '2026-01-01T00:00:00Z',
    });
    expect(item).toEqual({
      id: 'abc',
      title: 'Buy milk',
      done: false,
      createdAt: '2026-01-01T00:00:00Z',
    });
  });
});
