export const wordTypeDefinitions: { [key: string]: string } = {
  noun: 'A person, place, thing, or idea (e.g., "cat", "house", "happiness").',
  adjective: 'A word that describes a noun (e.g., "happy" dog, "tall" building).',
  adverb: 'A word that describes a verb, adjective, or another adverb. It often ends in "-ly" (e.g., "quickly", "slowly").',
  verb: 'An action word! It tells you what the subject is doing (e.g., "run", "jump", "think").',
  'verb (past tense)': 'A verb that describes an action that has already happened (e.g., "walked", "ate", "slept").',
  'verb (present tense)': 'A verb that describes an action happening now (e.g., "walks", "eats", "sleeps").',
  'verb (future)': 'A verb that describes an action that will happen (e.g., "will walk", "will eat").',
  'verb (ending in -ing)': 'A verb form ending in "-ing", often used to show continuous action (e.g., "walking", "eating").',
  'verb (infinitive)': 'The basic form of a verb, usually with "to" in front (e.g., "to walk", "to eat").',
};

export const capitalize = (s: string) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};