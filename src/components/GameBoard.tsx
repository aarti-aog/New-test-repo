import type { GameState } from '../types';
import { checkForBingo, countFilled, getClosestToWin } from '../lib/bingoChecker';
import { BingoCard } from './BingoCard';
import { GameControls } from './GameControls';
import { TranscriptPanel } from './TranscriptPanel';
import { CATEGORIES } from '../data/categories';

interface Props {
  game: GameState;
  setGame: React.Dispatch<React.SetStateAction<GameState>>;
  onWin: (winningLine: NonNullable<GameState['winningLine']>, winningWord: string) => void;
  onNewCard: () => void;
}

export function GameBoard({ game, setGame, onWin, onNewCard }: Props) {
  const { card, winningLine, isListening, category } = game;
  if (!card || !category) return null;

  const filled = countFilled(card);
  const closest = getClosestToWin(card);
  const categoryName = CATEGORIES.find(c => c.id === category)?.name ?? '';

  function handleSquareClick(row: number, col: number) {
    if (!card) return;
    const square = card.squares[row][col];
    if (square.isFreeSpace) return;

    const updatedSquares = card.squares.map((r, ri) =>
      r.map((sq, ci) => {
        if (ri === row && ci === col) {
          return { ...sq, isFilled: !sq.isFilled, filledAt: Date.now() };
        }
        return sq;
      })
    );

    const updatedCard = { ...card, squares: updatedSquares };
    const bingo = checkForBingo(updatedCard);

    setGame(prev => ({
      ...prev,
      card: updatedCard,
      filledCount: countFilled(updatedCard),
      ...(bingo ? { status: 'won' as const, completedAt: Date.now(), winningLine: bingo } : {}),
    }));

    if (bingo) {
      onWin(bingo, square.word);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">🎯 Meeting Bingo</span>
          <span className="text-xs text-gray-400 hidden sm:inline">— {categoryName}</span>
        </div>
        <div className="flex items-center gap-3">
          {isListening && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-gray-500 hidden sm:inline">Listening</span>
            </div>
          )}
          <span className="text-sm font-medium text-gray-700">{filled}/24</span>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-6 gap-4">
        {closest && closest.needed === 1 && (
          <div className="w-full max-w-sm bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-700 text-center">
            ⚡ One away from BINGO on {closest.line}!
          </div>
        )}

        <BingoCard
          card={card}
          winningLine={winningLine}
          onSquareClick={handleSquareClick}
        />

        <TranscriptPanel
          transcript=""
          interimTranscript=""
          detectedWords={[]}
          isListening={isListening}
        />

        <GameControls
          isListening={isListening}
          isSpeechSupported={false}
          onToggleListening={() => setGame(prev => ({ ...prev, isListening: !prev.isListening }))}
          onNewCard={onNewCard}
        />
      </main>
    </div>
  );
}
