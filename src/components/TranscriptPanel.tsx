interface Props {
  transcript: string;
  interimTranscript: string;
  detectedWords: string[];
  isListening: boolean;
}

export function TranscriptPanel({ transcript, interimTranscript, detectedWords, isListening }: Props) {
  const displayTranscript = transcript.slice(-120);

  return (
    <div className="bg-gray-100 rounded-lg p-3 mt-3">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
        <span className="text-xs font-medium text-gray-600">
          {isListening ? '🎤 Listening…' : '🎤 Paused'}
        </span>
      </div>

      <div className="text-xs text-gray-600 min-h-[32px] mb-2">
        <span className="text-gray-800">{displayTranscript || 'Waiting for speech…'}</span>
        <span className="text-gray-400 italic">{interimTranscript}</span>
      </div>

      {detectedWords.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-200">
          <span className="text-xs text-gray-400">Detected:</span>
          {detectedWords.slice(-5).map((word, i) => (
            <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              ✨ {word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
