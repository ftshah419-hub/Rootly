# 🌱 ROOTLY — Homegrown Produce Exchange

> **Grown Close. Shared Fresh.**  
> *"തനിമയുള്ള നാടൻ വിളവുകൾ നിങ്ങളുടെ തൊട്ടടുത്ത്"*  
> Authentic, sun-ripened garden harvests from fences next door.

Rootly is a neighbourhood-powered hyperlocal community produce exchange connecting home growers, organic gardeners, and local households across Kerala.

---

## 🌟 Key Platform Capabilities

- **Hyperlocal Discovery**: Discover garden produce within walking or cycling distance (1 to 5 km) on an interactive Leaflet map.
- **Three Exchange Modes**: Sell at fair community prices, barter directly for produce you need, or share surplus as a free community gift.
- **Upcoming Harvests & Prebooking**: Announce expected yields before picking; neighbors can prebook to eliminate post-harvest food waste.
- **Harvest AI Assistant**: Advisory crop recognition, automatic description drafting in English and Malayalam, fair local price suggestions, and interactive Harvest Buddy chatbot.
- **Zero-Mile Sustainability Tracker**: Automatically computes food waste prevented (kg), food miles saved (km), and CO2e emissions avoided per exchange.
- **Community Trust Charter**: Transparent reviews, neighbor vouching, garden verification, and private home coordinates.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, JavaScript JSX, React Router DOM, Context API, Axios, Tailwind CSS, Leaflet, React Leaflet |
| **Backend** | Node.js, Express.js (ES Modules), MVC Architecture, Socket.IO (Realtime Messaging) |
| **Database** | MongoDB Atlas with Mongoose (Exactly 26 collections with 2dsphere indexes) |
| **Authentication** | JWT Access Tokens (15m), Secure Refresh Token Rotation (30d), bcrypt (12 rounds) |
| **AI Subsystem** | Google Gemini API (Backend abstraction with local heuristic fallback) |
| **Maps** | Leaflet + OpenStreetMap (No proprietary Google Maps dependency) |

---

## 📁 Repository Architecture

```
Rootly1/
├── backend/
│   ├── config/             # DB, Environment, Cloudinary, Gemini AI configs
│   ├── models/             # Exactly 26 Mongoose Models (users, products, harvests, etc.)
│   ├── routes/             # authRoutes.js, userRoutes.js, adminRoutes.js, index.js
│   ├── controllers/        # authController.js, userController.js, adminController.js
│   ├── services/           # authService.js, productService.js, exchangeService.js, ai/...
│   ├── middleware/         # authMiddleware.js, adminMiddleware.js, errorMiddleware.js, ...
│   ├── validators/         # Input schemas and validation helpers
│   ├── sockets/            # chatSocket.js (Socket.IO messaging server)
│   ├── utils/              # ApiError, asyncHandler, generateToken, responseHandler
│   ├── tests/              # testModels.js, testAuth.js
│   ├── app.js              # Express app setup with Helmet, CORS & rate limiters
│   └── server.js           # Server entrypoint with MongoDB Atlas connection
│
├── frontend/
│   ├── public/assets/      # Fine-art harvest photography, emblems, mockups
│   ├── src/
│   │   ├── api/            # apiClient.js, authApi.js
│   │   ├── context/        # AuthContext.jsx, ThemeContext.jsx
│   │   ├── routes/         # ProtectedRoute.jsx, RoleBasedRoute.jsx
│   │   ├── styles/         # variables.css, themes.css, global.css
│   │   ├── components/
│   │   │   ├── common/     # Button, Input, Modal, ConfirmDialog, Spinner, Toast, ...
│   │   │   ├── map/        # MapView, MapMarker, UserLocationMarker, MapPopup, ...
│   │   │   └── layout/     # Navbar, Footer
│   │   ├── pages/
│   │   │   ├── auth/       # LoginPage (Mock Parity), ForgotPassword, ResetPassword
│   │   │   ├── common/     # About, HowItWorks, Help, Contact, Privacy, Terms, ...
│   │   │   └── integration/# Person1Placeholder, Person2Placeholder
│   │   ├── App.jsx         # Main router definition
│   │   └── main.jsx        # App bootstrapper
│   └── tailwind.config.js  # Rustic Premium design tokens
│
├── API_DOCUMENTATION.md    # Comprehensive API contracts for Person 1 and Person 2
├── DATABASE_SCHEMA.md      # Detailed documentation of all 26 collections & indexes
├── PROJECT_ARCHITECTURE.md # System architecture, security model & data flows
├── AUTHENTICATION_GUIDE.md # Auth lifecycle, token rotation & role guards
├── TEAM_FILE_OWNERSHIP.md  # Boundaries for Person 1, Person 2, and Shared Core
├── ENVIRONMENT_SETUP.md    # Step-by-step Windows PowerShell setup instructions
└── GIT_COLLABORATION_GUIDE.md # Branching rules & conflict resolution
```

---

## 🚀 Quick Start (Windows PowerShell)

### 1. Start the Backend Server
```powershell
cd C:\Users\User\OneDrive\Desktop\Buildathon\Rootly1\backend
npm install
npm run test:auth      # Runs complete live Atlas authentication tests
npm run dev            # Starts backend at http://localhost:5000
```

### 2. Start the Frontend Application
```powershell
cd C:\Users\User\OneDrive\Desktop\Buildathon\Rootly1\frontend
npm install
npm run dev            # Starts frontend at http://localhost:5173
```

---

## 👥 Instructions for Teammates

### Person 1 (Complete User Website Lead)
- Your user routes are mounted at `/api/user`. Connect your endpoints in `backend/routes/userRoutes.js` and `backend/controllers/userController.js`.
- Your user pages go in `frontend/src/pages/user/`. Replace `Person1Placeholder.jsx` in `App.jsx` with your Home page.
- Import `useAuth()` from `context/AuthContext.jsx` for authenticated user data.
- Import `MapView` from `components/map/MapView.jsx` for interactive Leaflet discovery.
- Consult `API_DOCUMENTATION.md` for exact request and response schemas.

### Person 2 (Complete Admin Dashboard Lead)
- Your admin routes are mounted at `/api/admin`. Connect your endpoints in `backend/routes/adminRoutes.js` and `backend/controllers/adminController.js`.
- All admin endpoints are automatically protected with `authenticate` and `requireAdmin`.
- Your admin dashboard pages go in `frontend/src/pages/admin/`. Replace `Person2Placeholder.jsx` in `App.jsx` with your Dashboard.
- Consult `API_DOCUMENTATION.md` for admin overview metrics and report moderation schemas.

---

## 📄 License
Rootly Community Project — Built for neighborhood resilience and hyperlocal agriculture.
