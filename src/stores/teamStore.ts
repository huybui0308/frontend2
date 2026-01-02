import { create } from 'zustand';
import { teamService } from '../services/teamService';
import type { Team, CreateTeamRequest, TeamCreatedResponse, UpdateTeamRequest, BulkImportResponse } from '../types';

interface TeamState {
  teams: Team[];
  selectedTeam: Team | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTeams: () => Promise<void>;
  createTeam: (data: CreateTeamRequest) => Promise<TeamCreatedResponse>;
  updateTeam: (id: number, data: UpdateTeamRequest) => Promise<void>;
  deleteTeam: (id: number) => Promise<void>;
  importTeams: (file: File) => Promise<BulkImportResponse>;
  selectTeam: (team: Team | null) => void;
  clearError: () => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  teams: [],
  selectedTeam: null,
  isLoading: false,
  error: null,
  
  fetchTeams: async () => {
    set({ isLoading: true, error: null });
    try {
      const teams = await teamService.getAllTeams();
      set({ teams, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch teams';
      set({ error: errorMessage, isLoading: false });
    }
  },
  
  createTeam: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const result = await teamService.createTeam(data);
      // Refresh team list
      const teams = await teamService.getAllTeams();
      set({ teams, isLoading: false });
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create team';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  updateTeam: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await teamService.updateTeam(id, data);
      // Refresh team list
      const teams = await teamService.getAllTeams();
      set({ teams, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update team';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  deleteTeam: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await teamService.deleteTeam(id);
      // Refresh team list
      const teams = await teamService.getAllTeams();
      set({ teams, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete team';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  importTeams: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const result = await teamService.bulkImport(file);
      // Refresh team list
      const teams = await teamService.getAllTeams();
      set({ teams, isLoading: false });
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to import teams';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  selectTeam: (team) => set({ selectedTeam: team }),
  clearError: () => set({ error: null }),
}));
