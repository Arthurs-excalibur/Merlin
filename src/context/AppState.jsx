import { useEffect, useMemo, useState } from 'react';
import { AppStateContext } from './appStateContext';

const STORAGE_KEY = 'merlin.app-state.v1';

const defaultState = {
  vaultPath: '',
  memoryEnabled: true,
  chatModel: 'Gemini 3.1 Pro (High)',
  memoryModel: 'text-embedding-3-large',
  selectedNotePath: '',
  focusMode: false,
  sidebarCollapsed: false,
};

function loadInitialState() {
  const storedState = window.localStorage.getItem(STORAGE_KEY);

  if (!storedState) {
    return defaultState;
  }

  try {
    return {
      ...defaultState,
      ...JSON.parse(storedState),
    };
  } catch (error) {
    console.warn('Failed to parse saved Merlin app state.', error);
    return defaultState;
  }
}

export function AppStateProvider({ children }) {
  const [state, setState] = useState(loadInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(
    () => ({
      ...state,
      updateState(updates) {
        setState((currentState) => ({
          ...currentState,
          ...updates,
        }));
      },
    }),
    [state],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
