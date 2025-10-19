# JPMC Access Mobile Banking PWA

A Progressive Web App for mobile banking with check capture and remote deposits.

## Features

- 📱 **PWA Support**: Installable on mobile devices
- 📷 **Auto Document Detection**: OpenCV.js powered document detection
- 🔍 **OCR Text Extraction**: Tesseract.js for check details extraction
- 💳 **Check Capture**: Front and back check capture with auto-detection
- 🏦 **Banking Flow**: Complete deposit workflow
- 📱 **Mobile Optimized**: Responsive design for mobile devices

## Tech Stack

- **React 19** with TypeScript
- **Ionic React** for mobile UI components
- **Vite** for build tooling
- **OpenCV.js** for document detection
- **Tesseract.js** for OCR
- **PWA** with service worker

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Render.com

### Method 1: Using Render Dashboard

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/access-mobile-web.git
   git push -u origin main
   ```

2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Sign up/Login with GitHub
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `access-mobile-web`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
     - **Node Version**: `18` (or latest)

3. **Deploy**:
   - Click "Create Static Site"
   - Render will automatically build and deploy

### Method 2: Using render.yaml (Recommended)

The project includes a `render.yaml` file for automatic configuration:

1. **Push to GitHub** with the render.yaml file
2. **Connect to Render**:
   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Select your repository
   - Render will automatically detect and use the render.yaml configuration

## Environment Variables

No environment variables required for basic deployment.

## PWA Features

- **Service Worker**: Offline functionality
- **Web App Manifest**: App installation
- **Auto Install Prompt**: User-friendly installation
- **Push Notifications**: Ready for banking alerts

## Browser Support

- **Chrome/Edge**: Full PWA support
- **Safari**: iOS installation support
- **Firefox**: Basic PWA support

## Security Headers

The deployment includes security headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## Performance

- **Code Splitting**: Automatic vendor/route splitting
- **Tree Shaking**: Unused code elimination
- **Minification**: Terser minification
- **Caching**: Optimized cache headers

## Monitoring

- **Build Logs**: Available in Render dashboard
- **Deployment Status**: Real-time deployment tracking
- **Custom Domain**: Support for custom domains

## Support

For deployment issues:
1. Check Render build logs
2. Verify all dependencies are in package.json
3. Ensure build command works locally: `npm run build`
