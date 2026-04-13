import api from './api';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  userId: string;
}

export const getNotes = async (): Promise<Note[]> => {
  const response = await api.get('/api/notes');
  return response.data;
};

export const getNote = async (id: string): Promise<Note> => {
  const response = await api.get(`/api/notes/${id}`);
  return response.data;
};

export const createNote = async (note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> => {
  const response = await api.post('/api/notes', note);
  return response.data;
};

export const updateNote = async (id: string, note: Partial<Note>): Promise<Note> => {
  const response = await api.put(`/api/notes/${id}`, note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/api/notes/${id}`);
};

export const summarizeNote = async (id: string): Promise<string> => {
  const response = await api.post(`/api/notes/${id}/summarize`);
  return response.data;
};

export const convertToChecklist = async (id: string): Promise<string> => {
  const response = await api.post(`/api/notes/${id}/checklist`);
  return response.data;
};
