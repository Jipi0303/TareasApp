import React, { useState } from 'react';
import { Cog, PlusCircle } from 'lucide-react';
import { Task } from './types';
import { TaskProvider } from './context/TaskContext';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import CategoryManager from './components/CategoryManager';
import TaskCalendar from './components/TaskCalendar';


function App() {
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const handleAddTask = () => {
    setTaskToEdit(undefined);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task | null) => {
  setTaskToEdit(task ?? undefined); // null se convierte en undefined
  setShowTaskForm(true);
};

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setTaskToEdit(undefined);
  };

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header onOpenTaskForm={handleAddTask} />
        
        <main className="flex-grow pt-4">
          <TaskList onEditTask={handleEditTask} />
          
          <button
            onClick={() => setShowCategoryManager(true)}
            className="fixed bottom-6 left-6 p-3 bg-white text-blue-500 rounded-full shadow-lg hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
            title="Administrar categorías"
          >
            <Cog className="h-6 w-6" />
          </button>
          
          <button
            onClick={handleAddTask}
            className="fixed bottom-6 right-6 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 sm:hidden"
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
         <TaskCalendar />

          <button
            onClick={handleAddTask}
            className="fixed bottom-6 right-6 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 sm:hidden"
            title="Nueva tarea"
          >
            <PlusCircle className="h-6 w-6" />
          </button>

      </div>
    </TaskProvider>
  );
}

export default App;