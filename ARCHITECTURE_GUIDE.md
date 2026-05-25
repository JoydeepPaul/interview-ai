# Authentication Architecture Overview & Form Styling

## 4-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     LAYER 1: PRESENTATION (UI/Pages)                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐   │
│  │  LoginPage.jsx   │  │ RegisterPage.jsx │  │  DashboardPage.jsx   │   │
│  │  ProfilePage.jsx │  │  AuthLayout.jsx  │  │  MainLayout.jsx      │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘   │
│                         ↓ Uses Components ↓                              │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│               LAYER 2: COMPONENTS (Reusable UI Components)              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐   │
│  │  FormInput.jsx   │  │    Button.jsx    │  │   Alert.jsx          │   │
│  │  & styling       │  │  & styling       │  │  & styling           │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘   │
│  + ProtectedRoute.jsx   + MainLayout.jsx     + AuthLayout.jsx           │
│                         ↓ Uses Services ↓                                │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│          LAYER 3: SERVICES (API & Business Logic)                       │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  services/api.js                                                   │  │
│  │  ├─ axios instance with interceptors                              │  │
│  │  ├─ authService.register()                                        │  │
│  │  ├─ authService.login()                                           │  │
│  │  ├─ authService.logout()                                          │  │
│  │  └─ authService.getMe()                                           │  │
│  │                                                                    │  │
│  │  Responsibilities:                                                │  │
│  │  • HTTP requests to backend                                       │  │
│  │  • Automatic token attachment to headers                          │  │
│  │  • Error handling (401 redirects)                                 │  │
│  │  • Response transformation                                        │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                         ↓ Uses Context ↓                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│        LAYER 4: STATE MANAGEMENT (Context & Local State)                │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  context/AuthContext.jsx                                           │  │
│  │  ├─ token (JWT from localStorage)                                 │  │
│  │  ├─ user (Current user data)                                      │  │
│  │  ├─ isLoading (Request state)                                     │  │
│  │  ├─ login(token) - Store token                                    │  │
│  │  ├─ logout() - Clear token                                        │  │
│  │  └─ setCurrentUser(userData) - Update user                        │  │
│  │                                                                    │  │
│  │  Data Flow:                                                       │  │
│  │  • Token persisted in localStorage                                │  │
│  │  • Auto-loaded on app start                                       │  │
│  │  • Shared across all components via useAuth()                     │  │
│  │  • Protected routes check token existence                         │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

## Architecture Layers Explained

### Layer 1: Presentation (Pages)
**What:** User interface pages that users interact with
**Location:** `src/pages/`
**Components:**
- LoginPage.jsx
- RegisterPage.jsx
- DashboardPage.jsx
- ProfilePage.jsx

**Responsibilities:**
- Display UI to users
- Collect form inputs
- Show validation errors
- Display loading/success/error messages
- Handle form submission

**Example Flow:**
```
User enters email → FormInput component → Validates → Calls handleSubmit
→ Calls authService.login() → Updates AuthContext → Redirects to /dashboard
```

### Layer 2: Reusable Components
**What:** Dumb/presentational components used across pages
**Location:** `src/components/`
**Components:**
- FormInput.jsx - Input field with label, icon, error
- Button.jsx - Button with variants, loading state
- Alert.jsx - Alert message display
- ProtectedRoute.jsx - Route guard
- MainLayout.jsx - Layout for protected pages
- AuthLayout.jsx - Layout for auth pages

**Responsibilities:**
- Render UI elements
- Accept props
- Emit events via callbacks
- No business logic
- Reusable across multiple pages

**Example - FormInput:**
```jsx
<FormInput
  label="Email"
  type="email"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
  icon="✉️"
/>
```

### Layer 3: Services (API)
**What:** API communication and business logic
**Location:** `src/services/api.js`
**Functions:**
- authService.register(data)
- authService.login(data)
- authService.logout()
- authService.getMe()

**Responsibilities:**
- Make HTTP requests to backend
- Attach JWT token to requests
- Handle API errors
- Transform responses
- Centralized error handling
- Auto-logout on 401

**Key Features:**
- Axios interceptors for token attachment
- Automatic error handling
- Centralized configuration
- Request/response transformation

**Example:**
```javascript
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
})
// Returns: { token, user }
```

