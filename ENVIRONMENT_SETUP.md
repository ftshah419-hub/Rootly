# ROOTLY HOMEGROWN PRODUCE EXCHANGE — ENVIRONMENT SETUP

This guide provides step-by-step instructions for setting up, configuring, and launching the Rootly platform locally using Windows PowerShell.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or later (v20+ or v24 recommended). Verify with `node -v`.
- **npm**: v9.0.0 or later. Verify with `npm -v`.
- **MongoDB**: MongoDB Atlas connection URI or local MongoDB daemon.
- **Git**: Installed and available on PATH.

---

## 2. Windows PowerShell Setup Commands

### Step 1: Clone or Navigate to the Project Root
```powershell
cd C:\Users\User\OneDrive\Desktop\Buildathon\Rootly1
```

### Step 2: Configure Backend Environment Variables
Copy `.env.example` to `.env` in the `backend/` directory:
```powershell
cd backend
Copy-Item .env.example .env
```

Open `backend/.env` and update the values:
```ini
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Atlas URI:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.8bf4mja.mongodb.net/rootly?retryWrites=true&w=majority

# JWT Secrets:
JWT_ACCESS_SECRET=rootly_jwt_access_secret_super_secure_key_2026
JWT_REFRESH_SECRET=rootly_jwt_refresh_secret_super_secure_key_2026
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=30d

# Email Settings (Optional / Ethereal):
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM="Rootly Harvest Network <noreply@rootly.local>"

# Cloudinary (Optional for Image Hosting):
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Google Gemini AI (Optional / Falls back to local heuristic engine):
GEMINI_API_KEY=
```

### Step 3: Install Backend Dependencies & Run Tests
```powershell
# From backend directory:
npm install

# Verify all 26 Mongoose models:
npm run test:models

# Run the complete live authentication & backend test suite:
npm run test:auth
```

### Step 4: Configure Frontend Environment Variables
```powershell
cd ..\frontend
```
Create `frontend/.env` (optional, defaults to `http://localhost:5000/api`):
```ini
VITE_API_URL=http://localhost:5000/api
```

### Step 5: Install Frontend Dependencies
```powershell
# From frontend directory:
npm install
```

---

## 3. Starting the Applications

Open two separate Windows PowerShell windows:

### Terminal 1: Start Backend API & WebSocket Server
```powershell
cd C:\Users\User\OneDrive\Desktop\Buildathon\Rootly1\backend
npm run dev
```
*Backend will boot at `http://localhost:5000` and connect to MongoDB Atlas.*

### Terminal 2: Start Frontend Development Server
```powershell
cd C:\Users\User\OneDrive\Desktop\Buildathon\Rootly1\frontend
npm run dev
```
*Frontend will launch at `http://localhost:5173`.*

---

## 4. Verification Checklist

1. Visit `http://localhost:5173/login` in your web browser.
2. Verify split-screen visual storytelling and Rustic Premium branding.
3. Test toggling between Light and Dark mode using the sun/moon icon.
4. Test language switching between `EN` and `മലയാളം`.
5. Create a new account with your name and email; verify instant sign-in and redirect.
6. Open browser DevTools Network tab to observe token rotation and JWT payloads.
