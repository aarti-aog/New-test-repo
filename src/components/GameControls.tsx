interface Props {
  isListening: boolean;
  isSpeechSupported: boolean;
  onToggleListening: () => void;
  onNewCard: () => void;
}

export function GameControls({ isListening, isSpeechSupported, onToggleListening, onNewCard }: Props) {
  return (
    <div className="flex gap-3 justify-center mt-4">
      {isSpeechSupported && (
        <button
          onClick={onToggleListening}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
            isListening
              ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isListening ? '⏹ Stop Listening' : '🎤 Start Listening'}
        </button>
      )}
      <button
        onClick={onNewCard}
        className="px-5 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition-colors duration-150"
      >
        🔄 New Card
      </button>
    </div>
  );
}
