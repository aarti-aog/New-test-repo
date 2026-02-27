import { useState } from 'react';
import type { GameState, CategoryId } from './types';
import { generateCard } from './lib/cardGenerator';
import { LandingPage } from './components/LandingPage';
import { CategorySelect } from './components/CategorySelect';
import { GameBoard } from './components/GameBoard';
import { WinScreen } from './components/WinScreen';

type Screen = 'landing' | 'category' | 'game' | 'win';

const INITIAL_GAME: GameState = {
  status: 'idle',
  category: null,
  card: null,
  isListening: false,
  startedAt: null,
  completedAt: null,
  winningLine: null,
  winningWord: null,
  filledCount: 0,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [game, setGame] = useState<GameState>(INITIAL_GAME);

  function handleCategorySelect(categoryId: CategoryId) {
    const card = generateCard(categoryId);
    setGame({
      status: 'playing',
      category: categoryId,
      card,
      isListening: false,
      startedAt: Date.now(),
      completedAt: null,
      winningLine: null,
      winningWord: null,
      filledCount: 1, // free space
    });
    setScreen('game');
  }

  function handleWin(
    winningLine: NonNullable<GameState['winningLine']>,
    winningWord: string,
  ) {
    setGame(prev => ({
      ...prev,
      status: 'won',
      completedAt: Date.now(),
      winningLine,
      winningWord,
    }));
    setScreen('win');
  }

  function handleNewCard() {
    setScreen('category');
    setGame(INITIAL_GAME);
  }

  function handleHome() {
    setScreen('landing');
    setGame(INITIAL_GAME);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {screen === 'landing' && (
        <LandingPage onStart={() => setScreen('category')} />
      )}
      {screen === 'category' && (
        <CategorySelect onSelect={handleCategorySelect} onBack={handleHome} />
      )}
      {screen === 'game' && game.card && (
        <GameBoard
          game={game}
          setGame={setGame}
          onWin={handleWin}
          onNewCard={handleNewCard}
        />
      )}
      {screen === 'win' && (
        <WinScreen
          game={game}
          onPlayAgain={() => setScreen('category')}
          onHome={handleHome}
        />
      )}
    </div>
  );
}
