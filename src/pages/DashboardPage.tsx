import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { habitService } from '../services/habitService';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { HabitCard } from '../components/habits/HabitCard';
import { CreateHabitModal } from '../components/habits/CreateHabitModal';
import { HabitDetailsModal } from '../components/habits/HabitDetailsModal';
import type { Habit } from '../types';

export const DashboardPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [detailsHabit, setDetailsHabit] = useState<Habit | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['habits'],
    queryFn: () => habitService.listHabits(true),
  });

  const habits = data?.habits || [];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
          <p className="text-gray-600 mt-1">Track and maintain your daily habits</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Habit</span>
        </Button>
      </div>

      {/* Habits Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits yet</h3>
          <p className="text-gray-600 mb-6">Create your first habit to get started</p>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Habit</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onUpdate={() => refetch()}
              onEdit={setSelectedHabit}
              onViewDetails={setDetailsHabit}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Habit Modal */}
      <CreateHabitModal
        isOpen={isCreateModalOpen || !!selectedHabit}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedHabit(null);
        }}
        onSuccess={() => {
          refetch();
          setIsCreateModalOpen(false);
          setSelectedHabit(null);
        }}
        habit={selectedHabit}
      />

      {/* Habit Details Modal */}
      {detailsHabit && (
        <HabitDetailsModal
          habit={detailsHabit}
          isOpen={!!detailsHabit}
          onClose={() => setDetailsHabit(null)}
        />
      )}
    </div>
  );
};
