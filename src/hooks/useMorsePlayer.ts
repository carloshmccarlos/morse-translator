import { useCallback, useEffect, useRef, useState } from "react";
import { morseToToneSegments } from "../lib/morseTiming";

export function useMorsePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  // Track whether the component is still mounted to avoid stale state updates
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Cleanup on unmount
      oscillatorsRef.current.forEach((osc) => { try { osc.stop(); } catch { /* no-op */ } });
      oscillatorsRef.current = [];
      if (contextRef.current) {
        void contextRef.current.close();
        contextRef.current = null;
      }
    };
  }, []);

  const stop = useCallback(() => {
    oscillatorsRef.current.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // no-op
      }
    });
    oscillatorsRef.current = [];

    if (contextRef.current) {
      void contextRef.current.close();
      contextRef.current = null;
    }

    if (mountedRef.current) setIsPlaying(false);
  }, []);

  const play = useCallback(
    async (morse: string, wpm: number, frequencyHz = 650) => {
      if (!morse.trim()) return;

      stop();
      const context = new AudioContext();
      contextRef.current = context;

      const gain = context.createGain();
      gain.gain.value = 0.15;
      gain.connect(context.destination);

      const startAt = context.currentTime + 0.03;
      let cursor = startAt;
      const segments = morseToToneSegments(morse, wpm);
      let lastOscillator: OscillatorNode | null = null;

      segments.forEach((segment) => {
        if (segment.on) {
          const oscillator = context.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.value = frequencyHz;
          oscillator.connect(gain);
          oscillator.start(cursor);
          oscillator.stop(cursor + segment.durationSec);
          oscillatorsRef.current.push(oscillator);
          lastOscillator = oscillator;
        }
        cursor += segment.durationSec;
      });

      if (mountedRef.current) setIsPlaying(true);

      // Use onended on the last oscillator instead of setTimeout for reliable state sync
      if (lastOscillator) {
        (lastOscillator as OscillatorNode).onended = () => {
          if (mountedRef.current) setIsPlaying(false);
        };
      }
    },
    [stop]
  );

  return { isPlaying, play, stop };
}
