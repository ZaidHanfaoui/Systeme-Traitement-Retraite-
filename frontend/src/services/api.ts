import axios from 'axios';
import { DossierRetraite, Carriere, Document, Paiement, StatutDossier, PensionCalculation } from '../types';

const API_BASE_URL = 'http://localhost:8088/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = 'http://localhost:8088/oauth2/authorization/keycloak';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: () => {
    window.location.href = 'http://localhost:8088/oauth2/authorization/keycloak';
  },

  getCurrentUser: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};

export const dossierService = {
  createDossier: (dossier: DossierRetraite) =>
    apiClient.post<DossierRetraite>('/dossiers', dossier),

  getDossierById: (id: number) =>
    apiClient.get<DossierRetraite>(`/dossiers/${id}`),

  getAllDossiers: () =>
    apiClient.get<DossierRetraite[]>('/dossiers'),

  getDossiersByStatut: (statut: StatutDossier) =>
    apiClient.get<DossierRetraite[]>(`/dossiers/statut/${statut}`),

  updateDossier: (id: number, dossier: Partial<DossierRetraite>) =>
    apiClient.put<DossierRetraite>(`/dossiers/${id}`, dossier),

  deleteDossier: (id: number) =>
    apiClient.delete(`/dossiers/${id}`),

  updateStatut: (id: number, statut: StatutDossier) =>
    apiClient.put<DossierRetraite>(`/dossiers/${id}/statut`, { statut }),

  calculatePension: (dossierId: number) =>
    apiClient.get<PensionCalculation>(`/dossiers/${dossierId}/calculate-pension`),
};

export const carriereService = {
  createCarriere: (dossierId: number, carriere: Carriere) =>
    apiClient.post<Carriere>(`/carrieres/dossier/${dossierId}`, carriere),

  getAllCarrieres: () =>
    apiClient.get<Carriere[]>('/carrieres'),

  getCarrieresByDossier: (dossierId: number) =>
    apiClient.get<Carriere[]>(`/carrieres/dossier/${dossierId}`),

  updateCarriere: (id: number, carriere: Partial<Carriere>) =>
    apiClient.put<Carriere>(`/carrieres/${id}`, carriere),

  deleteCarriere: (id: number) =>
    apiClient.delete(`/carrieres/${id}`),

  getCarriereStats: async () => {
    // Simulate fetching career statistics
    return Promise.resolve({
      totalCarrieres: 100,
      averageSalary: 50000,
      totalTrimestres: 1200,
    });
  },
};

export const documentService = {
  uploadDocument: (dossierId: number, file: File, description?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }
    return apiClient.post<Document>(`/documents/upload/${dossierId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getAllDocuments: () =>
    apiClient.get<Document[]>('/documents'),

  getDocumentsByDossier: (dossierId: number) =>
    apiClient.get<Document[]>(`/documents/dossier/${dossierId}`),

  downloadDocument: (documentId: number) =>
    apiClient.get(`/documents/${documentId}/download`, {
      responseType: 'blob',
    }),

  deleteDocument: (documentId: number) =>
    apiClient.delete(`/documents/${documentId}`),
    updateDocument: (documentId: number, data: Partial<Document>) =>
      apiClient.put<Document>(`/documents/${documentId}`, data),
};

export const paiementService = {
  createPaiement: (paiement: Paiement) =>
    apiClient.post<Paiement>('/paiements', paiement),

  getAllPaiements: () =>
    apiClient.get<Paiement[]>('/paiements'),

  getPaiementsByDossier: (dossierId: number) =>
    apiClient.get<Paiement[]>(`/paiements/dossier/${dossierId}`),

  updatePaiement: (id: number, paiement: Partial<Paiement>) =>
    apiClient.put<Paiement>(`/paiements/${id}`, paiement),

  deletePaiement: (id: number) =>
    apiClient.delete(`/paiements/${id}`),
};

export const geminiService = {
  chat: (message: string) =>
    apiClient.post<{ message: string }>('/gemini/chat', { message }),

  analyzeDocument: (documentId: number) =>
    apiClient.post<{ analysis: string }>(`/gemini/analyze/${documentId}`),
};

export default apiClient;
