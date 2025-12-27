import { useQuery } from '@tanstack/react-query';
import { habitService } from '../../services/habitService';
import { Button } from '../ui/Button';
import { X, TrendingUp, Calendar, Award, BarChart3 } from 'lucide-react';
import type { Habit } from '../../types';
import { formatDate, formatRelativeTime } from '../../utils/date';

interface HabitDetailsModalProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
}

export const HabitDetailsModal = ({ habit, isOpen, onClose }: HabitDetailsModalProps) => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['habit-stats', habit.id],
    queryFn: () => habitService.getHabitStats(habit.id),
    enabled: isOpen,
  });

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['habit-history', habit.id],
    queryFn: () => habitService.getHabitHistory(habit.id, 30, 0),
    enabled: isOpen,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{habit.name}</h2>
            {habit.description && (
              <p className="text-gray-600 text-sm mt-1">{habit.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Statistics Grid */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
            </div>

            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2 text-orange-700 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">Current Streak</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900">{stats.current_streak}</div>
                  <div className="text-xs text-orange-700">days</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2 text-purple-700 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-medium">Longest Streak</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">{stats.longest_streak}</div>
                  <div className="text-xs text-purple-700">days</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 text-blue-700 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-medium">Total</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{stats.total_confirmations}</div>
                  <div className="text-xs text-blue-700">completions</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 text-green-700 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">Success Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {Math.round(stats.completion_rate * 100)}%
                  </div>
                  <div className="text-xs text-green-700">completion</div>
                </div>
              </div>
            ) : null}
          </div>

          {/* History */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent History</h3>
            </div>

            {historyLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : history?.confirmations && history.confirmations.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.confirmations.map((confirmation) => (
                  <div
                    key={confirmation.id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatDate(confirmation.confirmed_for_date)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatRelativeTime(confirmation.confirmed_at)}
                        </div>
                      </div>
                      {confirmation.notes && (
                        <div className="ml-4 text-sm text-gray-600 italic">
                          "{confirmation.notes}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No history yet. Start completing this habit to see your progress!
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="pt-4">
            <Button variant="secondary" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
