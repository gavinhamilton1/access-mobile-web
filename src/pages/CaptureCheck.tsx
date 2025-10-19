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
  IonFab,
  IonFabButton
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';

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

  const captureImage = () => {
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

  const getStepDescription = () => {
    if (isCheckCapture) {
      return currentStep === 'front' 
        ? 'Position the front of the check within the frame'
        : 'Position the back of the check within the frame';
    }
    return 'Position the document within the frame';
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
          {/* Camera View */}
          <div className="camera-view">
            {/* Always render video element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              webkit-playsinline="true"
              className="camera-video"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                backgroundColor: '#000',
                border: '2px solid red' // Debug border
              }}
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
            
            {/* Debug info */}
            <div style={{ 
              position: 'absolute', 
              top: '10px', 
              left: '10px', 
              background: 'rgba(0,0,0,0.7)', 
              color: 'white', 
              padding: '5px',
              fontSize: '12px',
              zIndex: 10
            }}>
              Camera Ready: {isCameraReady ? 'Yes' : 'No'}
            </div>
            
            {/* Capture Overlay */}
            <div className="capture-overlay">
              <div className="overlay-top"></div>
              <div className="overlay-middle">
                <div className="overlay-left"></div>
                <div className="capture-frame">
                  <div className="frame-corners">
                    <div className="corner top-left"></div>
                    <div className="corner top-right"></div>
                    <div className="corner bottom-left"></div>
                    <div className="corner bottom-right"></div>
                  </div>
                </div>
                <div className="overlay-right"></div>
              </div>
              <div className="overlay-bottom"></div>
            </div>

            {/* Instructions */}
            <div className="capture-instructions">
              <IonText>
                <p className="instruction-text">{getStepDescription()}</p>
              </IonText>
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

          {/* Action Buttons */}
          <div className="capture-actions">
            {currentStep !== 'complete' ? (
              <IonFab vertical="bottom" horizontal="center" slot="fixed">
                <IonFabButton onClick={captureImage} className="capture-button">
                  <IonIcon name="camera" />
                </IonFabButton>
              </IonFab>
            ) : (
              <IonButton 
                expand="block" 
                className="continue-button"
                onClick={handleContinue}
              >
                Continue
              </IonButton>
            )}
          </div>
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </IonContent>
    </IonPage>
  );
};

export default CaptureCheck;
