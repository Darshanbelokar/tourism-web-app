# Render Backend Deployment Guide

## � **QUICK FIX for Current Build Error**

If you're seeing "Command 'build' not found" error, go to your Render service settings and change:
- **Build Command**: Change from `yarn install; yarn build` to `npm install`
- **Start Command**: Should be `npm start`

## �🚀 **Deploy Backend to Render**

### ✅ **Backend is Ready for Render:**
- ✅ `package.json` has correct start script: `"start": "node server.js"`
- ✅ Server uses `process.env.PORT` for dynamic port assignment
- ✅ CORS configured to allow Vercel frontend domains
- ✅ All dependencies properly listed

### 📋 **Step-by-Step Deployment:**

#### **1. Create Render Web Service**
1. Go to [render.com](https://render.com)
2. Sign up/Login → Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select repository: `Darshanbelokar/tourism-web-app`
5. Select branch: `main`

#### **2. Configure Build Settings**
- **Name**: `jharkhand-tourism-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Build Command**: `npm install` (IMPORTANT: Remove any default yarn build command)
- **Start Command**: `npm start`

#### **⚠️ IMPORTANT: Remove Default Build Command**
Render might auto-detect and set a build command like `yarn install; yarn build`. 
**You MUST change this to just**: `npm install`

This is because your backend is a server application, not a static site that needs building.

#### **3. Add Environment Variables**
In Render Dashboard → Environment tab, add these variables:

```
MONGODB_URI=mongodb+srv://sample_user_1:darshan123@tourismapp.lxpc4az.mongodb.net/?retryWrites=true&w=majority&appName=TourismApp
GOOGLE_API_KEY=AIzaSyDAbmTK8e8_xjT_rpUucrgovIuzDm19S_g
NODE_ENV=production
```

#### **4. Deploy Backend**
- Click **"Create Web Service"**
- Wait 5-10 minutes for deployment
- You'll get a URL like: `https://jharkhand-tourism-backend.onrender.com`

### 🔗 **Connect Frontend to Backend**

#### **5. Update Vercel Frontend**
1. Go to [vercel.com](https://vercel.com) → Your Project → Settings
2. Go to **Environment Variables**
3. Add new variable:
   ```
   VITE_BACKEND_URL=https://jharkhand-tourism-backend.onrender.com
   ```
4. **Redeploy** your frontend from Vercel dashboard

### 🧪 **Test the Connection**
1. Visit your Vercel frontend URL
2. Test features like:
   - Tourist spots loading
   - Feedback system
   - AI chatbot
   - Authentication

### 🔧 **Backend API Endpoints**
Your backend will be available at:
- Health check: `https://jharkhand-tourism-backend.onrender.com/`
- Tourist spots: `https://jharkhand-tourism-backend.onrender.com/api/spots`
- Feedback: `https://jharkhand-tourism-backend.onrender.com/api/feedback`
- Auth: `https://jharkhand-tourism-backend.onrender.com/api/auth/login`

### ⚠️ **Important Notes**
- **Free tier**: Render free tier sleeps after 15 minutes of inactivity
- **Cold starts**: First request after sleep may take 30+ seconds
- **Database**: MongoDB Atlas connection already configured
- **CORS**: Frontend domains automatically allowed

### 🎯 **Expected Result**
- ✅ Backend deployed on Render
- ✅ Frontend on Vercel connects to Render backend
- ✅ Full-stack app working with separate deployments
- ✅ Database and AI features functional

The backend is now optimized and ready for Render deployment!