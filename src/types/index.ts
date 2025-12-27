// User types
export interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user_id: string;
  email: string;
  username: string;
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  first_name?: string;
  timezone: string;
}

export interface LoginRequest {
  email_or_username: string;
  password: string;
}

// Habit types
export type ScheduleType = 'interval' | 'weekly';

// Backend sends schedule_type as number (1 = interval, 2 = weekly)
export type ScheduleTypeRaw = 1 | 2 | 'interval' | 'weekly';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color?: string;
  schedule_type: ScheduleType;
  interval_days?: number;
  weekly_days?: number[];
  timezone_offset_hours: number;
  streak: number;
  next_deadline_utc: string;
  confirmed_for_current_period: boolean;
  last_confirmed_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateHabitRequest {
  name: string;
  description?: string;
  color?: string;
  schedule_type: ScheduleType;
  interval_days?: number;
  weekly_days?: number[];
  timezone: string;
}

export interface UpdateHabitRequest {
  name?: string;
  description?: string;
  color?: string;
  schedule_type?: ScheduleType;
  interval_days?: number;
  weekly_days?: number[];
  timezone?: string;
}

export interface HabitConfirmation {
  id: string;
  habit_id: string;
  user_id: string;
  confirmed_at: string;
  confirmed_for_date: string;
  notes?: string;
  created_at: string;
}

export interface HabitStats {
  current_streak: number;
  longest_streak: number;
  total_confirmations: number;
  completion_rate: number;
  first_confirmation?: string;
  last_confirmation?: string;
}

export interface ListHabitsResponse {
  habits: Habit[];
  total_count: number;
}

export interface ConfirmHabitResponse {
  message: string;
  habit: Habit;
  confirmation: HabitConfirmation;
}

export interface HabitHistoryResponse {
  confirmations: HabitConfirmation[];
  total_count: number;
}

// API Error type
export interface ApiError {
  error: string;
}
