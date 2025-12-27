import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { Habit } from '../../types';
import { habitService } from '../../services/habitService';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle2, Flame, Calendar, Edit, Trash2, MoreVertical, BarChart3 } from 'lucide-react';
import { formatDate, getWeekdayShort } from '../../utils/date';
import { cn } from '../../utils/cn';

interface HabitCardProps {
  habit: Habit;
  onUpdate: () => void;
  onEdit: (habit: Habit) => void;
  onViewDetails: (habit: Habit) => void;
}

export const HabitCard = ({ habit, onUpdate, onEdit, onViewDetails }: HabitCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  const confirmMutation = useMutation({
    mutationFn: (notes?: string) => habitService.confirmHabit(habit.id, notes),
    onSuccess: () => {
      setShowNotes(false);
      setNotes('');
      onUpdate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => habitService.deleteHabit(habit.id),
    onSuccess: onUpdate,
  });

  const handleConfirm = () => {
    if (habit.confirmed_for_current_period) return;
    setShowNotes(true);
  };

  const handleConfirmSubmit = () => {
    confirmMutation.mutate(notes || undefined);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteMutation.mutate();
    }
  };

  const getScheduleText = () => {
    if (habit.schedule_type === 'interval') {
      return `Every ${habit.interval_days} ${habit.interval_days === 1 ? 'day' : 'days'}`;
    } else {
      const days = habit.weekly_days?.map((d) => getWeekdayShort(d)).join(', ');
      return `Weekly: ${days}`;
    }
  };

  return (
    <Card
      className={cn(
        'relative transition-all duration-200 hover:shadow-md',
        habit.confirmed_for_current_period && 'bg-green-50 border-green-200'
      )}
      style={{ borderLeft: `4px solid ${habit.color || '#0ea5e9'}` }}
    >
      {/* Menu Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            <button
              onClick={() => {
                onViewDetails(habit);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Stats</span>
            </button>
            <button
              onClick={() => {
                onEdit(habit);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                handleDelete();
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Habit Info */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1 pr-8">{habit.name}</h3>
        {habit.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{habit.description}</p>
        )}
      </div>

      {/* Schedule & Streak */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center space-x-1 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{getScheduleText()}</span>
        </div>
        <div className="flex items-center space-x-1 font-semibold text-orange-600">
          <Flame className="w-4 h-4" />
          <span>{habit.streak} day{habit.streak !== 1 && 's'}</span>
        </div>
      </div>

      {/* Next Deadline */}
      <div className="text-xs text-gray-500 mb-4">
        Next: {formatDate(habit.next_deadline_utc)}
      </div>

      {/* Confirm Button or Notes Input */}
      {showNotes ? (
        <div className="space-y-2">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            rows={3}
          />
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmSubmit}
              isLoading={confirmMutation.isPending}
              className="flex-1"
            >
              Confirm
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setShowNotes(false);
                setNotes('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant={habit.confirmed_for_current_period ? 'secondary' : 'primary'}
          size="sm"
          onClick={handleConfirm}
          disabled={habit.confirmed_for_current_period}
          className="w-full flex items-center justify-center space-x-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {habit.confirmed_for_current_period ? 'Completed' : 'Mark as Done'}
          </span>
        </Button>
      )}
    </Card>
  );
};
