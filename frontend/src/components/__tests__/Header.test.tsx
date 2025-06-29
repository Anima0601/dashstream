// src/components/__tests__/Header.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'; // Import 'act' here
import '@testing-library/jest-dom';
import Header from '../Header';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { toggleDarkMode } from '../../redux/slices/userPreferencesSlice'; 

const mockStore = configureStore([]);

describe('Header Component', () => {
  let store: any;
  let onSearchMock: jest.Mock;

  beforeEach(() => {
    store = mockStore({
      userPreferences: {
        darkMode: false, // Corrected to 'darkMode' as per your slice definition
      },
    });
    store.dispatch = jest.fn(); // Mock dispatch
    onSearchMock = jest.fn(); // Mock the onSearch prop
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Header onSearch={onSearchMock} searchQuery="" />
      </Provider>
    );
    expect(screen.getByText('My Dashboard')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search news...')).toBeInTheDocument();
  });

  it('updates search query on input change', () => {
    render(
      <Provider store={store}>
        <Header onSearch={onSearchMock} searchQuery="" />
      </Provider>
    );
    const searchInput = screen.getByPlaceholderText('Search news...') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    expect(searchInput.value).toBe('test query');
  });

  it('calls onSearch with trimmed query after debounce', async () => {
    jest.useFakeTimers(); // Use fake timers for debounce testing
    render(
      <Provider store={store}>
        <Header onSearch={onSearchMock} searchQuery="" />
      </Provider>
    );
    const searchInput = screen.getByPlaceholderText('Search news...') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: '  test query  ' } });

    expect(onSearchMock).not.toHaveBeenCalled(); // Should not be called immediately

    // Wrap the timer advancement in act to ensure all React updates are flushed
    await act(async () => { // Use async act because the updates might involve promises (e.g., from Next.js Link or internal timers)
      jest.advanceTimersByTime(500); // Advance timers by 500ms (debounce time)
    });

    await waitFor(() => {
      expect(onSearchMock).toHaveBeenCalledTimes(1);
      expect(onSearchMock).toHaveBeenCalledWith('test query');
    });

    jest.useRealTimers(); // Restore real timers
  });

  it('dispatches toggleDarkMode when theme controller is clicked', () => {
    render(
      <Provider store={store}>
        <Header onSearch={onSearchMock} searchQuery="" />
      </Provider>
    );

    // This line requires the 'aria-label' fix in Header.tsx (see next step)
    const themeController = screen.getByRole('checkbox', { name: /toggle theme/i });
    fireEvent.click(themeController);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(toggleDarkMode());
  });

  it('updates data-theme attribute on html element when dark mode state changes', async () => {
    const { rerender } = render(
      <Provider store={store}>
        <Header onSearch={onSearchMock} searchQuery="" />
      </Provider>
    );

    // Initial state: darkMode is false, data-theme should be 'light'
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    // Simulate toggling dark mode by updating the mock store's state
    store = mockStore({
      userPreferences: {
        darkMode: true, // Simulate dark mode being true
      },
    });
    store.dispatch = jest.fn(); // Re-mock dispatch for subsequent renders

    await act(async () => { // Wrap rerender in act
      rerender( // Re-render with updated state
        <Provider store={store}>
          <Header onSearch={onSearchMock} searchQuery="" />
        </Provider>
      );
    });


    // Use await waitFor as the useEffect might run asynchronously
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });


    // Simulate toggling back to light mode
    store = mockStore({
      userPreferences: {
        darkMode: false, // Simulate dark mode being false
      },
    });
    store.dispatch = jest.fn();

    await act(async () => { // Wrap rerender in act
      rerender(
        <Provider store={store}>
          <Header onSearch={onSearchMock} searchQuery="" />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    });
  });
});