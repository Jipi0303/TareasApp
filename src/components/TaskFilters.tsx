import React from 'react';
import { Check, Filter } from 'lucide-react';
import { Priority } from '../types';
import { getPriorityLabel } from '../utils';
import { useTaskContext } from '../context/TaskContext';

const TaskFilters: React.FC = () => {
  const { filterOptions, setFilter, state } = useTaskContext();

  const handleCompletedFilter = (value: boolean | null) => {
    setFilter({ completed: value });
  };

  const handlePriorityFilter = (value: Priority | null) => {
    setFilter({ priority: value });
  };

  const handleCategoryFilter = (value: string | null) => {
    setFilter({ categoryId: value });
  };

  const clearFilters = () => {
    setFilter({
      completed: null,
      priority: null,
      categoryId: null,
    });
  };

  // Check if any filter is active
  const hasActiveFilters =
    filterOptions.completed !== null ||
    filterOptions.priority !== null ||
    filterOptions.categoryId !== null;

  return (
    <div className="mb-4 border-b pb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-gray-700">
          <Filter className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">Filtros</span>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            Limpiar filtros
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status filter */}
        <div>
          <h4 className="text-xs text-gray-500 mb-2">Estado</h4>
          <div className="space-y-1">
            <button
              onClick={() => handleCompletedFilter(null)}
              className={`flex items-center text-sm py-1 px-2 rounded-md w-full text-left ${
                filterOptions.completed === null
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              {filterOptions.completed === null && (
                <Check className="h-4 w-4 mr-1" />
              )}
              <span className={filterOptions.completed === null ? 'ml-1' : 'ml-5'}>Todas</span>
            </button>
            
            <button
              onClick={() => handleCompletedFilter(false)}
              className={`flex items-center text-sm py-1 px-2 rounded-md w-full text-left ${
                filterOptions.completed === false
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              {filterOptions.completed === false && (
                <Check className="h-4 w-4 mr-1" />
              )}
              <span className={filterOptions.completed === false ? 'ml-1' : 'ml-5'}>Pendientes</span>
            </button>
            
            <button
              onClick={() => handleCompletedFilter(true)}
              className={`flex items-center text-sm py-1 px-2 rounded-md w-full text-left ${
                filterOptions.completed === true
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              {filterOptions.completed === true && (
                <Check className="h-4 w-4 mr-1" />
              )}
              <span className={filterOptions.completed === true ? 'ml-1' : 'ml-5'}>Completadas</span>
            </button>
          </div>
        </div>
        
        {/* Priority filter */}
        <div>
          <h4 className="text-xs text-gray-500 mb-2">Prioridad</h4>
          <div className="space-y-1">
            <button
              onClick={() => handlePriorityFilter(null)}
              className={`flex items-center text-sm py-1 px-2 rounded-md w-full text-left ${
                filterOptions.priority === null
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              {filterOptions.priority === null && (
                <Check className="h-4 w-4 mr-1" />
              )}
              <span className={filterOptions.priority === null ? 'ml-1' : 'ml-5'}>Todas</span>
            </button>
            
            {(['low', 'medium', 'high'] as Priority[]).map((priority) => (
              <button
                key={priority}
                onClick={() => handlePriorityFilter(priority)}
                className={`flex items-center text-sm py-1 px-2 rounded-md w-full text-left ${
                  filterOptions.priority === priority
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                {filterOptions.priority === priority && (
                  <Check className="h-4 w-4 mr-1" />
                )}
                <span className={filterOptions.priority === priority ? 'ml-1' : 'ml-5'}>
                  {getPriorityLabel(priority)}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Category filter */}
        <div>
          <h4 className="text-xs text-gray-500 mb-2">Categoría</h4>
          <div className="space-y-1">
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`flex items-center text-sm py-1 px-2 rounded-md w-full text-left ${
                filterOptions.categoryId === null
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              {filterOptions.categoryId === null && (
                <Check className="h-4 w-4 mr-1" />
              )}
              <span className={filterOptions.categoryId === null ? 'ml-1' : 'ml-5'}>Todas</span>
            </button>
            
            {state.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`flex items-center text-sm py-1 px-2 rounded-md w-full text-left ${
                  filterOptions.categoryId === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                {filterOptions.categoryId === category.id && (
                  <Check className="h-4 w-4 mr-1" />
                )}
                <div className="flex items-center">
                  <span 
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className={filterOptions.categoryId === category.id ? '' : 'ml-0'}>
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;