import { invoke } from '@tauri-apps/api/core';

export const VaultAPI = {
  async readNote(vaultPath, notePath) {
    return invoke('read_vault_note', { vaultRoot: vaultPath, notePath });
  },

  async writeNote(vaultPath, notePath, content) {
    return invoke('write_vault_note', { vaultRoot: vaultPath, notePath, content });
  },

  async listNotes(vaultPath) {
    return invoke('list_vault_notes', { vaultRoot: vaultPath });
  }
};
