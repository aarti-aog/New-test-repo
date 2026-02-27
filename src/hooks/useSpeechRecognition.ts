import { useState, useEffect, useCallback, useRef } from 'react';
import type { SpeechRecognitionState } from '../types';

const SpeechRecognitionAPI =
  (typeof SpeechRecognition !== 'undefined' && SpeechRecognition) ||
  (typeof webkitSpeechRecognition !== 'undefined' && webkitSpeechRecognition) ||
  null;

export function useSpeechRecognition() {
  const [state, setState] = useState<SpeechRecognitionState>({
    isSupported: !!SpeechRecognitionAPI,
    isListening: false,
    transcript: '',
    interimTranscript: '',
    error: null,
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultCallbackRef = useRef<((chunk: string) => void) | null>(null);
  const shouldListenRef = useRef(false);

  useEffect(() => {
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      setState(prev => ({
        ...prev,
        transcript: prev.transcript + final,
        interimTranscript: interim,
      }));

      if (final && onResultCallbackRef.current) {
        onResultCallbackRef.current(final);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // 'no-speech' is not a real error — ignore it
      if (event.error === 'no-speech') return;
      setState(prev => ({ ...prev, error: event.error, isListening: false }));
      shouldListenRef.current = false;
    };

    recognition.onend = () => {
      // Auto-restart if we're still supposed to be listening
      if (shouldListenRef.current) {
        try { recognition.start(); } catch { /* already starting */ }
      } else {
        setState(prev => ({ ...prev, isListening: false, interimTranscript: '' }));
      }
    };

    recognitionRef.current = recognition;
    return () => { recognition.stop(); };
  }, []);

  const startListening = useCallback((onResult?: (chunk: string) => void) => {
    if (!recognitionRef.current) return;
    onResultCallbackRef.current = onResult ?? null;
    shouldListenRef.current = true;

    setState(prev => ({
      ...prev,
      isListening: true,
      transcript: '',
      interimTranscript: '',
      error: null,
    }));

    try { recognitionRef.current.start(); } catch { /* already running */ }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    shouldListenRef.current = false;
    onResultCallbackRef.current = null;
    setState(prev => ({ ...prev, isListening: false, interimTranscript: '' }));
    recognitionRef.current.stop();
  }, []);

  const resetTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '', interimTranscript: '' }));
  }, []);

  return { ...state, startListening, stopListening, resetTranscript };
}
