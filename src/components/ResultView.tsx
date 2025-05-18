import React, { useState, useEffect } from 'react';
import { Check, Copy, ArrowLeft, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { ScanResult } from '../App';

interface ResultViewProps {
  result: ScanResult;
  onClose: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isUrl, setIsUrl] = useState(false);
  
  useEffect(() => {
    // Check if the result is a URL
    try {
      const url = new URL(result.text);
      setIsUrl(url.protocol === 'http:' || url.protocol === 'https:');
    } catch {
      setIsUrl(false);
    }
    
    // Reset copied state
    setCopied(false);
  }, [result]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(result.text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy text: ', err));
  };
  
  const handleOpenUrl = () => {
    if (isUrl) {
      window.open(result.text, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 animate-fade-in transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onClose}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-1">
          {isUrl ? (
            <CheckCircle className="text-green-500" size={18} />
          ) : (
            <XCircle className="text-gray-400" size={18} />
          )}
          <span className={`text-sm ${isUrl ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {isUrl ? 'Valid URL' : 'Plain Text'}
          </span>
        </div>
      </div>
      
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Scan Result
        </h2>
        
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg break-words overflow-auto max-h-[30vh] text-gray-800 dark:text-gray-200 transition-colors duration-300">
          {result.text}
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Scanned {new Date(result.timestamp).toLocaleString()}
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={handleCopy}
          className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
          <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
        </button>
        
        {isUrl && (
          <button
            onClick={handleOpenUrl}
            className="py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ExternalLink size={20} />
            <span>Open URL</span>
          </button>
        )}
      </div>
    </div>
  );
};