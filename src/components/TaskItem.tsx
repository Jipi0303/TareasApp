import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, Edit, Trash2, MinusCircle, PlusCircle } from 'lucide-react';
import { Task } from '../types';
import { formatDate, getPriorityColor, isOverdue, isToday, isTomorrow } from '../utils';
import { useTaskContext } from '../context/TaskContext';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { toggleTaskCompleted, deleteTask, getCategoryById, updateTask } = useTaskContext();
  
  const category = getCategoryById(task.categoryId);
  
  const getDueDateLabel = () => {
    if (!task.dueDate) return null;
    
    if (isToday(task.dueDate)) {
      return 'Hoy';
    } else if (isTomorrow(task.dueDate)) {
      return 'Mañana';
    } else {
      return formatDate(task.dueDate);
    }
  };
  
  const handleDelete = () => {
    if (showConfirmDelete) {
      deleteTask(task.id);
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
    }
  };

  const handleCompletedInstancesChange = (increment: boolean) => {
    if (!task.recurrence) return;

    const newCount = increment 
      ? Math.min(task.recurrence.completedInstances + 1, task.recurrence.frequency)
      : Math.max(task.recurrence.completedInstances - 1, 0);

    updateTask({
      ...task,
      recurrence: {
        ...task.recurrence,
        completedInstances: newCount
      },
      completed: newCount === task.recurrence.frequency
    });
  };
  
  const dueDateLabel = getDueDateLabel();
  const isTaskOverdue = task.dueDate && isOverdue(task.dueDate);
  
  return (
    <div 
      className={`mb-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 transition-all ${
        task.completed ? 'opacity-70' : ''
      } hover:shadow-md`}
    >
      <div className="flex items-start">
        {task.recurrence ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCompletedInstancesChange(false)}
              disabled={task.recurrence.completedInstances === 0}
              className={`focus:outline-none ${
                task.recurrence.completedInstances === 0 
                  ? 'text-gray-300' 
                  : 'text-blue-500 hover:text-blue-600'
              }`}
            >
              <MinusCircle className="h-6 w-6" />
            </button>
            
            <span className="text-lg font-medium">
              {task.recurrence.completedInstances}/{task.recurrence.frequency}
            </span>
            
            <button
              onClick={() => handleCompletedInstancesChange(true)}
              disabled={task.recurrence.completedInstances === task.recurrence.frequency}
              className={`focus:outline-none ${
                task.recurrence.completedInstances === task.recurrence.frequency
                  ? 'text-gray-300'
                  : 'text-blue-500 hover:text-blue-600'
              }`}
            >
              <PlusCircle className="h-6 w-6" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => toggleTaskCompleted(task.id)}
            className={`mt-0.5 flex-shrink-0 focus:outline-none ${
              task.completed ? 'text-green-500' : 'text-gray-400 hover:text-blue-500'
            }`}
            title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          >
            {task.completed ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <Circle className="h-6 w-6" />
            )}
          </button>
        )}
        
        <div className="ml-3 flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 
              className={`font-medium ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {task.title}
            </h3>
            
            {category && (
              <span 
                className="text-xs px-2 py-0.5 rounded-full text-white" 
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            )}
            
            <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getPriorityColor(task.priority)}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>

            {task.recurrence && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {task.recurrence.frequency}x {' '}
                {task.recurrence.type === 'daily' && 'al día'}
                {task.recurrence.type === 'weekly' && 'por semana'}
                {task.recurrence.type === 'monthly' && 'al mes'}
              </span>
            )}
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          )}
          
          {dueDateLabel && (
            <div className={`flex items-center text-xs ${
              isTaskOverdue && !task.completed ? 'text-red-500' : 'text-gray-500'
            }`}>
              <Clock className="h-3 w-3 mr-1" />
              <span>{dueDateLabel}</span>
              {isTaskOverdue && !task.completed && <span className="ml-1">(vencida)</span>}
            </div>
          )}
        </div>
        
        <div className="flex space-x-1 ml-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-500 rounded focus:outline-none"
            title="Editar"
          >
            <Edit className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleDelete}
            className={`p-1 rounded focus:outline-none ${
              showConfirmDelete ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
            title={showConfirmDelete ? 'Confirmar eliminación' : 'Eliminar'}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;