import { create } from 'zustand';

export interface RecommendedWord {
  word: string;
  pronunciation: string;
  meaning: string;
  example_kr: string;
  example_en: string;
  hashtags: string[];
}

interface WordState {
  selectedWord: RecommendedWord | null;
  setSelectedWord: (word: RecommendedWord) => void;
  clearSelectedWord: () => void;
}

export const useWordStore = create<WordState>((set) => ({
  selectedWord: null,
  setSelectedWord: (word) => set({ selectedWord: word }),
  clearSelectedWord: () => set({ selectedWord: null }),
}));
