import { DailyEntry } from '@/types/tracking';

const STORAGE_KEY = 'wellness_tracker_entries';

export const storage = {
  getEntries: (): DailyEntry[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from storage:', error);
      return [];
    }
  },

  saveEntry: (entry: DailyEntry): void => {
    try {
      const entries = storage.getEntries();
      const existingIndex = entries.findIndex(e => e.date === entry.date);
      
      if (existingIndex >= 0) {
        entries[existingIndex] = entry;
      } else {
        entries.push(entry);
      }
      
      entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },

  getEntryByDate: (date: string): DailyEntry | null => {
    const entries = storage.getEntries();
    return entries.find(e => e.date === date) || null;
  },

  deleteEntry: (date: string): void => {
    try {
      const entries = storage.getEntries().filter(e => e.date !== date);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error deleting from storage:', error);
    }
  }
};
