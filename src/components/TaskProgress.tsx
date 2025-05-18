import React, { useState } from 'react';
import { BarChart2, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimeRange } from '../types';
import { useTaskContext } from '../context/TaskContext';

const TaskProgress: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const { state } = useTaskContext();

  const report = React.useMemo(() => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredTasks = state.tasks.filter(task => 
      new Date(task.createdAt) >= startDate && new Date(task.createdAt) <= now
    );

    const total = filteredTasks.length;
    const completed = filteredTasks.filter(task => task.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate recurrence completion rates
    const recurringTasks = filteredTasks.filter(task => task.recurrence);
    const recurringTotal = recurringTasks.reduce((acc, task) => {
      if (task.recurrence) {
        return acc + task.recurrence.frequency;
      }
      return acc;
    }, 0);
    
    const recurringCompleted = recurringTasks.reduce((acc, task) => {
      if (task.recurrence) {
        return acc + task.recurrence.completedInstances;
      }
      return acc;
    }, 0);

    const recurringPercentage = recurringTotal > 0 
      ? Math.round((recurringCompleted / recurringTotal) * 100)
      : 0;

    const byCategory = state.categories.reduce((acc, category) => {
      const categoryTasks = filteredTasks.filter(task => task.categoryId === category.id);
      const categoryCompleted = categoryTasks.filter(task => task.completed).length;
      
      // Calculate recurrence completion for this category
      const categoryRecurringTasks = categoryTasks.filter(task => task.recurrence);
      const categoryRecurringTotal = categoryRecurringTasks.reduce((sum, task) => {
        if (task.recurrence) {
          return sum + task.recurrence.frequency;
        }
        return sum;
      }, 0);
      
      const categoryRecurringCompleted = categoryRecurringTasks.reduce((sum, task) => {
        if (task.recurrence) {
          return sum + task.recurrence.completedInstances;
        }
        return sum;
      }, 0);

      acc[category.id] = {
        completed: categoryCompleted,
        total: categoryTasks.length,
        percentage: categoryTasks.length > 0 
          ? Math.round((categoryCompleted / categoryTasks.length) * 100)
          : 0,
        recurringTotal: categoryRecurringTotal,
        recurringCompleted: categoryRecurringCompleted,
        recurringPercentage: categoryRecurringTotal > 0
          ? Math.round((categoryRecurringCompleted / categoryRecurringTotal) * 100)
          : 0
      };
      return acc;
    }, {} as Record<string, { 
      completed: number; 
      total: number; 
      percentage: number;
      recurringTotal: number;
      recurringCompleted: number;
      recurringPercentage: number;
    }>);

    const byStatus = {
      todo: filteredTasks.filter(task => task.status === 'todo').length,
      in_progress: filteredTasks.filter(task => task.status === 'in_progress').length,
      done: filteredTasks.filter(task => task.status === 'done').length,
    };

    const overdueTasks = filteredTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < now && !task.completed
    ).length;

    const upcomingTasks = filteredTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) > now && !task.completed
    ).length;

    return {
      timeRange,
      progress: { completed, total, percentage },
      recurring: { completed: recurringCompleted, total: recurringTotal, percentage: recurringPercentage },
      byCategory,
      byStatus,
      overdueTasks,
      upcomingTasks
    };
  }, [state.tasks, state.categories, timeRange]);

  const chartData = state.categories.map(category => ({
    name: category.name,
    'Tareas Completadas': report.byCategory[category.id]?.completed || 0,
    'Total de Tareas': report.byCategory[category.id]?.total || 0,
    'Instancias Completadas': report.byCategory[category.id]?.recurringCompleted || 0,
    'Total de Instancias': report.byCategory[category.id]?.recurringTotal || 0,
    color: category.color,
  }));

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-6 p-3 bg-white text-purple-600 rounded-full shadow-lg hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
        title="Ver progreso"
      >
        <BarChart2 className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Progreso de tareas</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 flex gap-2">
                {(['week', 'month', 'year'] as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-md ${
                      timeRange === range
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range === 'week' && 'Última semana'}
                    {range === 'month' && 'Último mes'}
                    {range === 'year' && 'Último año'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Total de tareas</p>
                  <p className="text-2xl font-bold">{report.progress.total}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Completadas</p>
                  <p className="text-2xl font-bold">
                    {report.progress.completed}
                    <span className="text-sm font-normal text-green-600 ml-2">
                      ({report.progress.percentage}%)
                    </span>
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Cumplimiento de recurrencias</p>
                  <p className="text-2xl font-bold">
                    {report.recurring.completed}/{report.recurring.total}
                    <span className="text-sm font-normal text-purple-600 ml-2">
                      ({report.recurring.percentage}%)
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Progreso por categoría
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Instancias Completadas" fill="#8B5CF6" />
                      <Bar dataKey="Total de Instancias" fill="#C4B5FD" />
                      <Bar dataKey="Tareas Completadas" fill="#10B981" />
                      <Bar dataKey="Total de Tareas" fill="#93C5FD" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {Object.entries(report.byStatus).map(([status, count]) => (
                  <div key={status} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {status === 'todo' && 'Por hacer'}
                      {status === 'in_progress' && 'En progreso'}
                      {status === 'done' && 'Completadas'}
                    </p>
                    <p className="text-xl font-semibold">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskProgress;