# ROOTLY HOMEGROWN PRODUCE EXCHANGE — API DOCUMENTATION

This document defines the complete backend API contracts, request/response structures, authorization rules, and integration guides for **Person 1 (User Website Lead)** and **Person 2 (Admin Dashboard Lead)**.

---

## 1. Global Standards & Conventions

### Base URLs
- **Backend API Base**: `http://localhost:5000/api`
- **WebSocket (Socket.IO)**: `http://localhost:5000`

### Standard Response Envelope
All API endpoints adhere to this consistent JSON structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Standard Error Envelope
```json
{
  "success": false,
  "message": "Detailed error description",
  "errors": ["Specific field validation issue if applicable"]
}
```

### Authentication Header
For protected endpoints, supply the access token:
```http
Authorization: Bearer <access_token>
```
*Note: Tokens can also be supplied via HttpOnly cookies (`accessToken` and `refreshToken`).*

---

## 2. Authentication API (Auth Module)

Mounted at: `/api/auth`

### 2.1 Register New User
- **Method / Endpoint**: `POST /api/auth/register`
- **Auth**: Public
- **Rate Limit**: 30 requests / 15 minutes
- **Request Body**:
```json
{
  "name": "Maya Krishnan",
  "email": "maya@community.eco",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "phone": "+91 9847012345",
  "preferredLanguage": "en",
  "interests": ["Home Gardener", "Heirloom Veggies"]
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registration successful",
  "data": {
    "user": {
      "_id": "673998f09281...",
      "name": "Maya Krishnan",
      "email": "maya@community.eco",
      "role": "USER",
      "accountStatus": "ACTIVE",
      "preferredLanguage": "en",
      "profile": {
        "interests": ["Home Gardener", "Heirloom Veggies"]
      }
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "4a71b..."
  }
}
```

### 2.2 User Login
- **Method / Endpoint**: `POST /api/auth/login`
- **Auth**: Public
- **Rate Limit**: 30 requests / 15 minutes
- **Request Body**:
```json
{
  "email": "maya@community.eco",
  "password": "SecurePassword123!",
  "rememberDevice": true
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Sign in successful",
  "data": {
    "user": {
      "_id": "673998f09281...",
      "name": "Maya Krishnan",
      "email": "maya@community.eco",
      "role": "USER",
      "accountStatus": "ACTIVE"
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "4a71b..."
  }
}
```

### 2.3 Rotate Refresh Token
- **Method / Endpoint**: `POST /api/auth/refresh`
- **Auth**: Public (Requires refresh token in cookie or body)
- **Request Body** (optional if cookie sent):
```json
{
  "refreshToken": "4a71b..."
}
```
- **Response (200 OK)**: Returns new rotated access token and new refresh token.

### 2.4 Logout
- **Method / Endpoint**: `POST /api/auth/logout`
- **Auth**: Public (Requires active refresh session)
- **Response (200 OK)**: Clears refresh session and cookies.

### 2.5 Forgot Password Request
- **Method / Endpoint**: `POST /api/auth/forgot-password`
- **Auth**: Public
- **Rate Limit**: 10 requests / hour
- **Request Body**:
```json
{
  "email": "maya@community.eco"
}
```
- **Response (200 OK)**: Returns generic non-disclosing message. In development mode, returns `devToken` for testing.

### 2.6 Reset Password
- **Method / Endpoint**: `POST /api/auth/reset-password`
- **Auth**: Public
- **Request Body**:
```json
{
  "token": "4a71b9...",
  "password": "NewSecurePassword2026!",
  "confirmPassword": "NewSecurePassword2026!"
}
```
- **Response (200 OK)**: Invalids all existing refresh sessions and updates password.

### 2.7 Get Current Authenticated Profile
- **Method / Endpoint**: `GET /api/auth/me`
- **Auth**: Bearer Token
- **Response (200 OK)**: Returns sanitized user object (passwords and exact coordinates excluded).

---

## 3. Person 1 Integration Contracts (User Application)

Person 1 connects their UI to these core services and endpoints mounted under `/api/user` and shared service calls.

### 3.1 Products & Discovery
#### Geospatial Search & Listing Exploration
- **Service**: `productService.getProducts(options)`
- **Query Parameters**:
  - `longitude` (Number): User longitude (e.g. `76.2711`)
  - `latitude` (Number): User latitude (e.g. `10.8505`)
  - `radiusKm` (Number): Search radius (1 to 25 km, default 5 km)
  - `category` (ObjectId): Filter by Category ID
  - `exchangeType` (String): `'SELL' | 'BARTER' | 'FREE'`
  - `status` (String): Default `'AVAILABLE'`
  - `search` (String): Full-text keyword filter
  - `page` & `limit`: Pagination parameters
- **Response Data Structure**:
```json
{
  "products": [
    {
      "_id": "67399a12...",
      "name": "Country Spinach & Red Amaranth",
      "description": "Freshly cut cheera leaves from our terrace garden in Aluva.",
      "exchangeType": "BARTER",
      "pricing": { "price": 0, "unit": "bunch" },
      "quantity": { "available": 4, "unit": "bunch" },
      "images": [{ "url": "https://res.cloudinary.com/..." }],
      "location": {
        "neighborhood": "Aluva Riverbank",
        "approximateCoords": [76.35, 10.11]
      },
      "sellerId": {
        "name": "Maya Krishnan",
        "profile": { "gardenName": "Maya's Organic Terrace" }
      }
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 1, "pages": 1 }
}
```

