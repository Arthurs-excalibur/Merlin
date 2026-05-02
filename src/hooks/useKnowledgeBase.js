import { useCallback, useEffect, useMemo, useState } from 'react';
import { demoInsights, demoNotes } from '../data/demoData';
import { useVault } from './useVault';
import { extractLinks, extractTags } from '../utils/content.jsx';

export function useKnowledgeBase(vaultPath, memoryEnabled) {
  const { listMemoryNotes, getMemoryNote, saveMemoryNote, loading, error } = useVault(vaultPath);
  const [notes, setNotes] = useState([]);
  const [isDemoData, setIsDemoData] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadKnowledgeBase() {
      if (!memoryEnabled || !vaultPath) {
        if (!cancelled) {
          setNotes(buildKnowledgeNotes(demoNotes));
          setIsDemoData(true);
        }
        return;
      }

      const entries = await listMemoryNotes();
      const flattenedEntries = flattenEntries(entries);

      if (flattenedEntries.length === 0) {
        if (!cancelled) {
          setNotes(buildKnowledgeNotes(demoNotes));
          setIsDemoData(true);
        }
        return;
      }

      const loadedNotes = await Promise.all(
        flattenedEntries.map(async (entry) => {
          const content = await getMemoryNote(entry.path);

          return {
            path: entry.path,
            name: entry.name.replace(/\.md$/i, ''),
            category: entry.category,
            content: typeof content === 'string' ? content : '# Untitled\n',
          };
        }),
      );

      if (!cancelled) {
        setNotes(buildKnowledgeNotes(loadedNotes));
        setIsDemoData(false);
      }
    }

    loadKnowledgeBase();

    return () => {
      cancelled = true;
    };
  }, [getMemoryNote, listMemoryNotes, memoryEnabled, refreshKey, vaultPath]);

  const noteMap = useMemo(
    () => new Map(notes.map((note) => [note.path, note])),
    [notes],
  );

  const edges = useMemo(() => {
    const nameMap = new Map();
    notes.forEach((note) => {
      nameMap.set(note.name.toLowerCase(), note.path);
    });

    const nextEdges = [];

    notes.forEach((note) => {
      note.links.forEach((link) => {
        const targetPath = nameMap.get(link.toLowerCase());
        if (!targetPath || targetPath === note.path) {
          return;
        }

        const edgeId = [note.path, targetPath].sort().join('::');
        if (!nextEdges.some((edge) => edge.id === edgeId)) {
          nextEdges.push({
            id: edgeId,
            source: note.path,
            target: targetPath,
          });
        }
      });
    });

    return nextEdges;
  }, [notes]);

  const groupedNotes = useMemo(() => {
    const groups = new Map();

    notes.forEach((note) => {
      const category = note.category || 'Unsorted';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category).push(note);
    });

    return [...groups.entries()].map(([name, items]) => ({
      name,
      items,
    }));
  }, [notes]);

  const saveNote = useCallback(
    async (notePath, content) => {
      if (isDemoData || !memoryEnabled || !vaultPath) {
        setNotes((currentNotes) =>
          currentNotes.map((note) =>
            note.path === notePath
              ? enrichNote({
                  ...note,
                  content,
                })
              : note,
          ),
        );

        return true;
      }

      const success = await saveMemoryNote(notePath, content);
      if (success) {
        refresh();
      }
      return success;
    },
    [isDemoData, memoryEnabled, refresh, saveMemoryNote, vaultPath],
  );

  const insights = useMemo(() => buildInsights(notes, isDemoData), [isDemoData, notes]);

  return {
    notes,
    noteMap,
    groupedNotes,
    edges,
    insights,
    saveNote,
    refresh,
    loading,
    error,
    isDemoData,
  };
}

function flattenEntries(entries, currentCategory = '') {
  const result = [];

  entries.forEach((entry) => {
    if (entry.isDir) {
      const nextCategory = currentCategory || entry.name;
      result.push(...flattenEntries(entry.children ?? [], nextCategory));
      return;
    }

    result.push({
      path: entry.path,
      name: entry.name,
      category: currentCategory || entry.path.split('/')[0] || 'Unsorted',
    });
  });

  return result;
}

function buildKnowledgeNotes(rawNotes) {
  return rawNotes.map(enrichNote);
}

function enrichNote(note) {
  const links = extractLinks(note.content);
  const tags = extractTags(note.content);
  const excerpt =
    note.content
      .replace(/^#.*$/gm, '')
      .replace(/\[\[|\]\]/g, '')
      .replace(/#/g, '')
      .trim()
      .slice(0, 180) || 'No summary yet.';

  return {
    ...note,
    links,
    tags,
    excerpt,
  };
}

function buildInsights(notes, isDemoData) {
  if (isDemoData) {
    return demoInsights;
  }

  const topTag = notes
    .flatMap((note) => note.tags)
    .reduce((accumulator, tag) => {
      accumulator[tag] = (accumulator[tag] ?? 0) + 1;
      return accumulator;
    }, {});

  const dominantTag = Object.entries(topTag).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '#context';

  return [
    {
      title: 'Dominant theme',
      body: `${dominantTag} is showing up repeatedly across the active vault. Merlin can use that as a routing signal for related memory.`,
    },
    {
      title: 'Link density',
      body: `${notes.filter((note) => note.links.length > 0).length} notes currently participate in explicit relationships.`,
    },
    {
      title: 'Graph readiness',
      body: 'This vault is healthy enough for exploratory graph navigation and local context expansion.',
    },
  ];
}
