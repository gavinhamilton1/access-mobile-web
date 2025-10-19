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
  IonSpinner
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
  const [backImage, setBackImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  
  // Auto-detection and OCR states
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState<string>('');
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [checkDetails, setCheckDetails] = useState<{
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

  // Cleanup camera when component unmounts or when capture is complete
  useEffect(() => {
    if (currentStep === 'complete') {
      // Stop camera when capture is complete
      setTimeout(() => {
        stopCamera();
      }, 1000); // Give a moment for the user to see the final state
    }
  }, [currentStep]);

  // Auto-detection interval
  useEffect(() => {
    if (!isCameraReady || currentStep === 'complete') return;

    const detectionInterval = setInterval(() => {
      if (!isAutoDetecting && !isProcessingOCR) {
        handleAutoCapture();
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(detectionInterval);
  }, [isCameraReady, currentStep, isAutoDetecting, isProcessingOCR]);

  // Initialize OpenCV
  useEffect(() => {
    window.onOpenCvReady = () => {
      console.log('OpenCV.js is ready');
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
      // Show error message and allow mock capture
      alert('Camera access denied. You can still test the capture flow with mock images.');
      setIsCameraReady(true);
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
    if (currentStep === 'back') {
      setCurrentStep('front');
    } else {
      history.goBack();
    }
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
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        // Process OCR if this is the front of a check
        if (isCheckCapture && currentStep === 'front') {
          setDetectionStatus('Processing check details...');
          const extractedText = await extractTextFromImage(imageData);
          if (extractedText) {
            parseCheckDetails(extractedText);
          }
        }
        
        if (currentStep === 'front') {
          setFrontImage(imageData);
          if (isCheckCapture) {
            setCurrentStep('back');
          } else {
            setCurrentStep('complete');
          }
        } else if (currentStep === 'back') {
          setBackImage(imageData);
          setCurrentStep('complete');
        }
      } else {
        // Fallback: create a mock image for development
        const mockImage = createMockImage();
        if (currentStep === 'front') {
          setFrontImage(mockImage);
          if (isCheckCapture) {
            setCurrentStep('back');
          } else {
            setCurrentStep('complete');
          }
        } else if (currentStep === 'back') {
          setBackImage(mockImage);
          setCurrentStep('complete');
        }
      }
    }
  };

  const createMockImage = () => {
    // Create a mock image for development/testing
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Draw a simple mock check/document
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, 400, 200);
      
      context.fillStyle = '#000000';
      context.font = '16px Arial';
      context.fillText('Mock Check/Document', 20, 30);
      context.fillText('Amount: $1,000.00', 20, 60);
      context.fillText('Date: ' + new Date().toLocaleDateString(), 20, 90);
      context.fillText('Pay to: Test Payee', 20, 120);
      
      // Add some lines to simulate check features
      context.strokeStyle = '#cccccc';
      context.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        context.beginPath();
        context.moveTo(20, 140 + i * 10);
        context.lineTo(380, 140 + i * 10);
        context.stroke();
      }
    }
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  // Auto-detection using OpenCV.js
  const detectDocument = async (videoElement: HTMLVideoElement): Promise<boolean> => {
    if (!window.cv) {
      console.log('OpenCV not ready yet');
      return false;
    }

    try {
      // Create canvas to capture video frame
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;

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

      // Clean up
      src.delete();
      gray.delete();
      edges.delete();
      blurred.delete();
      contours.delete();
      hierarchy.delete();

      // Check if we found a good document contour
      const minArea = canvas.width * canvas.height * 0.1; // At least 10% of frame
      return largestArea > minArea && bestContour !== null;
      
    } catch (error) {
      console.error('Document detection error:', error);
      return false;
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
      setDetectionStatus('Extracting text...');
      
      const { data: { text } } = await window.Tesseract.recognize(
        imageData,
        'eng',
        {
          logger: (m: any) => {
            if (m.status === 'recognizing text') {
              setDetectionStatus(`OCR Progress: ${Math.round(m.progress * 100)}%`);
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

  // Parse check details from extracted text
  const parseCheckDetails = (text: string) => {
    const details: any = {};
    
    // Extract amount (look for $X,XXX.XX pattern)
    const amountMatch = text.match(/\$[\d,]+\.?\d*/);
    if (amountMatch) {
      details.amount = amountMatch[0];
    }
    
    // Extract date (various date formats)
    const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/);
    if (dateMatch) {
      details.date = dateMatch[0];
    }
    
    // Extract payee (look for "Pay to" or "Pay" patterns)
    const payeeMatch = text.match(/(?:Pay\s+to|Pay)\s*:?\s*([A-Za-z\s]+)/i);
    if (payeeMatch) {
      details.payee = payeeMatch[1].trim();
    }
    
    // Extract memo (look for "Memo" or "For" patterns)
    const memoMatch = text.match(/(?:Memo|For)\s*:?\s*([A-Za-z0-9\s]+)/i);
    if (memoMatch) {
      details.memo = memoMatch[1].trim();
    }
    
    setCheckDetails(details);
    return details;
  };

  // Auto-capture when document is detected
  const handleAutoCapture = async () => {
    if (!videoRef.current || !isCameraReady) return;
    
    setIsAutoDetecting(true);
    setDetectionStatus('Detecting document...');
    
    try {
      const isDocumentDetected = await detectDocument(videoRef.current);
      
      if (isDocumentDetected) {
        setDetectionStatus('Document detected! Capturing...');
        
        // Small delay to show detection feedback
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Capture the image
        await captureImage();
        
        setDetectionStatus('Document captured successfully!');
      } else {
        setDetectionStatus('Position document within frame');
      }
    } catch (error) {
      console.error('Auto-capture error:', error);
      setDetectionStatus('Detection failed, try manual capture');
    } finally {
      setIsAutoDetecting(false);
    }
  };

  const handleContinue = () => {
    if (currentStep === 'complete') {
      // Stop camera before navigating
      stopCamera();
      
      // Navigate to capture summary with captured images
      history.push('/capture-summary', {
        captureType,
        selectedGroup,
        selectedProgram,
        programName,
        frontImage,
        backImage: isCheckCapture ? backImage : null
      });
    }
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
                <IonText>← Back</IonText>
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

          {/* Detection Status */}
          {detectionStatus && (
            <div className="detection-status">
              <IonText>
                <p className="status-text">
                  {isAutoDetecting && <IonSpinner name="crescent" />}
                  {isProcessingOCR && <IonSpinner name="crescent" />}
                  {detectionStatus}
                </p>
              </IonText>
            </div>
          )}

          {/* Extracted Check Details */}
          {Object.keys(checkDetails).length > 0 && (
            <div className="check-details">
              <IonText>
                <h3 className="details-title">Extracted Check Details:</h3>
              </IonText>
              <div className="details-grid">
                {checkDetails.amount && (
                  <div className="detail-item">
                    <span className="detail-label">Amount:</span>
                    <span className="detail-value">{checkDetails.amount}</span>
                  </div>
                )}
                {checkDetails.date && (
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{checkDetails.date}</span>
                  </div>
                )}
                {checkDetails.payee && (
                  <div className="detail-item">
                    <span className="detail-label">Payee:</span>
                    <span className="detail-value">{checkDetails.payee}</span>
                  </div>
                )}
                {checkDetails.memo && (
                  <div className="detail-item">
                    <span className="detail-label">Memo:</span>
                    <span className="detail-value">{checkDetails.memo}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Camera Preview Pane */}
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
              />
              
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

          {/* Captured Images Preview */}
          {(frontImage || backImage) && (
            <div className="captured-preview">
              {frontImage && (
                <div className="preview-item">
                  <IonText>
                    <p className="preview-label">Front</p>
                  </IonText>
                  <img src={frontImage} alt="Front" className="preview-image" />
                </div>
              )}
              {backImage && (
                <div className="preview-item">
                  <IonText>
                    <p className="preview-label">Back</p>
                  </IonText>
                  <img src={backImage} alt="Back" className="preview-image" />
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
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </IonContent>
    </IonPage>
  );
};

export default CaptureCheck;
