import api from './api';
import type { UploadResponse } from '../types';

export const uploadService = {
  async uploadChecker(file: File, challengeId: number): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('challengeId', challengeId.toString());
    
    const response = await api.post<UploadResponse>('/upload/checker', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async uploadVulnbox(file: File, challengeId: number): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('challengeId', challengeId.toString());
    
    const response = await api.post<UploadResponse>('/upload/vulnbox', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
