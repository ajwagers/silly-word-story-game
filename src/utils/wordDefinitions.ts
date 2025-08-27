export const wordTypeDefinitions: Record<string, string> = {
  adjective: 'describes a noun (e.g., funny, bright, slimy).',
  noun: 'a person, place, or thing (e.g., dragon, castle, shoe).',
  'plural noun': 'more than one noun (e.g., cats, houses, wishes).',
  'proper noun': 'a specific person or place name (e.g., Alice, London).',
  verb: 'an action word (e.g., run, laugh, think).',
  'verb (present tense)': 'an action happening now (e.g., runs, laughs, thinks).',
  'verb (past tense)': 'an action that already happened (e.g., jumped, slept, ate).',
  'verb (ending in -ing)': 'an action that is ongoing (e.g., running, sleeping, eating).',
  adverb: 'describes a verb, often ends in -ly (e.g., quickly, loudly, happily).',
  exclamation: 'a sudden cry or remark (e.g., Wow!, Ouch!, Oh!).',
  pronoun: 'replaces a noun (e.g., he, she, it, they).',
  // Add more definitions as you expand your stories!
};

export const capitalize = (s: string): string => {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};