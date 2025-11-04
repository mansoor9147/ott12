# 🚀 Render Deployment Guide for OTT Platform

## Overview
This guide will help you deploy your OTT Platform backend on Render.com. The backend uses Node.js, Express, and MongoDB Atlas.

---

## Prerequisites

✅ **What you already have:**
- GitHub repository: https://github.com/mansoor9147/ott12
- MongoDB Atlas cluster with connection string
- Local project running successfully

✅ **What you need:**
- Render account (free tier available)
- All environment variables ready

---

## Step 1: Prepare Environment Variables

Before deploying, gather these values:

### Required Environment Variables:

```plaintext
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://ott_platform:root@cluster0.hcf7let.mongodb.net/ott-platform
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

### Optional (for full features):
```plaintext
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
```

**Note:** After deploying frontend to Vercel, you'll update `FRONTEND_URL` to your Vercel URL.

---

## Step 2: Sign Up / Login to Render

1. Go to https://render.com
2. Click **"Get Started for Free"** or **"Sign In"**
3. Sign up with GitHub (recommended) or email
4. Authorize Render to access your GitHub account

---

## Step 3: Create a New Web Service

### 3.1 Start New Web Service
1. From Render Dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**

### 3.2 Connect Your Repository
1. Click **"Connect account"** if you haven't connected GitHub yet
2. Find and select **"mansoor9147/ott12"** repository
3. Click **"Connect"**

### 3.3 Configure Service Settings

Fill in the following details:

| Field | Value |
|-------|-------|
| **Name** | `ott-platform-backend` (or any name you prefer) |
| **Region** | Choose closest to you (e.g., Singapore, Frankfurt, Oregon) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |

### 3.4 Select Plan
- Choose **"Free"** plan (sufficient for testing)
- Free tier includes:
  - 750 hours/month
  - Auto-sleep after 15 min inactivity
  - Slower cold starts

**For production:** Consider upgrading to Starter ($7/month) for:
- No auto-sleep
- Faster performance
- More memory

---

## Step 4: Add Environment Variables

### 4.1 Scroll to "Environment Variables" section

### 4.2 Click "Add Environment Variable" for each:

**Essential Variables:**

1. **NODE_ENV**
   ```
   Key: NODE_ENV
   Value: production
   ```

2. **PORT**
   ```
   Key: PORT
   Value: 5000
   ```

3. **MONGODB_URI**
   ```
   Key: MONGODB_URI
   Value: mongodb+srv://ott_platform:root@cluster0.hcf7let.mongodb.net/ott-platform
   ```

4. **JWT_SECRET**
   ```
   Key: JWT_SECRET
   Value: your_super_secret_jwt_key_change_this_in_production_2024
   ```
   **⚠️ Important:** Generate a strong secret! Use this command locally:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **JWT_EXPIRE**
   ```
   Key: JWT_EXPIRE
   Value: 30d
   ```

6. **FRONTEND_URL** (temporary, will update later)
   ```
   Key: FRONTEND_URL
   Value: http://localhost:3000
   ```

### 4.3 Optional Email Variables (for password reset):

7. **EMAIL_HOST**
   ```
   Key: EMAIL_HOST
   Value: smtp.gmail.com
   ```

8. **EMAIL_PORT**
   ```
   Key: EMAIL_PORT
   Value: 587
   ```

9. **EMAIL_USER**
   ```
   Key: EMAIL_USER
   Value: your-email@gmail.com
   ```

10. **EMAIL_PASS**
    ```
    Key: EMAIL_PASS
    Value: your-gmail-app-password
    ```
    
    **How to get Gmail App Password:**
    - Go to Google Account → Security
    - Enable 2-Step Verification
    - Search "App passwords"
    - Generate password for "Mail"
    - Copy the 16-character password

---

## Step 5: Deploy!

1. Click **"Create Web Service"** button at the bottom
2. Render will start building your application
3. Watch the deployment logs in real-time

### What happens during deployment:
```
✓ Cloning repository...
✓ Installing dependencies (npm install)...
✓ Running seedAdmin.js (creates admin user)
✓ Running seedVideos.js (creates sample videos)
✓ Starting server (node server.js)...
✓ Server listening on port 5000
✓ MongoDB connected successfully
✓ Deployment live!
```

**Deployment time:** Usually 2-5 minutes for first deploy

---

## Step 6: Verify Deployment

### 6.1 Get Your Render URL
After deployment completes, you'll see:
```
Your service is live at https://ott-platform-backend-xxxx.onrender.com
```

### 6.2 Test API Health
Open in browser or use curl:
```bash
https://ott-platform-backend-xxxx.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### 6.3 Test Database Connection
Try accessing videos endpoint:
```bash
https://ott-platform-backend-xxxx.onrender.com/api/videos
```

