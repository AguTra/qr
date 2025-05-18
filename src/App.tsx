import React, { useState } from 'react';
import { ScannerView } from './components/ScannerView';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ResultView } from './components/ResultView';
import { TabView } from './components/TabView';
import { HistoryView } from './components/HistoryView';
import { ThemeProvider } from './contexts/ThemeContext';

export type ScanResult = {
  text: string;
  timestamp: number;
};

function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>(() => {
    const savedHistory = localStorage.getItem('qr-history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const handleScanSuccess = (decodedText: string) => {
    const result: ScanResult = {
      text: decodedText,
      timestamp: Date.now()
    };
    
    setCurrentResult(result);
    
    // Add to history and save to localStorage
    const updatedHistory = [result, ...history].slice(0, 20); // Keep only last 20 items
    setHistory(updatedHistory);
    localStorage.setItem('qr-history', JSON.stringify(updatedHistory));
  };

  const clearResult = () => {
    setCurrentResult(null);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qr-history');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-6 max-w-md">
          {currentResult ? (
            <ResultView result={currentResult} onClose={clearResult} />
          ) : (
            <>
              <TabView activeTab={activeTab} onChange={setActiveTab} />
              
              {activeTab === 'scan' ? (
                <ScannerView onScanSuccess={handleScanSuccess} />
              ) : (
                <HistoryView 
                  history={history} 
                  onItemSelect={setCurrentResult} 
                  onClearHistory={clearHistory}
                />
              )}
            </>
          )}
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;