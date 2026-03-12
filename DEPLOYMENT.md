# Deployment Guide

This guide explains how to deploy:
- Backend: `server` (Express + MongoDB)
- Frontend: `code-campus-appraisal` (Vite + React)

## 1. Prerequisites

- GitHub repo containing both folders:
  - `server`
  - `code-campus-appraisal`
- MongoDB Atlas account
- Render account (for backend)
- Vercel account (for frontend)

## 2. MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster.
2. Create a database user with username/password.
3. In **Network Access**, allow your deployment providers (or temporarily `0.0.0.0/0` for testing).
4. Copy the connection string.
5. Replace `<password>` and database name in the URI.

Example:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/appraisal_db?retryWrites=true&w=majority
```

## 3. Backend Deployment (Render)

### 3.1 Prepare backend scripts

In `server/package.json` ensure scripts are:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

`start` is required for production deployment.

### 3.2 Create Render service

1. Go to Render dashboard.
2. Create **New Web Service** from your GitHub repo.
3. Configure:
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

4. Add environment variable:
- `MONGO_URI=<your atlas URI>`

5. Deploy.

After deployment, note your backend URL, e.g.:

```txt
https://your-api.onrender.com
```

### 3.3 Backend health test

- Open `https://your-api.onrender.com/`
- Expected response: `Hello World!`

You can also test POST endpoint:

```txt
POST https://your-api.onrender.com/api/appraisals
Content-Type: application/json
```

Body example:

```json
{
  "memberName": "Jane Doe",
  "memberRole": "Chair",
  "reviewerName": "John Reviewer",
  "appraisalPeriod": "Q1 2026",
  "scores": {
    "leadership": 4,
    "engagement": 5,
    "governance": 4,
    "ethics": 5,
    "collaboration": 4
  },
  "averageScore": 4.4,
  "keyContributions": "Improved board decision process.",
  "improvementPriorities": "More mentorship for new members.",
  "recommendation": "retain"
}
```

## 4. Frontend Deployment (Vercel)

1. Create a new Vercel project from the same GitHub repo.
2. Configure:
- **Root Directory**: `code-campus-appraisal`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

3. Add environment variable:

```env
VITE_API_URL=https://your-api.onrender.com/api/appraisals
```

4. Deploy.

## 5. CORS Configuration

Current backend allows all origins (`*`). For production, restrict CORS to your frontend domain.

Example allowed origin:

```txt
https://your-frontend.vercel.app
```

If needed, update `server/app.js` to only allow your deployed frontend origin.

## 6. Final Verification Checklist

- Backend URL responds at `/`
- Frontend loads successfully
- Form submission returns success
- New appraisal record appears in MongoDB Atlas collection
- Browser console has no CORS/network errors

## 7. Common Issues

### 7.1 `Failed to fetch` on submit

- Check `VITE_API_URL` in Vercel
- Confirm backend is running and public
- Confirm CORS allows frontend domain

### 7.2 Mongo connection errors

- Validate `MONGO_URI`
- Ensure Atlas user/password are correct
- Ensure IP/network access rules allow Render

### 7.3 Render deploy succeeds but API crashes

- Confirm `start` script is `node app.js`
- Check Render logs for missing env vars

## 8. Optional Improvements

- Add `NODE_ENV=production` env var in Render
- Add request validation before saving appraisals
- Add rate limiting and helmet for API security
- Add monitoring/logging (Render logs + uptime checks)