Should return array of seeded videos.

---

## Step 7: Common Issues & Solutions

### ❌ Issue: "Application failed to respond"
**Solution:** Check logs for MongoDB connection errors
- Verify MONGODB_URI is correct
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### ❌ Issue: "Build failed"
**Solution:** 
- Check Node version (should be compatible with your package.json)
- Verify package.json exists in backend folder
- Check build logs for specific npm errors

### ❌ Issue: "Crashed" status
**Solution:**
- Check logs for errors
- Verify PORT environment variable is set to 5000
- Ensure all required dependencies are in package.json

### ❌ Issue: "Service is sleeping"
**Solution:**
- Free tier auto-sleeps after 15 min inactivity
- First request wakes it (30-60 second delay)
- Upgrade to Starter plan to prevent sleeping

---

## Step 8: Configure MongoDB Atlas (if needed)

### Allow Render IP Addresses:

1. Go to MongoDB Atlas Dashboard
2. Click **"Network Access"** (left sidebar)
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**

**Note:** This allows Render's dynamic IPs to connect. For better security in production, use MongoDB Atlas's Render integration.

---

## Step 9: Update FRONTEND_URL (After Vercel Deployment)

Once you deploy frontend to Vercel:

1. Go to Render Dashboard
2. Click on your **ott-platform-backend** service
3. Go to **"Environment"** tab
4. Find **FRONTEND_URL** variable
5. Click **"Edit"**
6. Update value to your Vercel URL:
   ```
   https://your-app-name.vercel.app
   ```
7. Click **"Save Changes"**
8. Service will automatically redeploy with new CORS settings

---

## Step 10: Monitor Your Deployment

### View Logs:
1. Go to your service dashboard
2. Click **"Logs"** tab
3. See real-time server logs

### Useful Log Commands:
- Filter errors: Click "Error" level
- Search logs: Use search box
- Download logs: Click download icon

### Check Metrics:
1. Click **"Metrics"** tab
2. View:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

---

## 🎯 Next Steps

After successful backend deployment:

1. ✅ **Save your Render URL** (you'll need it for frontend)
2. ✅ **Test admin login:**
   ```
   POST https://your-render-url.onrender.com/api/auth/login
   Body: {
     "email": "231fa04a47@gmail.com",
     "password": "123@123"
   }
   ```

3. ✅ **Deploy Frontend to Vercel** (see VERCEL_DEPLOYMENT_GUIDE.md)

4. ✅ **Update FRONTEND_URL** on Render with Vercel URL

5. ✅ **Test end-to-end registration** from Vercel frontend to Render backend

---

## 📝 Important URLs to Save

After deployment, save these:

```
Backend (Render): https://ott-platform-backend-xxxx.onrender.com
Frontend (Vercel): https://your-app-name.vercel.app (after Vercel deploy)

Admin Credentials:
Email: 231fa04a47@gmail.com
Password: 123@123

MongoDB Atlas: https://cloud.mongodb.com
GitHub Repo: https://github.com/mansoor9147/ott12
```

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Render Logs** - Most errors are visible here
2. **Check MongoDB Atlas** - Verify connection and IP whitelist
3. **Test Locally** - Ensure it works on localhost first
4. **Render Docs** - https://render.com/docs
5. **Contact Support** - Render has excellent free tier support

---

## 💡 Pro Tips

1. **Free Tier Sleep:** First request after sleep takes 30-60 seconds
2. **Custom Domain:** Add your own domain in Render dashboard (paid plans)
3. **Auto-Deploy:** Push to GitHub main branch = automatic redeploy
4. **Health Checks:** Render pings `/api/health` to check if service is up
5. **Secrets:** Use Render's Secret Files for sensitive data (advanced)

---

## ✨ Your Backend Will Be Live At:

```
https://ott-platform-backend-[random-string].onrender.com
```

**Total Deployment Time:** ~5-10 minutes

---

**Ready to deploy? Follow the steps above and you'll have your backend live in minutes!** 🚀
