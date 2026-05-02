use serde::Serialize;
use std::{
  fs,
  path::{Component, Path, PathBuf},
};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct VaultEntry {
  name: String,
  path: String,
  is_dir: bool,
  children: Option<Vec<VaultEntry>>,
}

#[tauri::command]
fn list_vault_notes(vault_root: String) -> Result<Vec<VaultEntry>, String> {
  let root = canonicalize_vault_root(&vault_root)?;
  collect_entries(&root, &root)
}

#[tauri::command]
fn read_vault_note(vault_root: String, note_path: String) -> Result<String, String> {
  let root = canonicalize_vault_root(&vault_root)?;
  let path = resolve_existing_note_path(&root, &note_path)?;
  fs::read_to_string(path).map_err(|error| format!("Unable to read note: {error}"))
}

#[tauri::command]
fn write_vault_note(vault_root: String, note_path: String, content: String) -> Result<bool, String> {
  let root = canonicalize_vault_root(&vault_root)?;
  let path = resolve_writable_note_path(&root, &note_path)?;

  fs::write(path, content).map_err(|error| format!("Unable to save note: {error}"))?;
  Ok(true)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .plugin(tauri_plugin_dialog::init())
    .invoke_handler(tauri::generate_handler![
      list_vault_notes,
      read_vault_note,
      write_vault_note
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

fn canonicalize_vault_root(vault_root: &str) -> Result<PathBuf, String> {
  let root = PathBuf::from(vault_root);
  let canonical_root = root
    .canonicalize()
    .map_err(|error| format!("Unable to access vault root: {error}"))?;

  if !canonical_root.is_dir() {
    return Err("Selected vault root is not a directory.".into());
  }

  Ok(canonical_root)
}

fn resolve_existing_note_path(root: &Path, note_path: &str) -> Result<PathBuf, String> {
  ensure_safe_note_path(note_path)?;

  let path = root.join(note_path);
  let canonical_path = path
    .canonicalize()
    .map_err(|error| format!("Unable to access note: {error}"))?;

  if !canonical_path.starts_with(root) {
    return Err("Note path escapes the selected vault.".into());
  }

  if canonical_path.extension().and_then(|extension| extension.to_str()) != Some("md") {
    return Err("Only markdown notes are supported.".into());
  }

  Ok(canonical_path)
}

fn resolve_writable_note_path(root: &Path, note_path: &str) -> Result<PathBuf, String> {
  ensure_safe_note_path(note_path)?;

  let path = root.join(note_path);
  let parent = path.parent().ok_or_else(|| "Note path must include a parent directory.".to_string())?;
  let canonical_parent = parent
    .canonicalize()
    .map_err(|error| format!("Unable to access note directory: {error}"))?;

  if !canonical_parent.starts_with(root) {
    return Err("Note path escapes the selected vault.".into());
  }

  if path.extension().and_then(|extension| extension.to_str()) != Some("md") {
    return Err("Only markdown notes are supported.".into());
  }

  Ok(path)
}

fn ensure_safe_note_path(note_path: &str) -> Result<(), String> {
  let path = Path::new(note_path);

  if path.is_absolute() {
    return Err("Absolute note paths are not allowed.".into());
  }

  for component in path.components() {
    match component {
      Component::Normal(_) => {}
      Component::CurDir => {}
      Component::ParentDir | Component::Prefix(_) | Component::RootDir => {
        return Err("Path traversal is not allowed.".into());
      }
    }
  }

  Ok(())
}

fn collect_entries(root: &Path, current: &Path) -> Result<Vec<VaultEntry>, String> {
  let mut entries = fs::read_dir(current)
    .map_err(|error| format!("Unable to read vault directory: {error}"))?
    .filter_map(Result::ok)
    .collect::<Vec<_>>();

  entries.sort_by_key(|entry| entry.path());

  let mut result = Vec::new();

  for entry in entries {
    let path = entry.path();
    let name = entry.file_name().to_string_lossy().to_string();
    let relative_path = path
      .strip_prefix(root)
      .map_err(|error| format!("Unable to build relative path: {error}"))?
      .to_string_lossy()
      .replace('\\', "/");

    if path.is_dir() {
      let children = collect_entries(root, &path)?;
      if !children.is_empty() {
        result.push(VaultEntry {
          name,
          path: relative_path,
          is_dir: true,
          children: Some(children),
        });
      }
      continue;
    }

    if path.extension().and_then(|extension| extension.to_str()) == Some("md") {
      result.push(VaultEntry {
        name,
        path: relative_path,
        is_dir: false,
        children: None,
      });
    }
  }

  Ok(result)
}
