import api from './api';
import type { 
  Team, 
  CreateTeamRequest, 
  TeamCreatedResponse, 
  UpdateTeamRequest,
  BulkImportResponse 
} from '../types';

export const teamService = {
  async getAllTeams(): Promise<Team[]> {
    const response = await api.get<Team[]>('/teams');
    return response.data;
  },

  async createTeam(data: CreateTeamRequest): Promise<TeamCreatedResponse> {
    const response = await api.post<TeamCreatedResponse>('/teams', data);
    return response.data;
  },

  async updateTeam(id: number, data: UpdateTeamRequest): Promise<Team> {
    const response = await api.put<Team>(`/teams/${id}`, data);
    return response.data;
  },

  async deleteTeam(id: number): Promise<void> {
    await api.delete(`/teams/${id}`);
  },

  async bulkImport(file: File): Promise<BulkImportResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<BulkImportResponse>('/teams/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
