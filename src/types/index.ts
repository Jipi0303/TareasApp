export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | null;

export type Theme = 'light' | 'dark' | 'warm';

export type TaskCategory = {
  id: string;
  name: string;
  color: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  completed: boolean;
  createdAt: Date;
  startDate: Date;
  dueDate: Date | null;
  priority: Priority;
  categoryId: string | null;
  recurrence: {
    type: RecurrenceType;
    frequency: number; // Times per day/week/month
    completedInstances: number; // Current count of completed instances
  } | null;
};

export type TasksState = {
  tasks: Task[];
  categories: TaskCategory[];
  theme: Theme;
};

export type SortOption = 'dueDate' | 'priority' | 'createdAt' | 'alphabetical' | 'status';

export type FilterOptions = {
  status: TaskStatus | null;
  completed: boolean | null;
  priority: Priority | null;
  categoryId: string | null;
  searchQuery: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
};

export type TimeRange = 'week' | 'month' | 'year';

export type TaskProgress = {
  completed: number;
  total: number;
  percentage: number;
};

export type TaskReport = {
  timeRange: TimeRange;
  progress: TaskProgress;
  byCategory: Record<string, TaskProgress>;
  byStatus: Record<TaskStatus, number>;
  overdueTasks: number;
  upcomingTasks: number;
};