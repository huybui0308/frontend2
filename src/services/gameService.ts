import api from './api';
import type { Game, GameStartResponse, GameStopResponse } from '../types';

export const gameService = {
  async getGameStatus(): Promise<Game> {
    const response = await api.get<Game>('/game/status');
    return response.data;
  },

  async startGame(): Promise<GameStartResponse> {
    const response = await api.post<GameStartResponse>('/game/start');
    return response.data;
  },

  async stopGame(): Promise<GameStopResponse> {
    const response = await api.post<GameStopResponse>('/game/stop');
    return response.data;
  },
};
