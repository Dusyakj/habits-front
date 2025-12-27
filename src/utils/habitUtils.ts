import type { Habit, ScheduleType, ScheduleTypeRaw } from '../types';

// Convert backend schedule_type (number) to frontend format (string)
export const normalizeScheduleType = (scheduleType: ScheduleTypeRaw): ScheduleType => {
  if (scheduleType === 1 || scheduleType === 'interval') {
    return 'interval';
  }
  if (scheduleType === 2 || scheduleType === 'weekly') {
    return 'weekly';
  }
  // Default to interval if unknown
  console.warn('Unknown schedule_type:', scheduleType);
  return 'interval';
};

// Convert frontend schedule_type (string) to backend format (number)
export const denormalizeScheduleType = (scheduleType: ScheduleType): number => {
  return scheduleType === 'interval' ? 1 : 2;
};

// Normalize a habit from backend format
export const normalizeHabit = (habit: any): Habit => {
  return {
    ...habit,
    schedule_type: normalizeScheduleType(habit.schedule_type),
  };
};

// Normalize array of habits
export const normalizeHabits = (habits: any[]): Habit[] => {
  return habits.map(normalizeHabit);
};