### 3.2 Exchange Requests & Inventory Safety
#### Create Exchange Request
- **Service**: `exchangeService.createExchangeRequest()`
- **Request Body**:
```json
{
  "productId": "67399a12...",
  "requestType": "BARTER",
  "quantityRequested": 2,
  "offeredItems": [
    {
      "description": "1 kg Fresh Backyard Tapioca (Kappa)",
      "estimatedValue": 50
    }
  ],
  "message": "Hello neighbor, would love to trade our fresh tapioca for your cheera!"
}
```
- **Rules**:
  - Automatically validates that `quantityRequested <= product.quantity.available`.
  - Rejects requesting user's own listing.
  - Sends immediate notification to seller.

#### Accept / Complete Exchange Request
- **Service**: `exchangeService.updateExchangeStatus(exchangeId, userId, newStatus)`
- **Allowed `newStatus` values**: `'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'`
- **Rules**:
  - When `ACCEPTED`: Inventory is safely decremented. If available reaches 0, status transitions to `EXCHANGED`.
  - When `COMPLETED`: Automatically records sustainability metrics (food waste saved, food miles saved, CO2e averted) via `sustainabilityService.recordExchangeSustainability()`.

### 3.3 Barter Matching
- **Service**: `barterService.findDirectBarterMatches(userId)`
- **Behavior**:
  - Scans active `barter_preferences` in MongoDB.
  - Evaluates geographic proximity (< 5km) and mutual category reciprocity (user A wants what B has & user B wants what A has).
  - Returns ranked matches with `matchScore` (0-100), `distanceKm`, and `matchReasons`.

### 3.4 Upcoming Harvests & Prebooking
- **Service**: `harvestService.getUpcomingHarvests({ categoryId, maxDays: 30 })`
- **Service**: `prebookingService.createPrebooking({ harvestId, buyerId, quantity })`
- **Rules**:
  - Prebookings decrement `harvest.prebookedQuantity`.
  - Clearly distinguishes AI-estimated harvest dates from grower-entered dates via `isAIEstimated` flag.

### 3.5 Real-Time Chat & Sockets
- **Socket Event**: `join_conversation` with `{ conversationId }`
- **Socket Event**: `send_message` with `{ conversationId, content, messageType: 'TEXT' }`
- **Socket Receive**: `new_message` broadcast to conversation room.

### 3.6 Reviews & Ratings
- **Service**: `reviewService.createReview({ reviewerId, exchangeRequestId, rating, comment })`
- **Rules**:
  - Reviews strictly allowed **ONLY after `exchange.status === 'COMPLETED'`**.
  - Enforced unique MongoDB index `{ reviewerId: 1, exchangeRequestId: 1 }` prevents duplicates.

---

## 4. Person 2 Integration Contracts (Admin Dashboard)

Person 2 connects the administrative interface to `/api/admin` guarded by `authenticate` and `requireAdmin` middleware.

### 4.1 Admin Overview Metrics
- **Method / Endpoint**: `GET /api/admin/overview`
- **Auth**: ADMIN role required
- **Response Data**:
```json
{
  "success": true,
  "message": "Admin overview metrics retrieved",
  "data": {
    "users": { "total": 182, "active": 178 },
    "products": { "total": 450, "available": 320 },
    "completedExchanges": 210,
    "moderationQueue": {
      "pendingReports": 2,
      "pendingVerifications": 5
    }
  }
}
```

### 4.2 Moderation Queue (Reports)
- **Method / Endpoint**: `GET /api/admin/reports`
- **Auth**: ADMIN role required
- **Response Data**:
```json
{
  "success": true,
  "message": "Reports retrieved for moderation",
  "data": {
    "reports": [
      {
        "_id": "67399b...",
        "reporterId": { "name": "Deepa Nair", "email": "deepa@..." },
        "reportedUserId": { "name": "Wholesale Trader", "email": "trader@..." },
        "reason": "COMMERCIAL_RESELLER",
        "details": "User is selling bulk market vegetables, not homegrown produce.",
        "status": "PENDING"
      }
    ]
  }
}
```

### 4.3 User Moderation Actions
- **Service**: `adminService.updateUserAccountStatus(adminId, userId, newStatus, reason)`
- **Allowed `newStatus` values**: `'ACTIVE' | 'SUSPENDED' | 'BLOCKED' | 'DEACTIVATED'`
- **Behavior**:
  - Automatically writes an immutable audit record to `admin_actions`.
  - Automatically writes an event log to `audit_logs`.
  - Blocks suspended or blocked users from authenticating.

---

## 5. AI Harvest Services (Backend Only)

AI services are executed on the backend via Google Gemini. Frontend calls send requests to backend endpoints without exposing API keys.

| Service Function | Input | Output / Advisory Result |
| :--- | :--- | :--- |
| `recognizeProduceImage(userId, buffer)` | Image file buffer | `{ identifiedProduce, ripenessStage, freshnessScore, organicNotice }` |
| `generateListingDescription(userId, params)` | Produce name, category, notes | `{ title, description, malayalamDescription, suggestedTags }` |
| `suggestPrice(userId, params)` | Produce name, unit, category | `{ suggestedPrice, priceRange, basis, disclaimer }` |
| `suggestBarterCombinations(userId, params)` | Have item, want item | `{ compatibilityScore, proposals, exchangeEtiquetteTip }` |
| `planHarvest(userId, params)` | Crop, planting date | `{ estimatedDaysToHarvest, projectedHarvestDate, milestones }` |
| `chatWithHarvestBuddy(userId, params)` | User message, conversationId | Multi-turn conversational garden advice with Malayalam understanding |
