// MM:SS for < 1h, otherwise HH:MM:SS (both zero-padded)
const formatTime = (totalSeconds: number): string => {
  // guardrails
  if (!Number.isFinite(totalSeconds)) return "00:00";
  const sec = Math.max(0, Math.floor(totalSeconds));

  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
};

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const remainder = totalSeconds % 3600;
  const minutes = Math.floor(remainder / 60);
  const seconds = remainder % 60;

  if (hours > 0) return `${hours}h ${minutes}min ${seconds}s`;
  if (minutes > 0) return `${minutes}min ${seconds}s`;
  return `${seconds}s`;
};

export { formatTime, formatDuration };
