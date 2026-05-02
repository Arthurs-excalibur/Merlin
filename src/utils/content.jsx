export function extractLinks(text) {
  const matches = text.match(/\[\[(.+?)\]\]/g) ?? [];
  return [...new Set(matches.map((match) => match.slice(2, -2)))];
}

export function extractTags(text) {
  const matches = text.match(/(^|\s)(#\w+)/g) ?? [];
  return [...new Set(matches.map((match) => match.trim()))];
}

export function renderHighlightedText(text) {
  const parts = text.split(/(\[\[.*?\]\]|#\w+)/g);

  return parts.map((part, index) => {
    if (part.startsWith('[[') && part.endsWith(']]')) {
      return (
        <span key={`link-${index}`} className="highlight-link">
          {part}
        </span>
      );
    }

    if (part.startsWith('#')) {
      return (
        <span key={`tag-${index}`} className="highlight-tag">
          {part}
        </span>
      );
    }

    return part;
  });
}
