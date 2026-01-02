import { create } from 'zustand';
import { gameService } from '../services/gameService';
import type { Game, GameStatus } from '../types';

interface GameState {
  currentGame: Game | null;
  status: GameStatus | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchGameStatus: () => Promise<void>;
  startGame: () => Promise<void>;
  stopGame: () => Promise<void>;
  clearError: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentGame: null,
  status: null,
  isLoading: false,
  error: null,
  
  fetchGameStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const game = await gameService.getGameStatus();
      set({ 
        currentGame: game, 
        status: game.status, 
        isLoading: false 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch game status';
      set({ error: errorMessage, isLoading: false });
    }
  },
  
  startGame: async () => {
    set({ isLoading: true, error: null });
    try {
      await gameService.startGame();
      // Refresh game status
      const game = await gameService.getGameStatus();
      set({ 
        currentGame: game, 
        status: game.status, 
        isLoading: false 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to start game';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  stopGame: async () => {
    set({ isLoading: true, error: null });
    try {
      await gameService.stopGame();
      // Refresh game status
      const game = await gameService.getGameStatus();
      set({ 
        currentGame: game, 
        status: game.status, 
        isLoading: false 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to stop game';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  clearError: () => set({ error: null }),
}));
