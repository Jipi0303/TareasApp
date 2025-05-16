import { FilterOptions, Priority, SortOption, Task } from '../types';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

export const isOverdue = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'low':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'high':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const getPriorityLabel = (priority: Priority): string => {
  switch (priority) {
    case 'low':
      return 'Baja';
    case 'medium':
      return 'Media';
    case 'high':
      return 'Alta';
    default:
      return '';
  }
};

export const filterTasks = (tasks: Task[], filterOptions: FilterOptions): Task[] => {
  return tasks.filter((task) => {
    // Filter by completion status
    if (filterOptions.completed !== null && task.completed !== filterOptions.completed) {
      return false;
    }

    // Filter by priority
    if (filterOptions.priority !== null && task.priority !== filterOptions.priority) {
      return false;
    }

    // Filter by category
    if (filterOptions.categoryId !== null && task.categoryId !== filterOptions.categoryId) {
      return false;
    }

    // Filter by search query
    if (filterOptions.searchQuery && !task.title.toLowerCase().includes(filterOptions.searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });
};

export const sortTasks = (tasks: Task[], sortOption: SortOption): Task[] => {
  const sortedTasks = [...tasks];

  switch (sortOption) {
    case 'dueDate':
      return sortedTasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      });
    case 'priority':
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return sortedTasks.sort(
        (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]
      );
    case 'createdAt':
      return sortedTasks.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    case 'alphabetical':
      return sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sortedTasks;
  }
};