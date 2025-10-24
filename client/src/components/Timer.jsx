import React, { useEffect, useRef, useState } from 'react';

export default function Timer({ initialMinutes = 25, compact = false, onComplete, className = '' }) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    let interval;
    if (isActive && !isPaused && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    } else if (secondsLeft === 0 && isActive && !startedRef.current) {
      startedRef.current = true;
      setIsActive(false);
      setIsPaused(false);
      onComplete && onComplete();
    } else if (!isActive || isPaused) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, secondsLeft, onComplete]);

  useEffect(() => {
    setSecondsLeft(initialMinutes * 60);
  }, [initialMinutes]);

  const format = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const start = () => { setIsActive(true); setIsPaused(false); startedRef.current = false; };
  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);
  const reset = () => { setSecondsLeft(initialMinutes * 60); setIsActive(false); setIsPaused(false); startedRef.current = false; };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>
      <div className={`font-bold ${compact ? 'text-3xl' : 'text-5xl'} text-center mb-3`}>{format(secondsLeft)}</div>
      {isActive && !isPaused && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(secondsLeft / (initialMinutes * 60)) * 100}%` }}
          />
        </div>
      )}
      <div className="flex justify-center gap-2">
        {!isActive && !isPaused && <button onClick={start} className="px-3 py-2 bg-teal-600 text-white rounded-md">Start</button>}
        {isActive && !isPaused && <button onClick={pause} className="px-3 py-2 border border-yellow-500 text-yellow-600 rounded-md">Pause</button>}
        {isActive && isPaused && <button onClick={resume} className="px-3 py-2 bg-teal-600 text-white rounded-md">Resume</button>}
        {(isActive || isPaused) && <button onClick={reset} className="px-3 py-2 border border-red-500 text-red-600 rounded-md">Reset</button>}
      </div>
    </div>
  );
}