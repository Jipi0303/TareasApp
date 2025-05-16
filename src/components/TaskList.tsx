import React, { useState } from 'react';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';
import TaskFilters from './TaskFilters';
import TaskSort from './TaskSort';
import TaskStats from './TaskStats';
import { Task } from '../types';
import { useTaskContext } from '../context/TaskContext';

const TaskList: React.FC<{
  onEditTask: (task: Task | null) => void;
}> = ({ onEditTask }) => {
  const { filteredTasks, filterOptions } = useTaskContext();
  const [showFilters, setShowFilters] = useState(false);

  const getEmptyStateMessage = () => {
    // Check if we have filters applied
    const hasFilters = 
      filterOptions.completed !== null || 
      filterOptions.priority !== null || 
      filterOptions.categoryId !== null ||
      filterOptions.searchQuery !== '';
    
    if (hasFilters) {
      return 'No se encontraron tareas con los filtros aplicados';
    } else {
      return 'No hay tareas pendientes';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      <div className="my-6">
        <TaskStats />
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Mis Tareas
          {filteredTasks.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredTasks.length})
            </span>
          )}
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>
      
      {showFilters && <TaskFilters />}
      
      {filteredTasks.length > 0 ? (
        <>
          <TaskSort />
          <div className="mt-6">
            {filteredTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onEdit={onEditTask} 
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          message={getEmptyStateMessage()}
          actionText="Crear nueva tarea"
          onAction={() => onEditTask(null)}

        />
      )}
    </div>
  );
};

export default TaskList;