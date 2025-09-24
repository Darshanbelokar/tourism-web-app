# Deployment Guide for Jharkhand Tourism Web App

## Architecture
This application uses Vercel's serverless architecture:
- **Frontend**: React app with Vite build system
- **Backend**: Serverless functions in `api/` folder
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Google Gemini API for sentiment analysis and chatbot

## Environment Variables Required

Set these in your Vercel dashboard under Project Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/tourism-web-app
GOOGLE_API_KEY=your-google-gemini-api-key
```

## API Endpoints (Serverless Functions)

- `GET/POST /api/spots` - Tourist spots CRUD operations
- `GET/POST /api/feedback` - Feedback system with analytics
- `POST /api/analyze` - AI sentiment analysis
- `POST /api/gemini-flash` - Chatbot functionality  
- `GET /api/hello` - Health check endpoint

## Local Development

1. **Install dependencies**:
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # API (if needed)
   cd ../api
   npm install
   ```

2. **Set environment variables**:
   Create `.env.local` file in project root:
   ```
   MONGODB_URI=mongodb://localhost:27017/tourism-web-app
   GOOGLE_API_KEY=your-google-api-key
   ```

3. **Run locally**:
   ```bash
   # Frontend only
   cd frontend
   npm run dev
   
   # With Vercel CLI (recommended)
   vercel dev
   ```

## Deployment to Vercel

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set environment variables** in Vercel dashboard

4. **Domain configuration** (if custom domain):
   - Add domain in Vercel dashboard
   - Update DNS records

## Build Information

- **Frontend Build Time**: ~10 seconds
- **Bundle Size**: ~600KB (minified + gzipped)
- **Chunk Size Warning**: Consider code splitting for chunks > 500KB

## File Structure for Vercel

```
├── api/                    # Serverless functions
│   ├── package.json       # API dependencies
│   ├── hello.js           # Health check
│   ├── spots.js           # Tourist spots API
│   ├── feedback.js        # Feedback system
│   ├── analyze.js         # AI sentiment analysis
│   └── gemini-flash.js    # Chatbot API
├── frontend/              # React application
│   ├── dist/             # Build output (generated)
│   └── src/              # Source code
├── vercel.json           # Vercel configuration
└── DEPLOYMENT.md         # This file
```

## Troubleshooting

### Common Issues:

1. **API not found (404)**:
   - Ensure `api/` folder structure is correct
   - Check `vercel.json` routing configuration

2. **Database connection issues**:
   - Verify `MONGODB_URI` environment variable
   - Check MongoDB Atlas network access settings

3. **AI features not working**:
   - Verify `GOOGLE_API_KEY` environment variable
   - Check Google Cloud API quotas

4. **Build failures**:
   - Run `npm run build` in `frontend/` directory
   - Check for TypeScript/ESLint errors

### Performance Optimization:

- Images are optimized during build
- Consider implementing image lazy loading
- Use dynamic imports for large components
- Enable Vercel Analytics for monitoring

## Security Notes

- All API endpoints include CORS headers
- Environment variables are server-side only
- MongoDB connection uses connection caching for performance
- Rate limiting should be implemented for production

## Support

For issues related to:
- **Frontend**: Check React/Vite documentation
- **API**: Check Vercel serverless functions docs
- **Database**: Check MongoDB/Mongoose documentation
- **AI**: Check Google Gemini API documentation