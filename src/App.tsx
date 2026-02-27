import type { GameState, CategoryId } from './types';
import { generateCard } from './lib/cardGenerator';
import { useLocalStorage } from './hooks/useLocalStorage';
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
  const [screen, setScreen, clearScreen] = useLocalStorage<Screen>('mb-screen', 'landing');
  const [game, setGame, clearGame] = useLocalStorage<GameState>('mb-game', INITIAL_GAME);

  // Don't restore a mid-game listening state — user must re-enable mic
  const restoredGame = game.status === 'playing' ? { ...game, isListening: false } : game;

  function handleCategorySelect(categoryId: CategoryId) {
    const card = generateCard(categoryId);
    const newGame: GameState = {
      status: 'playing',
      category: categoryId,
      card,
      isListening: false,
      startedAt: Date.now(),
      completedAt: null,
      winningLine: null,
      winningWord: null,
      filledCount: 1,
    };
    setGame(newGame);
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
    clearGame();
    clearScreen();
    setScreen('category');
  }

  function handleHome() {
    clearGame();
    clearScreen();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {screen === 'landing' && (
        <LandingPage onStart={() => setScreen('category')} />
      )}
      {screen === 'category' && (
        <CategorySelect onSelect={handleCategorySelect} onBack={handleHome} />
      )}
      {screen === 'game' && restoredGame.card && (
        <GameBoard
          game={restoredGame}
          setGame={setGame}
          onWin={handleWin}
          onNewCard={handleNewCard}
        />
      )}
      {screen === 'win' && (
        <WinScreen
          game={restoredGame}
          onPlayAgain={() => { clearGame(); setScreen('category'); }}
          onHome={handleHome}
        />
      )}
    </div>
  );
}
