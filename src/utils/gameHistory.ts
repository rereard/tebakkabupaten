enum GameMode {
  Casual = 1,
  SuddenDeath = 2,
  TimeTrial = 3,
  Mix = 4,
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Ensures 24-hour format
  }).format(date);
  return `${formattedDate}, ${formattedTime}`;
};

/** save game result into local storage
 * only 5 latest game is saved
 */
export const saveGame = (provinceName: string, gameMode: GameMode, answeredAreas: Record<string, string>, timeTaken?: number) => {
  const gameResult = {
    mode: gameMode,
    date: formatDate(new Date().toISOString()),
    result: answeredAreas,
    ...((gameMode === GameMode.TimeTrial || gameMode === GameMode.Mix) && timeTaken !== undefined && { time: timeTaken })
  };

  const existingHistory = JSON.parse(localStorage.getItem(provinceName) || "[]");

  const updatedHistory = [gameResult, ...existingHistory].slice(0, 5);

  localStorage.setItem(provinceName, JSON.stringify(updatedHistory));
};

export interface GameHistoryItem {
  mode: GameMode; // e.g., "Casual", "Time Trial", etc.
  date: string; // ISO date string when the game finished
  result: Record<string, "correct" | "wrong" | "unanswered">; // The answered areas result
  time?: number; // Optional: Only provided for Time Trial mode (time in seconds)
}

/** get province game history */
export const getGameHistory = (provinceName: string): GameHistoryItem[] => {
  const historyStr = localStorage.getItem(provinceName);
  if (historyStr) {
    try {
      const parsedHistory = JSON.parse(historyStr);
      // You might want to add further runtime checks here if needed.
      return parsedHistory as GameHistoryItem[];
    } catch (error) {
      console.error("Error parsing game history:", error);
      return [];
    }
  }
  return [];
};
