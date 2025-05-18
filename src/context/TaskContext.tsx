import React, { createContext, useContext, useEffect, useReducer, useState, useMemo } from 'react';
import { FilterOptions, SortOption, Task, TaskCategory, TasksState, Theme } from '../types';
import { filterTasks, generateId, sortTasks } from '../utils';

type TaskAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt'> }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK_COMPLETED'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Omit<TaskCategory, 'id'> }
  | { type: 'UPDATE_CATEGORY'; payload: TaskCategory }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_THEME'; payload: Theme };

type TaskContextType = {
  state: TasksState;
  filteredTasks: Task[];
  filterOptions: FilterOptions;
  sortOption: SortOption;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;
  addCategory: (category: Omit<TaskCategory, 'id'>) => void;
  updateCategory: (category: TaskCategory) => void;
  deleteCategory: (id: string) => void;
  setFilter: (filter: Partial<FilterOptions>) => void;
  setSort: (sort: SortOption) => void;
  getCategoryById: (id: string | null) => TaskCategory | undefined;
  setTheme: (theme: Theme) => void;
};

const initialState: TasksState = {
  tasks: [],
  categories: [
    { id: 'personal', name: 'Personal', color: '#3B82F6' },
    { id: 'trabajo', name: 'Trabajo', color: '#10B981' },
    { id: 'estudio', name: 'Estudio', color: '#F59E0B' },
  ],
  theme: 'light',
};

const initialFilterOptions: FilterOptions = {
  completed: null,
  priority: null,
  categoryId: null,
  searchQuery: '',
  status: null,
  dateRange: {
    start: null,
    end: null
  }
};

const initialSortOption: SortOption = 'createdAt';

const loadState = (): {
  state: TasksState;
  filterOptions: FilterOptions;
  sortOption: SortOption;
} => {
  try {
    const savedState = localStorage.getItem('apptarea');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      
      if (parsedState.state && parsedState.state.tasks) {
        parsedState.state.tasks = parsedState.state.tasks.map((task: Task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
        }));
      }
      
      return {
        state: parsedState.state || initialState,
        filterOptions: parsedState.filterOptions || initialFilterOptions,
        sortOption: parsedState.sortOption || initialSortOption,
      };
    }
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
  }
  
  return {
    state: initialState,
    filterOptions: initialFilterOptions,
    sortOption: initialSortOption,
  };
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const taskReducer = (state: TasksState, action: TaskAction): TasksState => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            ...action.payload,
            id: generateId(),
            createdAt: new Date(),
          },
        ],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'TOGGLE_TASK_COMPLETED':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [
          ...state.categories,
          {
            ...action.payload,
            id: generateId(),
          },
        ],
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category.id !== action.payload
        ),
        tasks: state.tasks.map((task) =>
          task.categoryId === action.payload
            ? { ...task, categoryId: null }
            : task
        ),
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loadedState = loadState();
  const [state, dispatch] = useReducer(taskReducer, loadedState.state);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(loadedState.filterOptions);
  const [sortOption, setSortOption] = useState<SortOption>(loadedState.sortOption);

  const filteredTasks = useMemo(() => {
    const filtered = filterTasks(state.tasks, filterOptions);
    return sortTasks(filtered, sortOption);
  }, [state.tasks, filterOptions, sortOption]);

  useEffect(() => {
    try {
      localStorage.setItem(
        'apptarea',
        JSON.stringify({
          state,
          filterOptions,
          sortOption,
        })
      );
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  }, [state, filterOptions, sortOption]);

  useEffect(() => {
    document.documentElement.className = state.theme;
  }, [state.theme]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const toggleTaskCompleted = (id: string) => {
    dispatch({ type: 'TOGGLE_TASK_COMPLETED', payload: id });
  };

  const addCategory = (category: Omit<TaskCategory, 'id'>) => {
    dispatch({ type: 'ADD_CATEGORY', payload: category });
  };

  const updateCategory = (category: TaskCategory) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: category });
  };

  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };

  const setFilter = (filter: Partial<FilterOptions>) => {
    setFilterOptions((prev) => ({ ...prev, ...filter }));
  };

  const setSort = (sort: SortOption) => {
    setSortOption(sort);
  };

  const getCategoryById = (id: string | null) => {
    if (!id) return undefined;
    return state.categories.find((category) => category.id === id);
  };

  const setTheme = (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  return (
    <TaskContext.Provider
      value={{
        state,
        filteredTasks,
        filterOptions,
        sortOption,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompleted,
        addCategory,
        updateCategory,
        deleteCategory,
        setFilter,
        setSort,
        getCategoryById,
        setTheme,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};