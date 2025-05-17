import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { TaskCategory } from '../types';
import { useTaskContext } from '../context/TaskContext';

interface CategoryFormProps {
  category?: TaskCategory;
  isOpen: boolean;
  onClose: () => void;
}

const initialCategory: Omit<TaskCategory, 'id'> = {
  name: '',
  color: '#3B82F6',
};

const MAX_CATEGORY_NAME_LENGTH = 30;

const colorOptions = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

const CategoryForm: React.FC<CategoryFormProps> = ({ category, isOpen, onClose }) => {
  const [formData, setFormData] = useState<Omit<TaskCategory, 'id'>>(initialCategory);
  const [error, setError] = useState('');
  const { addCategory, updateCategory, state } = useTaskContext();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color,
      });
    } else {
      setFormData(initialCategory);
    }
    setError('');
  }, [category, isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CATEGORY_NAME_LENGTH) {
      setFormData((prev) => ({ ...prev, name: value }));
      setError('');
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  const checkDuplicateName = (name: string): boolean => {
    return state.categories.some(
      (c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== category?.id
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (checkDuplicateName(formData.name.trim())) {
      setError('Ya existe una categoría con este nombre');
      return;
    }

    if (category) {
      updateCategory({ ...category, ...formData });
    } else {
      addCategory(formData);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {category ? 'Editar categoría' : 'Nueva categoría'}
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre* <span className="text-gray-400 text-xs">({formData.name.length}/{MAX_CATEGORY_NAME_LENGTH})</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nombre de la categoría"
              required
              maxLength={MAX_CATEGORY_NAME_LENGTH}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform ${
                    formData.color === color 
                      ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' 
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  title={color}
                />
              ))}
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
              {category ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;