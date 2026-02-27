interface Props {
  onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Meeting Bingo</h1>
        <p className="text-lg text-gray-600 mb-2">Turn any meeting into a game.</p>
        <p className="text-sm text-gray-500 mb-8">
          Auto-detects buzzwords using speech recognition!
        </p>

        <button
          onClick={onStart}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-lg font-semibold py-4 px-8 rounded-xl transition-colors duration-150 shadow-md"
        >
          🎮 New Game
        </button>

        <p className="mt-4 text-xs text-gray-400">
          🔒 Audio processed locally. Never recorded.
        </p>

        <div className="mt-10 text-left bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            How it works
          </h2>
          <ol className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="text-lg leading-none">1️⃣</span>
              <span>Pick a buzzword category</span>
            </li>
            <li className="flex gap-3">
              <span className="text-lg leading-none">2️⃣</span>
              <span>Enable microphone for auto-detection</span>
            </li>
            <li className="flex gap-3">
              <span className="text-lg leading-none">3️⃣</span>
              <span>Join your meeting and listen</span>
            </li>
            <li className="flex gap-3">
              <span className="text-lg leading-none">4️⃣</span>
              <span>Watch squares fill automatically!</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
