# ROOTLY HOMEGROWN PRODUCE EXCHANGE — AUTHENTICATION GUIDE

This guide details the complete authentication lifecycle, security guarantees, frontend state management, and backend implementation for Rootly.

---

## 1. Security Architecture & Principles

1. **Role Separation**:
   - Platform supports two roles: `USER` and `ADMIN`.
   - Public registration endpoints **always** assign `USER`. No client can select or request `ADMIN`.
   - Admin accounts are created exclusively via administrative provisioning or database seeds.
2. **Password Hashing**:
   - `bcryptjs` with 12 salt rounds is used for all password hashes.
   - Plaintext passwords are never written to disk, database, or console logs.
3. **No Long-Lived Client Storage**:
   - Refresh tokens are transmitted via secure, HttpOnly cookies (`SameSite: Lax`).
   - Stored in MongoDB solely as SHA-256 hashes (`crypto.createHash('sha256')`).
4. **Token Rotation**:
   - On every `/api/auth/refresh` call, the old refresh session is revoked (`revokedAt = new Date()`), and a new session is generated.
   - Re-use of a revoked refresh token triggers immediate rejection (401 Unauthorized).

---

## 2. API Endpoints Reference

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user. Returns user object & tokens. |
| `POST` | `/api/auth/login` | Public | Sign in with email and password. |
| `POST` | `/api/auth/refresh` | Cookie/Body | Rotate refresh token and obtain new access token. |
| `POST` | `/api/auth/logout` | Cookie/Body | Invalidate active refresh session and clear cookies. |
| `POST` | `/api/auth/forgot-password` | Public | Issue 1-hour secure password reset token. |
| `POST` | `/api/auth/reset-password` | Public | Validate token, update password, revoke all user sessions. |
| `GET` | `/api/auth/me` | Bearer Token | Retrieve authenticated user profile (safe object). |

---

## 3. Frontend Authentication Integration

### Using `useAuth()` in React Components
```jsx
import { useAuth } from '../context/AuthContext.jsx';

export const UserProfileWidget = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Please sign in to access your garden offers.</p>;
  }

  return (
    <div>
      <p>Welcome, {user.name} ({user.role})</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
};
```

### Protecting Routes
Wrap any route in `ProtectedRoute` to require an authenticated session:
```jsx
import ProtectedRoute from './routes/ProtectedRoute.jsx';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  }
/>
```

### Role-Based Route Guards
Wrap administrator pages with `RoleBasedRoute`:
```jsx
import RoleBasedRoute from './routes/RoleBasedRoute.jsx';

<Route
  path="/admin"
  element={
    <RoleBasedRoute allowedRole="ADMIN">
      <AdminDashboard />
    </RoleBasedRoute>
  }
/>
```

---

## 4. Backend Middleware Usage

In any Express route file, protect endpoints with the standard middlewares:

```javascript
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

// User protected endpoint:
router.get('/my-harvests', authenticate, getMyHarvests);

// Admin protected endpoint:
router.patch('/users/:id/suspend', authenticate, requireAdmin, suspendUser);
```
