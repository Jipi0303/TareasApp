import React, { useState } from 'react';
import { PlusCircle, Search, Sliders, X } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

interface HeaderProps {
  onOpenTaskForm: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenTaskForm }) => {
  const { setFilter, filterOptions } = useTaskContext();
  const [searchValue, setSearchValue] = useState(filterOptions.searchQuery);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setFilter({ searchQuery: value });
  };

  const clearSearch = () => {
    setSearchValue('');
    setFilter({ searchQuery: '' });
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-blue-600">Apptarea</h1>
        </div>

        <div className="flex items-center space-x-2">
          {showSearch ? (
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Buscar tareas..."
                className="pl-9 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                autoFocus
              />
              <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              {searchValue && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-2 top-2.5"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Buscar"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>
          )}

          <button
            onClick={onOpenTaskForm}
            className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            title="Nueva tarea"
          >
            <PlusCircle className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Nueva tarea</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;