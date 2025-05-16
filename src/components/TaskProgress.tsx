import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TimeRange, TaskReport } from '../types';
import { useTaskContext } from '../context/TaskContext';

interface TaskProgressProps {
  timeRange: TimeRange;
}

const TaskProgress: React.FC<TaskProgressProps> = ({ timeRange }) => {
  const { state } = useTaskContext();

  const report = useMemo(() => {
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

    const byCategory = state.categories.reduce((acc, category) => {
      const categoryTasks = filteredTasks.filter(task => task.categoryId === category.id);
      const categoryCompleted = categoryTasks.filter(task => task.completed).length;
      acc[category.id] = {
        completed: categoryCompleted,
        total: categoryTasks.length,
        percentage: categoryTasks.length > 0 
          ? Math.round((categoryCompleted / categoryTasks.length) * 100)
          : 0
      };
      return acc;
    }, {} as Record<string, { completed: number; total: number; percentage: number }>);

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
      byCategory,
      byStatus,
      overdueTasks,
      upcomingTasks
    };
  }, [state.tasks, state.categories, timeRange]);

  const chartData = state.categories.map(category => ({
    name: category.name,
    Completadas: report.byCategory[category.id]?.completed || 0,
    Total: report.byCategory[category.id]?.total || 0,
    color: category.color,
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Progreso de tareas</h3>
      
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
        
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-600">Vencidas</p>
          <p className="text-2xl font-bold">{report.overdueTasks}</p>
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
              <Bar dataKey="Completadas" fill="#10B981" />
              <Bar dataKey="Total" fill="#93C5FD" />
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
  );
};

export default TaskProgress;