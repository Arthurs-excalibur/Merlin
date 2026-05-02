import { useState, useCallback } from 'react';
import { VaultAPI } from '../utils/fs';

export function useVault(vaultRoot) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runVaultOperation = useCallback(async (operation) => {
    setLoading(true);
    setError(null);

    try {
      return await operation();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMemoryNote = useCallback(async (notePath) => (
    runVaultOperation(() => VaultAPI.readNote(vaultRoot, notePath))
  ), [runVaultOperation, vaultRoot]);

  const saveMemoryNote = useCallback(async (notePath, content) => {
    const result = await runVaultOperation(() => VaultAPI.writeNote(vaultRoot, notePath, content));
    return Boolean(result);
  }, [runVaultOperation, vaultRoot]);

  const listMemoryNotes = useCallback(async () => {
    const result = await runVaultOperation(() => VaultAPI.listNotes(vaultRoot));
    return result ?? [];
  }, [runVaultOperation, vaultRoot]);

  return { getMemoryNote, saveMemoryNote, listMemoryNotes, loading, error };
}
