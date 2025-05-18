import React from 'react';
import { QrCode, Clock } from 'lucide-react';

interface TabViewProps {
  activeTab: 'scan' | 'history';
  onChange: (tab: 'scan' | 'history') => void;
}

export const TabView: React.FC<TabViewProps> = ({ activeTab, onChange }) => {
  return (
    <div className="flex mb-4 bg-gray-200 dark:bg-gray-800 rounded-lg p-1 transition-colors duration-300">
      <button
        className={`flex-1 flex items-center justify-center p-3 rounded-md space-x-2 transition-all
          ${activeTab === 'scan' 
            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        onClick={() => onChange('scan')}
        aria-selected={activeTab === 'scan'}
        role="tab"
      >
        <QrCode size={18} />
        <span className="font-medium">Scan QR</span>
      </button>
      
      <button
        className={`flex-1 flex items-center justify-center p-3 rounded-md space-x-2 transition-all
          ${activeTab === 'history' 
            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        onClick={() => onChange('history')}
        aria-selected={activeTab === 'history'}
        role="tab"
      >
        <Clock size={18} />
        <span className="font-medium">Historial</span>
      </button>
    </div>
  );
};