### Layer 4: State Management (Context)
**What:** Global application state and data
**Location:** `src/context/AuthContext.jsx`
**State:**
- token - JWT token from login
- user - Current user data
- isLoading - Request loading state
- login() - Store token function
- logout() - Clear token function
- setCurrentUser() - Update user function

**Responsibilities:**
- Store global auth state
- Persist token to localStorage
- Provide auth state to all components
- Centralized token management
- Handle login/logout

**Usage:**
```javascript
const { token, user, login, logout } = useAuth()
```

## Data Flow

### Login Flow
```
1. User enters email & password
   ↓
2. FormInput components display data
   ↓
3. Click "Sign In" button
   ↓
4. LoginPage validates form
   ↓
5. Calls authService.login()
   ↓
6. API service sends POST /api/auth/login
   ↓
7. Backend validates credentials
   ↓
8. Returns { token, user }
   ↓
9. Context updates: login(token) & setCurrentUser(user)
   ↓
10. Token stored in localStorage
   ↓
11. Redirect to /dashboard
   ↓
12. Protected routes check token and allow access
```

### Logout Flow
```
1. User clicks "Logout" button
   ↓
2. ProfilePage calls logout()
   ↓
3. Calls authService.logout()
   ↓
4. API service sends POST /api/auth/logout
   ↓
5. Backend removes token from blacklist
   ↓
6. Context updates: logout()
   ↓
7. Token cleared from localStorage
   ↓
8. Redirect to /auth/login
   ↓
9. Protected routes now redirect to login
```

### Protected Route Flow
```
1. User navigates to /profile
   ↓
2. ProtectedRoute component checks token
   ↓
3. useAuth() gets token from context
   ↓
4. If token exists → Render component
   ↓
5. If NO token → Redirect to /auth/login
```

## Separation of Concerns

### Page Components (LoginPage)
Handles:
- Form state management
- Form validation logic
- User interactions
- Displaying errors/success

Does NOT:
- Make direct API calls (uses service)
- Store global state (uses context)
- Render form inputs (uses components)

### Components (FormInput)
Handles:
- Rendering form fields
- Displaying error messages
- Showing icons

Does NOT:
- Validate data
- Make API calls
- Store state (parent handles it)

### Services (api.js)
Handles:
- HTTP requests
- Token attachment
- Error handling
- Response transformation

Does NOT:
- Update UI
- Store state
- Handle validation

### Context (AuthContext)
Handles:
- Storing token
- Storing user data
- Providing state to all components

Does NOT:
- Make API calls
- Handle UI rendering
- Validate data

## Component Communication

```
LoginPage Component
├─ State: formData, errors, loading, alert
├─ Props: (none - top level)
├─ Children:
│  ├─ FormInput (label, value, onChange, error, icon)
│  ├─ Button (onClick, loading, disabled)
│  └─ Alert (type, message, onClose)
└─ Calls: authService.login(), useAuth().login()
```

## Testing Strategy

### Unit Tests (Components)
```javascript
// Test FormInput component
- Renders with label
- Shows error message
- Updates value on change
- Calls onChange callback
- Shows icon
```

### Integration Tests (Pages)
```javascript
// Test LoginPage
- Form validation works
- Error display works
- API call made on submit
- Token stored on success
- Redirect happens
```

### E2E Tests
```javascript
// Complete user flow
- User registers
- User logs in
- User views profile (GetMe API)
- User logs out
```

## Best Practices Used

1. **Single Responsibility Principle**
   - Each layer has one purpose
   - Services handle API
   - Context handles state
   - Components handle UI

