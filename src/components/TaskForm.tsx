import React, { useEffect, useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { Priority, Task, TaskStatus, RecurrenceType } from '../types';
import { useTaskContext } from '../context/TaskContext';
import TaskCalendar from './TaskCalendar';

interface TaskFormProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
}

const initialTask: Omit<Task, 'id' | 'createdAt'> = {
  title: '',
  description: '',
  status: 'todo',
  completed: false,
  startDate: new Date(),
  dueDate: null,
  priority: 'low',
  categoryId: null,
  recurrence: null,
};

const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;

const TaskForm: React.FC<TaskFormProps> = ({ task, isOpen, onClose }) => {
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'createdAt'>>(initialTask);
  const [showCalendar, setShowCalendar] = useState(false);
  const { addTask, updateTask, state } = useTaskContext();
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        completed: task.completed,
        startDate: new Date(task.startDate),
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        priority: task.priority,
        categoryId: task.categoryId,
        recurrence: task.recurrence,
      });
      setTitleError('');
    } else {
      setFormData(initialTask);
      setTitleError('');
    }
  }, [task, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'title' && value.length > MAX_TITLE_LENGTH) {
      return;
    }
    
    if (name === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'title') {
      setTitleError('');
    }
  };

  const handleRecurrenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as RecurrenceType;
    setFormData((prev) => ({
      ...prev,
      recurrence: type
        ? {
            type,
            frequency: 1,
            completedInstances: 0,
          }
        : null,
    }));
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frequency = parseInt(e.target.value, 10);
    if (formData.recurrence && !isNaN(frequency)) {
      setFormData((prev) => ({
        ...prev,
        recurrence: {
          ...prev.recurrence!,
          frequency,
        },
      }));
    }
  };

  const handleDateChange = (type: 'startDate' | 'dueDate', date: Date | null) => {
    setFormData((prev) => ({ ...prev, [type]: date }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setTitleError('El título es requerido');
      return;
    }

    if (task) {
      updateTask({ ...task, ...formData });
    } else {
      addTask(formData);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {task ? 'Editar tarea' : 'Nueva tarea'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título* <span className="text-gray-400 text-xs">({formData.title.length}/{MAX_TITLE_LENGTH})</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                titleError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="¿Qué necesitas hacer?"
              required
              maxLength={MAX_TITLE_LENGTH}
              autoFocus
            />
            {titleError && (
              <p className="text-red-500 text-xs mt-1">{titleError}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción <span className="text-gray-400 text-xs">({formData.description.length}/{MAX_DESCRIPTION_LENGTH})</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Añade detalles sobre esta tarea"
              rows={3}
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">Por hacer</option>
              <option value="in_progress">En progreso</option>
              <option value="done">Completada</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de inicio
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateChange('startDate', e.target.value ? new Date(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha límite
              </label>
              <input
                type="date"
                value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange('dueDate', e.target.value ? new Date(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="recurrenceType" className="block text-sm font-medium text-gray-700 mb-1">
              Recurrencia
            </label>
            <select
              id="recurrenceType"
              value={formData.recurrence?.type || ''}
              onChange={handleRecurrenceChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin recurrencia</option>
              <option value="daily">Diaria</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>

          {formData.recurrence && (
            <div className="mb-4">
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Frecuencia
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="frequency"
                  min="1"
                  value={formData.recurrence.frequency}
                  onChange={handleFrequencyChange}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">
                  {formData.recurrence.type === 'daily' && 'veces al día'}
                  {formData.recurrence.type === 'weekly' && 'veces por semana'}
                  {formData.recurrence.type === 'monthly' && 'veces al mes'}
                </span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin categoría</option>
                {state.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {task ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>

        {showCalendar && (
          <TaskCalendar
            task={task}
            isOpen={showCalendar}
            onClose={() => setShowCalendar(false)}
            onDateSelect={(date) => {
              handleDateChange('startDate', date);
              setShowCalendar(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TaskForm;