// src/features/items/ItemsScreen.tsx — example CRUD screen. This is the pattern to copy for real
// features: data access via src/data/api, loading via useLoad, writes via useMutation (which
// surfaces errors), UI from shared primitives. Replace `items` with your domain and delete this.
import { FormEvent, useState } from 'react';
import { createItem, deleteItem, listItems, setItemDone } from '../../data/api';
import { useLoad } from '../shared/useLoad';
import { useMutation } from '../shared/useMutation';
import { EmptyState } from '../shared/primitives';

export function ItemsScreen() {
  const { data: items, error: loadError, reload } = useLoad(listItems, []);
  const { error: mutError, run } = useMutation();
  const [title, setTitle] = useState('');

  function onAdd(e: FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    run(() => createItem(t), () => { setTitle(''); reload(); });
  }

  return (
    <section className="screen">
      <h1>Items</h1>
      <p className="muted">
        Example feature demonstrating the data → hooks → screen pattern over Supabase (anon + RLS).
      </p>

      <form className="row" onSubmit={onAdd}>
        <input value={title} placeholder="New item…" onChange={(e) => setTitle(e.target.value)} />
        <button className="btn-primary" type="submit">Add</button>
      </form>

      {(loadError || mutError) && <p role="alert" className="error">{loadError ?? mutError}</p>}

      {items === null ? (
        <p className="muted">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState message="No items yet — add one above." />
      ) : (
        <ul className="list">
          {items.map((it) => (
            <li key={it.id} className="list-row">
              <label>
                <input type="checkbox" checked={it.done}
                  onChange={() => run(() => setItemDone(it.id, !it.done), reload)} />
                <span className={it.done ? 'done' : ''}>{it.title}</span>
              </label>
              <button className="link-danger" onClick={() => run(() => deleteItem(it.id), reload)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
