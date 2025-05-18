import React from 'react';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-4 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="flex justify-center items-center space-x-1 mb-2">
          <a 
            href="https://github.com/AguTra/qr/tree/master"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:underline"
            aria-label="View source code on GitHub"
          >
            <Github size={16} />
            <span>Source</span>
          </a>
        </div>
        <p>© {new Date().getFullYear()} Codigo fuente en el GitHub.</p>
      </div>
    </footer>
  );
};