2. **DRY (Don't Repeat Yourself)**
   - FormInput reused in login/register
   - Button reused everywhere
   - API service centralized

3. **Composition Over Inheritance**
   - Components composed of smaller components
   - Layouts wrap page content
   - Context wraps entire app

4. **Controlled Components**
   - Form inputs controlled by parent state
   - onChange handlers update state
   - Re-render on state change

5. **Error Handling**
   - Try-catch in async functions
   - Error display in UI
   - User-friendly messages

6. **Security**
   - Token in localStorage (not cookie accessible via JS - secure)
   - Automatic 401 logout
   - Token sent via Bearer in Authorization header
   - Blacklist on logout

## Authentication Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Browser (Frontend)                                         │  │
│  │ ├─ LoginPage.jsx                                          │  │
│  │ │  ├─ FormInput (email, password)                        │  │
│  │ │  ├─ Button (Sign In)                                   │  │
│  │ │  └─ onClick → handleSubmit                             │  │
│  │ │              ↓                                          │  │
│  │ │     authService.login({ email, password })            │  │
│  │ │              ↓                                          │  │
│  │ │     POST /api/auth/login                               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                         ↓ Network ↓                               │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                       SERVER SIDE                                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Backend API (Node.js/Express)                              │  │
│  │ ├─ POST /api/auth/login                                   │  │
│  │ │  ├─ Verify email & password                            │  │
│  │ │  ├─ Generate JWT token                                 │  │
│  │ │  └─ Return { token, user }                             │  │
│  │ │              ↓                                          │  │
│  │ │     Response sent to client                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                         ↓ Network ↓                               │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Browser (Frontend)                                         │  │
│  │ ├─ Receive { token, user }                               │  │
│  │ ├─ localStorage.setItem('token', token)                  │  │
│  │ ├─ AuthContext.login(token)                              │  │
│  │ ├─ AuthContext.setCurrentUser(user)                      │  │
│  │ └─ navigate('/dashboard')                                │  │
│  │                                                           │  │
│  │ ✅ User authenticated! Token persisted!                   │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Protected Route Access

```
User navigates to /profile
         ↓
Routes component checks path
         ↓
<ProtectedRoute> component
         ↓
useAuth() hook retrieves token
         ↓
Is token present?
  ├─ YES → Render ProfilePage
  │         ├─ useEffect: fetch /api/user/me
  │         ├─ Axios auto-adds: Authorization: Bearer {token}
  │         ├─ Display user data
  │         └─ Show profile info
  │
  └─ NO → <Navigate to="/auth/login" />
          User redirected to login
```

## State Management Flow

```
AuthContext
├─ token (string | null)
│  ├─ Set by: login(token)
│  ├─ Cleared by: logout()
│  ├─ Persisted to: localStorage
│  └─ Used by: ProtectedRoute, api.js, other components
│
├─ user (object | null)
│  ├─ Set by: setCurrentUser(userData)
│  ├─ Cleared by: logout()
│  └─ Used by: ProfilePage, DashboardPage, other components
│
├─ isLoading (boolean)
│  ├─ Set by: setIsLoading(true/false)
│  └─ Used by: Show loading states
│
└─ Login/Logout Functions
   ├─ login(token) → Update context & localStorage
   ├─ logout() → Clear context & localStorage
   └─ setCurrentUser(user) → Update user data
```

## Error Handling Strategy

```
Try Block (Async Operation)
├─ Make API call
├─ Handle success
│  └─ Update state & redirect
│
└─ Catch Block (Error Handling)
   ├─ API Error?
   │  ├─ 401? → logout() & redirect to login
   │  ├─ 400? → Show user-friendly message
   │  ├─ 500? → Show generic error
   │  └─ Network? → Show connection error
   │
   └─ Display in Alert component
      ├─ Error type (error)
      ├─ Error message (from API or generic)
      └─ Close button to dismiss
```

## Component Hierarchy

```
App.jsx (Router)
├─ AuthProvider (Context wrapper)
│  └─ Routes
│     ├─ AuthLayout
│     │  ├─ LoginPage
│     │  │  ├─ FormInput (email)
│     │  │  ├─ FormInput (password)
│     │  │  ├─ Button (Sign In)
│     │  │  ├─ Button (Demo)
│     │  │  └─ Alert (error/success)
│     │  │
│     │  └─ RegisterPage
│     │     ├─ FormInput (username)
│     │     ├─ FormInput (email)
│     │     ├─ FormInput (password)
│     │     ├─ FormInput (confirmPassword)
│     │     ├─ Button (Create Account)
│     │     ├─ Button (Generate Demo)
│     │     └─ Alert (error/success)
│     │
│     └─ ProtectedRoute
│        └─ MainLayout
│           ├─ DashboardPage
│           │  ├─ Button (View Profile)
│           │  └─ User info display
│           │
│           └─ ProfilePage
│              ├─ User info display
│              ├─ Button (Back)
│              └─ Button (Logout)
```

## Conclusion

This 4-layer architecture provides:
- **Separation of Concerns**: Each layer has a single responsibility
- **Reusability**: Components reused, API service centralized
- **Maintainability**: Easy to locate and modify functionality
- **Testability**: Each layer can be tested independently
- **Scalability**: Easy to add new pages/components/services
- **Security**: Token managed centrally, auto-logout on expiration
- **Performance**: Minimal re-renders, efficient state management
