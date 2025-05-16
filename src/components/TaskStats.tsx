import React, { useMemo } from 'react';
import { CheckCircle, Clock, ListChecks } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { isOverdue } from '../utils';

const TaskStats: React.FC = () => {
  const { state } = useTaskContext();
  
  const stats = useMemo(() => {
    const total = state.tasks.length;
    const completed = state.tasks.filter(task => task.completed).length;
    const overdue = state.tasks.filter(task => 
      !task.completed && task.dueDate && isOverdue(task.dueDate)
    ).length;
    const pending = total - completed;
    
    // Calculate completion percentage
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      total,
      completed,
      pending,
      overdue,
      completionPercentage
    };
  }, [state.tasks]);
  
  if (stats.total === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-blue-100 text-blue-500 mr-3">
            <ListChecks className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total de tareas</p>
            <p className="text-xl font-semibold">{stats.total}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-green-100 text-green-500 mr-3">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completadas</p>
            <div className="flex items-end">
              <p className="text-xl font-semibold">{stats.completed}</p>
              <p className="text-sm text-gray-500 ml-2 mb-0.5">
                ({stats.completionPercentage}%)
              </p>
            </div>
          </div>
        </div>
        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${stats.completionPercentage}%` }}
          />
        </div>
      </div>
      
      {stats.overdue > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-red-100">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100 text-red-500 mr-3">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vencidas</p>
              <p className="text-xl font-semibold text-red-500">{stats.overdue}</p>
            </div>
          </div>
        </div>
      )}
      
      {stats.overdue === 0 && stats.pending > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 text-yellow-500 mr-3">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-xl font-semibold">{stats.pending}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskStats;