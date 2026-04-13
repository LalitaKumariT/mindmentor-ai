import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { format, addDays, startOfWeek, formatISO, parseISO, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiLoader, 
  FiCheck, 
  FiRefreshCw, 
  FiChevronLeft, 
  FiChevronRight, 
  FiCalendar, 
  FiClock, 
  FiTarget, 
  FiCheckCircle 
} from 'react-icons/fi';
import { scheduleApi, ScheduleItem } from '../../services/scheduleApi';

interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  estimatedHours: number;
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 9 PM

const SchedulePage: React.FC = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableGoals, setAvailableGoals] = useState<Array<{ id: string; name: string }>>([]);
  const { user } = useAuth();

  // Generate a week's worth of dates starting from currentWeekStart
  const weekDates = Array.from({ length: 7 }, (_, i) => 
    addDays(currentWeekStart, i)
  );

  // Fetch schedule data and available goals
  const fetchSchedule = useCallback(async () => {
    try {
      setIsLoading(true);
      const startDate = formatISO(currentWeekStart, { representation: 'date' });
      const endDate = formatISO(addDays(currentWeekStart, 6), { representation: 'date' });
      
      const [scheduleData, goalsData] = await Promise.all([
        scheduleApi.getSchedule(startDate, endDate),
        scheduleApi.getAvailableGoals()
      ]);
      
      setSchedule(scheduleData);
      setAvailableGoals(goalsData);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  }, [currentWeekStart]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // Handle generating a new schedule (AI-powered)
  const handleGenerateSchedule = async () => {
    try {
      setIsGenerating(true);
      const startDate = formatISO(currentWeekStart, { representation: 'date' });
      const endDate = formatISO(addDays(currentWeekStart, 6), { representation: 'date' });
      
      // Optionally filter by specific goals if needed
      const goalIds = availableGoals.map(goal => goal.id);
      
      const generatedSchedule = await scheduleApi.generateSchedule({
        startDate,
        endDate,
        goalIds: goalIds.length > 0 ? goalIds : undefined
      });
      
      setSchedule(generatedSchedule);
    } catch (error) {
      console.error('Error generating schedule:', error);
      // Show error message to user
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (id: string) => {
    try {
      const item = schedule.find(item => item.id === id);
      if (!item) return;
      
      const updatedItem = await scheduleApi.updateScheduleItem(id, { 
        completed: !item.completed 
      });
      
      setSchedule(prev => 
        prev.map(item => 
          item.id === id ? updatedItem : item
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
      // Show error message to user
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prev => 
      direction === 'prev' 
        ? addDays(prev, -7) 
        : addDays(prev, 7)
    );
  };

  const getScheduleForDay = (date: Date) => {
    return schedule.filter(item => 
      isSameDay(parseISO(item.date), date)
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${start} - ${end}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Schedule</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiChevronLeft className="text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={handleGenerateSchedule}
            disabled={isGenerating}
            className={`flex items-center px-4 py-2 rounded-lg ${isGenerating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {isGenerating ? (
              <>
                <FiRefreshCw className="animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <FiRefreshCw className="mr-2" />
                Regenerate Schedule
              </>
            )}
          </button>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiChevronRight className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        {/* Week Header */}
        <div className="grid grid-cols-7 border-b dark:border-gray-700">
          {weekDates.map((date, index) => (
            <div 
              key={index}
              className={`py-3 text-center font-medium ${isSameDay(date, new Date()) ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}
            >
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {format(date, 'EEE')}
              </div>
              <div className={`text-lg ${isSameDay(date, new Date()) ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-900 dark:text-white'}`}>
                {format(date, 'd')}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {format(date, 'MMM')}
              </div>
            </div>
          ))}
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-7 divide-x dark:divide-gray-700">
          {weekDates.map((date, dayIndex) => {
            const daySchedule = getScheduleForDay(date);
            return (
              <div key={dayIndex} className="min-h-[500px] relative">
                <div className="absolute inset-0 overflow-y-auto p-2">
                  {daySchedule.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
                      No scheduled tasks
                    </div>
                  ) : (
                    daySchedule.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-2 p-3 rounded-lg border-l-4 ${
                          item.completed 
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                            : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {item.goalName}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {item.topic}
                            </div>
                            <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <FiClock className="mr-1" size={12} />
                              {formatTimeRange(item.startTime, item.endTime)}
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleComplete(item.id)}
                            className={`p-1 rounded-full ${
                              item.completed 
                                ? 'text-green-500 hover:text-green-600' 
                                : 'text-gray-400 hover:text-gray-500'
                            }`}
                          >
                            <FiCheckCircle size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
