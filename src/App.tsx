import React, { useContext, useState, Suspense, lazy, FC, useEffect } from "react";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import DesktopLayout from "./components/Layout/DesktopLayout";
import AuthPage from "./pages/Auth/AuthPage";
import useApiServices from "./hooks/useApiServices";
import { UserContext } from "./context/UserContext";
import { ViewProvider } from "./Provider/ViewProvider";
import MobileView from "./components/Layout/MobileView";
import { useMediaQuery, useTheme } from "@mui/material";
import ScrollToTop from "./components/ScrollToTop";

// Lazy load components
const AppRoutes = lazy(() => import("./routes"));
const Creation = lazy(() => import("./pages/Creation"));

// Loading component
const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

interface ResponsiveLayoutProps {
  isMobile: boolean;
  children: React.ReactNode;
}

// Create a wrapper component that will maintain child component identity
const ResponsiveLayout: FC<ResponsiveLayoutProps> = ({ isMobile, children }) => {
  return (
    <>
      <div style={{ display: isMobile ? 'block' : 'none' }}>
        <MobileView>{children}</MobileView>
      </div>
      <div style={{ display: isMobile ? 'none' : 'block' }}>
        <DesktopLayout>{children}</DesktopLayout>
      </div>
    </>
  );
};

const App: FC = () => {
  // Initialize API ssupportervices with authentication
  const { isInitialized, services, isAuthenticated, hasValidToken } = useApiServices();
  const { userInfo, setUserInfo, setSubs } = useContext(UserContext);
  const { signOut } = useAuth()
  
  // State to track if user needs onboarding
  const [isNew, setIsNew] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasLoadedUser, setHasLoadedUser] = useState<boolean>(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(1020));

  // Check user status function
  const checkUserStatus = async () => {
    // Wait for both initialization and authentication
    if (!isInitialized || !isAuthenticated || !hasValidToken() || hasLoadedUser) {
      if (!isAuthenticated) {
        setIsLoading(false); // Stop loading if not authenticated
      }
      return;
    }
    
    try {
      setIsLoading(true);
      const user = await services.auth.getCurrentUser();
      if(user === null) signOut()
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub:any = await services.auth.getCurrentSub(user.id)
        if(sub) setSubs(sub[0])
        setUserInfo(user);
        setIsNew(user.onboarding);
        setHasLoadedUser(true);
      }
    } catch (error) {
      console.error("Failed to check user status:", error);
      // Default to showing onboarding if we can't determine status
      setIsNew(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is new (needs onboarding) - only load once
  useEffect(() => {
     checkUserStatus();
  }, [isInitialized, isAuthenticated]);

  // Show loading while initializing APIs or checking user status
  // Only show loading spinner if we're authenticated but still loading user data
  if (isAuthenticated && (!isInitialized || isLoading)) {
    return <LoadingSpinner />;
   }

  return (
	   <Suspense fallback={<LoadingSpinner />}>
      <>
        <SignedOut>
          <AuthPage isMobile={isMobile} />
        </SignedOut>
        
        <SignedIn>
          {((userInfo && isNew) || (isAuthenticated && !userInfo && !isLoading)) && (
                    <Suspense fallback={<LoadingSpinner />}>
                      <Creation isMobile={Boolean(isMobile)} />
                    </Suspense>
                  )}
                  
                  {(userInfo && isNew === false) && (
                    <ViewProvider>
                      <ResponsiveLayout isMobile={isMobile}>
                        <Suspense fallback={<LoadingSpinner />}>
                        <ScrollToTop />
                          <AppRoutes />
                        </Suspense>
                      </ResponsiveLayout>
                    </ViewProvider>
              )}
	     </SignedIn>
      </>
      </Suspense>
  );
};

export default App;
