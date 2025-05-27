# Authentication & API Call Optimization Guide

## Issues Fixed

### 1. Duplicate API Calls

**Problem**: Components were making duplicate API calls due to:

- useEffect dependencies on `userInfo` context that changes frequently
- Clerk token updates triggering re-renders
- Multiple components calling the same APIs when authentication state changes

**Solution**: Implemented localStorage-based token management with ref-based data loading

### 2. Clerk Token Re-renders

**Problem**: Every time Clerk updates the authentication token, it triggers component re-renders across the app

**Solution**:

- Store tokens in localStorage instead of component state
- Use refs to prevent re-renders from token updates
- Implement silent token refresh in the background

## Key Changes Made

### 1. Token Manager (`src/utils/tokenManager.ts`)

```typescript
// Singleton pattern for token management
export class TokenManager {
  private static instance: TokenManager;
  private currentToken: string | null = null;
  private tokenExpiry: number | null = null;

  // Stores tokens in localStorage
  public setToken(token: string, expiryInSeconds?: number): void {
    // Implementation stores in localStorage
  }

  // Retrieves tokens from localStorage
  public getToken(): string | null {
    // Implementation checks expiry and returns valid token
  }
}
```

### 2. Updated API Client (`src/services/api-client.ts`)

```typescript
// Request interceptor now uses tokenManager
this.api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### 3. Improved Auth Service Hook (`src/hooks/useAuthService.ts`)

```typescript
export function useAuthService() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  // Use refs to prevent re-renders
  const isUpdatingToken = useRef(false);
  const lastTokenUpdate = useRef(0);
  const MIN_UPDATE_INTERVAL = 30000; // 30 seconds throttling

  // Throttled token update function
  const updateAuthToken = useCallback(async (): Promise<boolean> => {
    // Prevents rapid successive updates
    // Stores token in localStorage with 50-minute expiry
  }, [isSignedIn, getToken]);

  // Background token refresh
  useLayoutEffect(() => {
    // Sets up interval for silent token refresh
    // Refreshes on visibility change
  }, [isSignedIn, silentTokenRefresh]);
}
```

### 4. Optimized Component Pattern

```typescript
// Example: AssetsAllocations component
function AssetsAllocations() {
  const { userInfo } = useContext(UserContext);

  // Prevent duplicate API calls
  const hasLoadedDataRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  // Capture userId once and never change it
  if (!userIdRef.current && userInfo?.id) {
    userIdRef.current = userInfo.id;
  }

  // Load data only once
  useEffect(() => {
    const loadData = async () => {
      if (!userIdRef.current || hasLoadedDataRef.current) {
        return; // Already loaded or no user
      }

      try {
        const data = await apiService.getData(userIdRef.current);
        setData(data);
        hasLoadedDataRef.current = true;
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []); // NO DEPENDENCIES - load once only
}
```

## Implementation Guidelines

### For New Components

1. **Use the ref pattern for user data loading**:

```typescript
const hasLoadedDataRef = useRef(false);
const userIdRef = useRef<string | null>(null);

// Capture userId once
if (!userIdRef.current && userInfo?.id) {
  userIdRef.current = userInfo.id;
}
```

2. **Use empty dependency arrays for one-time data loading**:

```typescript
useEffect(() => {
  // Load data logic
}, []); // No dependencies
```

3. **Don't depend on userInfo context for API calls**:

```typescript
// ❌ Bad - causes duplicate calls
useEffect(() => {
  if (userInfo?.id) {
    loadData(userInfo.id);
  }
}, [userInfo]);

// ✅ Good - loads once
useEffect(() => {
  if (userIdRef.current && !hasLoadedDataRef.current) {
    loadData(userIdRef.current);
    hasLoadedDataRef.current = true;
  }
}, []);
```

### For Existing Components

1. **Identify components with userInfo dependencies**:

```bash
grep -r "useEffect.*userInfo" src/
```

2. **Replace with ref pattern**:

- Add `hasLoadedDataRef` and `userIdRef`
- Remove `userInfo` from useEffect dependencies
- Use empty dependency array `[]`

3. **Test for duplicate calls**:

- Open browser dev tools
- Check Network tab for duplicate API requests
- Verify data loads only once per component mount

## Benefits

1. **Performance**: Eliminates duplicate API calls
2. **User Experience**: Faster loading, less network traffic
3. **Reliability**: Prevents race conditions from multiple simultaneous requests
4. **Token Management**: Silent background refresh without re-renders
5. **Scalability**: Pattern works consistently across all components

## Monitoring

To verify the fixes are working:

1. **Check Network Tab**: Should see single API calls per component
2. **Console Logs**: No duplicate "loading data" messages
3. **Token Refresh**: Happens silently in background every 5 minutes
4. **Re-renders**: Components don't re-render on token updates

## Migration Checklist

- [ ] Update all components using `userInfo` in useEffect
- [ ] Replace direct token management with tokenManager
- [ ] Test authentication flow end-to-end
- [ ] Verify no duplicate API calls in Network tab
- [ ] Test token refresh behavior
- [ ] Update any custom auth logic to use new pattern
