import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { habitService } from '../../services/habitService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import type { Habit } from '../../types';
import { getWeekdayName } from '../../utils/date';

const habitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  color: z.string().optional(),
  schedule_type: z.enum(['interval', 'weekly']),
  interval_days: z.number().min(1).optional(),
  weekly_days: z.array(z.number()).optional(),
  timezone: z.string(),
}).refine(
  (data) => {
    if (data.schedule_type === 'interval') {
      return data.interval_days !== undefined && data.interval_days > 0;
    }
    return true;
  },
  {
    message: 'Interval days is required for interval schedule',
    path: ['interval_days'],
  }
).refine(
  (data) => {
    if (data.schedule_type === 'weekly') {
      return data.weekly_days !== undefined && data.weekly_days.length > 0;
    }
    return true;
  },
  {
    message: 'At least one day must be selected for weekly schedule',
    path: ['weekly_days'],
  }
);

type HabitFormData = z.infer<typeof habitSchema>;

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  habit?: Habit | null;
}

export const CreateHabitModal = ({ isOpen, onClose, onSuccess, habit }: CreateHabitModalProps) => {
  const isEditing = !!habit;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      schedule_type: 'interval',
      interval_days: 1,
      weekly_days: [],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      color: '#0ea5e9',
    },
  });

  const scheduleType = watch('schedule_type');
  const weeklyDays = watch('weekly_days') || [];

  useEffect(() => {
    if (habit) {
      reset({
        name: habit.name,
        description: habit.description || '',
        color: habit.color || '#0ea5e9',
        schedule_type: habit.schedule_type,
        interval_days: habit.interval_days,
        weekly_days: habit.weekly_days || [],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    } else {
      reset({
        schedule_type: 'interval',
        interval_days: 1,
        weekly_days: [],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        color: '#0ea5e9',
      });
    }
  }, [habit, reset]);

  const createMutation = useMutation({
    mutationFn: habitService.createHabit,
    onSuccess: () => {
      onSuccess();
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: HabitFormData) => habitService.updateHabit(habit!.id, data),
    onSuccess: () => {
      onSuccess();
      reset();
    },
  });

  const onSubmit = (data: HabitFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const toggleWeekday = (day: number) => {
    const current = weeklyDays || [];
    if (current.includes(day)) {
      setValue('weekly_days', current.filter((d) => d !== day));
    } else {
      setValue('weekly_days', [...current, day].sort());
    }
  };

  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Name */}
          <Input
            label="Habit Name"
            placeholder="e.g., Morning Meditation"
            error={errors.name?.message}
            {...register('name')}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              placeholder="Add a description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    watch('color') === color
                      ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Schedule Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('schedule_type', 'interval')}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  scheduleType === 'interval'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Every N Days</div>
                <div className="text-sm text-gray-600">Repeat at fixed intervals</div>
              </button>
              <button
                type="button"
                onClick={() => setValue('schedule_type', 'weekly')}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  scheduleType === 'weekly'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Specific Days</div>
                <div className="text-sm text-gray-600">Choose weekdays</div>
              </button>
            </div>
          </div>

          {/* Interval Days */}
          {scheduleType === 'interval' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat Every (Days)
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                {...register('interval_days', { valueAsNumber: true })}
              />
              {errors.interval_days && (
                <p className="mt-1 text-sm text-red-600">{errors.interval_days.message}</p>
              )}
            </div>
          )}

          {/* Weekly Days */}
          {scheduleType === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Days
              </label>
              <div className="grid grid-cols-7 gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleWeekday(day)}
                    className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      weeklyDays.includes(day)
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {getWeekdayName(day).substring(0, 3)}
                  </button>
                ))}
              </div>
              {errors.weekly_days && (
                <p className="mt-1 text-sm text-red-600">{errors.weekly_days.message}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {isEditing ? 'Update Habit' : 'Create Habit'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
