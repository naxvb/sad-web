// src/data/rows.ts — map Postgres rows (snake_case) to domain types (camelCase) and back.
// Keep this boundary explicit: the rest of the app never sees snake_case column names.

export interface Item {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

export interface ItemRow {
  id: string;
  title: string;
  done: boolean;
  created_at: string;
}

export const rowToItem = (r: ItemRow): Item =>
  ({ id: r.id, title: r.title, done: r.done, createdAt: r.created_at });
