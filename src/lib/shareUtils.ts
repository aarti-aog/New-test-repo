import type { GameState } from '../types';
import { CATEGORIES } from '../data/categories';

export function buildShareText(game: GameState): string {
  const categoryName = CATEGORIES.find(c => c.id === game.category)?.name ?? 'Unknown';
  const elapsed =
    game.startedAt && game.completedAt
      ? Math.round((game.completedAt - game.startedAt) / 60000)
      : null;

  const lines = [
    '🎯 I got Meeting Bingo!',
    `Category: ${categoryName}`,
    elapsed !== null ? `Time: ${elapsed} minute${elapsed === 1 ? '' : 's'}` : null,
    game.winningWord ? `Winning word: "${game.winningWord}"` : null,
    `${game.filledCount}/24 squares filled`,
    '',
    '▶ Play at meetingbingo.vercel.app',
  ];

  return lines.filter(l => l !== null).join('\n');
}

export type ShareResult = 'shared' | 'copied' | 'error';

export async function shareResult(game: GameState): Promise<ShareResult> {
  const text = buildShareText(game);

  if (navigator.share) {
    try {
      await navigator.share({ title: 'Meeting Bingo', text });
      return 'shared';
    } catch {
      // User cancelled native share — fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'error';
  }
}
