import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useContext, useLayoutEffect, useState, Suspense, lazy, FC, useCallback, useMemo } from "react";
import DesktopLayout from "./components/Layout/DesktopLayout";
import AuthPage from "./pages/Auth/AuthPage";
import useApiServices from "./hooks/useApiServices";
import { UserContext } from "./context/UserContext";
import { ViewProvider } from "./Provider/ViewProvider";
import MobileView from "./components/Layout/MobileView";
import { useMediaQuery, useTheme } from "@mui/material";

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
    return (_jsxs(_Fragment, { children: [_jsx("div", { style: {
                    display: isMobile ? 'block' : 'none',
                }, children: _jsx(MobileView, { children: children }) }), _jsx("div", { style: { display: isMobile ? 'none' : 'block' }, children: _jsx(DesktopLayout, { children: children }) })] }));
};

const App: FC = () => {
    // Initialize API services with authentication
    const { isInitialized, services, isAuthenticated, hasValidToken } = useApiServices();
    const { userInfo, setUserInfo } = useContext(UserContext);
    
    // State to track if user needs onboarding
    const [isNew, setIsNew] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasLoadedUser, setHasLoadedUser] = useState<boolean>(false);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(1020));

    // Memoize the user check function to prevent re-creation
    const checkUserStatus = useCallback(async () => {
        if (!isInitialized || !isAuthenticated || !hasValidToken() || hasLoadedUser) {
            return;
        }
        
        try {
            setIsLoading(true);
            const user = await services.auth.getCurrentUser();
            if (user) {
                setUserInfo(user);
                setIsNew(user.onboarding);
                setHasLoadedUser(true);
            }
        }
        catch (error) {
            console.error("Failed to check user status:", error);
            // Default to showing onboarding if we can't determine status
        }
        finally {
            setIsLoading(false);
        }
    }, [isInitialized, isAuthenticated, hasValidToken, services.auth, hasLoadedUser, setUserInfo]);

    // Check if user is new (needs onboarding) - only load once
    useLayoutEffect(() => {
        checkUserStatus();
    }, [checkUserStatus]);

    // Memoize the main content to prevent unnecessary re-renders
    const mainContent = useMemo(() => {
        // Show loading while initializing APIs or checking user status
        if (isAuthenticated && (!isInitialized || isLoading)) {
            return <LoadingSpinner />;
        }

        return (
            <Suspense fallback={<LoadingSpinner />}>
                {_jsxs(_Fragment, { 
                    children: [
                        _jsx(SignedOut, { 
                            children: _jsx(AuthPage, { isMobile: isMobile }) 
                        }), 
                        _jsxs(SignedIn, { 
                            children: [
                                ((userInfo && isNew) || (isAuthenticated && !userInfo)) && (
                                    <Suspense fallback={<LoadingSpinner />}>
                                        {_jsx(Creation, { isMobile: Boolean(isMobile) })}
                                    </Suspense>
                                ),
                                (userInfo && isNew === false) && (
                                    _jsx(ViewProvider, { 
                                        children: _jsx(ResponsiveLayout, { 
                                            isMobile: isMobile, 
                                            children: (
                                                <Suspense fallback={<LoadingSpinner />}>
                                                    {_jsx(AppRoutes, {})}
                                                </Suspense>
                                            ) 
                                        }) 
                                    })
                                )
                            ]
                        })
                    ]
                })}
            </Suspense>
        );
    }, [isAuthenticated, isInitialized, isLoading, isMobile, userInfo, isNew]);

    return mainContent;
};

export default App;