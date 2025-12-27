import { api } from '../lib/axios';
import type {
  Habit,
  CreateHabitRequest,
  UpdateHabitRequest,
  ListHabitsResponse,
  ConfirmHabitResponse,
  HabitHistoryResponse,
  HabitStats,
} from '../types';
import { normalizeHabit, normalizeHabits } from '../utils/habitUtils';

export const habitService = {
  createHabit: async (data: CreateHabitRequest): Promise<Habit> => {
    const response = await api.post('/habits/create', data);
    return normalizeHabit(response.data);
  },

  listHabits: async (activeOnly: boolean = true): Promise<ListHabitsResponse> => {
    const response = await api.get('/habits/list', {
      params: { active_only: activeOnly },
    });
    return {
      habits: normalizeHabits(response.data.habits || []),
      total_count: response.data.total_count,
    };
  },

  getHabit: async (habitId: string): Promise<Habit> => {
    const response = await api.get('/habits/get', {
      params: { id: habitId },
    });
    return normalizeHabit(response.data);
  },

  updateHabit: async (habitId: string, data: UpdateHabitRequest): Promise<Habit> => {
    const response = await api.put('/habits/update', data, {
      params: { id: habitId },
    });
    return normalizeHabit(response.data);
  },

  deleteHabit: async (habitId: string): Promise<{ message: string }> => {
    const response = await api.delete('/habits/delete', {
      params: { id: habitId },
    });
    return response.data;
  },

  confirmHabit: async (habitId: string, notes?: string): Promise<ConfirmHabitResponse> => {
    const response = await api.post(
      '/habits/confirm',
      { notes },
      {
        params: { id: habitId },
      }
    );
    return {
      ...response.data,
      habit: normalizeHabit(response.data.habit),
    };
  },

  getHabitHistory: async (
    habitId: string,
    limit: number = 30,
    offset: number = 0
  ): Promise<HabitHistoryResponse> => {
    const response = await api.get('/habits/history', {
      params: { id: habitId, limit, offset },
    });
    return response.data;
  },

  getHabitStats: async (habitId: string): Promise<HabitStats> => {
    const response = await api.get('/habits/stats', {
      params: { id: habitId },
    });
    return response.data;
  },
};
