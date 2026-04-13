import api from './api';

interface ScheduleItem {
  id: string;
  goalId: string;
  goalName: string;
  topic: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  date: string;
}

interface GenerateScheduleParams {
  startDate: string;
  endDate: string;
  goalIds?: string[];
}

export const scheduleApi = {
  // Get schedule for a date range
  getSchedule: async (startDate: string, endDate: string): Promise<ScheduleItem[]> => {
    const response = await api.get('/schedules', {
      params: {
        startDate,
        endDate,
      },
    });
    return response.data;
  },

  // Generate a new schedule
  generateSchedule: async (params: GenerateScheduleParams): Promise<ScheduleItem[]> => {
    const response = await api.post('/schedules/generate', params);
    return response.data;
  },

  // Update a schedule item (e.g., mark as completed)
  updateScheduleItem: async (id: string, updates: Partial<ScheduleItem>): Promise<ScheduleItem> => {
    const response = await api.patch(`/schedules/${id}`, updates);
    return response.data;
  },

  // Delete a schedule item
  deleteScheduleItem: async (id: string): Promise<void> => {
    await api.delete(`/schedules/${id}`);
  },

  // Get available goals for scheduling
  getAvailableGoals: async (): Promise<Array<{ id: string; name: string }>> => {
    const response = await api.get('/goals/available');
    return response.data;
  },
};

export type { ScheduleItem, GenerateScheduleParams };
