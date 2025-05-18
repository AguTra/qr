import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Upload, Camera, CameraOff } from 'lucide-react';

interface ScannerViewProps {
  onScanSuccess: (decodedText: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader';

  useEffect(() => {
    // Initialize the scanner
    scannerRef.current = new Html5Qrcode(scannerContainerId);
    
    // Check if camera exists
    Html5Qrcode.getCameras()
      .then(devices => {
        setHasCamera(devices.length > 0);
      })
      .catch(err => {
        console.error('Error getting cameras', err);
        setHasCamera(false);
      });
    
    // Cleanup on unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop()
          .catch(err => console.error('Error stopping scanner', err));
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      setErrorMessage(null);
      setIsScanning(true);
      
      if (!scannerRef.current) return;
      
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };
      
      await scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          // On successful scan
          onScanSuccess(decodedText);
          
          // Stop scanning after successful scan
          if (scannerRef.current?.isScanning) {
            scannerRef.current.stop()
              .catch(err => console.error('Error stopping scanner', err));
            setIsScanning(false);
          }
        },
        () => {
          // On ongoing scanning (do nothing)
        }
      );
    } catch (err) {
      console.error('Error starting scanner', err);
      setIsScanning(false);
      
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to start camera. Please check permissions.');
      }
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
    } catch (err) {
      console.error('Error stopping scanner', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file && scannerRef.current) {
      setErrorMessage(null);
      
      // Use the scanner to decode the QR from the image
      scannerRef.current.scanFile(file, /* showImage */ true)
        .then(decodedText => {
          onScanSuccess(decodedText);
        })
        .catch(err => {
          console.error('Error scanning file', err);
          setErrorMessage('No QR code found in image or invalid image format.');
        });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-300">
      <h2>Leé códigos QR con tu cámara o desde la galeria</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Revisa tu historial de escaneos.</p>
      <div 
        id={scannerContainerId} 
        className={`w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-4 transition-colors duration-300 ${isScanning ? 'border-2 border-indigo-500' : ''}`}
      >
        {!isScanning && !hasCamera && hasCamera !== null && (
          <div className="text-center p-4">
            <CameraOff className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Se denego el acceso / no se detecto camara</p>
          </div>
        )}
        
        {!isScanning && (hasCamera === null || hasCamera) && (
          <div className="text-center p-4">
            <Camera className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Preview</p>
          </div>
        )}
      </div>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}
      
      <div className="flex flex-col space-y-3">
        {hasCamera && (
          <button
            onClick={isScanning ? stopScanner : startScanner}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200
              ${isScanning 
                ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500'}`}
          >
            <Camera size={20} />
            <span>{isScanning ? 'Stop Camera' : 'Start Camera'}</span>
          </button>
        )}
        
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
            className="w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            aria-hidden="true"
          >
            <Upload size={20} />
            <span>Subir Imagen</span>
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Soporte a todos los tipos de QR</p>
      </div>
    </div>
  );
};