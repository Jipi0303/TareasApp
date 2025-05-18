import React, { useState } from 'react';
import { Sun, Moon, Cloud, ChevronDown, ChevronUp } from 'lucide-react';
import { Theme } from '../types';
import { useTaskContext } from '../context/TaskContext';

const ThemeSwitcher: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { state, setTheme } = useTaskContext();

  const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    {
      value: 'light',
      icon: <Sun className="h-5 w-5" />,
      label: 'Modo luz',
    },
    {
      value: 'dark',
      icon: <Moon className="h-5 w-5" />,
      label: 'Modo noche',
    },
    {
      value: 'warm',
      icon: <Cloud className="h-5 w-5" />,
      label: 'Modo cálido',
    },
  ];

  const currentTheme = themes.find(t => t.value === state.theme);

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Cambiar tema"
        aria-expanded={isExpanded}
        aria-haspopup="true"
      >
        <span className="text-gray-700">
          {currentTheme?.icon}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="theme-switcher"
        >
          <div className="py-1" role="none">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => {
                  setTheme(theme.value);
                  setIsExpanded(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  state.theme === theme.value
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                <span className="mr-2">{theme.icon}</span>
                {theme.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;