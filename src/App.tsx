import React, { useState } from 'react';
import { Cog, PlusCircle } from 'lucide-react';
import { Task } from './types';
import { TaskProvider } from './context/TaskContext';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import CategoryManager from './components/CategoryManager';
import TaskCalendar from './components/TaskCalendar';
import TaskProgress from './components/TaskProgress';
import ThemeSwitcher from './components/ThemeSwitcher';

function App() {
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const handleAddTask = () => {
    setTaskToEdit(undefined);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task | null) => {
    setTaskToEdit(task ?? undefined);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setTaskToEdit(undefined);
  };

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col transition-colors duration-200 dark:bg-gray-900 warm:bg-yellow-50">
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 warm:bg-yellow-100 shadow-sm transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Header onOpenTaskForm={handleAddTask} />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
        
        <main className="flex-grow pt-4">
          <TaskList onEditTask={handleEditTask} />
          
          <button
            onClick={() => setShowCategoryManager(true)}
            className="fixed bottom-6 left-6 p-3 bg-white text-blue-500 rounded-full shadow-lg hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600 warm:bg-yellow-100 warm:hover:bg-yellow-200"
            title="Administrar categorías"
          >
            <Cog className="h-6 w-6" />
          </button>
          
          <TaskCalendar />
          <TaskProgress />
          
          <button
            onClick={handleAddTask}
            className="fixed bottom-6 right-6 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 sm:hidden dark:bg-blue-600 dark:hover:bg-blue-700 warm:bg-yellow-600 warm:hover:bg-yellow-700"
            title="Nueva tarea"
          >
            <PlusCircle className="h-6 w-6" />
          </button>
        </main>
        
        <TaskForm
          task={taskToEdit}
          isOpen={showTaskForm}
          onClose={handleCloseTaskForm}
        />
        
        <CategoryManager
          isOpen={showCategoryManager}
          onClose={() => setShowCategoryManager(false)}
        />
      </div>
    </TaskProvider>
  );
}

export default App;