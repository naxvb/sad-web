// Example component test: render a screen with the data layer mocked, assert on what the user
// sees and on the calls the UI makes. Copy this shape for your own screens.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ItemsScreen } from './ItemsScreen';
import * as api from '../../data/api';

vi.mock('../../data/api');
const mockApi = vi.mocked(api);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ItemsScreen', () => {
  it('shows the empty state when there are no items', async () => {
    mockApi.listItems.mockResolvedValue([]);
    render(<ItemsScreen />);
    expect(await screen.findByText(/No items yet/i)).toBeInTheDocument();
  });

  it('renders loaded items', async () => {
    mockApi.listItems.mockResolvedValue([
      { id: '1', title: 'Buy milk', done: false, createdAt: '2026-01-01T00:00:00Z' },
    ]);
    render(<ItemsScreen />);
    expect(await screen.findByText('Buy milk')).toBeInTheDocument();
  });

  it('creates an item from the form', async () => {
    mockApi.listItems.mockResolvedValue([]);
    mockApi.createItem.mockResolvedValue();
    render(<ItemsScreen />);
    await screen.findByText(/No items yet/i);

    fireEvent.change(screen.getByPlaceholderText(/New item/i), { target: { value: 'Buy milk' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => expect(mockApi.createItem).toHaveBeenCalledWith('Buy milk'));
  });
});
