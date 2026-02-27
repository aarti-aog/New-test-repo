import type { GameState } from '../types';
import { BingoCard } from './BingoCard';
import { CATEGORIES } from '../data/categories';

interface Props {
  game: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function WinScreen({ game, onPlayAgain, onHome }: Props) {
  const { card, winningLine, winningWord, startedAt, completedAt, filledCount, category } = game;
  const categoryName = CATEGORIES.find(c => c.id === category)?.name ?? '';

  const elapsedMinutes =
    startedAt && completedAt ? Math.round((completedAt - startedAt) / 60000) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start px-4 py-8 gap-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-green-600 mb-1">🎉 BINGO! 🎉</h1>
        <p className="text-gray-500 text-sm">{categoryName}</p>
      </div>

      {card && (
        <BingoCard
          card={card}
          winningLine={winningLine}
          onSquareClick={() => {}}
        />
      )}

      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {elapsedMinutes !== null && (
          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-gray-500">⏱ Time to BINGO</span>
            <span className="font-medium text-gray-900">{elapsedMinutes} min</span>
          </div>
        )}
        {winningWord && (
          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-gray-500">🏆 Winning word</span>
            <span className="font-medium text-gray-900">"{winningWord}"</span>
          </div>
        )}
        <div className="flex justify-between px-4 py-3 text-sm">
          <span className="text-gray-500">📊 Squares filled</span>
          <span className="font-medium text-gray-900">{filledCount}/24</span>
        </div>
      </div>

      <div className="flex gap-3 w-full max-w-sm">
        <button
          onClick={onPlayAgain}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-150"
        >
          🔄 Play Again
        </button>
        <button
          onClick={onHome}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors duration-150"
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
}
