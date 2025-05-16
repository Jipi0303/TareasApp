import React from 'react';
import { ArrowDownAZ, ArrowUpDown, CalendarClock, Clock } from 'lucide-react';
import { SortOption } from '../types';
import { useTaskContext } from '../context/TaskContext';

const TaskSort: React.FC = () => {
  const { sortOption, setSort } = useTaskContext();

  const options: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    {
      value: 'dueDate',
      label: 'Fecha límite',
      icon: <CalendarClock className="h-4 w-4" />,
    },
    {
      value: 'priority',
      label: 'Prioridad',
      icon: <ArrowUpDown className="h-4 w-4" />,
    },
    {
      value: 'createdAt',
      label: 'Más recientes',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      value: 'alphabetical',
      label: 'Alfabético',
      icon: <ArrowDownAZ className="h-4 w-4" />,
    },
  ];

  return (
    <div className="mb-4 flex items-center flex-wrap">
      <span className="text-sm text-gray-500 mr-2">Ordenar por:</span>
       <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setSort(option.value)}
            className={`flex items-center text-xs py-1 px-3 rounded-full ${
              sortOption === option.value
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
            }`}
          >
            <span className="mr-1">{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskSort;