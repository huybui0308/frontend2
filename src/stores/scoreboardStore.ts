import { create } from 'zustand';
import { scoreboardService } from '../services/scoreboardService';
import type { Scoreboard } from '../types';

interface ScoreboardState {
  scoreboard: Scoreboard | null;
  isLoading: boolean;
  error: string | null;
  autoRefresh: boolean;
  refreshInterval: number; // milliseconds
  
  // Actions
  fetchScoreboard: () => Promise<void>;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (ms: number) => void;
  clearError: () => void;
}

export const useScoreboardStore = create<ScoreboardState>((set) => ({
  scoreboard: null,
  isLoading: false,
  error: null,
  autoRefresh: true,
  refreshInterval: 10000, // 10 seconds default
  
  fetchScoreboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const scoreboard = await scoreboardService.getScoreboard();
      set({ 
        scoreboard: {
          ...scoreboard,
          lastUpdated: new Date().toISOString(),
        }, 
        isLoading: false 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch scoreboard';
      set({ error: errorMessage, isLoading: false });
    }
  },
  
  setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
  setRefreshInterval: (ms) => set({ refreshInterval: ms }),
  clearError: () => set({ error: null }),
}));
