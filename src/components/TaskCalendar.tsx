import React, { useState } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Task } from '../types';
import { useTaskContext } from '../context/TaskContext';

const TaskCalendar: React.FC = () => {
  const { state, getCategoryById } = useTaskContext();
  const [isOpen, setIsOpen] = useState(false);

  const events = state.tasks.map((t) => {
    const category = getCategoryById(t.categoryId);
    return {
      id: t.id,
      title: t.title,
      start: t.startDate,
      end: t.dueDate || undefined,
      backgroundColor: category?.color || '#3B82F6',
      borderColor: category?.color || '#3B82F6',
      textColor: '#ffffff',
      className: t.completed ? 'opacity-50' : '',
    };
  });

  return (
    <>
      <button
  onClick={() => setIsOpen(true)}
  className="fixed bottom-[8.5rem] left-6 p-3 bg-white text-green-600 rounded-full shadow-lg hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 dark:bg-gray-700 dark:text-green-400 dark:hover:bg-gray-600 warm:bg-yellow-100 warm:hover:bg-yellow-200"
  title="Ver calendario"
>
  <CalendarIcon className="h-6 w-6" />
</button>


      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl dark:bg-gray-800">
            <div className="p-4 border-b flex justify-between items-center dark:border-gray-700">
              <h2 className="text-xl font-semibold dark:text-white">Calendario de tareas</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-4">
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek',
                }}
                height="auto"
                locale="es"
                buttonText={{
                  today: 'Hoy',
                  month: 'Mes',
                  week: 'Semana',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCalendar;