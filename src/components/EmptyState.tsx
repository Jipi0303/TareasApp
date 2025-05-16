import React from 'react';
import { ClipboardList } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  actionText, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <ClipboardList className="h-16 w-16 mb-4 text-blue-500 opacity-50" />
       <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;