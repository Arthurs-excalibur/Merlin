export const demoConversation = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Map the information architecture for Merlin so memory feels spatial, not bolted onto chat.',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    memoryUsed: true,
    content:
      'I am pulling your notes on cognitive tactility, vault taxonomy, and the Excalibur collaboration model. The pattern across them is that navigation should privilege relationships over chronology.',
    references: ['Design System Principles', 'Merlin Setup', 'Excalibur IDE'],
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content:
      'A strong next move is a hybrid workspace: conversation on one side, the active note on the other, with the graph available as the map of everything around that thought.',
    references: ['Spatial UX', 'Thinking in Public'],
  },
];

export const demoInsights = [
  {
    title: 'Memory bias detected',
    body: 'Current context is weighted toward architecture and system design notes rather than user-facing workflow notes.',
  },
  {
    title: 'Potential connection',
    body: 'Your collaboration notes link naturally with the active note on Excalibur IDE, but the backlink is still missing.',
  },
  {
    title: 'Suggested capture',
    body: 'The phrase "living visual thinking space" appears to be emerging as a product principle worth saving.',
  },
];

export const demoNotes = [
  {
    path: 'Projects/Excalibur IDE.md',
    name: 'Excalibur IDE',
    category: 'Projects',
    content:
      '# Excalibur IDE\n\nA collaborative IDE with strong event modeling.\n\n## Focus\nUse [[Spatial UX]] to shape navigation.\n\n## Dependencies\nReferences [[Merlin Setup]] and [[Design System Principles]].\n\n#architecture #collaboration',
  },
  {
    path: 'Projects/Merlin Setup.md',
    name: 'Merlin Setup',
    category: 'Projects',
    content:
      '# Merlin Setup\n\nMerlin should treat the vault as a living context system.\n\nLink the chat to [[Design System Principles]] and [[Spatial UX]].\n\n#memory #product',
  },
  {
    path: 'Ideas/Spatial UX.md',
    name: 'Spatial UX',
    category: 'Ideas',
    content:
      '# Spatial UX\n\nA second-brain interface should reveal adjacency, not just recency.\n\nConnected to [[Thinking in Public]] and [[Merlin Setup]].\n\n#ux #graph',
  },
  {
    path: 'Ideas/Design System Principles.md',
    name: 'Design System Principles',
    category: 'Ideas',
    content:
      '# Design System Principles\n\nUse low-contrast surfaces, crisp hierarchy, and calm motion.\n\nSee also [[Spatial UX]] and [[Excalibur IDE]].\n\n#design #system',
  },
  {
    path: 'People/Thinking in Public.md',
    name: 'Thinking in Public',
    category: 'People',
    content:
      '# Thinking in Public\n\nA working note on how visible reasoning builds trust.\n\nRelates to [[Spatial UX]].\n\n#writing #reflection',
  },
];
