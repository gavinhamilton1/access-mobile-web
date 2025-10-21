import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonIcon,
  IonSpinner,
  IonModal
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';

// TypeScript declarations for external libraries
declare global {
  interface Window {
    cv: any;
    Tesseract: any;
    onOpenCvReady: () => void;
  }
}

interface LocationState {
  captureType?: string;
  selectedGroup?: string;
  selectedProgram?: string;
  programName?: string;
}

const CaptureCheck: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const state = location.state as LocationState;
  const captureType = state?.captureType || 'Check and document(s)';
  const selectedGroup = state?.selectedGroup || '';
  const selectedProgram = state?.selectedProgram || '';
  const programName = state?.programName || '';

  const [currentStep, setCurrentStep] = useState<'front' | 'back' | 'complete'>('front');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  // Back image no longer required
  const [backImage, setBackImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  
  // Auto-detection and OCR states
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState<string>('');
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isExtractionComplete, setIsExtractionComplete] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isVideoFrozen, setIsVideoFrozen] = useState(false);
  const [frozenFrameData, setFrozenFrameData] = useState<string | null>(null);
  const countdownActiveRef = useRef<boolean>(false);
  
  // Document size requirements
  const MIN_DOCUMENT_SIZE_PERCENTAGE = 0.45; // 45% of frame area
  const [documentSizePercentage, setDocumentSizePercentage] = useState<number>(0);
  const countdownIntervalRef = useRef<number | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [frontCheckDetails, setFrontCheckDetails] = useState<{
    routingNumber?: string;
    accountNumber?: string;
    checkNumber?: string;
    amount?: string;
    date?: string;
    payee?: string;
    memo?: string;
  }>({});
  
  const [backCheckDetails, setBackCheckDetails] = useState<{
    routingNumber?: string;
    accountNumber?: string;
    checkNumber?: string;
    amount?: string;
    date?: string;
    payee?: string;
    memo?: string;
  }>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isCheckCapture = captureType.includes('Check');

  // Initialize camera on component mount
  useEffect(() => {
    console.log('CaptureCheck component mounted');
    console.log('Video ref:', videoRef.current);
    initializeCamera();
    
    // Cleanup camera stream on unmount
    return () => {
      console.log('CaptureCheck component unmounting, stopping camera');
      forceStopCamera();
    };
  }, []);

  // Additional cleanup effect that runs when stream changes
  useEffect(() => {
    return () => {
      if (stream) {
        console.log('Stream cleanup effect triggered');
        stream.getTracks().forEach(track => {
          console.log('Cleaning up track:', track.kind);
          track.stop();
        });
      }
    };
  }, [stream]);

  // Add beforeunload event listener for page navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('Page unloading, stopping camera');
      forceStopCamera();
    };

    const handlePopState = () => {
      console.log('Browser back/forward, stopping camera');
      forceStopCamera();
    };

    // Add global cleanup function to window for debugging
    (window as any).stopCameraGlobal = forceStopCamera;

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      delete (window as any).stopCameraGlobal;
    };
  }, []);

  // Listen for route changes using history
  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      console.log('Route change detected:', action, location.pathname);
      if (location.pathname !== '/capture-check') {
        console.log('Leaving capture page, stopping camera');
        forceStopCamera();
      }
    });

    return () => {
      unlisten();
    };
  }, [history]);

  // Cleanup camera when component unmounts (capture now stops immediately on capture)
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Auto-detection interval
  useEffect(() => {
    if (!isCameraReady || currentStep === 'complete') return;

    const detectionInterval = setInterval(() => {
      if (!isAutoDetecting && !isProcessingOCR && !countdownActiveRef.current && currentStep === 'front') {
        handleAutoCapture();
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(detectionInterval);
  }, [isCameraReady, currentStep, isAutoDetecting, isProcessingOCR]);

  // Initialize OpenCV with proper guards
  useEffect(() => {
    // Use global flag to prevent multiple initializations
    if ((window as any).openCVInitialized) {
      console.log('OpenCV already initialized globally');
      return;
    }

    // Check if OpenCV is already loaded
    if (window.cv) {
      console.log('OpenCV already loaded');
      (window as any).openCVInitialized = true;
      return;
    }

    // Check if callback is already set to prevent multiple assignments
    if (typeof window.onOpenCvReady === 'function') {
      console.log('OpenCV callback already set');
      return;
    }

    // Set the callback only once
    window.onOpenCvReady = () => {
      console.log('OpenCV.js loaded successfully');
      (window as any).openCVInitialized = true;
      // Don't call onOpenCvReady again to prevent recursion
    };
  }, []);

  // Handle page visibility change (when user switches tabs or minimizes browser)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && stream) {
        console.log('Page hidden, stopping camera');
        stopCamera();
      } else if (!document.hidden && !stream && currentStep !== 'complete') {
        console.log('Page visible, restarting camera');
        initializeCamera();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stream, currentStep]);

  // Debug effect to check video element
  useEffect(() => {
    console.log('Video element in DOM:', document.querySelector('video'));
    console.log('Video ref current:', videoRef.current);
  }, [isCameraReady]);

  const initializeCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false // Explicitly disable audio to avoid mic permissions
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to load and play
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current?.play().then(() => {
            console.log('Video started playing');
            setIsCameraReady(true);
          }).catch((playError) => {
            console.error('Error playing video:', playError);
            setIsCameraReady(true);
          });
        };
        
        videoRef.current.onerror = (error) => {
          console.error('Video error:', error);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setDetectionStatus('');
      setIsCameraReady(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    
    try {
      // Stop all tracks in the stream
      if (stream) {
        console.log('Stopping stream with', stream.getTracks().length, 'tracks');
        stream.getTracks().forEach(track => {
          console.log('Stopping track:', track.kind, 'state:', track.readyState);
          if (track.readyState === 'live') {
            track.stop();
            console.log('Track stopped successfully');
          }
        });
        setStream(null);
      }
      
      // Clear video source
      if (videoRef.current) {
        console.log('Clearing video source');
        videoRef.current.srcObject = null;
        videoRef.current.load(); // Reset video element
      }
      
      setIsCameraReady(false);
      console.log('Camera stopped successfully');
    } catch (error) {
      console.error('Error stopping camera:', error);
    }
  };

  // Force stop camera - more aggressive cleanup
  const forceStopCamera = () => {
    console.log('Force stopping camera...');
    
    try {
      // Stop any existing stream first
      if (stream) {
        console.log('Stopping existing stream with', stream.getTracks().length, 'tracks');
        stream.getTracks().forEach(track => {
          console.log('Force stopping track:', track.kind, 'state:', track.readyState);
          track.stop();
        });
        setStream(null);
      }
      
      // Clear video element
      if (videoRef.current) {
        console.log('Clearing video source and resetting element');
        videoRef.current.srcObject = null;
        videoRef.current.load();
        videoRef.current.pause();
      }
      
      setIsCameraReady(false);
      console.log('Camera force stopped successfully');
    } catch (error) {
      console.error('Error force stopping camera:', error);
    }
  };

  const handleBack = () => {
    stopCamera();
    history.goBack();
  };

  const handleCancel = () => {
    stopCamera();
    history.push('/deposits');
  };

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to image data
        let imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        // Freeze the video preview during processing
        setIsVideoFrozen(true);
        setFrozenFrameData(imageData);
        
        // Crop the image to just the document if OpenCV is available
        if (window.cv) {
          const croppedImageData = await cropImageToDocument(imageData);
          imageData = croppedImageData;
        }
        
        // Process MICR extraction if this is the front of a check
        if (isCheckCapture && currentStep === 'front') {
          // Keep status as set by countdown (Extracting details...)
          const micrData = await extractRoutingNumberArea(imageData);
          if (micrData && typeof micrData === 'object') {
            setFrontCheckDetails({
              routingNumber: micrData.routingNumber,
              accountNumber: micrData.accountNumber,
              checkNumber: micrData.checkNumber,
              amount: micrData.amount ?? frontCheckDetails.amount,
              date: frontCheckDetails.date,
              payee: frontCheckDetails.payee,
              memo: frontCheckDetails.memo
            });
            setIsExtractionComplete(true);
            // Hide status once extraction completes
            setDetectionStatus('');
          }
        }
        
        if (currentStep === 'front') {
          setFrontImage(imageData);
          // Hide camera preview by stopping camera immediately after capture
          stopCamera();
          // For checks, we only require the front image now
          setCurrentStep('complete');
        } else if (currentStep === 'back') {
          // Back capture no longer required; finalize
          setCurrentStep('complete');
        }
      }
    }
  };

  // removed mock image generator

  // Auto-detection using OpenCV.js with size requirements
  const detectDocument = async (videoElement: HTMLVideoElement): Promise<{detected: boolean, sizePercentage: number}> => {
    if (!window.cv || !(window as any).openCVInitialized) {
      console.log('OpenCV not ready yet, skipping detection');
      return {detected: false, sizePercentage: 0};
    }

    try {
      // Create canvas to capture video frame
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return {detected: false, sizePercentage: 0};

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      ctx.drawImage(videoElement, 0, 0);

      // Convert to OpenCV Mat
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const src = window.cv.matFromImageData(imgData);
      const gray = new window.cv.Mat();
      const edges = new window.cv.Mat();
      const contours = new window.cv.MatVector();
      const hierarchy = new window.cv.Mat();

      // Convert to grayscale
      window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);
      
      // Apply Gaussian blur
      const blurred = new window.cv.Mat();
      window.cv.GaussianBlur(gray, blurred, new window.cv.Size(5, 5), 0);
      
      // Edge detection
      window.cv.Canny(blurred, edges, 50, 150);
      
      // Find contours
      window.cv.findContours(edges, contours, hierarchy, window.cv.RETR_EXTERNAL, window.cv.CHAIN_APPROX_SIMPLE);
      
      let largestArea = 0;
      let bestContour = null;
      
      // Find the largest rectangular contour
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const area = window.cv.contourArea(contour);
        
        if (area > largestArea) {
          // Check if contour is roughly rectangular
          const epsilon = 0.02 * window.cv.arcLength(contour, true);
          const approx = new window.cv.Mat();
          window.cv.approxPolyDP(contour, approx, epsilon, true);
          
          if (approx.rows === 4) {
            largestArea = area;
            bestContour = approx;
          }
          approx.delete();
        }
        contour.delete();
      }

      // Calculate size percentage
      const totalFrameArea = canvas.width * canvas.height;
      const sizePercentage = largestArea / totalFrameArea;
      
      // Update size percentage for UI feedback
      setDocumentSizePercentage(sizePercentage);

      // Clean up
      src.delete();
      gray.delete();
      edges.delete();
      blurred.delete();
      contours.delete();
      hierarchy.delete();

      // Check if we found a good document contour with sufficient size
      const minArea = totalFrameArea * MIN_DOCUMENT_SIZE_PERCENTAGE;
      const detected = largestArea > minArea && bestContour !== null;
      
      return {detected, sizePercentage};
      
    } catch (error) {
      console.error('Document detection error:', error);
      return {detected: false, sizePercentage: 0};
    }
  };

  // Crop image to document boundaries using OpenCV
  const cropImageToDocument = async (imageData: string): Promise<string> => {
    if (!window.cv || !(window as any).openCVInitialized) {
      console.log('OpenCV not available for cropping, returning original image');
      return imageData;
    }

    try {
      // Create image element to get the original image
      const img = new Image();
      img.src = imageData;
      
      return new Promise((resolve) => {
        img.onload = () => {
          try {
            // Create canvas to work with the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(imageData);
              return;
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Convert to OpenCV Mat
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const src = window.cv.matFromImageData(imgData);
            const gray = new window.cv.Mat();
            const edges = new window.cv.Mat();
            const contours = new window.cv.MatVector();
            const hierarchy = new window.cv.Mat();

            // Convert to grayscale
            window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);

            // Apply Gaussian blur
            const blurred = new window.cv.Mat();
            window.cv.GaussianBlur(gray, blurred, new window.cv.Size(5, 5), 0);

            // Apply Canny edge detection
            window.cv.Canny(blurred, edges, 50, 150);

            // Find contours
            window.cv.findContours(edges, contours, hierarchy, window.cv.RETR_EXTERNAL, window.cv.CHAIN_APPROX_SIMPLE);

            // Find the largest rectangular contour
            let largestArea = 0;
            let bestContour = null;
            const minArea = canvas.width * canvas.height * 0.1;

            for (let i = 0; i < contours.size(); i++) {
              const contour = contours.get(i);
              const area = window.cv.contourArea(contour);
              
              if (area > largestArea && area > minArea) {
                const epsilon = 0.02 * window.cv.arcLength(contour, true);
                const approx = new window.cv.Mat();
                window.cv.approxPolyDP(contour, approx, epsilon, true);
                
                if (approx.rows === 4) {
                  // Delete previous bestContour if it exists
                  if (bestContour) {
                    bestContour.delete();
                  }
                  largestArea = area;
                  bestContour = contour; // Don't delete this one yet
                } else {
                  // Delete this contour since it's not the best
                  contour.delete();
                }
                
                approx.delete();
              } else {
                // Delete this contour since it's not good enough
                contour.delete();
              }
            }

            if (bestContour && largestArea > minArea) {
              // Get bounding rectangle of the document BEFORE deleting bestContour
              const rect = window.cv.boundingRect(bestContour);
              
              // Add some padding around the document
              const padding = 10;
              const x = Math.max(0, rect.x - padding);
              const y = Math.max(0, rect.y - padding);
              const width = Math.min(canvas.width - x, rect.width + (padding * 2));
              const height = Math.min(canvas.height - y, rect.height + (padding * 2));

              // Create cropped canvas
              const croppedCanvas = document.createElement('canvas');
              const croppedCtx = croppedCanvas.getContext('2d');
              if (!croppedCtx) {
                resolve(imageData);
                return;
              }

              croppedCanvas.width = width;
              croppedCanvas.height = height;
              
              // Draw the cropped portion
              croppedCtx.drawImage(
                canvas,
                x, y, width, height,
                0, 0, width, height
              );

              // Convert to image data
              const croppedImageData = croppedCanvas.toDataURL('image/jpeg', 0.9);
              
              console.log(`Document cropped: ${width}x${height} from ${canvas.width}x${canvas.height}`);
              resolve(croppedImageData);
            } else {
              console.log('No document found for cropping, returning original');
              resolve(imageData);
            }

            // Clean up - delete bestContour AFTER using it
            src.delete();
            gray.delete();
            edges.delete();
            contours.delete();
            hierarchy.delete();
            blurred.delete();
            if (bestContour) bestContour.delete();

          } catch (error) {
            console.error('Document cropping error:', error);
            resolve(imageData);
          }
        };
      });
    } catch (error) {
      console.error('Document cropping error:', error);
      return imageData;
    }
  };

  // Extract routing number area from check image
  const extractRoutingNumberArea = async (imageData: string): Promise<any> => {
    if (!window.Tesseract) {
      console.log('Tesseract not ready yet');
      return '';
    }
    
    try {
      setIsProcessingOCR(true);
      
      
      // Create an image element to get dimensions
      const img = new Image();
      img.src = imageData;
      
      return new Promise((resolve) => {
        img.onload = async () => {
          try {
            // Define routing number area (MICR line at bottom of check)
            // Routing numbers are typically in the bottom 15% of the check
            const routingArea = {
              x: Math.floor(img.width * 0.1), // 10% from left
              y: Math.floor(img.height * 0.85), // 85% from top (bottom area)
              width: Math.floor(img.width * 0.8), // 80% of width
              height: Math.floor(img.height * 0.15) // 15% of height (just the MICR line)
            };
            
            console.log('Routing area:', routingArea);
            
            // Use Tesseract with specific area and MICR configuration
            const { data: { text } } = await window.Tesseract.recognize(imageData, 'eng', {
              logger: (m: any) => {
                if (m.status === 'recognizing text') {
                  
                }
              },
              // Focus on the routing number area
              rectangle: routingArea,
              // Use MICR-specific settings for better number recognition
              tessedit_char_whitelist: '0123456789',
              tessedit_pageseg_mode: '8' // Single word
            });
            
            // Parse MICR line format: [Transit] [Account] [Check Number] [Amount]
            // MICR format: 123456789 1234567890 123456 123.45
            const lines = text.split('\n').filter((line: string) => line.trim().length > 0);
            const micrLine = lines[lines.length - 1] || '';
            const cleanMicrLine = micrLine.replace(/[^\d\s]/g, ''); // Keep only digits and spaces
            
            // Split MICR line into components
            const micrParts = cleanMicrLine.trim().split(/\s+/).filter((part: string) => part.length > 0);
            
            let routingNumber = '';
            let accountNumber = '';
            let checkNumber = '';
            let amount = '';
            
            if (micrParts.length >= 1) routingNumber = micrParts[0]; // First 9 digits
            if (micrParts.length >= 2) accountNumber = micrParts[1]; // Account number
            if (micrParts.length >= 3) checkNumber = micrParts[2]; // Check number
            if (micrParts.length >= 4) amount = micrParts[3]; // Amount
            
            const micrData = {
              routingNumber,
              accountNumber,
              checkNumber,
              amount,
              rawLine: cleanMicrLine
            };
            
            setExtractedText(JSON.stringify(micrData, null, 2));
            console.log('Parsed MICR data:', micrData);
            resolve(micrData);
          } catch (error) {
            console.error('Routing number OCR error:', error);
            resolve({});
          } finally {
            setIsProcessingOCR(false);
          }
        };
      });
    } catch (error) {
      console.error('Routing number extraction error:', error);
      setIsProcessingOCR(false);
      return '';
    }
  };

  // OCR text extraction using Tesseract.js
  const extractTextFromImage = async (imageData: string): Promise<string> => {
    if (!window.Tesseract) {
      console.log('Tesseract not ready yet');
      return '';
    }

    try {
      setIsProcessingOCR(true);
      
      
      const { data: { text } } = await window.Tesseract.recognize(
        imageData,
        'eng',
        {
          logger: (m: any) => {
            if (m.status === 'recognizing text') {
              
            }
          }
        }
      );
      
      setExtractedText(text);
      return text;
    } catch (error) {
      console.error('OCR error:', error);
      return '';
    } finally {
      setIsProcessingOCR(false);
    }
  };


  // Start countdown before capturing
  const startCountdown = () => {
    console.log('Starting countdown...');
    if (countdownActiveRef.current || isCountingDown) return;
    countdownActiveRef.current = true;
    setIsCountingDown(true);
    setCountdown(3);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          countdownActiveRef.current = false;
          setIsCountingDown(false);
          setCountdown(0);
          setDetectionStatus('Extracting details...');
          // Capture now
          captureImage();
          return 0;
        }
        return prev - 1;
      });
    }, 750);
  };

  // Auto-capture when document is detected
  const handleAutoCapture = async () => {
    if (!videoRef.current || !isCameraReady) return;
    
    setIsAutoDetecting(true);
    // Show the default guidance while scanning
    if (!isCountingDown && !detectionStatus) {
      setDetectionStatus('Position document within frame');
    }
    
    try {
      // Try OpenCV detection first
      let detectionResult = {detected: false, sizePercentage: 0};
      
        if (window.cv && (window as any).openCVInitialized) {
          detectionResult = await detectDocument(videoRef.current);
        } else {
          console.log('OpenCV not available');
          detectionResult = {detected: false, sizePercentage: 0};
        }
      
      if (detectionResult.detected && !countdownActiveRef.current && !isCountingDown) {
        // Show hold-still status during countdown
        setDetectionStatus('Please hold still');
        // Start a faster countdown immediately
        startCountdown();
      } else {
        // Show size-specific guidance when not detected
        if (!isCountingDown) {
          if (detectionResult.sizePercentage > 0 && detectionResult.sizePercentage < MIN_DOCUMENT_SIZE_PERCENTAGE) {
            const percentage = Math.round(detectionResult.sizePercentage * 100);
            const required = Math.round(MIN_DOCUMENT_SIZE_PERCENTAGE * 100);
            setDetectionStatus(`Move closer - document is ${percentage}% of frame (need ${required}%)`);
          } else {
            setDetectionStatus('Position document within frame');
          }
        }
      }
    } catch (error) {
      console.error('Auto-capture error:', error);
      if (!isCountingDown) {
        setDetectionStatus('Position document within frame');
      }
    } finally {
      // Keep detecting locked during countdown to avoid status changes
      if (!isCountingDown) {
        setIsAutoDetecting(false);
      }
    }
  };

  const handleContinue = () => {
    if (currentStep === 'complete') {
      // Stop camera before navigating
      stopCamera();
      // Clear status after processing is complete
      setDetectionStatus('');
      
      // Navigate to capture summary with captured images
      history.push('/capture-summary', {
        captureType,
        selectedGroup,
        selectedProgram,
        programName,
        frontImage,
        backImage: isCheckCapture ? backImage : null,
        frontCheckDetails: isCheckCapture ? frontCheckDetails : null,
        backCheckDetails: isCheckCapture ? backCheckDetails : null
      });
    }
  };

  const handleRetakeCapture = async (imageType: 'front' | 'back') => {
    console.log(`Retaking ${imageType} capture`);
    
    // Stop current camera first
    stopCamera();
    
    if (imageType === 'front') {
      setFrontImage(null);
      setCurrentStep('front');
    } else if (imageType === 'back') {
      setBackImage(null);
      setCurrentStep('back');
    }
    
    // Reset detection status
    setDetectionStatus('Position document within frame');
    setIsAutoDetecting(false);
    setIsProcessingOCR(false);
    setIsExtractionComplete(false);
    setIsCameraReady(false);
    setIsCountingDown(false);
    setIsVideoFrozen(false);
    setFrozenFrameData(null);
    countdownActiveRef.current = false;
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    // Force detection to restart by clearing any existing detection state
    
    
    // Clear any existing check details for the specific image
    if (imageType === 'front') {
      setFrontCheckDetails({});
    } else if (imageType === 'back') {
      setBackCheckDetails({});
    }
    setExtractedText('');
    
    // Reinitialize camera after a short delay
    setTimeout(async () => {
      try {
        console.log('Reinitializing camera for retake...');
        await initializeCamera();
        // Force detection to start by triggering a manual detection check once camera reports ready
        const waitForReady = setInterval(() => {
          if (isCameraReady) {
            clearInterval(waitForReady);
            if (currentStep === 'front') {
              console.log('Triggering manual detection after retake...');
              handleAutoCapture();
            }
          }
        }, 100);
      } catch (error) {
        console.error('Error reinitializing camera:', error);
      }
    }, 150);
  };

  const getStepTitle = () => {
    if (isCheckCapture) {
      return currentStep === 'front' ? 'Capture check front' : 'Capture check back';
    }
    return 'Capture document';
  };


  return (
    <IonPage>
      <IonHeader className="standard-header">
        <IonToolbar>
          <div className="header-content">
            <div className="header-left">
              <IonButton fill="clear" className="header-button" onClick={handleBack}>
                <IonText>Back</IonText>
              </IonButton>
            </div>
            <div className="header-center">
              <IonTitle>{getStepTitle()}</IonTitle>
            </div>
            <div className="header-right">
              <IonButton fill="clear" className="header-button" onClick={handleCancel}>
                <IonText>Cancel</IonText>
              </IonButton>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="capture-content">
        <div className="capture-container">


          {/* Camera Preview Pane */}
          {!isExtractionComplete && (
          <div className="camera-preview-pane">
            <div className="camera-view">
              {/* Always render video element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                webkit-playsinline="true"
                className="camera-video"
                onLoadStart={() => console.log('Video load started')}
                onLoadedData={() => console.log('Video data loaded')}
                onCanPlay={() => console.log('Video can play')}
                style={{ display: isVideoFrozen ? 'none' : 'block' }}
              />
              
              {/* Frozen frame overlay during processing */}
              {isVideoFrozen && frozenFrameData && (
                <img 
                  src={frozenFrameData} 
                  alt="Frozen frame" 
                  className="camera-video-frozen"
                />
              )}
              
              {/* Loading overlay */}
              {!isCameraReady && (
                <div className="camera-loading">
                  <IonText>
                    <p className="loading-text">Initializing camera...</p>
                  </IonText>
                </div>
              )}
              
              {/* Framing Mask */}
              <div className="framing-mask">
                <div className="mask-overlay">
                  <div className="mask-top"></div>
                  <div className="mask-middle">
                    <div className="mask-left"></div>
                    <div className="capture-frame">
                      <div className="frame-corners">
                        <div className="corner top-left"></div>
                        <div className="corner top-right"></div>
                        <div className="corner bottom-left"></div>
                        <div className="corner bottom-right"></div>
                      </div>
                      <div className="frame-guidelines">
                        <div className="guideline horizontal top"></div>
                        <div className="guideline horizontal bottom"></div>
                        <div className="guideline vertical left"></div>
                        <div className="guideline vertical right"></div>
                      </div>
                    </div>
                    <div className="mask-right"></div>
                  </div>
                  <div className="mask-bottom"></div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Detection Status - moved below camera preview */}
          {detectionStatus && !isExtractionComplete && (
            <div className="detection-status">
              <IonText>
                <p className="status-text">
                  {isAutoDetecting && <IonSpinner name="crescent" />}
                  {isProcessingOCR && <IonSpinner name="crescent" />}
                  {isCountingDown && (
                    <span className="countdown-display">
                      {countdown}
                    </span>
                  )}
                  {detectionStatus}
                </p>
              </IonText>
            </div>
          )}

          {/* Captured Images Preview */}
          {isExtractionComplete && frontImage && (
            <div className="captured-preview">
              <IonText>
                <h3 className="preview-title">Captured Images</h3>
              </IonText>
              {frontImage && (
                <div className="preview-item">
                  <div className="preview-header">
                    <IonText>
                      <p className="preview-label">Front</p>
                    </IonText>
                    <div className="preview-actions">
                      <IonButton 
                        fill="outline" 
                        size="small" 
                        className="action-button retake-button"
                        onClick={() => handleRetakeCapture('front')}
                      >
                        <img src="/images/Retake.svg" alt="Retake" className="retake-icon" slot="start" />
                        Retake
                      </IonButton>
                    </div>
                  </div>
                  <img src={frontImage} alt="Front" className="preview-image" onClick={() => setIsPreviewModalOpen(true)} />
                </div>
              )}
              
              
              {/* Front Image MICR Details */}
              {frontImage && (
                <div className="check-details front-ocr-details">
                  <IonText>
                    <h3 className="details-title">Front - MICR Details:</h3>
                  </IonText>
                  <div className="details-grid">
                    {frontCheckDetails?.routingNumber && (
                      <div className="detail-item">
                        <span className="detail-label">Routing Number:</span>
                        <span className="detail-value">{frontCheckDetails.routingNumber}</span>
                      </div>
                    )}
                    {frontCheckDetails?.accountNumber && (
                      <div className="detail-item">
                        <span className="detail-label">Account Number:</span>
                        <span className="detail-value">{frontCheckDetails.accountNumber}</span>
                      </div>
                    )}
                    {frontCheckDetails?.checkNumber && (
                      <div className="detail-item">
                        <span className="detail-label">Check Number:</span>
                        <span className="detail-value">{frontCheckDetails.checkNumber}</span>
                      </div>
                    )}
                    {frontCheckDetails?.amount && (
                      <div className="detail-item">
                        <span className="detail-label">Amount:</span>
                        <span className="detail-value">${frontCheckDetails.amount}</span>
                      </div>
                    )}
                    {frontCheckDetails?.date && (
                      <div className="detail-item">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">{frontCheckDetails.date}</span>
                      </div>
                    )}
                    {frontCheckDetails?.payee && (
                      <div className="detail-item">
                        <span className="detail-label">Payee:</span>
                        <span className="detail-value">{frontCheckDetails.payee}</span>
                      </div>
                    )}
                    {frontCheckDetails?.memo && (
                      <div className="detail-item">
                        <span className="detail-label">Memo:</span>
                        <span className="detail-value">{frontCheckDetails.memo}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Continue Button - only show when capture is complete */}
          {currentStep === 'complete' && (
            <div className="continue-section">
              <IonButton 
                expand="block" 
                className="continue-button"
                onClick={handleContinue}
              >
                Continue
              </IonButton>
            </div>
          )}
          
          {/* Fullscreen Preview Modal */}
          <IonModal isOpen={isPreviewModalOpen} onDidDismiss={() => setIsPreviewModalOpen(false)} className="image-preview-modal">
            <IonHeader className="standard-header">
              <IonToolbar>
                <div className="header-content">
                  <div className="header-left">
                    <IonButton fill="clear" className="header-button" onClick={() => setIsPreviewModalOpen(false)}>
                      <IonText>Close</IonText>
                    </IonButton>
                  </div>
                  <div className="header-center">
                    <IonTitle>Preview</IonTitle>
                  </div>
                  <div className="header-right"></div>
                </div>
              </IonToolbar>
            </IonHeader>
            <IonContent className="image-preview-content">
              {frontImage && (
                <div className="image-preview-wrapper">
                  <img src={frontImage} alt="Captured" className="image-preview-full" />
                </div>
              )}
            </IonContent>
          </IonModal>
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </IonContent>
    </IonPage>
  );
};

export default CaptureCheck;
