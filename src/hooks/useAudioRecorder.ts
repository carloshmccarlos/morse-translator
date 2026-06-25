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

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

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
    stopRecording
  };
}
