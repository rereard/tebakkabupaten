import { FeatureCollection } from 'geojson';
import { GameMode } from './gameMode';
import { decryptJSON, encryptJSON, encryptKey } from './cryptoUtils';

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
export const saveGame = async (provinceName: string, gameMode: GameMode, answeredAreas: Record<string, string>, timeTaken?: number) => {
  const gameResult = {
    mode: gameMode,
    date: formatDate(new Date().toISOString()),
    result: answeredAreas,
    ...((gameMode === GameMode.TimeTrial || gameMode === GameMode.Mix) && timeTaken !== undefined && { time: timeTaken })
  };

  const encryptedKey = await encryptKey(provinceName);
  const existingHistory = await decryptJSON(localStorage.getItem(encryptedKey) || "[]") as GameHistoryItem[];

  const updatedHistory = [gameResult, ...(existingHistory || [])].slice(0, 5);

  localStorage.setItem(encryptedKey, await encryptJSON(updatedHistory));
};

export interface GameHistoryItem {
  mode: GameMode; // e.g., "Casual", "Time Trial", etc.
  date: string; // ISO date string when the game finished
  result: {[key: string]: "wrong" | "correct"}; // The answered areas result
  time?: number; // Optional: Only provided for Time Trial mode (time in seconds)
}

/** get province game history */
export const getGameHistory = async (provinceName: string): Promise<GameHistoryItem[]> => {
  const encryptedKey = await encryptKey(provinceName);
  const encryptedData = localStorage.getItem(encryptedKey);
  if (encryptedData) {
    try {
      return await decryptJSON(encryptedData) as GameHistoryItem[]
    } catch (error) {
      console.error("Error parsing game history:", error);
      return [];
    }
  }
  return [];
};

export const getStoredProvinces = async (data: FeatureCollection): Promise<string[]> => {
  // Get all keys from localStorage
  const allKeys = Object.keys(localStorage);
  
  
  // Extract province names from the GeoJSON file
  const provinceNames = data?.features?.map(feature => feature?.properties?.name);
  
  const storedProvinces: string[] = [];
  
  for (const province of provinceNames) {
    const encryptedKey = await encryptKey(province); // Encrypt the province name to match stored keys
    
    if (allKeys.includes(encryptedKey)) {
      storedProvinces.push(province); // Add province to result list if it exists
    }
  }

  return storedProvinces
}
