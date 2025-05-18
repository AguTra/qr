import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Upload, FileText } from 'lucide-react';

interface ScannerViewProps {
  onScanSuccess: (decodedText: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onScanSuccess }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader';

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(scannerContainerId);
    }
    
    return () => {
      const cleanup = async () => {
        if (scannerRef.current) {
          try {
            if (scannerRef.current.isScanning) {
              await scannerRef.current.stop();
            }
            await scannerRef.current.clear();
          } catch (err) {
            console.error('Error during cleanup:', err);
          }
        }
      };
      cleanup();
    };
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file && scannerRef.current) {
      setErrorMessage(null);
      
      scannerRef.current.scanFile(file, /* showImage */ true)
        .then(decodedText => {
          onScanSuccess(decodedText);
        })
        .catch(err => {
          console.error('Error scanning file:', err);
          setErrorMessage('No QR code found in image or invalid image format.');
        });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-300">
      <div 
        id={scannerContainerId} 
        className="hidden"
      />
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}
      
      <div className="flex flex-col space-y-3">
        <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">Upload an image containing a QR code</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You can also use your device's camera app to scan QR codes directly
          </p>
        </div>
        
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            id="qr-file-input"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Upload image with QR code"
          />
          <button
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-hidden="true"
          >
            <Upload size={20} />
            <span>Upload Image</span>
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Supports all standard QR codes</p>
      </div>
    </div>
  );
};