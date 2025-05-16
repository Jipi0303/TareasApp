import React, { useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { TaskCategory } from '../types';
import { useTaskContext } from '../context/TaskContext';
import CategoryForm from './CategoryForm';


interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ isOpen, onClose }) => {
  const { state, deleteCategory } = useTaskContext();
  const [categoryToEdit, setCategoryToEdit] = useState<TaskCategory | undefined>(undefined);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleAddCategory = () => {
    setCategoryToEdit(undefined);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category: TaskCategory) => {
    setCategoryToEdit(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (categoryToDelete === id) {
      deleteCategory(id);
      setCategoryToDelete(null);
    } else {
      setCategoryToDelete(id);
    }
  };

  const handleCloseCategoryForm = () => {
    setShowCategoryForm(false);
    setCategoryToEdit(undefined);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Administrar categorías</h2>
        </div>
        
        <div className="p-4">
          <button
            onClick={handleAddCategory}
            className="w-full mb-4 flex items-center justify-center py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva categoría
          </button>
          
          {state.categories.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No hay categorías creadas
            </div>
          ) : (
            <div className="space-y-2">
              {state.categories.map((category) => (
                <div 
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center">
                    <span 
                      className="h-4 w-4 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-1 text-gray-400 hover:text-blue-500 rounded"
                      title="Editar"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className={`p-1 rounded ${
                        categoryToDelete === category.id
                          ? 'text-red-500'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                      title={categoryToDelete === category.id ? 'Confirmar eliminación' : 'Eliminar'}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
      
      <CategoryForm
        category={categoryToEdit}
        isOpen={showCategoryForm}
        onClose={handleCloseCategoryForm}
      />
    </div>
  );
};

export default CategoryManager;