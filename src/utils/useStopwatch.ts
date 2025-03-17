import { useEffect, useState } from "react";

export default function useStopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  /** format stopwatch time to mm:ss */
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return {
    /** return stopwatch time */
    time,
    /** return formatted stopwatch time in mm:ss format */
    formattedTime: formatTime(time),
    /** return true if stopwatch is running, false if not */
    isRunning,
    /** start the stopwatch */
    start: () => setIsRunning(true),
    /** stop the stopwatch */
    stop: () => setIsRunning(false),
    /** reset stopwatch to 0s */
    reset: () => {
      setIsRunning(false);
      setTime(0);
    },
    /** add n seconds to stopwatch */
    addTime: (n: number) => {
      setTime((prev) => prev + n);
    },
    timeFormatting: (t: number) => formatTime(t)
  };
}
