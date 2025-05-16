import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, Edit, Trash2 } from 'lucide-react';
import { Task } from '../types';
import { formatDate, getPriorityColor, isOverdue, isToday, isTomorrow } from '../utils';
import { useTaskContext } from '../context/TaskContext';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { toggleTaskCompleted, deleteTask, getCategoryById } = useTaskContext();
  
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
  
  const dueDateLabel = getDueDateLabel();
  const isTaskOverdue = task.dueDate && isOverdue(task.dueDate);
  
  return (
    <div 
      className={`mb-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 transition-all ${
        task.completed ? 'opacity-70' : ''
      } hover:shadow-md`}
    >
      <div className="flex items-start">
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