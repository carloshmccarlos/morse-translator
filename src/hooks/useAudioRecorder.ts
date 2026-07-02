import { useCallback, useEffect, useRef, useState } from "react";

interface RecorderOptions {
  maxSeconds?: number;
}

export function useAudioRecorder(options: RecorderOptions = {}) {
  const maxSeconds = options.maxSeconds ?? 30;
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const stopTimerRef = useRef<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string>("");
  const [volume, setVolume] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRecording) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1_000);

    return () => window.clearInterval(timer);
  }, [isRecording]);

  const releaseStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    streamRef.current = null;
  }, []);

  const stopRecording = useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (audioCtxRef.current) {
      void audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setVolume(0);

    if (!mediaRecorderRef.current) return;
    if (mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError("");
    setAudioBlob(null);
    setElapsedSeconds(0);
    setVolume(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      // Setup Web Audio Analyser
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioCtxRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64; // small size for simple volume levels
        source.connect(analyser);
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          // Map average (0-255) to 0-100 scale
          const volMapped = Math.min(100, Math.round((average / 255) * 100));
          setVolume(volMapped);
          animationFrameIdRef.current = requestAnimationFrame(updateVolume);
        };
        animationFrameIdRef.current = requestAnimationFrame(updateVolume);
      } catch (audioErr) {
        console.warn("Failed to initialize audio analyser for waveform:", audioErr);
      }

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        setIsRecording(false);
        const combined = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(combined);
        releaseStream();
      };

      recorder.start();
      setIsRecording(true);

      stopTimerRef.current = window.setTimeout(() => {
        stopRecording();
      }, maxSeconds * 1_000);
    } catch {
      setError("Microphone permission denied or unavailable.");
      releaseStream();
    }
  }, [maxSeconds, releaseStream, stopRecording]);

  useEffect(
    () => () => {
      stopRecording();
      releaseStream();
    },
    [releaseStream, stopRecording]
  );

  return {
    audioBlob,
    elapsedSeconds,
    error,
    isRecording,
    startRecording,
    stopRecording,
    volume
  };
}

