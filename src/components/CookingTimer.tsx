'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Pause, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { create } from 'zustand';

interface Timer {
  id: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

interface TimerStore {
  timers: Timer[];
  addTimer: (label: string, minutes: number) => void;
  removeTimer: (id: string) => void;
  toggleTimer: (id: string) => void;
  tick: (id: string) => void;
  isMinimized: boolean;
  setIsMinimized: (minimized: boolean) => void;
}

const useTimerStore = create<TimerStore>((set) => ({
  timers: [],
  addTimer: (label: string, minutes: number) => {
    const id = Date.now().toString();
    const totalSeconds = Math.round(minutes * 60);
    set((state) => ({
      timers: [
        ...state.timers,
        {
          id,
          label,
          totalSeconds,
          remainingSeconds: totalSeconds,
          isRunning: true,
        },
      ],
    }));
  },
  removeTimer: (id: string) =>
    set((state) => ({
      timers: state.timers.filter((t) => t.id !== id),
    })),
  toggleTimer: (id: string) =>
    set((state) => ({
      timers: state.timers.map((t) =>
        t.id === id ? { ...t, isRunning: !t.isRunning } : t
      ),
    })),
  tick: (id: string) =>
    set((state) => ({
      timers: state.timers.map((t) => {
        if (t.id !== id || !t.isRunning) return t;
        const remaining = Math.max(0, t.remainingSeconds - 1);
        return { ...t, remainingSeconds: remaining };
      }),
    })),
  isMinimized: true,
  setIsMinimized: (minimized: boolean) => set({ isMinimized: minimized }),
}));

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function playAudio() {
  try {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    oscillator.start(now);
    oscillator.stop(now + 0.5);
  } catch (e) {
    console.error('Failed to play timer audio:', e);
  }
}

function TimerItem({ timer }: { timer: Timer }) {
  const { removeTimer, toggleTimer } = useTimerStore();
  const [hasAlerted, setHasAlerted] = useState(false);

  useEffect(() => {
    if (timer.remainingSeconds === 0 && !hasAlerted) {
      playAudio();
      setHasAlerted(true);
      // Show notification if available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Timer Complete', {
          body: `${timer.label} is done!`,
        });
      }
    }
  }, [timer.remainingSeconds, hasAlerted, timer.label]);

  const progress =
    ((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100;
  const isComplete = timer.remainingSeconds === 0;

  return (
    <div
      className={`bg-surface border border-border rounded-lg p-3 ${
        isComplete ? 'ring-2 ring-primary' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-text truncate">{timer.label}</p>
        <button
          onClick={() => removeTimer(timer.id)}
          className="text-text-secondary hover:text-primary transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="relative mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-center mb-2">
        <p className="text-2xl font-bold text-primary">
          {formatTime(timer.remainingSeconds)}
        </p>
      </div>

      <button
        onClick={() => toggleTimer(timer.id)}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
      >
        {timer.isRunning ? (
          <>
            <Pause size={16} /> Pause
          </>
        ) : (
          <>
            <Play size={16} /> Resume
          </>
        )}
      </button>
    </div>
  );
}

export function TimerPanel() {
  const { timers, isMinimized, setIsMinimized } = useTimerStore();

  useEffect(() => {
    if (timers.length === 0) return;

    const interval = setInterval(() => {
      timers.forEach((timer) => {
        if (timer.isRunning && timer.remainingSeconds > 0) {
          useTimerStore.setState((state) => ({
            timers: state.timers.map((t) => {
              if (t.id === timer.id && t.remainingSeconds > 0) {
                return { ...t, remainingSeconds: t.remainingSeconds - 1 };
              }
              return t;
            }),
          }));
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timers]);

  if (timers.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 md:w-80 w-full md:max-w-sm mx-2">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="w-full bg-primary text-white rounded-lg py-3 px-4 flex items-center justify-between font-semibold shadow-lg hover:bg-primary-dark transition-colors"
        >
          <span>{timers.length} active timer(s)</span>
          <ChevronUp size={20} />
        </button>
      ) : (
        <div className="bg-surface border border-border rounded-lg shadow-lg p-4 space-y-3 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text">Cooking Timers</h3>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-text-secondary hover:text-primary transition-colors"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {timers.map((timer) => (
            <TimerItem key={timer.id} timer={timer} />
          ))}
        </div>
      )}
    </div>
  );
}

export function useTimers() {
  return useTimerStore();
}
