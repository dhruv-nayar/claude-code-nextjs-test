"use client";

import { useState, useRef, useEffect } from "react";

interface Key {
  note: string;
  frequency: number;
  type: "white" | "black";
}

const Piano = () => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on mount
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    return () => {
      // Clean up AudioContext on unmount
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Define piano keys with their frequencies (2 octaves: C4 to B5)
  const keys: Key[] = [
    { note: "C4", frequency: 261.63, type: "white" },
    { note: "C#4", frequency: 277.18, type: "black" },
    { note: "D4", frequency: 293.66, type: "white" },
    { note: "D#4", frequency: 311.13, type: "black" },
    { note: "E4", frequency: 329.63, type: "white" },
    { note: "F4", frequency: 349.23, type: "white" },
    { note: "F#4", frequency: 369.99, type: "black" },
    { note: "G4", frequency: 392.0, type: "white" },
    { note: "G#4", frequency: 415.3, type: "black" },
    { note: "A4", frequency: 440.0, type: "white" },
    { note: "A#4", frequency: 466.16, type: "black" },
    { note: "B4", frequency: 493.88, type: "white" },
    { note: "C5", frequency: 523.25, type: "white" },
    { note: "C#5", frequency: 554.37, type: "black" },
    { note: "D5", frequency: 587.33, type: "white" },
    { note: "D#5", frequency: 622.25, type: "black" },
    { note: "E5", frequency: 659.25, type: "white" },
    { note: "F5", frequency: 698.46, type: "white" },
    { note: "F#5", frequency: 739.99, type: "black" },
    { note: "G5", frequency: 783.99, type: "white" },
    { note: "G#5", frequency: 830.61, type: "black" },
    { note: "A5", frequency: 880.0, type: "white" },
    { note: "A#5", frequency: 932.33, type: "black" },
    { note: "B5", frequency: 987.77, type: "white" },
  ];

  const playNote = (frequency: number, note: string) => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;

    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    // Envelope for a more natural sound
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1);

    oscillator.start(now);
    oscillator.stop(now + 1);

    // Visual feedback
    setActiveKey(note);
    setTimeout(() => setActiveKey(null), 200);
  };

  const whiteKeys = keys.filter((key) => key.type === "white");
  const blackKeys = keys.filter((key) => key.type === "black");

  // Calculate position for black keys
  const getBlackKeyPosition = (note: string): number => {
    const blackKeyPositions: { [key: string]: number } = {
      "C#4": 0, "D#4": 1, "F#4": 3, "G#4": 4, "A#4": 5,
      "C#5": 7, "D#5": 8, "F#5": 10, "G#5": 11, "A#5": 12,
    };
    return blackKeyPositions[note] || 0;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 dark:from-gray-900 dark:to-purple-900 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Virtual Piano
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Click on any key to play its note
        </p>
      </div>

      <div className="relative bg-gradient-to-b from-amber-900 to-amber-950 p-8 rounded-lg shadow-2xl">
        <div className="relative flex">
          {/* White Keys */}
          {whiteKeys.map((key) => (
            <button
              key={key.note}
              onClick={() => playNote(key.frequency, key.note)}
              className={`relative w-16 h-64 bg-white border-2 border-gray-800 rounded-b-lg transition-all duration-100 hover:bg-gray-100 active:bg-gray-300 ${
                activeKey === key.note ? "bg-gray-300 scale-95" : ""
              }`}
              style={{
                boxShadow: activeKey === key.note
                  ? "inset 0 4px 6px rgba(0,0,0,0.3)"
                  : "0 4px 6px rgba(0,0,0,0.3)",
              }}
            >
              <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-semibold">
                {key.note}
              </span>
            </button>
          ))}

          {/* Black Keys */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {blackKeys.map((key) => (
              <button
                key={key.note}
                onClick={() => playNote(key.frequency, key.note)}
                className={`absolute w-10 h-40 bg-gradient-to-b from-gray-900 to-black border-2 border-black rounded-b-lg transition-all duration-100 hover:from-gray-800 active:from-gray-700 pointer-events-auto ${
                  activeKey === key.note ? "from-gray-700 scale-95" : ""
                }`}
                style={{
                  left: `${getBlackKeyPosition(key.note) * 64 + 44}px`,
                  boxShadow: activeKey === key.note
                    ? "inset 0 2px 4px rgba(0,0,0,0.5)"
                    : "0 4px 6px rgba(0,0,0,0.5)",
                  zIndex: 10,
                }}
              >
                <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white font-semibold">
                  {key.note}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          How to Use
        </h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>• Click on any key to play its musical note</li>
          <li>• White keys represent natural notes (C, D, E, F, G, A, B)</li>
          <li>• Black keys represent sharp/flat notes (C#, D#, F#, G#, A#)</li>
          <li>• The piano spans 2 octaves from C4 to B5</li>
        </ul>
      </div>
    </div>
  );
};

export default Piano;
