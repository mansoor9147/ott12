# OTT Platform - Complete Deployment Guide

## Current Status
- ✅ Frontend code pushed to GitHub (ramana692/ott-platform)
- ✅ Backend CORS updated to allow Vercel origins
- ✅ Frontend API fallback configured for production
- ⏳ Backend needs redeploy on Render
- ⏳ Frontend needs redeploy on Vercel

## Quick Deploy Now (3 Steps)

### Step 1: Redeploy Backend on Render
Your backend is at: https://ott-platform-1-88oj.onrender.com/

**Option A - Manual Deploy (Recommended)**
1. Go to https://dashboard.render.com/
2. Click on your backend service (ott-platform-1-88oj or similar)
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait 2-3 minutes for the build to complete
5. Verify health: https://ott-platform-1-88oj.onrender.com/api/health

**Option B - Auto Deploy**
- If your Render service is connected to the GitHub repo main branch, it should auto-deploy within 5 minutes of the push.
- Check the "Events" tab in Render dashboard to see if deployment started.

### Step 2: Redeploy Frontend on Vercel
Your frontend is at: https://ott-platform-vmhu-ivawfkyrv-ramana692s-projects.vercel.app/

**Option A - Vercel Dashboard (Easiest)**
1. Go to https://vercel.com/dashboard
2. Click your project (ott-platform)
3. Go to "Deployments" tab
4. Click "..." menu on the latest deployment → "Redeploy"
5. Confirm redeploy
6. Wait 1-2 minutes for build to complete

**Option B - Vercel CLI**
```powershell
cd C:\Users\Dell\Downloads\ott-platform-main\ott-platform-main
vercel --prod
```

**Option C - Push any commit to trigger auto-deploy**
```powershell
cd C:\Users\Dell\Downloads\ott-platform-main\ott-platform-main
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

### Step 3: Test Registration
1. Open your Vercel site: https://ott-platform-vmhu-ivawfkyrv-ramana692s-projects.vercel.app/register
2. Open DevTools (F12) → Network tab
3. Fill in registration form and submit
4. Check the POST request to `/auth/register`:
   - **Expected URL**: https://ott-platform-1-88oj.onrender.com/api/auth/register
   - **Expected Status**: 200 or 201
   - **If CORS error**: Backend didn't redeploy yet; wait or trigger manual deploy
   - **If 500 error**: Check Render logs for server error
   - **If Network Failed**: Check backend is running

---

## Troubleshooting

### Issue: "Registration failed" with CORS error
**Symptom**: Console shows "Access to XMLHttpRequest... blocked by CORS policy"
**Fix**:
1. Ensure backend redeployed with the CORS update
2. Check Render logs: Render Dashboard → Service → Logs
3. Verify CORS allows your origin:
```powershell
# Test CORS from PowerShell (replace <VERCEL_URL> with your actual URL)
$body = @{ name='test'; email='test@example.com'; password='Password1!'; phone='+10000000000' } | ConvertTo-Json
Invoke-RestMethod -Uri 'https://ott-platform-1-88oj.onrender.com/api/auth/register' -Method Post -ContentType 'application/json' -Body $body -Headers @{ Origin = 'https://ott-platform-vmhu-ivawfkyrv-ramana692s-projects.vercel.app' }
```

### Issue: Backend not responding
**Symptom**: POST request times out or returns 503
**Fix**:
1. Check Render service status: https://dashboard.render.com/
2. If service is sleeping (free tier), first request may take 30-60s to wake
3. Check Render logs for startup errors

### Issue: Frontend still calling localhost:5000
**Symptom**: Network tab shows POST to http://localhost:5000/api/...
**Fix**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard reload the page (Ctrl+F5)
3. Verify Vercel deployed the latest code (check commit hash in Vercel deployments)

---

## Optional: Set Explicit FRONTEND_URL on Render

For added security, set the exact Vercel URL instead of the wildcard pattern:

1. Go to Render Dashboard → your service → Environment
2. Add environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://ott-platform-vmhu-ivawfkyrv-ramana692s-projects.vercel.app`
3. Click "Save Changes"
4. Render will auto-redeploy

---

## What We Fixed

### Frontend Changes
1. **File**: `frontend/src/services/api.js`
   - Added production fallback: if `REACT_APP_API_URL` is not set, use Render backend URL
   - Benefit: Frontend works even without env var configured in Vercel

### Backend Changes
1. **File**: `backend/server.js`
   - Updated CORS to allow:
     - `FRONTEND_URL` (if set)
     - `http://localhost:3000` (local dev)
     - Any `*.vercel.app` origin (Vercel deployments)
   - Benefit: Vercel deployments can call the API without 403 CORS errors

---

## Need Help?

Run these diagnostic commands and share the output:

**Test Backend Health**
```powershell
Invoke-RestMethod -Uri 'https://ott-platform-1-88oj.onrender.com/api/health'
```

**Test Registration API**
```powershell
$body = @{ name='diagnostic'; email='diag@example.com'; password='Password1!'; phone='+10000000000' } | ConvertTo-Json
Invoke-RestMethod -Uri 'https://ott-platform-1-88oj.onrender.com/api/auth/register' -Method Post -ContentType 'application/json' -Body $body
```

**Check Vercel Deployment Status**
```powershell
vercel ls
```

---

## Summary

✅ Code changes complete and pushed to GitHub
⏳ **ACTION REQUIRED**: Redeploy backend on Render (Step 1 above)
⏳ **ACTION REQUIRED**: Redeploy frontend on Vercel (Step 2 above)
🧪 **VERIFY**: Test registration (Step 3 above)

Once both redeploys are done, registration should work without errors!
