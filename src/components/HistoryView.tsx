import React from 'react';
import { Trash2, Link, FileText, ChevronRight } from 'lucide-react';
import { ScanResult } from '../App';

interface HistoryViewProps {
  history: ScanResult[];
  onItemSelect: (result: ScanResult) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ 
  history, 
  onItemSelect,
  onClearHistory
}) => {
  const isUrl = (text: string): boolean => {
    try {
      const url = new URL(text);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 30): string => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Scan History</h2>
        
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center text-sm transition-colors"
            aria-label="Clear history"
          >
            <Trash2 size={16} className="mr-1" />
            <span>Clear</span>
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Sin historial</p>
          <p className="text-sm mt-1">Qr escaneados apareceran aqui</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {history.map((item, index) => (
            <li key={index} className="py-3 first:pt-0 last:pb-0">
              <button
                onClick={() => onItemSelect(item)}
                className="w-full flex items-center text-left hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
              >
                <div className="mr-3">
                  {isUrl(item.text) ? (
                    <Link className="text-blue-500" size={20} />
                  ) : (
                    <FileText className="text-gray-500" size={20} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {truncateText(item.text)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(item.timestamp)}
                  </p>
                </div>
                
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};