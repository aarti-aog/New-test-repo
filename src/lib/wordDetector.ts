function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .trim();
}

const WORD_ALIASES: Record<string, string[]> = {
  // Existing — Agile / Tech
  'ci/cd': ['ci cd', 'cicd', 'continuous integration continuous delivery'],
  'mvp': ['minimum viable product'],
  'roi': ['return on investment'],
  'api': ['a.p.i.'],
  'devops': ['dev ops', 'dev-ops'],
  'a/b test': ['a b test', 'ab test', 'split test'],
  'wip limit': ['work in progress limit', 'wip'],
  // Video Games — acronyms the speech API expands or varies
  'gg': ['good game'],
  'pvp': ['player vs player', 'player versus player'],
  'dlc': ['downloadable content', 'd l c'],
  'xp': ['experience points', 'x p'],
  'co-op': ['co op', 'coop', 'cooperative'],
  'power-up': ['power up'],
  'speedrun': ['speed run'],
  // Fruits — compound words the speech API may split
  'starfruit': ['star fruit'],
  'jackfruit': ['jack fruit'],
};

export function detectWords(
  transcript: string,
  cardWords: string[],
  alreadyFilled: Set<string>,
): string[] {
  const normalized = normalizeText(transcript);
  const detected: string[] = [];

  for (const word of cardWords) {
    if (alreadyFilled.has(word.toLowerCase())) continue;

    const normalizedWord = normalizeText(word);

    if (normalizedWord.includes(' ')) {
      if (normalized.includes(normalizedWord)) {
        detected.push(word);
      }
    } else {
      const regex = new RegExp(`\\b${escapeRegex(normalizedWord)}\\b`, 'i');
      if (regex.test(normalized)) {
        detected.push(word);
      }
    }
  }

  return detected;
}

export function detectWordsWithAliases(
  transcript: string,
  cardWords: string[],
  alreadyFilled: Set<string>,
): string[] {
  const detected = detectWords(transcript, cardWords, alreadyFilled);
  const detectedLower = new Set(detected.map(w => w.toLowerCase()));

  for (const word of cardWords) {
    if (alreadyFilled.has(word.toLowerCase())) continue;
    if (detectedLower.has(word.toLowerCase())) continue;

    const aliases = WORD_ALIASES[word.toLowerCase()];
    if (!aliases) continue;

    const normalizedTranscript = normalizeText(transcript);
    for (const alias of aliases) {
      if (normalizedTranscript.includes(alias)) {
        detected.push(word);
        break;
      }
    }
  }

  return detected;
}
