import { useState, useCallback } from 'react';
import type { GameState } from '../types';
import { checkForBingo, countFilled, getClosestToWin } from '../lib/bingoChecker';
import { detectWordsWithAliases } from '../lib/wordDetector';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
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
  const { card, winningLine, category } = game;
  const [detectedWords, setDetectedWords] = useState<string[]>([]);

  const speech = useSpeechRecognition();

  const handleTranscriptChunk = useCallback((chunk: string) => {
    setGame(prev => {
      if (!prev.card) return prev;

      const filledSet = new Set(
        prev.card.squares.flat()
          .filter(sq => sq.isFilled && !sq.isFreeSpace)
          .map(sq => sq.word.toLowerCase()),
      );

      const matches = detectWordsWithAliases(chunk, prev.card.words, filledSet);
      if (matches.length === 0) return prev;

      setDetectedWords(d => [...d, ...matches]);

      const updatedSquares = prev.card.squares.map(row =>
        row.map(sq => {
          if (!sq.isFilled && matches.some(m => m.toLowerCase() === sq.word.toLowerCase())) {
            return { ...sq, isFilled: true, isAutoFilled: true, filledAt: Date.now() };
          }
          return sq;
        }),
      );

      const updatedCard = { ...prev.card, squares: updatedSquares };
      const bingo = checkForBingo(updatedCard);
      const lastMatch = matches[matches.length - 1];

      if (bingo) {
        setTimeout(() => onWin(bingo, lastMatch), 0);
      }

      return {
        ...prev,
        card: updatedCard,
        filledCount: countFilled(updatedCard),
        ...(bingo
          ? { status: 'won' as const, completedAt: Date.now(), winningLine: bingo, winningWord: lastMatch }
          : {}),
      };
    });
  }, [onWin, setGame]);

  function handleToggleListening() {
    if (speech.isListening) {
      speech.stopListening();
      setGame(prev => ({ ...prev, isListening: false }));
    } else {
      speech.startListening(handleTranscriptChunk);
      setGame(prev => ({ ...prev, isListening: true }));
    }
  }

  function handleSquareClick(row: number, col: number) {
    if (!card) return;
    const square = card.squares[row][col];
    if (square.isFreeSpace) return;

    const updatedSquares = card.squares.map((r, ri) =>
      r.map((sq, ci) => {
        if (ri === row && ci === col) {
          return { ...sq, isFilled: !sq.isFilled, isAutoFilled: false, filledAt: Date.now() };
        }
        return sq;
      }),
    );

    const updatedCard = { ...card, squares: updatedSquares };
    const bingo = checkForBingo(updatedCard);

    setGame(prev => ({
      ...prev,
      card: updatedCard,
      filledCount: countFilled(updatedCard),
      ...(bingo ? { status: 'won' as const, completedAt: Date.now(), winningLine: bingo } : {}),
    }));

    if (bingo) onWin(bingo, square.word);
  }

  if (!card || !category) return null;

  const filled = countFilled(card);
  const closest = getClosestToWin(card);
  const categoryName = CATEGORIES.find(c => c.id === category)?.name ?? '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">🎯 Meeting Bingo</span>
          <span className="text-xs text-gray-400 hidden sm:inline">— {categoryName}</span>
        </div>
        <div className="flex items-center gap-3">
          {speech.isListening && (
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
        {!speech.isSupported && (
          <div className="w-full max-w-sm bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-800 text-center">
            ⚠️ Speech recognition unavailable in this browser. Tap squares manually.
          </div>
        )}

        {speech.error && (
          <div className="w-full max-w-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700 text-center">
            Mic error: {speech.error}. Try reloading or use manual mode.
          </div>
        )}

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
          transcript={speech.transcript}
          interimTranscript={speech.interimTranscript}
          detectedWords={detectedWords}
          isListening={speech.isListening}
        />

        <GameControls
          isListening={speech.isListening}
          isSpeechSupported={speech.isSupported}
          onToggleListening={handleToggleListening}
          onNewCard={onNewCard}
        />
      </main>
    </div>
  );
}
