// src/data/api.ts — typed data access over the Supabase client. Screens call these, never the
// raw client, so the row↔domain mapping and error handling live in one place.
import { supabase } from '../lib/supabase';
import { Item, ItemRow, rowToItem } from './rows';

export async function listItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as ItemRow[]).map(rowToItem);
}

export async function createItem(title: string): Promise<void> {
  const { error } = await supabase.from('items').insert({ title });
  if (error) throw new Error(error.message);
}

export async function setItemDone(id: string, done: boolean): Promise<void> {
  const { error } = await supabase.from('items').update({ done }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
