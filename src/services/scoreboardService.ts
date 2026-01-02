import api from './api';
import type { Scoreboard } from '../types';

export const scoreboardService = {
  async getScoreboard(): Promise<Scoreboard> {
    const response = await api.get<Scoreboard>('/scoreboard');
    return response.data;
  },
};
